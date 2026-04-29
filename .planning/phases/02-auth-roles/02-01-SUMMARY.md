# Phase 2 Summary: Authentication & Roles

## Accomplishments
- **JWT System**: Implemented JWT generation and validation using `github.com/golang-jwt/jwt/v5`.
- **Backend Auth**:
    - Added `internal/auth` package with middleware for authentication and role-based authorization.
    - Implemented `/api/login`, `/api/logout`, and `/api/me` handlers.
- **Database**:
    - Created `users` table with roles (`pastor`, `obreiro`).
    - Seeded a default user: `pastor` / `admin123`.
- **Frontend Auth**:
    - Created `Login.tsx` component with form handling.
    - Updated `App.tsx` to manage authentication state and session checking.

## Verification Results
- Server starts and connects to SQLite.
- Default user is created on first run.
- [PENDING] Manual login test.

## Decisions
- Used **HttpOnly Cookies** for JWT storage to prevent XSS attacks.
- Implemented **bcrypt** for secure password hashing.
