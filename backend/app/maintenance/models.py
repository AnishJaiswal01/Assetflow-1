from sqlalchemy import (
    Column,
    BigInteger,
    DateTime,
    Text,
    ForeignKey,
    Enum
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.session import Base
from app.maintenance.enums import (
    MaintenancePriority,
    MaintenanceStatus
)


class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(BigInteger, primary_key=True)

    asset_id = Column(
        BigInteger,
        ForeignKey("assets.id", ondelete="CASCADE"),
        nullable=False
    )

    reported_by = Column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False
    )

    assigned_to = Column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="SET NULL")
    )

    issue_description = Column(Text, nullable=False)

    priority = Column(
        Enum(
            MaintenancePriority,
            values_callable=lambda x: [e.value for e in x],
            name="maintenance_priority"
        )
    )

    status = Column(
        Enum(
            MaintenanceStatus,
            values_callable=lambda x: [e.value for e in x],
            name="maintenance_status"
        )
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    completed_at = Column(DateTime(timezone=True))