from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.authentication.deps import get_current_user, require_roles
from app.database.session import get_db
from app.models import Event, Registration, RegistrationStatus, User, UserRole
from app.schemas import (
    EventCreate, EventListResponse, EventOut, EventUpdate,RegistrationOut,
)

router = APIRouter(prefix="/events", tags=["events"])


def _to_out(event: Event) -> EventOut:
    confirmed = sum(
        1 for r in event.registrations if r.status == RegistrationStatus.CONFIRMED
    )
    data = EventOut.model_validate(event)
    data.registrations_count = confirmed
    data.available_seats = max(event.max_capacity - confirmed, 0)
    data.organizer_name = event.organizer.full_name if event.organizer else None
    return data


@router.get("", response_model=EventListResponse)
def list_events(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
):
    q = db.query(Event).options(joinedload(Event.organizer), joinedload(Event.registrations))
    if search:
        like = f"%{search}%"
        q = q.filter(or_(Event.title.ilike(like), Event.description.ilike(like)))
    if category:
        q = q.filter(Event.category.ilike(category))
    if location:
        q = q.filter(Event.location.ilike(f"%{location}%"))
    if date_from:
        q = q.filter(Event.start_date >= date_from)
    if date_to:
        q = q.filter(Event.start_date <= date_to)

    total = q.count()
    items = (
        q.order_by(Event.start_date.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return EventListResponse(
        items=[_to_out(e) for e in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = (
        db.query(Event)
        .options(joinedload(Event.organizer), joinedload(Event.registrations))
        .filter(Event.id == event_id)
        .first()
    )
    if not event:
        raise HTTPException(404, "Event not found")
    return _to_out(event)


@router.post("", response_model=EventOut, status_code=201)
def create_event(
    payload: EventCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN)),
):
    event = Event(**payload.model_dump(), organizer_id=user.id)
    db.add(event)
    db.commit()
    db.refresh(event)
    return _to_out(event)


@router.put("/{event_id}", response_model=EventOut)
def update_event(
    event_id: int,
    payload: EventUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN)),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(404, "Event not found")
    if event.organizer_id != user.id and user.role != UserRole.ADMIN:
        raise HTTPException(403, "Not allowed")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(event, k, v)
    db.commit()
    db.refresh(event)
    return _to_out(event)


@router.delete("/{event_id}", status_code=204)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN)),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(404, "Event not found")
    if event.organizer_id != user.id and user.role != UserRole.ADMIN:
        raise HTTPException(403, "Not allowed")
    db.delete(event)
    db.commit()


@router.get("/{event_id}/participants", response_model=list[RegistrationOut])
def participants(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN)),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(404, "Event not found")
    if event.organizer_id != user.id and user.role != UserRole.ADMIN:
        raise HTTPException(403, "Not allowed")
    regs = (
        db.query(Registration)
        .options(joinedload(Registration.user))
        .filter(Registration.event_id == event_id)
        .all()
    )
    return [
        RegistrationOut(
            id=r.user.id,
            full_name=r.user.full_name,
            email=r.user.email,
            registration_date=r.registration_date,
            status=r.status,
        )
        for r in regs
    ]


@router.get("/mine/organized", response_model=list[EventOut])
def my_events(
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN)),
):
    events = (
        db.query(Event)
        .options(joinedload(Event.registrations), joinedload(Event.organizer))
        .filter(Event.organizer_id == user.id)
        .order_by(Event.created_at.desc())
        .all()
    )
    return [_to_out(e) for e in events]