import { useState } from "preact/hooks";
import { Alert, PageBadge, Avatar } from "./shared";
import { useNotification } from "../hooks/useNotification";
import { usePhotoUpload } from "../hooks/usePhotoUpload";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Formata dígitos como (xx) xxxxx-xxxx */
function formatWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Valida se a data de nascimento é válida e razoável */
function isValidBirthDate(date: string): boolean {
  if (!date) return true; // campo opcional
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const minYear = now.getFullYear() - 120;
  return d.getFullYear() >= minYear && d <= now;
}

// ─── Sub-componente: linha de preview ───────────────────────────────────────

function PreviewCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "0.9rem 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          background: "rgba(124,58,237,0.12)",
          border: "1px solid rgba(124,58,237,0.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: "0.72rem",
            fontWeight: 700,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: "var(--text-main)",
            fontSize: "0.9rem",
            fontWeight: 800,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "Não informado"}
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function MemberForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    whatsapp: "",
    birth_date: "",
    attendant_name: "",
    marital_status: "",
    observations: "",
    photo_url: "",
  });
  const [loading, setLoading] = useState(false);

  const { photoPreview, handlePhotoChange, removePhoto, resetPhoto } =
    usePhotoUpload();
  const { success, error, showSuccess, showError } = useNotification();

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e: Event) => {
    const target = e.currentTarget as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    setFormData((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const handleWhatsAppChange = (e: Event) => {
    const raw = (e.currentTarget as HTMLInputElement).value;
    setFormData((prev) => ({ ...prev, whatsapp: formatWhatsApp(raw) }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      whatsapp: "",
      birth_date: "",
      attendant_name: "",
      marital_status: "",
      observations: "",
      photo_url: "",
    });
    resetPhoto();
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // ── Validação ──────────────────────────────────────────────────────────
    if (!formData.name.trim()) {
      showError("Nome completo é obrigatório.");
      return;
    }
    if (!formData.whatsapp.trim()) {
      showError("WhatsApp é obrigatório.");
      return;
    }
    if (formData.birth_date && !isValidBirthDate(formData.birth_date)) {
      showError("Data de nascimento inválida.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(
          "Cadastro realizado com sucesso! O pastor já poderá acompanhar este visitante.",
        );
        resetForm();
      } else {
        showError(result.error || "Erro ao cadastrar visitante.");
      }
    } catch {
      showError("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <PageBadge color="green">Área do Obreiro</PageBadge>
          <h1>📝 Cadastro de Visitante</h1>
          <p>
            Registre visitantes, pedidos de oração e informações importantes
            para o acompanhamento pastoral.
          </p>
        </div>
      </div>

      {/* Notificações */}
      {success && <Alert type="success" message={success} autoDismiss={4000} />}
      {error && <Alert type="error" message={error} autoDismiss={4000} />}

      <div
        className="content-grid"
        style={{
          gridTemplateColumns: "1.2fr 0.8fr",
          alignItems: "start",
        }}
      >
        {/* ── Formulário de cadastro ──────────────────────────────────────── */}
        <div className="modern-card">
          <div className="modern-card-header">
            <div>
              <h2 className="modern-card-title">Novo Cadastro</h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  marginTop: 4,
                }}
              >
                Preencha os dados principais do visitante para que o pastor
                possa fazer o acompanhamento.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Foto */}
            <div
              style={{
                padding: "1rem",
                borderRadius: 20,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <Avatar
                name={formData.name}
                photo={photoPreview || formData.photo_url}
                size={86}
              />

              <div style={{ flex: 1 }}>
                <strong
                  style={{
                    display: "block",
                    color: "var(--text-main)",
                    fontSize: "0.95rem",
                    marginBottom: 4,
                  }}
                >
                  Foto do Visitante / Membro
                </strong>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    lineHeight: 1.5,
                    margin: "0 0 0.8rem",
                  }}
                >
                  Envie uma foto para facilitar a identificação no
                  acompanhamento pastoral. Formatos aceitos: JPG, PNG ou WEBP
                  até 2 MB.
                </p>
                <div
                  style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}
                >
                  <label
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      cursor: "pointer",
                      width: "fit-content",
                    }}
                  >
                    Escolher Foto
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) =>
                        handlePhotoChange(
                          e,
                          (b64) =>
                            setFormData((p) => ({ ...p, photo_url: b64 })),
                          showError,
                        )
                      }
                      style={{ display: "none" }}
                    />
                  </label>
                  {(photoPreview || formData.photo_url) && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        removePhoto(() =>
                          setFormData((p) => ({ ...p, photo_url: "" })),
                        )
                      }
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Nome + WhatsApp */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label>
                Nome Completo *
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onInput={handleChange}
                  required
                  placeholder="Nome do visitante"
                />
              </label>

              <label>
                WhatsApp *
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onInput={handleWhatsAppChange}
                  required
                  placeholder="(xx) xxxxx-xxxx"
                  inputMode="numeric"
                />
              </label>
            </div>

            {/* Telefone + Data de nascimento */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label>
                Telefone Fixo
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onInput={handleChange}
                  placeholder="Ex: 1133334444"
                />
              </label>

              <label>
                Data de Nascimento
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onInput={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                />
              </label>
            </div>

            {/* Endereço */}
            <label>
              Endereço
              <input
                type="text"
                name="address"
                value={formData.address}
                onInput={handleChange}
                placeholder="Rua, número, bairro e cidade"
              />
            </label>

            {/* Atendente + Estado civil */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label>
                Atendente / Obreiro
                <input
                  type="text"
                  name="attendant_name"
                  value={formData.attendant_name}
                  onInput={handleChange}
                  placeholder="Quem realizou o atendimento"
                />
              </label>

              <label>
                Estado Civil
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                >
                  <option value="">Selecione…</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
              </label>
            </div>

            {/* Observações */}
            <label>
              Observações / Pedido de Oração
              <textarea
                name="observations"
                value={formData.observations}
                onInput={handleChange}
                rows={4}
                placeholder="Descreva pedido de oração, necessidade, origem da visita ou observação pastoral…"
                style={{ resize: "vertical" }}
              />
            </label>

            {/* Nota informativa */}
            <div
              style={{
                padding: "1rem",
                borderRadius: 18,
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.22)",
              }}
            >
              <strong style={{ color: "#C4B5FD", fontSize: "0.9rem" }}>
                Importante
              </strong>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  margin: "0.4rem 0 0",
                }}
              >
                Após o cadastro, o pastor poderá visualizar este visitante,
                enviar mensagem de boas-vindas e acompanhar o cuidado
                espiritual.
              </p>
            </div>

            {/* Ações */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
                disabled={loading}
              >
                Limpar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Salvando…" : "Cadastrar Visitante"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Prévia do cadastro ──────────────────────────────────────────── */}
        <div className="modern-card">
          <div className="modern-card-header">
            <div>
              <h2 className="modern-card-title">Resumo do Atendimento</h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  marginTop: 4,
                }}
              >
                Prévia rápida do cadastro antes de salvar.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <Avatar
              name={formData.name}
              photo={photoPreview || formData.photo_url}
              size={96}
            />
          </div>

          <PreviewCard label="Nome" value={formData.name} icon="👤" />
          <PreviewCard label="WhatsApp" value={formData.whatsapp} icon="💬" />
          <PreviewCard
            label="Atendente"
            value={formData.attendant_name}
            icon="🤝"
          />
          <PreviewCard
            label="Estado Civil"
            value={formData.marital_status}
            icon="💍"
          />

          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: 18,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.22)",
            }}
          >
            <strong style={{ color: "#34D399", fontSize: "0.9rem" }}>
              Fluxo pastoral
            </strong>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                margin: "0.4rem 0 0",
              }}
            >
              1. Obreiro cadastra o visitante. <br />
              2. Pastor visualiza no painel. <br />
              3. Pastor envia mensagem de boas-vindas. <br />
              4. Igreja acompanha a pessoa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
