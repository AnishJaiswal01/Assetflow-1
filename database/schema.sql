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

CREATE TABLE departments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (

    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    phone VARCHAR(20),

    role user_role NOT NULL DEFAULT 'employee',

    department_id BIGINT
        REFERENCES departments(id)
        ON DELETE SET NULL,

    profile_image TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email
ON profiles(email);

CREATE INDEX idx_profiles_department
ON profiles(department_id);

CREATE TABLE asset_categories (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_asset_category_name
ON asset_categories(name);




-- ===========================================
-- ASSETS
-- ===========================================

CREATE TABLE assets (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    asset_tag VARCHAR(50) UNIQUE NOT NULL,

    name VARCHAR(200) NOT NULL,

    category_id BIGINT NOT NULL
        REFERENCES asset_categories(id)
        ON DELETE RESTRICT,

    department_id BIGINT
        REFERENCES departments(id)
        ON DELETE SET NULL,

    serial_number VARCHAR(150) UNIQUE,

    brand VARCHAR(100),

    model VARCHAR(100),

    purchase_date DATE,

    purchase_cost NUMERIC(12,2),

    warranty_expiry DATE,

    status asset_status DEFAULT 'available',

    condition asset_condition DEFAULT 'new',

    qr_code TEXT UNIQUE,

    image_url TEXT,

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assets_status
ON assets(status);

CREATE INDEX idx_assets_department
ON assets(department_id);

CREATE INDEX idx_assets_category
ON assets(category_id);

-- ===========================================
-- ALLOCATIONS
-- ===========================================

CREATE TABLE allocations (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    asset_id BIGINT NOT NULL
        REFERENCES assets(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    allocated_by UUID
        REFERENCES profiles(id)
        ON DELETE SET NULL,

    allocated_at TIMESTAMPTZ DEFAULT NOW(),

    expected_return_date DATE,

    returned_at TIMESTAMPTZ,

    remarks TEXT
);

CREATE INDEX idx_alloc_asset
ON allocations(asset_id);

CREATE INDEX idx_alloc_user
ON allocations(user_id);

-- ===========================================
-- BOOKINGS
-- ===========================================

CREATE TABLE bookings (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    asset_id BIGINT NOT NULL
        REFERENCES assets(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    booking_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    purpose TEXT,

    status booking_status DEFAULT 'pending',

    approved_by UUID
        REFERENCES profiles(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_asset
ON bookings(asset_id);

CREATE INDEX idx_booking_user
ON bookings(user_id);

-- ===========================================
-- MAINTENANCE REQUESTS
-- ===========================================

CREATE TABLE maintenance_requests (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    asset_id BIGINT NOT NULL
        REFERENCES assets(id)
        ON DELETE CASCADE,

    reported_by UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    assigned_to UUID
        REFERENCES profiles(id)
        ON DELETE SET NULL,

    issue_description TEXT NOT NULL,

    priority maintenance_priority DEFAULT 'medium',

    status maintenance_status DEFAULT 'pending',

    created_at TIMESTAMPTZ DEFAULT NOW(),

    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_maintenance_asset
ON maintenance_requests(asset_id);

-- ===========================================
-- NOTIFICATIONS
-- ===========================================

CREATE TABLE notifications (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    title VARCHAR(200) NOT NULL,

    message TEXT NOT NULL,

    type notification_type DEFAULT 'general',

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_user
ON notifications(user_id);

-- ===========================================
-- ACTIVITY LOGS
-- ===========================================

CREATE TABLE activity_logs (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID
        REFERENCES profiles(id)
        ON DELETE SET NULL,

    action VARCHAR(150) NOT NULL,

    entity_name VARCHAR(100),

    entity_id BIGINT,

    details TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user
ON activity_logs(user_id);

-- ==========================================
-- BOOKING OVERLAP PREVENTION
-- ==========================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings
ADD COLUMN booking_period tstzrange;


ALTER TABLE bookings
ADD CONSTRAINT no_booking_overlap
EXCLUDE USING gist (
  asset_id WITH =,
  booking_period WITH &&
);

-- ==========================================
-- AUTH PROFILE TRIGGER
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      'New User'
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- BOOKING PERIOD TRIGGER
-- ==========================================

CREATE OR REPLACE FUNCTION set_booking_period()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_period :=
    tstzrange(
      (NEW.booking_date + NEW.start_time)::timestamptz,
      (NEW.booking_date + NEW.end_time)::timestamptz,
      '[)'
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER booking_period_trigger
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_booking_period();

