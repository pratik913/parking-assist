# Backend Architecture and Coding Standards

## Architectural style

Parking Assist uses a **modular monolith** organized by business capability.
Each feature owns its controller, application service, persistence adapter,
DTOs, mapping and domain rules. Shared packages contain cross-cutting
infrastructure only; they must not become a dumping ground for business logic.

## Package convention

```text
com.parkingassist
├── identity/{controller,service,repository,entity,dto,mapper}
├── parking/{controller,service,repository,entity,dto,mapper}
├── booking/{controller,service,repository,entity,dto,mapper}
├── location/{controller,service,dto}
└── shared/{config,security,exception,common}
```

Create a layer package when it contains production code. Do not add empty
packages solely to make the tree look complete.

## Request flow

HTTP Controller -> Application Service -> Repository -> PostgreSQL/PostGIS

- **Controller:** HTTP mapping, request binding and response status only.
- **DTO:** Explicit API contract. Never serialize persistence entities directly.
- **Service:** Business invariants, orchestration and transaction boundaries.
- **Repository:** Persistence queries; no HTTP concerns.
- **Entity:** Persistence/domain state, not an API response model.
- **Mapper:** Explicit conversion between DTOs and domain/persistence types.
- **Exception handler:** Stable client-safe error contract; never return stack traces.

## Java formatting

- Four spaces; one declaration per line; one class per file.
- PascalCase types; camelCase methods and fields; UPPER_SNAKE_CASE constants.
- Constructor injection; final fields for required dependencies.
- Prefer immutable request/response records where suitable.
- Keep methods focused and name them by intent.
- Add JavaDoc to public APIs and comments to explain non-obvious decisions,
  invariants, concurrency controls and security boundaries.
- Do not add comments that merely repeat the code.

## Dependency rules

- A feature may expose a small application-facing interface to other features.
- Other modules must not access a feature's repositories or entities directly.
- Shared code must not depend on feature-specific packages.
- Avoid circular module dependencies.

## Persistence and concurrency

- PostgreSQL is the source of truth.
- Use Flyway for schema evolution.
- Keep money in NUMERIC/BigDecimal and timestamps in timestamptz/Instant.
- Enforce reservation overlap at the database boundary; application checks
  alone are not safe under concurrent requests.
- Keep transaction boundaries in application services, not controllers.

## Quality gates

Before merge: compile, unit tests, integration tests against PostgreSQL/PostGIS,
security tests, migration validation, formatting/static analysis and review.
Capacity claims require reproducible load tests and documented infrastructure.
