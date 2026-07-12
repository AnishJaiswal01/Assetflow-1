from enum import Enum


class AssetStatus(str, Enum):
    AVAILABLE = "available"
    ALLOCATED = "allocated"
    MAINTENANCE = "maintenance"
    DISPOSED = "disposed"
    LOST = "lost"


class AssetCondition(str, Enum):
    NEW = "new"
    GOOD = "good"
    FAIR = "fair"
    DAMAGED = "damaged"