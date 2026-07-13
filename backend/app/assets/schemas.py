from pydantic import BaseModel
from typing import Optional


class AssetOut(BaseModel):
    id: int
    asset_tag: str
    name: str

    category: str
    department: Optional[str]

    purchaseDate: Optional[str]

    serial_number: Optional[str]
    brand: Optional[str]
    model: Optional[str]
    warranty_expiry: Optional[str]

    status: str
    updated: str

    class Config:
        from_attributes = True