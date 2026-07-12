from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    Date,
    Numeric,
    DateTime,
    ForeignKey,
    Enum
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.session import Base
from app.assets.enums import AssetStatus, AssetCondition


class Asset(Base):
    __tablename__ = "assets"

    id = Column(BigInteger, primary_key=True)

    asset_tag = Column(String, nullable=False)

    name = Column(String, nullable=False)

    category_id = Column(
        BigInteger,
        ForeignKey("asset_categories.id"),
        nullable=False
    )

    department_id = Column(
        BigInteger,
        ForeignKey("departments.id")
    )

    serial_number = Column(String)

    brand = Column(String)

    model = Column(String)

    purchase_date = Column(Date)

    purchase_cost = Column(Numeric)

    warranty_expiry = Column(Date)

    status = Column(
        Enum(
            AssetStatus,
            values_callable=lambda x: [e.value for e in x],
            name="asset_status"
        ),
        default=AssetStatus.AVAILABLE.value
    )

    condition = Column(
        Enum(
            AssetCondition,
            values_callable=lambda x: [e.value for e in x],
            name="asset_condition"
        ),
        default=AssetCondition.GOOD.value
    )

    qr_code = Column(Text)

    image_url = Column(Text)

    notes = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    category = relationship("AssetCategory")
    department = relationship("Department")