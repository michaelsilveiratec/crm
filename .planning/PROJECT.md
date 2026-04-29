# CRM Eclésia

## What This Is

Um CRM leve e performático voltado para Igrejas Evangélicas, permitindo que obreiros realizem o cadastro inicial de visitantes e membros, enquanto pastores gerenciam o atendimento, visualizam dashboards e coordenam comunicações (como mensagens de aniversário e boas-vindas).

## Core Value

Facilitar o primeiro contato e o acompanhamento pastoral contínuo através de uma interface extremamente leve e eficiente.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Form para Obreiros: Nome, Endereço, Tel, WhatsApp, Nascimento, Atendente, Estado Civil, Observações (Oração).
- [ ] Dashboard para Pastores: Visualização de novos cadastros e lista geral.
- [ ] Sistema de Permissões: Acesso padrão para obreiros (apenas cadastro) e total para pastores, com opção de liberação provisória.
- [ ] Integração de Mensagens: Atalhos/automação para mensagens de boas-vindas e aniversário via WhatsApp.
- [ ] Banco de Dados Local: Persistência rápida e leve usando SQLite.

### Out of Scope

- [Automação complexa de marketing] — O foco é o atendimento pessoal e pastoral simples.
- [Gestão financeira completa] — O escopo atual é focado em relacionamento e CRM de membros.

## Context

- O usuário busca máxima leveza, optando por Golang no backend e Preact (3kB) no frontend.
- A estrutura deve permitir que, no futuro, o obreiro assuma funções do pastor sob permissão.
- Ambiente de uso provável: dispositivos móveis e desktops simples dentro do ambiente da igreja.

## Constraints

- **Tech Stack**: Backend em Golang, Frontend em Preact (sem React pesado).
- **Database**: SQLite para evitar dependências de infraestrutura pesada.
- **Performance**: O sistema deve ser "extremanente leve", evitando bundles JS grandes.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Golang Backend | Performance e binário único fácil de distribuir. | — Pending |
| Preact Frontend | Alternativa de 3kB ao React para máxima leveza. | — Pending |
| SQLite | Simplicidade de implantação e velocidade para volume local. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-29 after initialization*
