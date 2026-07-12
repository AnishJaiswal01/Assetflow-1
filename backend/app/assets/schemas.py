from pydantic import BaseModel
from typing import Optional


class AssetOut(BaseModel):
    id: int
    asset_tag: str
    name: str

    category: str
    department: Optional[str]

    purchaseDate: Optional[str]

    status: str
    updated: str

    class Config:
        from_attributes = True