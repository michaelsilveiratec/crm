# Phase 1 Research: Foundation

## Objective
Set up a lightweight monorepo with a Go backend and Preact frontend, capable of being built into a single executable binary.

## Recommended Structure
```text
/crm_1
  /cmd
    /server
      main.go        # Entry point
  /internal
    /api            # API handlers
    /db             # SQLite logic
  /ui               # Preact + Vite frontend
    /dist           # Build output (ignored by git)
    vite.config.ts
  embed.go          # //go:embed ui/dist/*
  go.mod
  go.sum
```

## Frontend: Preact + Vite
- **Build Output**: Configure Vite to output to `dist`.
- **Base URL**: Set `base: '/'` in `vite.config.ts`.
- **Command**: `npm run build` will generate the static files in `ui/dist`.

## Backend: Go + Gin
- **Embedding**:
  ```go
  //go:embed all:ui/dist
  var uiFS embed.FS
  ```
- **Static Serving**: Use `http.FS` to serve the `ui/dist` folder.
- **SPA Fallback**: Any route that doesn't match a static file or an `/api` route should return `ui/dist/index.html`.
- **Gin Example**:
  ```go
  publicFS, _ := fs.Sub(uiFS, "ui/dist")
  r.StaticFS("/assets", http.FS(publicFS))
  r.NoRoute(func(c *gin.Context) {
      c.FileFromFS("index.html", http.FS(publicFS))
  })
  ```

## Database: SQLite
- **Driver**: `modernc.org/sqlite` (CGO-free).
- **Initialization**: 
  ```go
  import (
      "database/sql"
      _ "modernc.org/sqlite"
  )
  db, err := sql.Open("sqlite", "crm.db")
  ```

## Deployment
- **Build Flag**: `go build -ldflags="-s -w"` for a small binary.
- **Result**: A single file (e.g., `crm.exe` on Windows) that contains everything.
