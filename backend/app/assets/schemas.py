from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class AssetCreate(BaseModel):
    name: str
    category_id: UUID
    notes: Optional[str] = None


class AssetOut(BaseModel):
    id: UUID
    name: str
    category_id: UUID
    status: str
    notes: Optional[str]

    class Config:
        from_attributes = True