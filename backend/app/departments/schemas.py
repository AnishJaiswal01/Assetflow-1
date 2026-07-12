from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True