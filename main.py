from fastapi import FastAPI, HTTPException, Depends, Response, Request # Import FastAPI class from the fastapi module
from sqlalchemy.orm import Session # Import Session class from the sqlalchemy.orm module
from database import SessionLocal, engine # Import SessionLocal and engine from the database module
from models import Base, User, Session as DbSession, Exercise, Attempt
import secrets
from passlib.context import CryptContext
from pydantic import BaseModel
import whisper 
import tempfile 
import os
from fastapi import UploadFile, File

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # Create a password context for hashing passwords using bcrypt

def hash_password(password: str) -> str: # Function to hash a password
    return pwd_context.hash(password) # Hash the password using the password context and return the hashed password
class RegisterRequest(BaseModel): # Define a Pydantic model for the registration request
    email: str # Email field of type string
    name: str | None = None # Optional name field of type string
    password: str # Password field of type string


class ExerciseResponse(BaseModel):
    id: int
    word: str
    phoneme: str 
    difficulty: int

    class Config:
        from_attributes = True


def verify_password(password: str, password_hash: str) -> bool: # Function to verify a password against a hashed password
    return pwd_context.verify(password, password_hash) # Verify the password using the password context and return the result


app = FastAPI() # Create an instance of the FastAPI class and assign it to the variable 'app'
Base.metadata.create_all(bind=engine) # Create all tables in the database based on the models defined in the Base class


def get_db(): #DB dependency
    db = SessionLocal() # Create a new database session using the SessionLocal class
    try:
        yield db # Yield the database session to be used in the route handlers
    finally:
        db.close() # Ensure that the database session is closed after use

def get_current_user(request: Request, db: Session = Depends(get_db)):
    session_token = request.cookies.get("session_token")
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db_session = db.query(DbSession).filter(DbSession.session_token == session_token).first()
    if not db_session:
        raise HTTPException(status_code=401, detail="Invalid session token")
    
    user = db.query(User).filter(User.id == db_session.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user 


@app.get("/") # Define a route for the root URL ("/") that will respond to GET requests
async def root():
    return {"message": "Backend testing"}


class LoginRequest(BaseModel): # Define a Pydantic model for the login request
        email: str # Email field of type string
        password: str # Password field of type string

@app.post("/auth/register") # Define a route for the "/auth/register" URL that will respond to POST requests
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=data.email,
        name=data.name,
        password_hash=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered successfully", "user_id": user.id}



@app.post("/auth/login") # Define a route for the "/auth/login" URL that will respond to POST requests
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = secrets.token_urlsafe(32)
    db_session = DbSession(session_token=token, user_id=user.id)
    db.add(db_session)
    db.commit()

    response.set_cookie(key="session_token", value=token, httponly=True, samesite="lax",)
    return {"message": "Login successful"}

@app.get("/auth/me") # Define a route for the "/auth/me" URL that will respond to GET requests
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "name": current_user.name}

@app.post("/auth/logout") # Define a route for the "/auth/logout" URL that will respond to POST requests
def logout(request: Request, response: Response, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    token = request.cookies.get("session_token")
    db.query(DbSession).filter(DbSession.session_token == token).delete()
    db.commit()
    response.delete_cookie(key="session_token")
    return {"message": "Logout successful"}

@app.post("/exercises/seed")
def seed_exercises(db: Session = Depends(get_db)):
    existing = db.query(Exercise).first()
    if existing:
        return {"message": "Exercises already seeded"}
    
    exercises = [
        Exercise(word="thank", phoneme="TH", difficulty = 1),
        Exercise(word="three", phoneme="TH", difficulty = 1),
        Exercise(word="throw", phoneme="TH", difficulty = 2),
        Exercise(word="thing", phoneme="TH", difficulty = 1),
        Exercise(word="thunder", phoneme="TH", difficulty =2),


        Exercise(word="rabbit", phoneme="R", difficulty = 1),
        Exercise(word="rocket", phoneme="R", difficulty = 1),
        Exercise(word="river", phoneme="R", difficulty = 2),
        Exercise(word="run", phoneme="R", difficulty = 1),
        Exercise(word="race", phoneme="R", difficulty = 2),


        Exercise(word="sun", phoneme="S", difficulty = 1),
        Exercise(word="star", phoneme="S", difficulty = 1),
        Exercise(word="sand", phoneme="S", difficulty = 1),
        Exercise(word="sock", phoneme="S", difficulty = 1),
        Exercise(word="slow", phoneme="S", difficulty = 2),
    ]

    db.add_all(exercises)
    db.commit()
    return {"message": "Exercises seeded successfully", "count": len(exercises)} 
    

@app.get("/exercises")
def get_exercises(phoneme: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Exercise)
    if phoneme:
        query = query.filter(Exercise.phoneme == phoneme)
    return query.all()
    



@app.post("/exercises/{exercise_id}/attempt")
def submit_attempt(
    exercise_id: int,
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)

):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(audio.file.read())
        tmp_path = tmp.name


    model = whisper.load_model("base")
    result = model.transcribe(tmp_path)
    transcription = result["text"].strip().lower()

    os.remove(tmp_path)


    target = exercise.word.lower()
    is_correct = transcription == target
    score = 100 if is_correct else 0


    attempt = Attempt(
        user_id=current_user.id,
        exercise_id=exercise.id,
        transcription=transcription,
        is_correct=is_correct,
        score=score
    )
    db.add(attempt)
    db.commit()

    return {
        "transcription": transcription,
        "is_correct": is_correct,
        "score": score,
        "target": target
    }
