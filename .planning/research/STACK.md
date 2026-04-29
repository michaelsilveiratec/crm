# Stack Research - CRM Eclésia

## Overview
O objetivo é um sistema extremamente leve (3kB no front, binário único no back) e performático.

## Recommended Stack

### Backend: Golang
- **Framework**: **Fiber** ou **Gin**.
  - *Rationale*: Fiber é inspirado no Express (Node.js) e é extremamente rápido, mas o Gin é mais maduro no ecossistema Go. Dado o requisito de "leveza", o **Fiber** pode ser ligeiramente mais amigável para quem vem do JS, mas o **Gin** tem menor pegada de memória em repouso.
  - **Decision**: Usaremos **Gin** pela estabilidade e simplicidade.
- **Database**: **SQLite** (via driver `modernc.org/sqlite` ou `github.com/mattn/go-sqlite3`).
  - *Rationale*: O `modernc.org/sqlite` é CGO-free, o que facilita a compilação cruzada e mantém o binário limpo.

### Frontend: Preact
- **Framework**: **Preact** (via Vite).
  - *Rationale*: 3kB de tamanho, API idêntica ao React. Perfeito para o requisito.
- **Styling**: **Pico.css** ou **Vanilla CSS**.
  - *Rationale*: Pico.css fornece um visual moderno e "class-light" com apenas alguns kBs, ideal para dashboards simples e formulários.

### Integration: Single Binary
- **Technique**: `//go:embed`
  - *Rationale*: Permite embutir os arquivos estáticos do Preact (após o build do Vite) diretamente no binário Go.
  - **Outcome**: Um único arquivo executável que roda o servidor e serve a interface.

## Implementation Patterns
1. **API**: REST JSON para comunicação entre Preact e Go.
2. **Auth**: JWT ou Cookies (Session-based). Dado que é um CRM local simples, Cookies com Session ID no SQLite é mais fácil de gerenciar permissões dinâmicas.
3. **Permissions**: Middleware em Go que checa o nível de acesso (Pastor/Obreiro) antes de processar rotas de dashboard ou deletar dados.

## Versions
- Go: 1.22+
- Preact: 10.x
- Vite: 5.x
- SQLite: 3.x
