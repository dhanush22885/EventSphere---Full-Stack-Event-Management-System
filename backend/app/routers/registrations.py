from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.authentication.deps import get_current_user
from app.database.session import get_db
from app.models import Event, Registration, RegistrationStatus, User
from app.schemas import RegistrationOut, EventOut

router = APIRouter(prefix="/registrations", tags=["registrations"])


def _event_out(event: Event) -> EventOut:
    confirmed = sum(1 for r in event.registrations if r.status == RegistrationStatus.CONFIRMED)
    data = EventOut.model_validate(event)
    data.registrations_count = confirmed
    data.available_seats = max(event.max_capacity - confirmed, 0)
    data.organizer_name = event.organizer.full_name if event.organizer else None
    return data


@router.post("/{event_id}", response_model=RegistrationOut, status_code=201)
def register_event(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(404, "Event not found")

    existing = (
        db.query(Registration)
        .filter(Registration.user_id == user.id, Registration.event_id == event_id)
        .first()
    )
    if existing and existing.status == RegistrationStatus.CONFIRMED:
        raise HTTPException(400, "Already registered")

    confirmed = (
        db.query(Registration)
        .filter(Registration.event_id == event_id, Registration.status == RegistrationStatus.CONFIRMED)
        .count()
    )
    if confirmed >= event.max_capacity:
        raise HTTPException(400, "Event is full")

    if existing:
        existing.status = RegistrationStatus.CONFIRMED
        reg = existing
    else:
        #reg = Registration(user_id=user.id, event_id=event_id)
        #db.add(reg)
        reg = Registration(
        user_id=user.id, 
        event_id=event_id, 
        status=RegistrationStatus.CONFIRMED  # <-- ADD THIS LINE
        )
        db.add(reg)
    db.commit()
    db.refresh(reg)
    return reg


@router.delete("/{event_id}", status_code=204)
def cancel_registration(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    reg = (
        db.query(Registration)
        .filter(Registration.user_id == user.id, Registration.event_id == event_id)
        .first()
    )
    if not reg:
        raise HTTPException(404, "Registration not found")
    reg.status = RegistrationStatus.CANCELLED
    db.commit()


@router.get("/me", response_model=list[RegistrationOut])
def my_registrations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    regs = (
        db.query(Registration)
        .options(
            joinedload(Registration.event).joinedload(Event.registrations),
            joinedload(Registration.event).joinedload(Event.organizer),
        )
        .filter(Registration.user_id == user.id)
        .order_by(Registration.registration_date.desc())
        .all()
    )
    out = []
    for r in regs:
        item = RegistrationOut.model_validate(r)
        if r.event:
            item.event = _event_out(r.event)
        out.append(item)
    return out