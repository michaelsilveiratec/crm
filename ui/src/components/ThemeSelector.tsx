/**
 * ThemeSelector — 2 temas: Azul (navy) e Escuro (dark).
 * Exibido apenas na tela de Configurações como painel informativo.
 * O seletor interativo principal está na sidebar (app.tsx).
 */

type ThemeName = "theme-navy" | "theme-dark";

const THEMES: {
  key: ThemeName;
  icon: string;
  title: string;
  desc: string;
  preview: string;
}[] = [
  {
    key: "theme-navy",
    icon: "🌊",
    title: "Azul",
    desc: "Tema padrão — paleta aurora premium com tons de azul e rosa",
    preview: "navy",
  },
  {
    key: "theme-dark",
    icon: "🌙",
    title: "Escuro",
    desc: "Visual preto total — moderno e elegante",
    preview: "dark",
  },
];

function getCurrentTheme(): ThemeName {
  const saved = localStorage.getItem("crm_theme");
  return saved === "theme-navy" || saved === "theme-dark"
    ? saved
    : "theme-navy";
}

function applyTheme(theme: ThemeName) {
  document.body.classList.remove("theme-navy", "theme-dark", "theme-light");
  document.body.classList.add(theme);
  localStorage.setItem("crm_theme", theme);
}

export function ThemeSelector() {
  return (
    <div className="modern-card">
      <div className="modern-card-header">
        <div>
          <h2 className="modern-card-title">🎨 Aparência do Sistema</h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginTop: 4,
            }}
          >
            Escolha o tema visual. A preferência é salva neste navegador. O
            seletor rápido também fica no painel lateral.
          </p>
        </div>
      </div>

      <div
        className="theme-option-grid"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {THEMES.map((t) => {
          const active = getCurrentTheme() === t.key;
          return (
            <button
              key={t.key}
              type="button"
              className={`theme-option-card ${active ? "active" : ""}`}
              onClick={() => {
                applyTheme(t.key);
                // força re-render via evento storage
                window.dispatchEvent(new Event("storage"));
              }}
            >
              <div className={`theme-preview ${t.preview}`} />
              <div className="theme-option-info">
                <strong>
                  {t.icon} {t.title}
                </strong>
                <span>{t.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
