from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    DateTime
)

from sqlalchemy.sql import func
from app.db.session import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(BigInteger, primary_key=True)

    name = Column(String, nullable=False)

    description = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )