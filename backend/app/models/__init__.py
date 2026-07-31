"""SQLAlchemy models: User, Event, Registration."""
import enum
from datetime import datetime, date, time
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Date, Time, ForeignKey, Enum, UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.database.session import Base


class UserRole(str, enum.Enum):
    USER = "USER"
    ORGANIZER = "ORGANIZER"
    ADMIN = "ADMIN"


class RegistrationStatus(str, enum.Enum):
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    events = relationship("Event", back_populates="organizer", cascade="all, delete-orphan")
    registrations = relationship("Registration", back_populates="user", cascade="all, delete-orphan")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(80), nullable=False, index=True)
    image_url = Column(String(500), nullable=True)
    venue = Column(String(200), nullable=False)
    location = Column(String(200), nullable=False, index=True)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    max_capacity = Column(Integer, nullable=False, default=100)
    organizer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    organizer = relationship("User", back_populates="events")
    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan")


class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (UniqueConstraint("user_id", "event_id", name="uq_user_event"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(Enum(RegistrationStatus), nullable=False, default=RegistrationStatus.CONFIRMED)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")