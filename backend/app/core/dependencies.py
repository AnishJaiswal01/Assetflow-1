from typing import List, Callable
from fastapi import Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_token

def get_current_user(
    db: Session = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    from app.users.models import User
    
    user_id = token_payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user

def require_role(allowed_roles: List[str]) -> Callable:
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return current_user
    return role_checker
