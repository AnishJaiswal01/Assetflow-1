from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, require_role
from .schemas import DepartmentOut, DepartmentCreate
from . import services

router = APIRouter()

@router.get("/", response_model=List[DepartmentOut])
def list_departments(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return services.get_all_departments(db)

@router.post("/", response_model=DepartmentOut, status_code=201)
def create_department(
    dept_in: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin"]))
):
    return services.create_department(db, dept_in)