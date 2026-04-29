# Requirements: CRM Eclésia

**Defined:** 2026-04-29
**Core Value:** Facilitar o primeiro contato e o acompanhamento pastoral contínuo através de uma interface extremamente leve e eficiente.

## v1 Requirements

### Authentication & Permissions

- [ ] **AUTH-01**: Pastor pode fazer login com e-mail e senha.
- [ ] **AUTH-02**: Obreiro pode fazer login com e-mail e senha.
- [ ] **PERM-01**: Sistema diferencia permissões entre Pastor (admin) e Obreiro (entry-only).
- [ ] **PERM-02**: Pastor pode conceder acesso "provisório" para Obreiro usar funções administrativas.

### Member Intake (Obreiro)

- [ ] **INTAKE-01**: Formulário de cadastro com: Nome, Endereço, Tel, WhatsApp, Data de Nascimento.
- [ ] **INTAKE-02**: Campos adicionais: Nome do Atendente, Estado Civil, Observações (Pedido de Oração).
- [ ] **INTAKE-03**: Validação básica de campos obrigatórios.
- [ ] **INTAKE-04**: Confirmação visual de sucesso após o cadastro.

### Pastoral Dashboard (Pastor)

- [ ] **DASH-01**: Lista de novos visitantes/membros ordenados por data.
- [ ] **DASH-02**: Filtro simples por nome ou atendente.
- [ ] **DASH-03**: Visualização de detalhes do membro (incluindo observações).
- [ ] **DASH-04**: Contador de novos visitantes na semana/mês.

### Messaging & Follow-up

- [ ] **MSG-01**: Botão para abrir WhatsApp com mensagem pré-definida de "Boas-vindas".
- [ ] **MSG-02**: Alerta/Lista de aniversariantes do dia.
- [ ] **MSG-03**: Botão para abrir WhatsApp com mensagem de "Feliz Aniversário".

### Infrastructure

- [ ] **INFRA-01**: Persistência de dados em SQLite.
- [ ] **INFRA-02**: Binário único em Go que serve o frontend Preact embutido.

## v2 Requirements

### Analytics

- **ANLY-01**: Gráficos de crescimento de membros ao longo do tempo.
- **ANLY-02**: Relatório de conversão (visitante -> membro).

### Advanced Messaging

- **MSG-04**: Disparo de mensagens em massa (limitado para evitar bloqueios).
- **MSG-05**: Histórico de mensagens enviadas para cada membro.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Gestão Financeira | CRM focado em pessoas, não em tesouraria. |
| Integração com Redes Sociais | Foco no contato direto via WhatsApp/Telefone. |
| App iOS/Android Nativo | Versão Web leve (PWA) é suficiente para o uso pretendido. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| PERM-01 | Phase 2 | Pending |
| INTAKE-01 | Phase 3 | Pending |
| INTAKE-02 | Phase 3 | Pending |
| INTAKE-03 | Phase 3 | Pending |
| INTAKE-04 | Phase 3 | Pending |
| DASH-01 | Phase 4 | Pending |
| DASH-02 | Phase 4 | Pending |
| DASH-03 | Phase 4 | Pending |
| DASH-04 | Phase 4 | Pending |
| MSG-01 | Phase 5 | Pending |
| MSG-02 | Phase 5 | Pending |
| MSG-03 | Phase 5 | Pending |
| PERM-02 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-29*
*Last updated: 2026-04-29 after initial definition*
