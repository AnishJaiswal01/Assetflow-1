from sqlalchemy.orm import Session
from fastapi import HTTPException
from .models import Department
from .schemas import DepartmentCreate

def get_all_departments(db: Session):
    return db.query(Department).all()

def create_department(db: Session, dept_in: DepartmentCreate):
    existing = db.query(Department).filter(Department.name == dept_in.name).first()
    if existing:
        raise HTTPException(status_code=409, detail="Department already exists")
    
    new_dept = Department(name=dept_in.name)
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept