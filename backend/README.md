# Parking Assist Backend
Java 21 / Spring Boot 4.1.2 backend foundation, kept in a separate feature branch from the Angular frontend.

## Included
- Stateless short-lived JWT authentication and BCrypt password hashing.
- Listing submission and PostGIS nearby search (only verified, active listings appear).
- Server-side Google reverse geocoding adapter.
- Booking holds protected by a PostgreSQL GiST exclusion constraint against overlapping active reservations.
- Flyway schema, Actuator, Docker Compose instructions to follow in the full backend package.

## Not yet production complete
This is a backend foundation, not a complete marketplace or a demonstrated 1M-RPS system. Payment order creation/webhooks/refunds, refresh-token rotation, OTP/MFA, listing verification/admin, ownership/role management, occupancy/check-in, payouts, notifications, rate limiting, observability, integration/concurrency tests and load tests remain to be implemented. Real payments and production bookings must not be enabled until those gates pass.

## Local prerequisites
JDK 21, Maven 3.9+, PostgreSQL 17 with PostGIS 3.5. Set environment variables before running:
- DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD
- APP_JWT_SECRET (at least 32 random bytes)
- CORS_ALLOWED_ORIGINS
- GOOGLE_MAPS_GEOCODING_API_KEY

Run with `mvn spring-boot:run`; API listens on port 8080.
