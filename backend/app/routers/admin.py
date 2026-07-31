from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.authentication.deps import require_roles
from app.database.session import get_db
from app.models import Event, Registration, User, UserRole
from app.schemas import AdminStats, UserOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN)),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/stats", response_model=AdminStats)
def stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN)),
):
    return AdminStats(
        total_users=db.query(User).filter(User.role == UserRole.USER).count(),
        total_organizers=db.query(User).filter(User.role == UserRole.ORGANIZER).count(),
        total_events=db.query(Event).count(),
        total_registrations=db.query(Registration).count(),
    )


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN)),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    db.delete(user)
    db.commit()


@router.delete("/events/{event_id}", status_code=204)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.ADMIN)),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(404, "Event not found")
    db.delete(event)
    db.commit()
