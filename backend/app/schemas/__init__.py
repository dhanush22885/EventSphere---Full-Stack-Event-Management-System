"""Pydantic schemas."""
from datetime import datetime, date, time
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models import UserRole, RegistrationStatus


# ---------- Auth / User ----------
class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    role: UserRole = UserRole.USER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Event ----------
class EventBase(BaseModel):
    title: str
    description: str
    category: str
    image_url: Optional[str] = None
    venue: str
    location: str
    start_date: date
    end_date: date
    start_time: time
    end_time: time
    max_capacity: int = Field(gt=0)


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    venue: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    max_capacity: Optional[int] = None


class EventOut(EventBase):
    id: int
    organizer_id: int
    created_at: datetime
    registrations_count: int = 0
    available_seats: int = 0
    organizer_name: Optional[str] = None

    class Config:
        from_attributes = True


class EventListResponse(BaseModel):
    items: List[EventOut]
    total: int
    page: int
    page_size: int


# ---------- Registration ----------
class RegistrationOut(BaseModel):
    id: int
    user_id: int
    event_id: int
    status: RegistrationStatus          
    registration_date: datetime | None = None   
    event: Optional[EventOut] = None
    model_config = ConfigDict(from_attributes=True)
    
class AdminStats(BaseModel):
    total_users: int
    total_organizers: int
    total_events: int
    total_registrations: int