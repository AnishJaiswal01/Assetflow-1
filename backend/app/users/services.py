import uuid

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.users.models import Profile
from app.users.schemas import UserPromote


def get_all_users(db: Session):

    return db.query(Profile).all()


def promote_user(
    db: Session,
    user_id: uuid.UUID,
    role_data: UserPromote
):

    user = (
        db.query(Profile)
        .filter(Profile.id == user_id)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    valid_roles = [
        "employee",
        "asset_manager",
        "department_head",
        "admin"
    ]

    if role_data.role not in valid_roles:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role"
        )

    user.role = role_data.role

    db.commit()
    db.refresh(user)

    return user