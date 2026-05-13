import { useState, useEffect, useMemo } from "preact/hooks";
import {
  SummaryCard,
  StatusBadge,
  LoadingState,
  EmptyState,
  Alert,
  PageBadge,
} from "./shared";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface WhatsAppLog {
  phone: string;
  message: string;
  status: string;
  error_msg: string;
  sent_at: string;
}

type StatusFilter = "all" | "sent" | "error" | "simulated" | "pending";
type DateFilter = "all" | "today" | "week" | "month";

// ─── Mapa de status ───────────────────────────────────────────────────────────

const statusMap: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  sent: { label: "Enviado", color: "#10B981", icon: "✅" },
  simulated: { label: "Simulado", color: "#8B5CF6", icon: "🧪" },
  error: { label: "Erro", color: "#EF4444", icon: "⚠️" },
  pending: { label: "Pendente", color: "#F59E0B", icon: "⏳" },
};

// ─── Utilitário: formatar telefone ────────────────────────────────────────────

function formatPhone(phone: string) {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 13)
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  if (digits.length === 12)
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 8)}-${digits.slice(8)}`;
  if (digits.length === 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return phone;
}

// ─── Utilitário: filtrar por data ─────────────────────────────────────────────

function isWithinDateRange(sentAt: string, filter: DateFilter): boolean {
  if (filter === "all" || !sentAt) return true;
  const date = new Date(sentAt);
  const now = new Date();
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (filter === "today") {
    return date >= startOf(now);
  }
  if (filter === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }
  if (filter === "month") {
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return date >= monthAgo;
  }
  return true;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function WhatsAppLogs() {
  const [logs, setLogs] = useState<WhatsAppLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filtros
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pastor/whatsapp/logs");
      const data = await res.json();
      setLogs(data || []);
    } catch {
      setError("Não foi possível carregar o histórico de envios.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ─── Contadores (sempre sobre todos os logs) ──────────────────────────────

  const totalSent = logs.filter((l) => l.status === "sent").length;
  const totalSimulated = logs.filter((l) => l.status === "simulated").length;
  const totalErrors = logs.filter((l) => l.status === "error").length;
  const totalPending = logs.filter((l) => l.status === "pending").length;

  // ─── Logs filtrados ───────────────────────────────────────────────────────

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchStatus = statusFilter === "all" || log.status === statusFilter;
      const matchDate = isWithinDateRange(log.sent_at, dateFilter);
      return matchStatus && matchDate;
    });
  }, [logs, statusFilter, dateFilter]);

  // ─── Labels dos filtros ───────────────────────────────────────────────────

  const dateLabels: Record<DateFilter, string> = {
    all: "Todas as datas",
    today: "Hoje",
    week: "Última semana",
    month: "Último mês",
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <PageBadge color="blue">WhatsApp Pastoral</PageBadge>
          <h1>📜 Histórico de Envios</h1>
          <p>
            Acompanhe mensagens automáticas e manuais enviadas para visitantes,
            membros, aniversariantes e grupos da igreja.
          </p>
        </div>

        <button
          className="btn-help"
          onClick={() => fetchLogs(true)}
          disabled={refreshing}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          {refreshing ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  width: 13,
                  height: 13,
                  border: "2px solid currentColor",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              Atualizando...
            </>
          ) : (
            "↻ Atualizar"
          )}
        </button>
      </div>

      {/* Alerta de erro */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {/* Cards de resumo */}
      <div
        className="stats-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: "1.5rem",
        }}
      >
        <SummaryCard
          title="Total de Envios"
          value={logs.length}
          color="#8B5CF6"
          icon="📨"
        />
        <SummaryCard
          title="Enviadas"
          value={totalSent}
          color="#10B981"
          icon="✅"
        />
        <SummaryCard
          title="Simuladas"
          value={totalSimulated}
          color="#8B5CF6"
          icon="🧪"
        />
        <SummaryCard
          title="Erros"
          value={totalErrors}
          color="#EF4444"
          icon="⚠️"
        />
        {totalPending > 0 && (
          <SummaryCard
            title="Pendentes"
            value={totalPending}
            color="#F59E0B"
            icon="⏳"
          />
        )}
      </div>

      {/* Card principal */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">Relatório de Mensagens</h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                marginTop: 4,
              }}
            >
              Veja o status, telefone, conteúdo e possíveis erros de envio.
            </p>
          </div>

          {/* ─── Filtros ─────────────────────────────────────────────────── */}
          {!loading && logs.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Filtro por status */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.currentTarget.value as StatusFilter)
                }
                style={{
                  padding: "0.4rem 0.75rem",
                  borderRadius: 10,
                  background: "var(--card-bg)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text-main)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                <option value="all">Todos os status</option>
                <option value="sent">✅ Enviado</option>
                <option value="simulated">🧪 Simulado</option>
                <option value="error">⚠️ Erro</option>
                <option value="pending">⏳ Pendente</option>
              </select>

              {/* Filtro por data */}
              <select
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(e.currentTarget.value as DateFilter)
                }
                style={{
                  padding: "0.4rem 0.75rem",
                  borderRadius: 10,
                  background: "var(--card-bg)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text-main)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                {(Object.keys(dateLabels) as DateFilter[]).map((k) => (
                  <option key={k} value={k}>
                    {dateLabels[k]}
                  </option>
                ))}
              </select>

              {/* Badge de resultados */}
              {(statusFilter !== "all" || dateFilter !== "all") && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    background: "rgba(255,255,255,0.06)",
                    padding: "0.3rem 0.6rem",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {filteredLogs.length} resultado
                  {filteredLogs.length !== 1 ? "s" : ""}
                  &nbsp;
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setDateFilter("all");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "0.7rem",
                      textDecoration: "underline",
                    }}
                  >
                    limpar
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Conteúdo */}
        {loading ? (
          <LoadingState rows={6} height={58} />
        ) : logs.length === 0 ? (
          <EmptyState
            icon="💬"
            title="Nenhum envio registrado ainda"
            description="Assim que mensagens forem enviadas pelo WhatsApp, o histórico aparecerá aqui com status, telefone, horário e detalhes do envio."
          />
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Nenhum resultado para este filtro"
            description="Tente alterar o filtro de status ou de data para ver mais registros."
            actionLabel="Limpar filtros"
            onAction={() => {
              setStatusFilter("all");
              setDateFilter("all");
            }}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Destinatário</th>
                  <th>Mensagem</th>
                  <th>Status</th>
                  <th>Erro/Detalhe</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log, i) => {
                  const status = statusMap[log.status] || {
                    label: log.status || "Desconhecido",
                    color: "#6B7280",
                    icon: "•",
                  };

                  return (
                    <tr key={i}>
                      {/* Data/hora */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {log.sent_at
                          ? new Date(log.sent_at).toLocaleString("pt-BR")
                          : "-"}
                      </td>

                      {/* Destinatário */}
                      <td>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <strong
                            style={{
                              color: "var(--text-main)",
                              fontSize: "0.88rem",
                              fontFamily: "monospace",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {formatPhone(log.phone)}
                          </strong>
                          <span
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.72rem",
                            }}
                          >
                            WhatsApp
                          </span>
                        </div>
                      </td>

                      {/* Mensagem */}
                      <td>
                        <div
                          style={{
                            maxWidth: 360,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                          }}
                          title={log.message}
                        >
                          {log.message || "Mensagem não informada"}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge
                          label={status.label}
                          color={status.color}
                          icon={status.icon}
                        />
                      </td>

                      {/* Erro */}
                      <td>
                        {log.error_msg ? (
                          <span
                            style={{
                              color: "#F87171",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                            }}
                          >
                            {log.error_msg}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "var(--text-sub)",
                              fontSize: "0.78rem",
                            }}
                          >
                            Sem erro
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
