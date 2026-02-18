from fastapi import FastAPI, HTTPException # Import FastAPI class from the fastapi module
from sqlalchemy.orm import Session # Import Session class from the sqlalchemy.orm module
from database import SessionLocal, engine # Import SessionLocal and engine from the database module
from models import Base, User 
from fastapi import Depends
app = FastAPI() # Create an instance of the FastAPI class and assign it to the variable 'app'
Base.metadata.create_all(bind=engine) # Create all tables in the database based on the models defined in the Base class


def get_db(): #DB dependency
    db = SessionLocal() # Create a new database session using the SessionLocal class
    try:
        yield db # Yield the database session to be used in the route handlers
    finally:
        db.close() # Ensure that the database session is closed after use

@app.get("/") # Define a route for the root URL ("/") that will respond to GET requests
async def root():
    return {"message": "Backend testing"}

@app.post("/test-create-user")
def test_create_user (email: str, name: str | None = None, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(email=email, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "email": user.email, name: user.name}
