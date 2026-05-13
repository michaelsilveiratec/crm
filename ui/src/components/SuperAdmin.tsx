import { useState, useEffect, useMemo } from "preact/hooks";
import {
  SummaryCard,
  StatusBadge,
  LoadingState,
  EmptyState,
  Alert,
  Avatar,
  PageBadge,
  ConfirmDialog,
} from "./shared";
import { useNotification } from "../hooks/useNotification";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Church {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
  created_at: string;
}

interface Stats {
  total_churches: number;
  total_users: number;
  total_members: number;
}

interface ConfirmToggle {
  church: Church;
  newStatus: "active" | "blocked";
}

// ─── Mapa de planos ───────────────────────────────────────────────────────────

const planMap: Record<string, { label: string; color: string }> = {
  essencial: { label: "Essencial", color: "#2563EB" },
  pastoreio: { label: "Pastoreio", color: "#8B5CF6" },
  avivamento: { label: "Avivamento", color: "#F59E0B" },
  enterprise: { label: "Enterprise", color: "#10B981" },
};

// ─── Componente principal ─────────────────────────────────────────────────────

export function SuperAdmin() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { success, error, showSuccess, showError, clearSuccess, clearError } =
    useNotification();

  // ConfirmDialog para bloqueio/ativação
  const [confirmToggle, setConfirmToggle] = useState<ConfirmToggle | null>(
    null,
  );

  // ─── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    clearError();

    try {
      const [chResp, stResp] = await Promise.all([
        fetch("/api/superadmin/churches"),
        fetch("/api/superadmin/stats"),
      ]);

      if (!chResp.ok || !stResp.ok) {
        throw new Error("Erro ao carregar dados do Super Admin.");
      }

      setChurches(await chResp.json());
      setStats(await stResp.json());
    } catch (err: any) {
      showError(err.message || "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ─── Toggle de status (com confirmação) ───────────────────────────────────

  const requestToggleStatus = (church: Church) => {
    const newStatus = church.status === "active" ? "blocked" : "active";
    setConfirmToggle({ church, newStatus: newStatus as "active" | "blocked" });
  };

  const confirmToggleStatus = async () => {
    if (!confirmToggle) return;
    const { church, newStatus } = confirmToggle;
    setConfirmToggle(null);

    setUpdatingId(church.id);
    clearError();
    clearSuccess();

    try {
      const resp = await fetch(`/api/superadmin/churches/${church.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!resp.ok) throw new Error("Erro ao atualizar status da igreja.");

      showSuccess(
        newStatus === "blocked"
          ? "Igreja bloqueada com sucesso."
          : "Igreja ativada com sucesso.",
      );
      await fetchData();
    } catch (err: any) {
      showError(err.message || "Não foi possível atualizar o status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── Cálculos de resumo ───────────────────────────────────────────────────

  const activeChurches = churches.filter((ch) => ch.status === "active").length;
  const blockedChurches = churches.filter(
    (ch) => ch.status !== "active",
  ).length;
  const monthlyEstimate = churches.reduce((total, ch) => {
    const plan = (ch.plan || "").toLowerCase();
    if (plan === "essencial") return total + 49;
    if (plan === "pastoreio") return total + 97;
    if (plan === "avivamento") return total + 197;
    if (plan === "enterprise") return total + 297;
    return total;
  }, 0);

  // ─── Busca por nome ───────────────────────────────────────────────────────

  const filteredChurches = useMemo(() => {
    if (!searchQuery.trim()) return churches;
    const q = searchQuery.toLowerCase().trim();
    return churches.filter(
      (ch) =>
        (ch.name || "").toLowerCase().includes(q) ||
        (ch.slug || "").toLowerCase().includes(q) ||
        (ch.email || "").toLowerCase().includes(q),
    );
  }, [churches, searchQuery]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <PageBadge color="yellow">Plataforma SaaS Global</PageBadge>
          <h1>👑 Painel Super Admin</h1>
          <p>
            Gerencie igrejas, assinaturas, bloqueios, usuários e crescimento da
            plataforma CRM Bom Samaritano.
          </p>
        </div>

        <button
          className="btn-help"
          onClick={() => fetchData(true)}
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

      {/* Notificações */}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={clearSuccess}
          autoDismiss={3500}
        />
      )}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={clearError}
          autoDismiss={4000}
        />
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
          title="Igrejas Cadastradas"
          value={stats?.total_churches || 0}
          color="#8B5CF6"
          icon="⛪"
        />
        <SummaryCard
          title="Igrejas Ativas"
          value={activeChurches}
          color="#10B981"
          icon="✅"
        />
        <SummaryCard
          title="Igrejas Bloqueadas"
          value={blockedChurches}
          color="#EF4444"
          icon="🔒"
        />
        <SummaryCard
          title="Usuários Totais"
          value={stats?.total_users || 0}
          color="#2563EB"
          icon="👥"
        />
        <SummaryCard
          title="Membros no SaaS"
          value={stats?.total_members || 0}
          color="#F59E0B"
          icon="💎"
        />
        <SummaryCard
          title="Receita Estimada"
          value={`R$ ${monthlyEstimate.toLocaleString("pt-BR")}`}
          color="#10B981"
          icon="💰"
        />
      </div>

      {/* Tabela de igrejas */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">Igrejas e Assinaturas</h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                marginTop: 4,
              }}
            >
              Controle o status das igrejas cadastradas, planos e acesso à
              plataforma.
            </p>
          </div>

          {/* Busca por nome */}
          {!loading && churches.length > 0 && (
            <div style={{ position: "relative", flexShrink: 0 }}>
              <input
                type="text"
                placeholder="🔍 Buscar igreja..."
                value={searchQuery}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  width: 220,
                  outline: "none",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    lineHeight: 1,
                    padding: 0,
                  }}
                  aria-label="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <LoadingState rows={6} height={62} />
        ) : churches.length === 0 ? (
          <EmptyState
            icon="⛪"
            title="Nenhuma igreja cadastrada"
            description="Quando novas igrejas criarem conta na plataforma, elas aparecerão nesta área para controle de planos, acessos e bloqueios."
          />
        ) : filteredChurches.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Nenhuma igreja encontrada"
            description={`Não há igrejas correspondendo a "${searchQuery}".`}
            actionLabel="Limpar busca"
            onAction={() => setSearchQuery("")}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Igreja</th>
                  <th>Slug / ID</th>
                  <th>Contato</th>
                  <th>Plano</th>
                  <th>Status</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredChurches.map((church) => {
                  const plan = planMap[(church.plan || "").toLowerCase()] || {
                    label: church.plan || "Sem plano",
                    color: "#6B7280",
                  };
                  const isActive = church.status === "active";
                  const isUpdating = updatingId === church.id;

                  return (
                    <tr key={church.id}>
                      {/* Nome da igreja */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Avatar name={church.name} />
                          <div>
                            <strong
                              style={{
                                color: "var(--text-main)",
                                fontSize: "0.9rem",
                              }}
                            >
                              {church.name || "Igreja sem nome"}
                            </strong>
                            <div
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.72rem",
                              }}
                            >
                              ID #{church.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td>
                        <code
                          style={{
                            fontSize: "0.78rem",
                            color: "#C4B5FD",
                            background: "rgba(124,58,237,0.12)",
                            padding: "0.25rem 0.55rem",
                            borderRadius: 8,
                            border: "1px solid rgba(124,58,237,0.25)",
                          }}
                        >
                          {church.slug}
                        </code>
                      </td>

                      {/* Contato */}
                      <td>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{
                              color: "var(--text-main)",
                              fontSize: "0.82rem",
                            }}
                          >
                            {church.email || "Sem e-mail"}
                          </span>
                          <span
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.72rem",
                            }}
                          >
                            {church.phone || "Sem telefone"}
                          </span>
                        </div>
                      </td>

                      {/* Plano */}
                      <td>
                        <StatusBadge
                          label={plan.label}
                          color={plan.color}
                          icon="💼"
                        />
                      </td>

                      {/* Status */}
                      <td>
                        {isActive ? (
                          <StatusBadge
                            label="Ativa"
                            color="#10B981"
                            icon="✅"
                          />
                        ) : (
                          <StatusBadge
                            label="Bloqueada"
                            color="#EF4444"
                            icon="🔒"
                          />
                        )}
                      </td>

                      {/* Data de cadastro */}
                      <td
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.82rem",
                        }}
                      >
                        {church.created_at
                          ? new Date(church.created_at).toLocaleDateString(
                              "pt-BR",
                            )
                          : "-"}
                      </td>

                      {/* Ação: bloquear / ativar */}
                      <td>
                        <div className="action-btns">
                          <button
                            type="button"
                            onClick={() => requestToggleStatus(church)}
                            disabled={isUpdating}
                            className={
                              isActive ? "btn-danger-soft" : "btn-success-soft"
                            }
                            style={{
                              padding: "0.45rem 0.75rem",
                              borderRadius: 10,
                              border: isActive
                                ? "1px solid rgba(239,68,68,0.35)"
                                : "1px solid rgba(16,185,129,0.35)",
                              background: isActive
                                ? "rgba(239,68,68,0.14)"
                                : "rgba(16,185,129,0.14)",
                              color: isActive ? "#F87171" : "#34D399",
                              fontSize: "0.75rem",
                              fontWeight: 900,
                              cursor: isUpdating ? "not-allowed" : "pointer",
                              opacity: isUpdating ? 0.65 : 1,
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            {isUpdating ? (
                              <>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 11,
                                    height: 11,
                                    border: "2px solid currentColor",
                                    borderTopColor: "transparent",
                                    borderRadius: "50%",
                                    animation: "spin 0.7s linear infinite",
                                  }}
                                />
                                Atualizando...
                              </>
                            ) : isActive ? (
                              "🔒 Bloquear"
                            ) : (
                              "✅ Ativar"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Rodapé com contagem */}
            {searchQuery && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.78rem",
                  marginTop: "1rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                Exibindo {filteredChurches.length} de {churches.length} igrejas
              </p>
            )}
          </div>
        )}
      </div>

      {/* ─── ConfirmDialog: Bloquear / Ativar igreja ─── */}
      {confirmToggle && (
        <ConfirmDialog
          title={
            confirmToggle.newStatus === "blocked"
              ? "Bloquear esta igreja?"
              : "Ativar esta igreja?"
          }
          message={
            confirmToggle.newStatus === "blocked"
              ? `Deseja realmente bloquear "${confirmToggle.church.name}"? O pastor e os obreiros perderão o acesso imediatamente.`
              : `Deseja realmente ativar "${confirmToggle.church.name}" novamente? O acesso será restaurado.`
          }
          onConfirm={confirmToggleStatus}
          onCancel={() => setConfirmToggle(null)}
          danger={confirmToggle.newStatus === "blocked"}
          confirmLabel={
            confirmToggle.newStatus === "blocked"
              ? "Sim, bloquear"
              : "Sim, ativar"
          }
        />
      )}
    </div>
  );
}
