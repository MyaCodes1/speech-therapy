from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password__hash = Column(String, nullable=False)

    class Session(Base):
        __tablename__ = "sessions"

        id = Column(Integer, primary_key=True, index=True)
        session_token = Column(String, unique=True, index=True, nullable=False)
        user_id = Column(Integer, nullable=False)
        created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
       