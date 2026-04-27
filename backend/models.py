from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    age = Column(Integer, nullable=True)

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, nullable=False)
    phoneme = Column(String, nullable=False)
    difficulty = Column(Integer, default=1, nullable=False)

    
class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    transcription = Column(String, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    score = Column(Integer, nullable=False)
    attempted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)