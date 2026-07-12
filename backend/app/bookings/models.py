from sqlalchemy import (
    Column,
    BigInteger,
    Date,
    Time,
    Text,
    DateTime,
    ForeignKey,
    Enum
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.session import Base
from app.bookings.enums import BookingStatus


class Booking(Base):
    __tablename__ = "bookings"

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

    booking_date = Column(Date, nullable=False)

    start_time = Column(Time, nullable=False)

    end_time = Column(Time, nullable=False)

    purpose = Column(Text)

    status = Column(
        Enum(BookingStatus),
        default=BookingStatus.PENDING
    )

    approved_by = Column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="SET NULL")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )