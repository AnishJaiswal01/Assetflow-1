from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    role: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class UserPromote(BaseModel):
    role: str