# Roadmap: CRM Eclésia

## Overview

O projeto será construído em fases incrementais, começando pela infraestrutura base (Go + Preact + SQLite), seguida pelo sistema de autenticação e permissões, e culminando nas funcionalidades de cadastro (obreiro) e gestão (pastor). O objetivo final é um binário único e leve.

## Phases

- [ ] **Phase 1: Foundation** - Configuração do ambiente Go, Vite/Preact e SQLite.
- [ ] **Phase 2: Auth & Roles** - Sistema de login e diferenciação entre Pastor e Obreiro.
- [ ] **Phase 3: Member Intake** - Implementação do formulário de cadastro de visitantes.
- [ ] **Phase 4: Pastoral Dashboard** - Interface de visualização e gestão para o Pastor.
- [ ] **Phase 5: Messaging & Alerts** - Integração com WhatsApp e sistema de aniversariantes.
- [ ] **Phase 6: Advanced Permissions** - Implementação da liberação provisória para Obreiros.
- [ ] **Phase 7: Final Polish** - Refinamento de UI (Pico.css) e build do binário único.
- [ ] **Phase 8: Mobile Access** - Acesso e compatibilidade para uso em celulares na mesma rede.

## Phase Details

### Phase 1: Foundation
**Goal**: Estabelecer a comunicação entre o backend Go e o frontend Preact com persistência SQLite.
**Depends on**: Nothing
**Requirements**: INFRA-01, INFRA-02
**Success Criteria**:
  1. Servidor Go rodando e respondendo "Hello World".
  2. Frontend Preact compilando e sendo servido pelo Go.
  3. Banco de dados SQLite criado e acessível via Go.
**Plans**: 2 plans

Plans:
- [ ] 01-01: Setup do backend Go e SQLite schema inicial.
- [ ] 01-02: Setup do frontend Preact com Vite e integração de embed no Go.

### Phase 2: Auth & Roles
**Goal**: Proteger o sistema e definir quem pode fazer o quê.
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, PERM-01
**Success Criteria**:
  1. Usuário pode logar e receber um cookie de sessão.
  2. Rotas protegidas por middleware no backend.
  3. Frontend redireciona para login se não autenticado.
**Plans**: 2 plans

### Phase 3: Member Intake
**Goal**: Permitir que o Obreiro realize sua principal função: cadastrar pessoas.
**Depends on**: Phase 2
**Requirements**: INTAKE-01, INTAKE-02, INTAKE-03, INTAKE-04
**Success Criteria**:
  1. Obreiro vê apenas o formulário de cadastro ao logar.
  2. Dados são salvos corretamente no SQLite.
  3. Validação de campos (ex: WhatsApp obrigatório) funciona.
**Plans**: 2 plans

### Phase 4: Pastoral Dashboard
**Goal**: Dar ao Pastor a visão geral dos atendimentos.
**Depends on**: Phase 3
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04
**Success Criteria**:
  1. Pastor vê lista de novos visitantes logados.
  2. Detalhes (incluindo pedidos de oração) são exibidos em modal ou página dedicada.
  3. Filtros por nome funcionam.
**Plans**: 2 plans

### Phase 5: Messaging & Alerts
**Goal**: Facilitar o contato do Pastor com os membros.
**Depends on**: Phase 4
**Requirements**: MSG-01, MSG-02, MSG-03
**Success Criteria**:
  1. Dashboard mostra quem faz aniversário hoje.
  2. Botão de WhatsApp abre o aplicativo com o texto correto.
**Plans**: 1 plan

### Phase 6: Advanced Permissions
**Goal**: Implementar a flexibilidade de acesso solicitada.
**Depends on**: Phase 2, Phase 5
**Requirements**: PERM-02
**Success Criteria**:
  1. Pastor tem um toggle para "Liberar Acesso Administrativo" para um obreiro.
  2. Obreiro ganha acesso às funções de Dashboard ao receber a permissão.
**Plans**: 1 plan

### Phase 7: Final Polish
**Goal**: Deixar o sistema pronto para uso real com visual profissional.
**Depends on**: Phase 6
**Requirements**: All
**Success Criteria**:
  1. Visual coerente usando Pico.css/Custom CSS.
  2. Binário compilado sem símbolos (-s -w) é menor que 15MB.
**Plans**: 1 plan

### Phase 8: Mobile Access
**Goal**: Permitir o uso contínuo do sistema em smartphones através da rede local.
**Depends on**: Phase 7
**Requirements**: INFRA-03
**Success Criteria**:
  1. Servidor escuta em `0.0.0.0` para aceitar conexões externas da mesma rede.
  2. Interface possui ajustes responsivos ou orientações para uso móvel.
**Plans**: 1 plan

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/1 | Complete | 2026-04-29 |
| 2. Auth & Roles | 1/1 | Complete | 2026-04-29 |
| 3. Member Intake | 1/1 | Complete | 2026-04-29 |
| 4. Pastoral Dashboard | 2/2 | Complete | 2026-04-29 |
| 5. Messaging & Alerts | 1/1 | Complete | 2026-04-29 |
| 6. Advanced Permissions | 1/1 | Complete | 2026-04-29 |
| 7. Final Polish | 1/1 | Complete | 2026-05-06 |
| 8. Mobile Access | 0/1 | Pending | |
