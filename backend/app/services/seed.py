"""Seed sample users, events, and registrations.

Run: python -m app.services.seed
"""
from datetime import date, time, timedelta

from app.database.session import Base, SessionLocal, engine
from app.models import Event, Registration, User, UserRole
from app.authentication.security import hash_password


SAMPLE_EVENTS = [
    dict(
        title="TechCon 2026",
        description="A three-day technology conference featuring the biggest names in AI, cloud, and web.",
        category="Technology",
        image_url="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
        venue="Bangalore International Exhibition Centre",
        location="Bangalore, India",
        start_date=date.today() + timedelta(days=30),
        end_date=date.today() + timedelta(days=32),
        start_time=time(9, 0),
        end_time=time(18, 0),
        max_capacity=500,
    ),
    dict(
        title="Startup Meetup — Founders Night",
        description="Casual networking evening for founders, operators, and investors.",
        category="Business",
        image_url="https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1200",
        venue="WeWork Galaxy",
        location="Bangalore, India",
        start_date=date.today() + timedelta(days=10),
        end_date=date.today() + timedelta(days=10),
        start_time=time(18, 30),
        end_time=time(21, 30),
        max_capacity=120,
    ),
    dict(
        title="Sunset Music Festival",
        description="Open-air music festival with 20+ artists across three stages.",
        category="Music",
        image_url="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200",
        venue="Marina Beach Grounds",
        location="Chennai, India",
        start_date=date.today() + timedelta(days=45),
        end_date=date.today() + timedelta(days=46),
        start_time=time(16, 0),
        end_time=time(23, 0),
        max_capacity=2000,
    ),
    dict(
        title="Full-Stack Coding Workshop",
        description="Hands-on workshop covering React, FastAPI, and PostgreSQL.",
        category="Workshop",
        image_url="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200",
        venue="Online (Zoom)",
        location="Online",
        start_date=date.today() + timedelta(days=7),
        end_date=date.today() + timedelta(days=7),
        start_time=time(10, 0),
        end_time=time(16, 0),
        max_capacity=200,
    ),
    dict(
        title="Business Leadership Seminar",
        description="Insights from Fortune-500 executives on scaling teams and culture.",
        category="Business",
        image_url="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200",
        venue="Taj Palace",
        location="New Delhi, India",
        start_date=date.today() + timedelta(days=20),
        end_date=date.today() + timedelta(days=20),
        start_time=time(9, 30),
        end_time=time(17, 0),
        max_capacity=250,
    ),
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Database already seeded — skipping.")
            return

        admin = User(
            full_name="Admin User",
            email="admin@eventsphere.dev",
            password_hash=hash_password("admin123"),
            role=UserRole.ADMIN,
        )
        organizer = User(
            full_name="Olivia Organizer",
            email="organizer@eventsphere.dev",
            password_hash=hash_password("organizer123"),
            role=UserRole.ORGANIZER,
        )
        user = User(
            full_name="Sam User",
            email="user@eventsphere.dev",
            password_hash=hash_password("user123"),
            role=UserRole.USER,
        )
        db.add_all([admin, organizer, user])
        db.commit()
        db.refresh(organizer)
        db.refresh(user)

        events = [Event(**e, organizer_id=organizer.id) for e in SAMPLE_EVENTS]
        db.add_all(events)
        db.commit()

        # Register the sample user for the first two events
        db.add_all([
            Registration(user_id=user.id, event_id=events[0].id),
            Registration(user_id=user.id, event_id=events[1].id),
        ])
        db.commit()
        print("✅ Seeded:")
        print("   admin@eventsphere.dev / admin123")
        print("   organizer@eventsphere.dev / organizer123")
        print("   user@eventsphere.dev / user123")
    finally:
        db.close()


if __name__ == "__main__":
    run()