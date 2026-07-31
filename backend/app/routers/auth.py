from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import schemas
from app.database.session import get_db
from app.models import User, UserRole
from app.schemas import UserCreate, UserOut, Token
from app.authentication.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role or UserRole.USER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(str(user.id), {"role": user.role.value})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form.username is the email
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(user.id), {"role": user.role.value})
    return Token(access_token=token, user=UserOut.model_validate(user))
# Your route might look slightly different (e.g., using OAuth2PasswordRequestForm)
@router.post("/login") 
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    # ADD THESE TWO LINES:
    print(f"DEBUG LOGIN - Password received: {user_credentials.password}")
    print(f"DEBUG LOGIN - Password length: {len(user_credentials.password)}")
    
    # ... your existing code that fetches the user from the DB
    # ... your existing code that verifies the password:
    # utils.verify(user_credentials.password, user.password)