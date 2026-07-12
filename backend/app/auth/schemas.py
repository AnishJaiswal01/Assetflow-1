from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserLoginData(BaseModel):
    id: UUID
    email: str
    role: str
    department_id: Optional[UUID] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserLoginData