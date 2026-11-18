# Parking Assist — Frontend

Angular standalone application foundation for the Parking Assist platform.

## Stack
- Angular 21, TypeScript strict mode, standalone components and Router
- Reactive integration boundary via HttpClient; feature forms use Angular Forms in this initial UI slice
- SCSS design tokens and responsive layouts
- Vitest-based Angular unit-test builder configured by Angular CLI

## Run locally

```bash
npm install
npm start
```

## Current routes
- `/` landing and destination search
- `/discover` discovery preview (explicit sample data; not live inventory)
- `/sign-in` mobile sign-in entry (OTP API intentionally not connected)
- `/workspace/:role` role-oriented workspace shell

## Integration contract
The UI must not claim a reservation, payment, OTP delivery, occupancy or verification succeeded until the backend/provider confirms it. Sample discovery cards are marked as preview data. Authentication token storage is a temporary integration seam and must be replaced with the approved refresh-cookie/CSRF strategy before production.

## Architecture conventions
- Keep feature UI separate from shared shell and core HTTP concerns.
- Keep authorization decisions on the server; route visibility is not authorization.
- Keep money display in INR and timestamps as API-provided ISO-8601 values.
- Add feature-level tests and API contract tests before enabling each live workflow.
