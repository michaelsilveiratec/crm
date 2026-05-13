import { useState, useEffect } from "preact/hooks";
import {
  SummaryCard,
  StatusBadge,
  LoadingState,
  EmptyState,
  Alert,
  PageBadge,
  Modal,
} from "./shared";
import { useNotification } from "../hooks/useNotification";

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface PastoralVisit {
  id: number;
  member_id: number;
  address: string;
  visit_date: string;
  visit_time: string;
  responsible_id: number;
  conducted_by: string;
  notes: string;
  result: string;
  status: string;
  carried_holy_communion: boolean;
}

interface Member {
  id: number;
  name: string;
}

// ─── Constantes ────────────────────────────────────────────────────────────────

const statusMap: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  Agendada: { label: "Agendada", color: "#8B5CF6", icon: "📅" },
  Realizada: { label: "Realizada", color: "#10B981", icon: "✅" },
  Cancelada: { label: "Cancelada", color: "#EF4444", icon: "✕" },
  Reagendada: { label: "Reagendada", color: "#F59E0B", icon: "🔁" },
  Pendente: { label: "Pendente", color: "#F59E0B", icon: "⏳" },
};

const emptyForm = {
  member_id: 0,
  address: "",
  visit_date: "",
  visit_time: "",
  responsible_id: 0,
  conducted_by: "",
  notes: "",
  result: "",
  status: "Agendada",
  carried_holy_communion: false,
};

// ─── Componente Principal ─────────────────────────────────────────────────────

