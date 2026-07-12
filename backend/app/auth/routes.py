from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from .schemas import SignupRequest, LoginRequest, TokenResponse
from . import services

router = APIRouter()

@router.post("/signup", status_code=201)
def signup(req: SignupRequest):
    return services.signup(req)

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    return services.login(db, req)