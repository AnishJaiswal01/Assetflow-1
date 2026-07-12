from fastapi import APIRouter
from app.auth import schemas, services

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(user_data: schemas.UserSignup):
    res = services.signup(user_data)
    user_dict = res.user.model_dump() if hasattr(res.user, 'model_dump') else res.user
    return {"message": "User created successfully", "user": user_dict}

@router.post("/login")
def login(user_data: schemas.UserLogin):
    res = services.login(user_data)
    user_dict = res.user.model_dump() if hasattr(res.user, 'model_dump') else res.user
    return {
        "access_token": res.session.access_token,
        "token_type": "Bearer",
        "user": user_dict
    }