export function PastoralVisits({ role }: { role: string }) {
  const [visits, setVisits] = useState<PastoralVisit[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<PastoralVisit | null>(null);
  const [detailsVisit, setDetailsVisit] = useState<PastoralVisit | null>(null);

  // Busca por nome do visitado
  const [searchTerm, setSearchTerm] = useState("");

  // Notificações via hook compartilhado
  const {
    notification,
    showSuccess,
    showError,
    clear: clearNotification,
  } = useNotification();

  const apiPrefix = role === "pastor" ? "/api/pastor" : "/api/worker";

  const [formData, setFormData] = useState({ ...emptyForm });

  useEffect(() => {
    fetchData();
  }, []);

  // ─── Fetches ─────────────────────────────────────────────────────────────

  const fetchData = async () => {
    setLoading(true);

    try {
      const [vRes, mRes] = await Promise.all([
        fetch(`${apiPrefix}/visits`),
        fetch(`${apiPrefix}/members`),
      ]);

      if (!vRes.ok || !mRes.ok) {
        throw new Error("Erro ao carregar visitas pastorais.");
      }

      const vData = await vRes.json();
      const mData = await mRes.json();

      setVisits(vData || []);
      setMembers(mData || []);
    } catch (err: unknown) {
      showError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os dados de visitas.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Form ─────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingVisit(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (visit: PastoralVisit) => {
    setEditingVisit(visit);
    setFormData({
      member_id: visit.member_id,
      address: visit.address,
      visit_date: visit.visit_date,
      visit_time: visit.visit_time,
      responsible_id: visit.responsible_id,
      conducted_by: visit.conducted_by,
      notes: visit.notes,
      result: visit.result,
      status: visit.status,
      carried_holy_communion: visit.carried_holy_communion,
    });
    setShowModal(true);
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingVisit ? "PUT" : "POST";
      const url = editingVisit
        ? `${apiPrefix}/visits/${editingVisit.id}`
        : `${apiPrefix}/visits`;

      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        throw new Error(
          editingVisit
            ? "Erro ao atualizar visita pastoral."
            : "Erro ao agendar visita pastoral.",
        );
      }

      setShowModal(false);
      resetForm();

      showSuccess(
        editingVisit
          ? "Visita pastoral atualizada com sucesso."
          : "Visita pastoral agendada com sucesso.",
      );

      await fetchData();
    } catch (err: unknown) {
      showError(
        err instanceof Error
          ? err.message
          : "Erro de conexão ao salvar visita.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Dados derivados ──────────────────────────────────────────────────────

  const filteredVisits = visits.filter((v) => {
    if (!searchTerm.trim()) return true;
    const member = members.find((m) => m.id === v.member_id);
    return (
      member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
    );
  });

  const totalVisits = visits.length;
  const scheduled = visits.filter((v) => v.status === "Agendada").length;
  const completed = visits.filter((v) => v.status === "Realizada").length;
  const communion = visits.filter((v) => v.carried_holy_communion).length;
  const pending = visits.filter((v) =>
    ["Pendente", "Reagendada"].includes(v.status),
  ).length;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="main-content">
      {/* Notificação inline */}
      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
          autoDismiss={3500}
        />
      )}

      {/* Cabeçalho */}
      <div className="page-header">
        <div>
          <PageBadge color="green">Cuidado pastoral nas casas</PageBadge>

          <h1>🏠 Visitas Pastorais</h1>

          <p>
            Organize visitas, acompanhamento espiritual, Santa Ceia nas casas e
            cuidado com membros que precisam de atenção pastoral.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-help" onClick={fetchData}>
            Atualizar
          </button>

          <button className="btn-primary" onClick={openCreateModal}>
            + Agendar Visita
          </button>
        </div>
      </div>

      {/* Sumário */}
      <div
        className="stats-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: "1.5rem",
        }}
      >
        <SummaryCard
          title="Total de Visitas"
          value={totalVisits}
          color="#8B5CF6"
          icon="🏠"
        />
        <SummaryCard
          title="Agendadas"
          value={scheduled}
          color="#2563EB"
          icon="📅"
        />
        <SummaryCard
          title="Realizadas"
          value={completed}
          color="#10B981"
          icon="✅"
        />
        <SummaryCard
          title="Santa Ceia"
          value={communion}
          color="#F59E0B"
          icon="🍇"
        />
        <SummaryCard
          title="Pendências"
          value={pending}
          color="#EF4444"
          icon="⏳"
        />
      </div>

      {/* Tabela de visitas */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">Agenda de Visitas</h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                marginTop: 4,
              }}
            >
              Acompanhe visitas agendadas, realizadas e pedidos de Santa Ceia.
            </p>
          </div>

          {/* Busca por nome do visitado */}
          <input
            type="text"
            placeholder="Buscar por nome do membro..."
            value={searchTerm}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
            style={{ maxWidth: 260 }}
          />
        </div>

        {loading ? (
          <LoadingState rows={6} height={62} />
        ) : filteredVisits.length === 0 ? (
          <EmptyState
            icon="🏠"
            title={
              searchTerm
                ? "Nenhuma visita encontrada"
                : "Nenhuma visita pastoral agendada"
            }
            description={
              searchTerm
                ? `Não encontramos visitas para "${searchTerm}". Tente outro nome.`
                : "Agende visitas para membros, enfermos, afastados ou famílias que precisam de cuidado pastoral."
            }
            actionLabel={searchTerm ? undefined : "Agendar primeira visita"}
            onAction={searchTerm ? undefined : openCreateModal}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Membro</th>
                  <th>Data/Hora</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th>Santa Ceia</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredVisits.map((visit) => {
                  const member = members.find((m) => m.id === visit.member_id);
                  const status = statusMap[visit.status] || {
                    label: visit.status || "Sem status",
                    color: "#6B7280",
                    icon: "•",
                  };

                  return (
                    <tr key={visit.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Avatar name={member?.name || "Membro"} />

                          <div>
                            <strong
                              style={{
                                color: "var(--text-main)",
                                fontSize: "0.9rem",
                              }}
                            >
                              {member ? member.name : "Membro não encontrado"}
                            </strong>

                            <div
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.72rem",
                              }}
                            >
                              Por:{" "}
                              {visit.conducted_by ||
                                "Responsável não informado"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            color: "var(--text-main)",
                            fontSize: "0.86rem",
                            fontWeight: 700,
                          }}
                        >
                          {formatDate(visit.visit_date)}
                        </div>

                        <div
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.72rem",
                          }}
                        >
                          {visit.visit_time || "--:--"}
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            maxWidth: 220,
                            color: "var(--text-muted)",
                            fontSize: "0.84rem",
                            lineHeight: 1.45,
                          }}
                        >
                          {visit.address || "Endereço não informado"}
                        </div>
                      </td>

                      <td>
                        <StatusBadge
                          label={status.label}
                          color={status.color}
                          icon={status.icon}
                        />
                      </td>

                      <td>
                        {visit.carried_holy_communion ? (
                          <StatusBadge label="Sim" color="#F59E0B" icon="🍇" />
                        ) : (
                          <StatusBadge label="Não" color="#6B7280" icon="—" />
                        )}
                      </td>

                      <td>
                        <div
                          style={{
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "var(--text-muted)",
                            fontSize: "0.82rem",
                          }}
                          title={visit.notes || visit.result}
                        >
                          {visit.notes || visit.result || "Sem observações"}
                        </div>
                      </td>

                      <td>
                        <div className="action-btns">
                          {/* Detalhe: substituiu alert() por Modal */}
                          <button
                            className="btn-icon"
                            title="Ver detalhes"
                            type="button"
                            onClick={() => setDetailsVisit(visit)}
                          >
                            👁️
                          </button>

                          {/* Editar: agora implementado */}
                          <button
                            className="btn-icon"
                            title="Editar visita"
                            type="button"
                            onClick={() => openEditModal(visit)}
                          >
                            ✏️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal: criar / editar visita ── */}
      {showModal && (
        <Modal
          title={
            editingVisit ? "Editar Visita Pastoral" : "Agendar Nova Visita"
          }
          subtitle="Registre a visita pastoral e informe se será levada Santa Ceia."
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          maxWidth={560}
        >
          <form
            onSubmit={handleSave}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <label>
              Membro
              <select
                value={formData.member_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    member_id: parseInt(e.currentTarget.value),
                  })
                }
                required
              >
                <option value="">Selecione...</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Endereço da visita
              <input
                type="text"
                placeholder="Informe o endereço completo"
                value={formData.address}
                onInput={(e) =>
                  setFormData({ ...formData, address: e.currentTarget.value })
                }
                required
              />
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label>
                Data
                <input
                  type="date"
                  value={formData.visit_date}
                  onInput={(e) =>
                    setFormData({
                      ...formData,
                      visit_date: e.currentTarget.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Horário
                <input
                  type="time"
                  value={formData.visit_time}
                  onInput={(e) =>
                    setFormData({
                      ...formData,
                      visit_time: e.currentTarget.value,
                    })
                  }
                  required
                />
              </label>
            </div>

            <label>
              Responsável / Realizado por
              <input
                type="text"
                placeholder="Ex: Pr. João ou Obreira Maria"
                value={formData.conducted_by}
                onInput={(e) =>
                  setFormData({
                    ...formData,
                    conducted_by: e.currentTarget.value,
                  })
                }
              />
            </label>

            <label>
              Status
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.currentTarget.value })
                }
              >
                <option value="Agendada">Agendada</option>
                <option value="Realizada">Realizada</option>
                <option value="Pendente">Pendente</option>
                <option value="Reagendada">Reagendada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
                padding: "0.9rem 1rem",
                borderRadius: 16,
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.22)",
              }}
            >
              <input
                type="checkbox"
                checked={formData.carried_holy_communion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carried_holy_communion: e.currentTarget.checked,
                  })
                }
                style={{ width: 18, height: 18 }}
              />

              <span style={{ color: "#FCD34D", fontWeight: 800 }}>
                Levar Santa Ceia nesta visita?
              </span>
            </label>

            <label>
              Observações Pastorais
              <textarea
                placeholder="Descreva a necessidade, pedido de oração ou situação pastoral..."
                value={formData.notes}
                onInput={(e) =>
                  setFormData({ ...formData, notes: e.currentTarget.value })
                }
                style={{ minHeight: 110, resize: "vertical" }}
              />
            </label>

            <label>
              Resultado da visita
              <textarea
                placeholder="Preencha após a visita ser realizada..."
                value={formData.result}
                onInput={(e) =>
                  setFormData({ ...formData, result: e.currentTarget.value })
                }
                style={{ minHeight: 90, resize: "vertical" }}
              />
            </label>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancelar
              </button>

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving
                  ? "Salvando..."
                  : editingVisit
                    ? "Atualizar Visita"
                    : "Agendar Visita"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal: detalhes da visita (substitui alert()) ── */}
      {detailsVisit && (
        <VisitDetailsModal
          visit={detailsVisit}
          memberName={
            members.find((m) => m.id === detailsVisit.member_id)?.name
          }
          onClose={() => setDetailsVisit(null)}
          onEdit={() => {
            setDetailsVisit(null);
            openEditModal(detailsVisit);
          }}
        />
      )}
    </div>
  );
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

