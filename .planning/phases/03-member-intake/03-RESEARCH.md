# Research: Phase 3 - Member Intake

## Goal
Implement the visitor/member registration form for Obreiros.

## Requirements
- [INTAKE-01] Form: Name, Address, Phone, WhatsApp, Birth Date.
- [INTAKE-02] Fields: Attendant, Marital Status, Observations (Prayer Request).
- [INTAKE-03] Basic validation (WhatsApp required).
- [INTAKE-04] Visual success confirmation.

## Database Schema
Table `members`:
- `id`: INTEGER PK
- `name`: TEXT NOT NULL
- `address`: TEXT
- `phone`: TEXT
- `whatsapp`: TEXT NOT NULL
- `birth_date`: DATE
- `attendant_name`: TEXT
- `marital_status`: TEXT
- `observations`: TEXT
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP
- `created_by`: INTEGER (FK to users.id)

## API Design
- `POST /api/members`: Create a new member.
- Auth required: Yes (any authenticated user).

## UI Components
- `MemberForm.tsx`: The main form component.
- `SuccessModal.tsx`: Confirmation after submission.
- Form validation: Simple client-side check + backend validation.

## Technical Choices
- **Preact state**: Use standard `useState` for form fields.
- **Pico.css**: Keep it light, use Pico.css grid for layout.
- **SQLite**: Standard INSERT query.
