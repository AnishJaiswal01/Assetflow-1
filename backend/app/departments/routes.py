from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_user, require_role
from app.departments import schemas, services
from app.users.models import User

router = APIRouter(prefix="/departments", tags=["departments"])

@router.get("", response_model=List[schemas.DepartmentResponse])
def list_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return services.get_all_departments(db)

@router.post("", response_model=schemas.DepartmentResponse)
def create_department(
    dept_in: schemas.DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "department_head"]))
):
    return services.create_department(db, dept_in)