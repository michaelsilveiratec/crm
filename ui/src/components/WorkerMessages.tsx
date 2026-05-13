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

interface WorkerMessage {
  id: number;
  sender_id: number;
  recipient_id: number;
  subject: string;
  message: string;
  msg_type: string;
  is_read: boolean;
  created_at: string;
}

// ─── Constantes ────────────────────────────────────────────────────────────────

const typeMap: Record<string, { label: string; color: string; icon: string }> =
  {
    URGENTE: { label: "Urgente", color: "#EF4444", icon: "🚨" },
    ENFERMIDADE: { label: "Enfermidade", color: "#F59E0B", icon: "🤒" },
    ORACAO: { label: "Oração", color: "#10B981", icon: "🙏" },
    AJUDA: { label: "Ajuda", color: "#3B82F6", icon: "🤝" },
    VISITA: { label: "Visita", color: "#8B5CF6", icon: "🏠" },
  };

const emptyForm = {
  recipient_id: 0,
  subject: "",
  message: "",
  msg_type: "VISITA",
};

// ─── Componente Principal ─────────────────────────────────────────────────────

export function WorkerMessages() {
  const [messages, setMessages] = useState<WorkerMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Notificações via hook compartilhado
  const {
    notification,
    showSuccess,
    showError,
    clear: clearNotification,
  } = useNotification();

  const [formData, setFormData] = useState({ ...emptyForm });

  useEffect(() => {
    fetchMessages();
  }, []);

  // ─── Fetches ─────────────────────────────────────────────────────────────

  const fetchMessages = async () => {
    setLoading(true);

    try {
      const resp = await fetch("/api/team/messages");
      const data = await resp.json();
      setMessages(data || []);
    } catch {
      showError("Não foi possível carregar os recados internos.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Form ─────────────────────────────────────────────────────────────────

  const resetForm = () => setFormData({ ...emptyForm });

  const handleSend = async (e: Event) => {
    e.preventDefault();

    // Validação client-side
    if (!formData.subject.trim()) {
      showError("Informe o assunto do recado.");
      return;
    }
    if (!formData.message.trim()) {
      showError("Escreva o conteúdo do recado.");
      return;
    }

    setSending(true);

    try {
      const resp = await fetch("/api/team/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        throw new Error("Não foi possível enviar o recado.");
      }

      setShowModal(false);
      resetForm();
      showSuccess("Recado enviado com sucesso.");
      fetchMessages();
    } catch (err: unknown) {
      showError(
        err instanceof Error
          ? err.message
          : "Erro de conexão ao enviar recado.",
      );
    } finally {
      setSending(false);
    }
  };

  // ─── Dados derivados ──────────────────────────────────────────────────────

  const unreadCount = messages.filter((msg) => !msg.is_read).length;
  const urgentCount = messages.filter(
    (msg) => msg.msg_type === "URGENTE",
  ).length;
  const prayerCount = messages.filter(
    (msg) => msg.msg_type === "ORACAO",
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
          <PageBadge color="purple">Comunicação da equipe</PageBadge>

          <h1>📝 Recados dos Obreiros</h1>

          <p>
            Registre pedidos de oração, visitas, enfermidades, alertas urgentes
            e informações importantes para o pastor.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Novo Recado
        </button>
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
          title="Total de Recados"
          value={messages.length}
          color="#8B5CF6"
          icon="📨"
        />
        <SummaryCard
          title="Novos Recados"
          value={unreadCount}
          color="#10B981"
          icon="🟢"
        />
        <SummaryCard
          title="Urgentes"
          value={urgentCount}
          color="#EF4444"
          icon="🚨"
        />
        <SummaryCard
          title="Pedidos de Oração"
          value={prayerCount}
          color="#F59E0B"
          icon="🙏"
        />
      </div>

      {/* Lista de recados */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">Histórico de Recados</h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                marginTop: 4,
              }}
            >
              Acompanhe as informações enviadas pela equipe da igreja.
            </p>
          </div>

          <button className="btn-help" onClick={fetchMessages}>
            Atualizar
          </button>
        </div>

        {loading ? (
          <LoadingState rows={5} height={86} />
        ) : messages.length === 0 ? (
          <EmptyState
            icon="📝"
            title="Nenhum recado registrado ainda"
            description="Use esta área para que obreiros enviem informações importantes ao pastor, como visitas, enfermidades, pedidos de oração e alertas."
            actionLabel="Criar primeiro recado"
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {messages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal: novo recado ── */}
      {showModal && (
        <Modal
          title="Novo Recado Interno"
          subtitle="Envie uma informação importante para o pastor."
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          maxWidth={520}
        >
          <form
            onSubmit={handleSend}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <label>
              Tipo de Recado
              <select
                value={formData.msg_type}
                onChange={(e) =>
                  setFormData({ ...formData, msg_type: e.currentTarget.value })
                }
              >
                <option value="VISITA">Pedido de Visita</option>
                <option value="URGENTE">Urgência / Alerta</option>
                <option value="ORACAO">Pedido de Oração</option>
                <option value="ENFERMIDADE">Membro Enfermo</option>
                <option value="AJUDA">Ajuda Social / Apoio</option>
              </select>
            </label>

            <label>
              Assunto *
              <input
                type="text"
                placeholder="Ex: Membro precisa de visita"
                value={formData.subject}
                onInput={(e) =>
                  setFormData({ ...formData, subject: e.currentTarget.value })
                }
                required
              />
            </label>

            <label>
              Mensagem Detalhada *
              <textarea
                style={{ height: 130, resize: "vertical" }}
                placeholder="Descreva a situação com clareza para o pastor..."
                value={formData.message}
                onInput={(e) =>
                  setFormData({ ...formData, message: e.currentTarget.value })
                }
                required
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

              <button type="submit" className="btn-primary" disabled={sending}>
                {sending ? "Enviando..." : "Enviar Recado"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function MessageCard({ msg }: { msg: WorkerMessage }) {
  const type = typeMap[msg.msg_type] || typeMap.VISITA;

  return (
    <div
      style={{
        position: "relative",
        padding: "1rem 1.1rem",
        borderRadius: 18,
        background: msg.is_read
          ? "rgba(255,255,255,0.03)"
          : "linear-gradient(135deg, rgba(124,58,237,0.13), rgba(17,24,39,0.88))",
        border: msg.is_read
          ? "1px solid var(--border)"
          : "1px solid rgba(124,58,237,0.35)",
        boxShadow: msg.is_read ? "none" : "0 14px 34px rgba(124,58,237,0.14)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            {/* Usa StatusBadge compartilhado (substitui Badge local) */}
            <StatusBadge
              color={type.color}
              icon={type.icon}
              label={type.label}
            />

            {!msg.is_read && <span className="badge active">Novo</span>}

            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {new Date(msg.created_at).toLocaleString("pt-BR")}
            </span>
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--text-main)",
            }}
          >
            {msg.subject || "Recado sem assunto"}
          </h3>

          <p
            style={{
              margin: "0.45rem 0 0",
              color: "var(--text-muted)",
              lineHeight: 1.55,
              fontSize: "0.9rem",
            }}
          >
            {msg.message}
          </p>
        </div>
      </div>
    </div>
  );
}
