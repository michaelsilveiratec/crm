import { useState, useEffect } from "preact/hooks";
import { ThemeSelector } from "./ThemeSelector";
import { Alert, PageBadge } from "./shared";
import { useNotification } from "../hooks/useNotification";

interface ChurchSettings {
  whatsapp: string;
  name?: string;
  slug?: string;
}

export function Settings() {
  const [settings, setSettings] = useState<ChurchSettings>({
    whatsapp: "",
    name: "Bom Samaritano Matriz",
    slug: "bom-samaritano-matriz",
  });
  const [saving, setSaving] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const { success, error, showSuccess, showError } = useNotification();

  // ── Carrega configurações atuais ─────────────────────────────────────────

  useEffect(() => {
    fetch("/api/church/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSettings((prev) => ({
            ...prev,
            whatsapp: data.whatsapp || "",
            name: data.name || prev.name,
            slug: data.slug || prev.slug,
          }));
        }
      })
      .catch(() => {
        /* silencioso — usa valores padrão */
      })
      .finally(() => setLoadingSettings(false));
  }, []);

  // ── Salva configurações ───────────────────────────────────────────────────

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const resp = await fetch("/api/church/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: settings.whatsapp }),
      });

      if (resp.ok) {
        showSuccess("Configurações salvas com sucesso!");
      } else {
        const body = await resp.json().catch(() => ({}));
        showError(body.error || "Erro ao salvar configurações.");
      }
    } catch {
      showError("Erro de conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="main-content">
      {/* Cabeçalho */}
      <div className="page-header">
        <div>
          <PageBadge color="purple">Configurações da igreja</PageBadge>
          <h1>⚙️ Configurações</h1>
          <p>
            Personalize a aparência do CRM e ajuste informações principais da
            igreja.
          </p>
        </div>
      </div>

      {/* Notificações */}
      {success && <Alert type="success" message={success} autoDismiss={3500} />}
      {error && <Alert type="error" message={error} autoDismiss={4000} />}

      {/* Seletor de tema */}
      <ThemeSelector />

      {/* Grid de cards */}
      <div
        className="content-grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          alignItems: "start",
        }}
      >
        {/* ── Perfil da Igreja ────────────────────────────────────────────── */}
        <div className="modern-card">
          <div className="modern-card-header">
            <div>
              <h2 className="modern-card-title">🏛️ Perfil da Igreja</h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  marginTop: 4,
                }}
              >
                Informações principais da congregação e integração WhatsApp.
              </p>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Nome — somente leitura */}
            <div className="form-group">
              <label>
                Nome da Congregação
                <input
                  type="text"
                  value={loadingSettings ? "…" : (settings.name ?? "")}
                  disabled
                />
              </label>
            </div>

            {/* Slug — somente leitura */}
            <div className="form-group">
              <label>
                Slug SaaS
                <input
                  type="text"
                  value={loadingSettings ? "…" : (settings.slug ?? "")}
                  disabled
                />
              </label>
            </div>

            {/* WhatsApp Oficial — editável */}
            <div className="form-group">
              <label>
                WhatsApp Oficial
                <input
                  type="text"
                  placeholder="Ex: 11999999999"
                  value={settings.whatsapp}
                  onInput={(e) =>
                    setSettings((p) => ({
                      ...p,
                      whatsapp: (e.currentTarget as HTMLInputElement).value,
                    }))
                  }
                  disabled={loadingSettings}
                />
              </label>
            </div>

            {/* Indicador de segurança */}
            <div
              style={{
                padding: "1rem",
                borderRadius: 18,
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.22)",
              }}
            >
              <strong style={{ color: "#34D399", fontSize: "0.9rem" }}>
                Segurança ativa
              </strong>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  margin: "0.35rem 0 0",
                }}
              >
                Os acessos são separados por perfil: Pastor Administrador e
                Obreiro.
              </p>
            </div>

            {/* Botão salvar */}
            <button
              className="btn-primary"
              style={{ width: "fit-content" }}
              onClick={handleSave}
              disabled={saving || loadingSettings}
            >
              {saving ? "💾 Salvando…" : "Salvar Alterações"}
            </button>
          </div>
        </div>

        {/* ── Controle de Acessos ─────────────────────────────────────────── */}
        <div className="modern-card">
          <div className="modern-card-header">
            <div>
              <h2 className="modern-card-title">🛡️ Controle de Acessos</h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  marginTop: 4,
                }}
              >
                O CRUD de usuários fica na tela Obreiros, acessível somente ao
                Pastor Administrador.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              borderRadius: 18,
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.22)",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
            }}
          >
            Para criar, editar, resetar senha, bloquear ou excluir obreiros,
            acesse o menu:
            <br />
            <strong style={{ color: "var(--text-main)" }}>Obreiros</strong>
          </div>

          {/* Atalho visual para a tela de obreiros */}
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: 18,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.22)",
            }}
          >
            <PageBadge color="purple">Níveis de acesso</PageBadge>
            <ul
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                lineHeight: 1.8,
                margin: 0,
                paddingLeft: "1.2rem",
              }}
            >
              <li>
                <strong style={{ color: "var(--text-main)" }}>
                  Pastor Administrador
                </strong>{" "}
                — acesso total ao CRM
              </li>
              <li>
                <strong style={{ color: "var(--text-main)" }}>Obreiro</strong> —
                cadastro de visitantes e mensagens
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
