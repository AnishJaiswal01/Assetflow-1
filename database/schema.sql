-- ==========================================
-- EXTENSIONS
-- ==========================================

CREATE EXTENSION IF NOT EXISTS btree_gist;
-- ===========================


-- ENUM TYPES
-- ===========================

CREATE TYPE user_role AS ENUM (
    'admin',
    'asset_manager',
    'employee',
    'auditor'
);

CREATE TYPE asset_status AS ENUM (
    'available',
    'allocated',
    'maintenance',
    'disposed',
    'lost'
);

CREATE TYPE asset_condition AS ENUM (
    'new',
    'good',
    'fair',
    'damaged'
);

CREATE TYPE booking_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'completed',
    'cancelled'
);

CREATE TYPE maintenance_status AS ENUM (
    'pending',
    'assigned',
    'in_progress',
    'completed',
    'rejected'
);

CREATE TYPE maintenance_priority AS ENUM (
    'low',
    'medium',
    'high'
);

CREATE TYPE notification_type AS ENUM (
    'booking',
    'allocation',
    'maintenance',
    'general'
);
