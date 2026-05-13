import { useState, useEffect } from "preact/hooks";
import {
  Avatar,
  StatusBadge,
  LoadingState,
  EmptyState,
  Alert,
  PageBadge,
  Modal,
  ConfirmDialog,
} from "./shared";
import { useNotification } from "../hooks/useNotification";
import { usePhotoUpload } from "../hooks/usePhotoUpload";

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  is_visitor: boolean;
  spiritual_status: string;
  last_contact_date: string;
  follow_up_notes: string;
  status: string;
  photo_url?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  birth_date?: string;
  observations?: string;
}

type FormData = {
  id?: number;
  name: string;
  email: string;
  whatsapp: string;
  address: string;
  neighborhood: string;
  city: string;
  birth_date: string;
  is_visitor: boolean;
  spiritual_status: string;
  observations: string;
  photo_url: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  whatsapp: "",
  address: "",
  neighborhood: "",
  city: "",
  birth_date: "",
  is_visitor: true,
  spiritual_status: "NOVO",
  observations: "",
  photo_url: "",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const spiritualLabels: Record<string, string> = {
  CONVERTIDO: "Convertido",
  BATIZADO: "Batizado",
  MEMBRO_ATIVO: "Membro Ativo",
  DISCIPULADO: "Em Discipulado",
  NOVO: "Novo na Igreja",
};

function getSpiritualLabel(status: string) {
  return spiritualLabels[status] ?? "Visitante";
}

// ─── Sub-componente: linha de detalhe (modal de visualização) ────────────────

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "var(--text-main)",
          fontSize: "0.9rem",
          fontWeight: 600,
          marginTop: 2,
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function MembersList({ role }: { role: string }) {
  const apiPrefix = role === "pastor" ? "/api/pastor" : "/api/worker";

  // Estado da listagem
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "members" | "visitors">("all");
  const [search, setSearch] = useState("");

  // Estado dos modais
  const [showModal, setShowModal] = useState(false);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Member | null>(null);
  const [saving, setSaving] = useState(false);

  // Formulário (criação e edição)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  // Hooks compartilhados
  const {
    photoPreview,
    setPhotoPreview,
    handlePhotoChange,
    removePhoto,
    resetPhoto,
  } = usePhotoUpload();
  const { success, error, showSuccess, showError } = useNotification();

  // ── Dados ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    setLoading(true);
    fetch(`${apiPrefix}/members`)
      .then((res) => res.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => showError("Erro ao carregar membros."))
      .finally(() => setLoading(false));
  };

  // ── Formulário ────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    resetPhoto();
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (m: Member) => {
    setFormData({
      id: m.id,
      name: m.name,
      email: m.email || "",
      whatsapp: m.whatsapp || "",
      address: m.address || "",
      neighborhood: m.neighborhood || "",
      city: m.city || "",
      birth_date: m.birth_date || "",
      is_visitor: m.is_visitor,
      spiritual_status: m.spiritual_status || "NOVO",
      observations: m.observations || m.follow_up_notes || "",
      photo_url: m.photo_url || "",
    });
    // exibe a foto já existente no preview
    setPhotoPreview(m.photo_url || "");
    setShowModal(true);
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError("Nome completo é obrigatório.");
      return;
    }
    if (!formData.whatsapp.trim()) {
      showError("WhatsApp é obrigatório.");
      return;
    }

    setSaving(true);
    const isEdit = Boolean(formData.id);
    const url = isEdit
      ? `${apiPrefix}/members/${formData.id}`
      : `${apiPrefix}/members`;

    try {
      const resp = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (resp.ok) {
        showSuccess(
          isEdit
            ? "Cadastro atualizado com sucesso!"
            : "Membro cadastrado com sucesso!",
        );
        setShowModal(false);
        resetForm();
        fetchMembers();
      } else {
        const body = await resp.json().catch(() => ({}));
        showError(body.error || "Erro ao salvar cadastro.");
      }
    } catch {
      showError("Erro de conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  // ── Exclusão ──────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const resp = await fetch(`${apiPrefix}/members/${confirmDelete.id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        showSuccess(`${confirmDelete.name} foi excluído(a) com sucesso!`);
        fetchMembers();
      } else {
        showError("Erro ao excluir membro.");
      }
    } catch {
      showError("Erro de conexão.");
    } finally {
      setConfirmDelete(null);
    }
  };

  // ── Filtragem ─────────────────────────────────────────────────────────────

  const filteredMembers = members.filter((m) => {
    if (filter === "members" && m.is_visitor) return false;
    if (filter === "visitors" && !m.is_visitor) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        (m.whatsapp || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── Foto no formulário ────────────────────────────────────────────────────

  // Usa o novo preview se existir; caso contrário mostra a foto já salva
  const displayPhoto = photoPreview || formData.photo_url;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="main-content">
      {/* Cabeçalho da página */}
      <div className="page-header">
        <div>
          <PageBadge color="blue">Membros e Visitantes</PageBadge>
          <h1>👥 Gestão de Membros e Visitantes</h1>
          <p>Acompanhe a jornada espiritual de cada pessoa na igreja.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + Novo Cadastro
        </button>
      </div>

      {/* Notificações globais */}
      {success && <Alert type="success" message={success} autoDismiss={3500} />}
      {error && <Alert type="error" message={error} autoDismiss={4000} />}

      {/* Barra de filtros + busca */}
      <div
        className="filters-bar"
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          className={`btn-secondary ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Todos
        </button>
        <button
          className={`btn-secondary ${filter === "members" ? "active" : ""}`}
          onClick={() => setFilter("members")}
        >
          Apenas Membros
        </button>
        <button
          className={`btn-secondary ${filter === "visitors" ? "active" : ""}`}
          onClick={() => setFilter("visitors")}
        >
          Apenas Visitantes
        </button>

        {/* Campo de busca */}
        <input
          type="text"
          placeholder="🔍 Buscar por nome ou WhatsApp…"
          value={search}
          onInput={(e) =>
            setSearch((e.currentTarget as HTMLInputElement).value)
          }
          style={{
            marginLeft: "auto",
            padding: "0.45rem 0.9rem",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-main)",
            fontSize: "0.85rem",
            minWidth: 220,
          }}
        />
      </div>

      {/* Tabela */}
      <div className="modern-card">
        {loading ? (
          <LoadingState rows={5} height={56} />
        ) : filteredMembers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="Nenhum registro encontrado"
            description={
              search
                ? `Nenhum resultado para "${search}".`
                : "Cadastre membros e visitantes para começar o acompanhamento."
            }
            actionLabel={!search ? "+ Novo Cadastro" : undefined}
            onAction={!search ? openCreate : undefined}
          />
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Status Espiritual</th>
                <th>Último Contato</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.id}>
                  {/* Nome + avatar */}
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <Avatar
                        name={m.name}
                        photo={m.photo_url}
                        size={46}
                        isVisitor={m.is_visitor}
                      />
                      <div>
                        <div
                          style={{ fontWeight: 700, color: "var(--text-main)" }}
                        >
                          {m.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {m.whatsapp || m.phone || "Sem WhatsApp"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tipo */}
                  <td>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: m.is_visitor ? "#f59e0b" : "#10b981",
                        fontWeight: 600,
                      }}
                    >
                      {m.is_visitor ? "🔸 Visitante" : "🔹 Membro"}
                    </span>
                  </td>

                  {/* Status espiritual */}
                  <td>
                    <StatusBadge status={m.spiritual_status} />
                  </td>

                  {/* Último contato */}
                  <td>
                    <div style={{ fontSize: "0.85rem" }}>
                      {m.last_contact_date || "Nunca"}
                    </div>
                    {m.follow_up_notes && (
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#94a3b8",
                          maxWidth: 150,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={m.follow_up_notes}
                      >
                        {m.follow_up_notes}
                      </div>
                    )}
                  </td>

                  {/* Ações */}
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon"
                        title="Visualizar detalhes"
                        onClick={() => setViewMember(m)}
                      >
                        📋
                      </button>
                      <button
                        className="btn-icon"
                        title="Editar"
                        onClick={() => openEdit(m)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Excluir"
                        onClick={() => setConfirmDelete(m)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal: Criar / Editar ─────────────────────────────────────────── */}
      {showModal && (
        <Modal
          title={formData.id ? "✏️ Editar Cadastro" : "➕ Novo Cadastro"}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          maxWidth={580}
          footer={
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="member-form"
                className="btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Salvando…"
                  : formData.id
                    ? "Atualizar"
                    : "Salvar Cadastro"}
              </button>
            </>
          }
        >
          <form
            id="member-form"
            onSubmit={handleSave}
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
                photo={displayPhoto}
                size={80}
                isVisitor={formData.is_visitor}
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
                  Foto do Membro / Visitante
                </strong>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.78rem",
                    lineHeight: 1.5,
                    margin: "0 0 0.8rem",
                  }}
                >
                  JPG, PNG ou WEBP até 2 MB.
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
                  {displayPhoto && (
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

            {/* Nome + E-mail */}
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
                  value={formData.name}
                  onInput={(e) =>
                    setFormData((p) => ({
                      ...p,
                      name: (e.currentTarget as HTMLInputElement).value,
                    }))
                  }
                  placeholder="Nome completo"
                  required
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onInput={(e) =>
                    setFormData((p) => ({
                      ...p,
                      email: (e.currentTarget as HTMLInputElement).value,
                    }))
                  }
                />
              </label>
            </div>

            {/* WhatsApp + Endereço */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label>
                WhatsApp *
                <input
                  type="text"
                  placeholder="Ex: 21999999999"
                  value={formData.whatsapp}
                  onInput={(e) =>
                    setFormData((p) => ({
                      ...p,
                      whatsapp: (e.currentTarget as HTMLInputElement).value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Endereço
                <input
                  type="text"
                  placeholder="Rua, Número…"
                  value={formData.address}
                  onInput={(e) =>
                    setFormData((p) => ({
                      ...p,
                      address: (e.currentTarget as HTMLInputElement).value,
                    }))
                  }
                />
              </label>
            </div>

            {/* Bairro + Cidade */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label>
                Bairro
                <input
                  type="text"
                  placeholder="Ex: Engenho Novo"
                  value={formData.neighborhood}
                  onInput={(e) =>
                    setFormData((p) => ({
                      ...p,
                      neighborhood: (e.currentTarget as HTMLInputElement).value,
                    }))
                  }
                />
              </label>
              <label>
                Cidade
                <input
                  type="text"
                  placeholder="Ex: Rio de Janeiro"
                  value={formData.city}
                  onInput={(e) =>
                    setFormData((p) => ({
                      ...p,
                      city: (e.currentTarget as HTMLInputElement).value,
                    }))
                  }
                />
              </label>
            </div>

            {/* Data de nascimento */}
            <label>
              Data de Nascimento
              <input
                type="date"
                value={formData.birth_date}
                onInput={(e) =>
                  setFormData((p) => ({
                    ...p,
                    birth_date: (e.currentTarget as HTMLInputElement).value,
                  }))
                }
              />
            </label>

            {/* Tipo de cadastro */}
            <label>
              Tipo de Cadastro
              <select
                value={formData.is_visitor ? "true" : "false"}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    is_visitor:
                      (e.currentTarget as HTMLSelectElement).value === "true",
                  }))
                }
              >
                <option value="true">Visitante (Primeira Vez)</option>
                <option value="false">Membro (Batizado/Convertido)</option>
              </select>
            </label>

            {/* Status espiritual */}
            <label>
              Status Espiritual
              <select
                value={formData.spiritual_status}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    spiritual_status: (e.currentTarget as HTMLSelectElement)
                      .value,
                  }))
                }
              >
                <option value="NOVO">Novo na Igreja</option>
                <option value="CONVERTIDO">Convertido</option>
                <option value="BATIZADO">Batizado</option>
                <option value="DISCIPULADO">Em Discipulado</option>
                <option value="MEMBRO_ATIVO">Membro Ativo</option>
              </select>
            </label>

            {/* Observações */}
            <label>
              Observações
              <textarea
                value={formData.observations}
                onInput={(e) =>
                  setFormData((p) => ({
                    ...p,
                    observations: (e.currentTarget as HTMLTextAreaElement)
                      .value,
                  }))
                }
                rows={3}
                placeholder="Pedidos de oração, observações pastorais…"
              />
            </label>
          </form>
        </Modal>
      )}

      {/* ── Modal: Visualizar detalhes ────────────────────────────────────── */}
      {viewMember && (
        <Modal
          title="📋 Detalhes do Cadastro"
          onClose={() => setViewMember(null)}
          maxWidth={520}
          footer={
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setViewMember(null)}
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setViewMember(null);
                  openEdit(viewMember);
                }}
              >
                ✏️ Editar
              </button>
            </>
          }
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Avatar + nome */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Avatar
                name={viewMember.name}
                photo={viewMember.photo_url}
                size={72}
                isVisitor={viewMember.is_visitor}
              />
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "var(--text-main)",
                    fontSize: "1.1rem",
                  }}
                >
                  {viewMember.name}
                </h3>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: viewMember.is_visitor ? "#f59e0b" : "#10b981",
                    fontWeight: 600,
                  }}
                >
                  {viewMember.is_visitor ? "🔸 Visitante" : "🔹 Membro"}
                </span>
                <div style={{ marginTop: 4 }}>
                  <StatusBadge status={viewMember.spiritual_status} />
                </div>
              </div>
            </div>

            {/* Grid de informações */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <DetailRow
                label="WhatsApp"
                value={viewMember.whatsapp || viewMember.phone}
              />
              <DetailRow label="E-mail" value={viewMember.email} />
              <DetailRow
                label="Status Espiritual"
                value={getSpiritualLabel(viewMember.spiritual_status)}
              />
              <DetailRow
                label="Último Contato"
                value={viewMember.last_contact_date}
              />
              {viewMember.address && (
                <DetailRow label="Endereço" value={viewMember.address} />
              )}
              {viewMember.neighborhood && (
                <DetailRow label="Bairro" value={viewMember.neighborhood} />
              )}
              {viewMember.city && (
                <DetailRow label="Cidade" value={viewMember.city} />
              )}
              {viewMember.birth_date && (
                <DetailRow
                  label="Data de Nascimento"
                  value={viewMember.birth_date}
                />
              )}
            </div>

            {/* Observações */}
            {(viewMember.follow_up_notes || viewMember.observations) && (
              <div>
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 4,
                  }}
                >
                  Observações
                </div>
                <p
                  style={{
                    color: "var(--text-main)",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    margin: 0,
                    padding: "0.75rem",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                  }}
                >
                  {viewMember.observations || viewMember.follow_up_notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── ConfirmDialog: Excluir ────────────────────────────────────────── */}
      {confirmDelete && (
        <ConfirmDialog
          title="Excluir Cadastro"
          message={`Tem certeza que deseja excluir "${confirmDelete.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          danger
        />
      )}
    </div>
  );
}
