from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

class DepartmentCreate(BaseModel):
    name: str

class DepartmentOut(BaseModel):
    id: UUID
    name: str
    head_user_id: Optional[UUID] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)