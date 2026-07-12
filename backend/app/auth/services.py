from supabase import create_client, Client

from fastapi import HTTPException, status

from app.core.config import settings
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

        res = supabase.auth.sign_up(
            {
                "email": user_data.email,
                "password": user_data.password,
            }
        )

        user = res.user

        if user:

            existing = (
                supabase.table("profiles")
                .select("id")
                .eq("id", user.id)
                .execute()
            )

            if len(existing.data) == 0:

                supabase.table("profiles").insert(
                    {
                        "id": user.id,
                        "full_name": user_data.full_name,
                        "email": user.email,
                        "role": "employee",
                        "phone": None,
                        "department_id": None,
                        "profile_image": None,
                    }
                ).execute()

        return res

    except AuthApiError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


def login(user_data: UserLogin):

    try:

        res = supabase.auth.sign_in_with_password(
            {
                "email": user_data.email,
                "password": user_data.password
            }
        )

        return res

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )