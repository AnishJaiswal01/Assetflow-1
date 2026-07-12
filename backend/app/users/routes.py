import uuid
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_user, require_role
from app.users import schemas, services
from app.users.models import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("", response_model=List[schemas.UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return services.get_all_users(db)

@router.patch("/{id}/promote", response_model=schemas.UserResponse)
def promote_user(
    id: uuid.UUID,
    role_data: schemas.UserPromote,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return services.promote_user(db, id, role_data)