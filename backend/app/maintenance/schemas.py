from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

from app.maintenance.enums import (
    MaintenancePriority,
    MaintenanceStatus
)


class MaintenanceCreate(BaseModel):
    asset_id: int
    issue_description: str
    priority: MaintenancePriority


class MaintenanceResponse(BaseModel):
    id: int

    asset_id: int

    reported_by: UUID

    assigned_to: Optional[UUID]

    issue_description: str

    priority: MaintenancePriority

    status: MaintenanceStatus

    created_at: datetime

    completed_at: Optional[datetime]

    class Config:
        from_attributes = True