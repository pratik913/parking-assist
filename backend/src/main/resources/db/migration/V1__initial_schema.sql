CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE app_user (
 id UUID PRIMARY KEY, full_name VARCHAR(80) NOT NULL, email VARCHAR(254) NOT NULL UNIQUE,
 password_hash VARCHAR(100) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
 CHECK(status IN ('ACTIVE','SUSPENDED','DELETED')), created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE parking_listing (
 id UUID PRIMARY KEY, owner_user_id UUID NOT NULL REFERENCES app_user(id), name VARCHAR(120) NOT NULL,
 address VARCHAR(300) NOT NULL, locality VARCHAR(100) NOT NULL, city VARCHAR(100) NOT NULL,
 kind VARCHAR(30) NOT NULL CHECK(kind IN ('PRIVATE','PUBLIC_AUTHORIZED')),
 verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
 CHECK(verification_status IN ('PENDING','VERIFIED','REJECTED','EXPIRED')),
 hourly_rate NUMERIC(10,2) NOT NULL CHECK(hourly_rate>=0), location GEOGRAPHY(POINT,4326) NOT NULL,
 supports_two_wheeler BOOLEAN NOT NULL DEFAULT false, supports_four_wheeler BOOLEAN NOT NULL DEFAULT true,
 active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_parking_location_gist ON parking_listing USING GIST(location);
CREATE INDEX idx_parking_verified_city ON parking_listing(city,locality) WHERE active=true AND verification_status='VERIFIED';
CREATE TABLE booking (
 id UUID PRIMARY KEY, parking_listing_id UUID NOT NULL REFERENCES parking_listing(id),
 driver_user_id UUID NOT NULL REFERENCES app_user(id), start_at TIMESTAMPTZ NOT NULL,
 end_at TIMESTAMPTZ NOT NULL, status VARCHAR(24) NOT NULL
 CHECK(status IN ('HELD','PENDING_PAYMENT','CONFIRMED','CANCELLED','EXPIRED','COMPLETED')),
 hold_expires_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 CHECK(end_at>start_at)
);
-- Database-level exclusion is the cross-instance guarantee against overlapping active reservations.
ALTER TABLE booking ADD CONSTRAINT booking_no_overlapping_active_ranges EXCLUDE USING GIST
(parking_listing_id WITH =, tstzrange(start_at,end_at,'[)') WITH &&)
WHERE(status IN ('HELD','PENDING_PAYMENT','CONFIRMED'));
CREATE INDEX idx_booking_driver_created ON booking(driver_user_id,created_at DESC);
CREATE INDEX idx_booking_expiry ON booking(hold_expires_at) WHERE status='HELD';