/** Avatar com iniciais geradas a partir do nome */
function Avatar({ name }: { name: string }) {
  const initials = (name || "MB")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#10B981,#2563EB)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 900,
        fontSize: "0.8rem",
        boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/** Modal de detalhes da visita (substitui window.alert()) */
function VisitDetailsModal({
  visit,
  memberName,
  onClose,
  onEdit,
}: {
  visit: PastoralVisit;
  memberName?: string;
  onClose: () => void;
  onEdit: () => void;
}) {
  const status = statusMap[visit.status] || {
    label: visit.status,
    color: "#6B7280",
    icon: "•",
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: "0.5rem",
        padding: "0.6rem 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span
        style={{
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          fontWeight: 800,
        }}
      >
        {label}
      </span>
      <span style={{ color: "var(--text-main)", fontSize: "0.88rem" }}>
        {value || "-"}
      </span>
    </div>
  );

  return (
    <Modal
      title="📋 Detalhes da Visita"
      subtitle={memberName ? `Visita para: ${memberName}` : undefined}
      onClose={onClose}
      maxWidth={520}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Row label="Membro" value={memberName || "Não identificado"} />
        <Row label="Data" value={formatDate(visit.visit_date)} />
        <Row label="Horário" value={visit.visit_time || "--:--"} />
        <Row label="Endereço" value={visit.address} />
        <Row label="Responsável" value={visit.conducted_by} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr",
            gap: "0.5rem",
            padding: "0.6rem 0",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              fontWeight: 800,
            }}
          >
            Status
          </span>
          <StatusBadge
            label={status.label}
            color={status.color}
            icon={status.icon}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr",
            gap: "0.5rem",
            padding: "0.6rem 0",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              fontWeight: 800,
            }}
          >
            Santa Ceia
          </span>
          {visit.carried_holy_communion ? (
            <StatusBadge label="Sim" color="#F59E0B" icon="🍇" />
          ) : (
            <StatusBadge label="Não" color="#6B7280" icon="—" />
          )}
        </div>

        {visit.notes && (
          <div style={{ padding: "0.75rem 0" }}>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                fontWeight: 800,
                margin: "0 0 0.35rem",
              }}
            >
              Observações
            </p>
            <p
              style={{
                color: "var(--text-main)",
                fontSize: "0.88rem",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {visit.notes}
            </p>
          </div>
        )}

        {visit.result && (
          <div style={{ padding: "0.75rem 0" }}>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                fontWeight: 800,
                margin: "0 0 0.35rem",
              }}
            >
              Resultado
            </p>
            <p
              style={{
                color: "var(--text-main)",
                fontSize: "0.88rem",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {visit.result}
            </p>
          </div>
        )}
      </div>

      <div className="form-actions" style={{ marginTop: "1rem" }}>
        <button className="btn-secondary" onClick={onClose}>
          Fechar
        </button>

        <button className="btn-primary" onClick={onEdit}>
          ✏️ Editar Visita
        </button>
      </div>
    </Modal>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(date: string) {
  if (!date) return "-";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("pt-BR");
}
