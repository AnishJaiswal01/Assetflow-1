from supabase import create_client, Client
from app.core.config import settings
from fastapi import HTTPException, status
from app.auth.schemas import UserSignup, UserLogin

supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_ANON_KEY
)

try:
    from gotrue.errors import AuthApiError
except ImportError:
    AuthApiError = Exception

def signup(user_data: UserSignup):
    try:
        return supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })
    except AuthApiError as e:
        error_msg = e.message if hasattr(e, "message") else str(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

def login(user_data: UserLogin):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password
        })
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )