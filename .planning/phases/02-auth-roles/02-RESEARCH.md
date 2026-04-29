# Phase 2 Research: Authentication & Roles

## Objective
Implement a secure, role-based authentication system using JWT and HttpOnly cookies.

## Libraries
- **JWT**: `github.com/golang-jwt/jwt/v5`
- **Password Hashing**: `golang.org/x/crypto/bcrypt`

## Database Schema (SQLite)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('pastor', 'obreiro')) NOT NULL,
    provisional_access BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Auth Strategy
- **Token Storage**: HttpOnly Cookie (`Secure`, `SameSite=Strict`).
- **Middleware**: Gin middleware to intercept requests, validate JWT from cookie, and inject user info into the context.
- **Login Flow**:
  1. POST `/api/login` (username, password).
  2. Verify user in DB.
  3. Generate JWT with `user_id` and `role`.
  4. Set HttpOnly cookie.
  5. Return user info (excluding password).

## Role-Based Access Control (RBAC)
- Middleware `AuthorizeRole(role)` will be used to protect specific routes.
- Example: `/api/admin/*` requires `pastor`.
