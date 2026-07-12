from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.departments.models import Department
from app.departments.schemas import DepartmentCreate

def get_all_departments(db: Session):
    return db.query(Department).all()

def create_department(db: Session, dept_in: DepartmentCreate):
    existing = db.query(Department).filter(Department.name == dept_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department with this name already exists"
        )
    
    db_dept = Department(**dept_in.model_dump())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept