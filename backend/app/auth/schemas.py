from pydantic import BaseModel, EmailStr


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserSignup(UserLogin):
    full_name: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict