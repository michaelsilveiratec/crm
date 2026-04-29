# Research: Phase 4 - Pastoral Dashboard

## Goal
Dar ao Pastor a visão geral dos atendimentos e permitir a gestão das informações coletadas pelos obreiros.

## Requirements
- [DASH-01] Lista de novos visitantes/membros ordenados por data.
- [DASH-02] Filtro simples por nome ou atendente.
- [DASH-03] Visualização de detalhes do membro (incluindo observações).
- [DASH-04] Contador de novos visitantes na semana/mês.

## Database & API Design
- `db.go`: Need a `GetMembers()` function that returns a slice of `*Member` ordered by `created_at DESC`.
- `member_handlers.go`: Add `GetMembersHandler` for `GET /api/members`.
- Security: Protect the route using `auth.RoleRequired("pastor")` middleware so Obreiros cannot see the whole database.

## UI Components
- `Dashboard.tsx`: Component to fetch and display the list.
- **Metrics**: Calculate "This Week" and "This Month" based on the `created_at` field from the returned JSON list directly in Preact.
- **Filtering**: Use a controlled input in Preact to filter the list locally (since the dataset is expected to be small/medium for a local church, filtering in the browser is much faster and simpler).
- **Details View**: Use HTML5 `<details>` element which is natively supported and styled beautifully by Pico.css without needing complex React Modal state.
- **Navigation**: Update `App.tsx` to provide tabs/buttons to switch between the Dashboard and the Form if the user is a Pastor.
