from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, require_role
from .schemas import UserOut, UserPromote
from . import services

router = APIRouter()

@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), current_user = Depends(require_role(["admin", "asset_manager", "department_head"]))):
    return services.get_all_users(db)

@router.patch("/{id}/promote", response_model=UserOut)
def promote_user(
    id: str,
    role_in: UserPromote,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin"]))
):
    return services.promote_user(db, id, role_in)