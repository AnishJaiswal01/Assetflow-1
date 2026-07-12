from sqlalchemy.orm import Session
from fastapi import HTTPException
from .models import User
from .schemas import UserPromote

def get_all_users(db: Session):
    return db.query(User).all()

def promote_user(db: Session, user_id: str, role_in: UserPromote):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if role_in.role not in ["asset_manager", "department_head", "admin", "employee"]:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    user.role = role_in.role
    db.commit()
    db.refresh(user)
    return user