from sqlalchemy import (
    Column,
    BigInteger,
    Date,
    DateTime,
    Text,
    ForeignKey
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.session import Base


class Allocation(Base):
    __tablename__ = "allocations"

    id = Column(BigInteger, primary_key=True)

    asset_id = Column(
        BigInteger,
        ForeignKey("assets.id", ondelete="CASCADE"),
        nullable=False
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False
    )

    allocated_by = Column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="SET NULL")
    )

    allocated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    expected_return_date = Column(Date)

    returned_at = Column(DateTime(timezone=True))

    remarks = Column(Text)