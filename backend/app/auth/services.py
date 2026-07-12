import os
from fastapi import HTTPException
from supabase import create_client, Client
from app.core.config import settings
from sqlalchemy.orm import Session
from app.users.models import User

# Initialize Supabase client
# Ensure SUPABASE_ANON_KEY is in your .env
supabase_url = settings.SUPABASE_URL
supabase_key = os.environ.get("SUPABASE_ANON_KEY", "")
supabase: Client = create_client(supabase_url, supabase_key)

def signup(req: dict):
    try:
        res = supabase.auth.sign_up({
            "email": req.email,
            "password": req.password,
            "options": {
                "data": {"full_name": req.full_name}
            }
        })
        if not res.user:
            raise HTTPException(status_code=400, detail="Signup failed")
        
        return {
            "id": res.user.id,
            "email": res.user.email,
            "full_name": req.full_name,
            "role": "employee" # DB Trigger handles this, we return it as contract requires
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def login(db: Session, req: dict):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password
        })
        if not res.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Fetch role and dept from our users table
        user_profile = db.query(User).filter(User.id == res.user.id).first()
        if not user_profile:
            raise HTTPException(status_code=404, detail="Profile not synced")

        return {
            "access_token": res.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": user_profile.id,
                "email": user_profile.email,
                "role": user_profile.role,
                "department_id": user_profile.department_id
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))