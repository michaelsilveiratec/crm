import { useState, useEffect } from "preact/hooks";
import {
  SummaryCard,
  StatusBadge,
  LoadingState,
  EmptyState,
  Alert,
  PageBadge,
  Modal,
  ConfirmDialog,
} from "./shared";
import { useNotification } from "../hooks/useNotification";

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface PastoralMessage {
  id: number;
  categoria: string;
  titulo: string;
  mensagem: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
}

interface Member {
  id: number;
  name: string;
  whatsapp?: string;
  phone?: string;
}

// ─── Constantes ────────────────────────────────────────────────────────────────

const categories = [
  { value: "BOAS_VINDAS", label: "Boas-vindas", icon: "👋", color: "#10B981" },
  { value: "VISITANTE", label: "Visitante", icon: "🚶", color: "#2563EB" },
  {
    value: "ANIVERSARIANTE",
    label: "Aniversariante",
    icon: "🎁",
    color: "#F59E0B",
  },
  {
    value: "MEMBRO_AFASTADO",
    label: "Membro Afastado",
    icon: "☁️",
    color: "#8B5CF6",
  },
  {
    value: "MEMBRO_DOENTE",
    label: "Membro Doente",
    icon: "🩹",
    color: "#EF4444",
  },
  {
    value: "GRUPOS_IGREJA",
    label: "Grupos da Igreja",
    icon: "👥",
    color: "#2563EB",
  },
  {
    value: "BATISMO_NAS_AGUAS",
    label: "Batismo nas Águas",
    icon: "💧",
    color: "#06B6D4",
  },
  { value: "CASAMENTO", label: "Casamento", icon: "❤️", color: "#EC4899" },
  { value: "SANTA_CEIA", label: "Santa Ceia", icon: "🍷", color: "#F59E0B" },
  {
    value: "PEDIDO_ORACAO",
    label: "Pedido de Oração",
    icon: "🙏",
    color: "#10B981",
  },
  {
    value: "CONVITE_CULTO",
    label: "Convite para Culto",
    icon: "⛪",
    color: "#8B5CF6",
  },
];

const lists = [
  { value: "visitors", label: "Visitantes" },
  { value: "birthdays", label: "Aniversariantes do Mês" },
  { value: "away", label: "Membros Afastados" },
  { value: "sick", label: "Membros Doentes" },
  { value: "youth", label: "Grupo de Jovens" },
  { value: "everyone", label: "Todos os Membros" },
];

// ─── Componente Principal ─────────────────────────────────────────────────────

export function PastoralMessages() {
  const [messages, setMessages] = useState<PastoralMessage[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);

  // ─ Notification via hook compartilhado ─
  const {
    notification,
    showSuccess,
    showError,
    clear: clearNotification,
  } = useNotification();

  // ─ Form de cadastro / edição ─
  const [formId, setFormId] = useState<number | null>(null);
  const [formCategory, setFormCategory] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formActive, setFormActive] = useState(true);

  // ─ Filtros ─
  const [filterCategory, setFilterCategory] = useState("Todas as categorias");
  const [searchTerm, setSearchTerm] = useState("");

  // ─ Views ─
  const [view, setView] = useState<"center" | "history">("center");
  const [viewMessage, setViewMessage] = useState<PastoralMessage | null>(null);

  // ─ Modais de envio ─
  const [selectedMessage, setSelectedMessage] =
    useState<PastoralMessage | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  // ─ ConfirmDialog de exclusão ─
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // ─ Envio ─
  const [sendType, setSendType] = useState<"single" | "list">("single");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedList, setSelectedList] = useState("visitors");

  // ─ Teste WhatsApp ─
  const [testName, setTestName] = useState("Maria");
  const [testPhone, setTestPhone] = useState("");

  useEffect(() => {
    fetchMessages();
    fetchMembers();
  }, []);

  // ─── Fetches ───────────────────────────────────────────────────────────────

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/pastor/pastoral-messages");
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setMessages(data || []);
    } catch {
      showError("Erro ao carregar mensagens pastorais.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const resp = await fetch("/api/pastor/pastoral-history");
      if (resp.ok) {
        const data = await resp.json();
        setHistory(data || []);
      }
    } catch {
      showError("Erro ao carregar histórico de envios.");
    }
  };

  const fetchMembers = async () => {
    try {
      const resp = await fetch("/api/pastor/members");
      if (resp.ok) {
        const data = await resp.json();
        setMembers(data || []);
      }
    } catch {
      console.error("Erro ao carregar membros");
    }
  };

  // ─── Form ────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormId(null);
    setFormCategory("");
    setFormTitle("");
    setFormContent("");
    setFormActive(true);
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();

    // Validação client-side
    if (!formCategory.trim()) {
      showError("Selecione uma categoria para a mensagem.");
      return;
    }
    if (!formTitle.trim()) {
      showError("Informe o título da mensagem.");
      return;
    }
    if (!formContent.trim()) {
      showError("Escreva o conteúdo da mensagem.");
      return;
    }

    setSubmitting(true);

    try {
      const method = formId ? "PUT" : "POST";
      const url = formId
        ? `/api/pastor/pastoral-messages/${formId}`
        : "/api/pastor/pastoral-messages";

      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoria: formCategory,
          titulo: formTitle,
          mensagem: formContent,
          status: formActive ? "ATIVA" : "INATIVA",
        }),
      });

      if (!resp.ok) throw new Error();

      showSuccess(
        formId
          ? "Mensagem atualizada com sucesso."
          : "Mensagem cadastrada com sucesso.",
      );
      resetForm();
      fetchMessages();
    } catch {
      showError("Erro ao salvar mensagem pastoral.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (msg: PastoralMessage) => {
    setFormId(msg.id);
    setFormCategory(msg.categoria);
    setFormTitle(msg.titulo);
    setFormContent(msg.mensagem);
    setFormActive(msg.status === "ATIVA");
  };

  // Abre ConfirmDialog de exclusão (substitui window.confirm)
  const confirmDelete = (id: number) => setDeleteId(id);

  const handleDelete = async () => {
    if (deleteId === null) return;
    const id = deleteId;
    setDeleteId(null);

    try {
      const resp = await fetch(`/api/pastor/pastoral-messages/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error();
      showSuccess("Mensagem excluída com sucesso.");
      fetchMessages();
    } catch {
      showError("Erro ao excluir mensagem.");
    }
  };

  // ─── Modais de envio ─────────────────────────────────────────────────────

  const openSendModal = (msg: PastoralMessage) => {
    setSelectedMessage(msg);
    setShowSendModal(true);
  };

  const openTestModal = (msg: PastoralMessage) => {
    setSelectedMessage(msg);
    setShowTestModal(true);
  };

  // Teste via WhatsApp Web
  const handleWhatsAppWeb = () => {
    if (!selectedMessage) return;

    if (!testPhone.trim()) {
      showError("Informe um número de WhatsApp.");
      return;
    }

    const msgText = replaceVariables(selectedMessage.mensagem, testName);
    const cleanPhone = cleanPhoneNumber(testPhone);
    window.open(
      `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msgText)}`,
      "_blank",
    );
  };

  // Envio para pessoa específica
  const handleSendNow = async () => {
    if (!selectedMessage) return;

    // Envio em lista → confirmar antes via ConfirmDialog
    if (sendType === "list") {
      setShowBulkConfirm(true);
      return;
    }

    // Envio individual
    setSending(true);
    try {
      const member = members.find((m) => m.id.toString() === selectedMember);
      if (!member) {
        showError("Selecione uma pessoa.");
        return;
      }

      const phone = cleanPhoneNumber(member.whatsapp || member.phone || "");
      const finalMsg = replaceVariables(selectedMessage.mensagem, member.name);

      if (!phone) {
        showError("O membro selecionado não possui WhatsApp cadastrado.");
        return;
      }

      window.open(
        `https://wa.me/55${phone}?text=${encodeURIComponent(finalMsg)}`,
        "_blank",
      );

      await fetch("/api/pastor/pastoral-bulk-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message_id: selectedMessage.id,
          target: "single",
          target_id: member.id,
          mensagem_final: finalMsg,
          telefone: phone,
        }),
      });

      showSuccess("Mensagem aberta no WhatsApp e registrada no histórico.");
      setShowSendModal(false);
      setSelectedMessage(null);
      fetchHistory();
    } catch {
      showError("Erro ao enviar mensagem pastoral.");
    } finally {
      setSending(false);
    }
  };

  // Envio em massa (confirmado via ConfirmDialog)
  const handleBulkSendConfirmed = async () => {
    if (!selectedMessage) return;
    setShowBulkConfirm(false);
    setSending(true);

    try {
      const resp = await fetch("/api/pastor/pastoral-bulk-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message_id: selectedMessage.id,
          target: "list",
          list: selectedList,
        }),
      });

      if (!resp.ok) throw new Error();

      showSuccess("Disparo em massa registrado para processamento.");
      setShowSendModal(false);
      setSelectedMessage(null);
      fetchHistory();
    } catch {
      showError("Erro ao enviar mensagem pastoral.");
    } finally {
      setSending(false);
    }
  };

  // ─── Dados filtrados ──────────────────────────────────────────────────────

  const filteredMessages = messages.filter((m) => {
    const category = getCategory(m.categoria);
    const matchCat =
      filterCategory === "Todas as categorias" ||
      category.label === filterCategory;
    const matchSearch =
      m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mensagem.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalMessages = messages.length;
  const activeMessages = messages.filter((m) => m.status === "ATIVA").length;
  const inactiveMessages = messages.filter((m) => m.status !== "ATIVA").length;
  const totalCategories = new Set(messages.map((m) => m.categoria)).size;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="main-content">
      {/* Toast de notificação (fixed top-right) */}
      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
          autoDismiss={3500}
          fixed
        />
      )}

      {/* Cabeçalho */}
      <div className="page-header">
        <div>
          <PageBadge color="purple">Comunicação pastoral</PageBadge>

          <h1>💬 Central de Mensagens Pastorais</h1>

          <p>
            Crie, edite, visualize e envie mensagens para visitantes, membros,
            aniversariantes, afastados, doentes e grupos da igreja.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            background: "rgba(255,255,255,0.04)",
            padding: "0.4rem",
            borderRadius: 14,
            border: "1px solid var(--border)",
          }}
        >
          <button
            className={view === "center" ? "btn-primary" : "btn-secondary"}
            style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}
            onClick={() => setView("center")}
          >
            📱 Central
          </button>

          <button
            className={view === "history" ? "btn-primary" : "btn-secondary"}
            style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}
            onClick={() => {
              setView("history");
              fetchHistory();
            }}
          >
            📜 Histórico
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
          title="Mensagens"
          value={totalMessages}
          color="#8B5CF6"
          icon="💬"
        />
        <SummaryCard
          title="Ativas"
          value={activeMessages}
          color="#10B981"
          icon="✅"
        />
        <SummaryCard
          title="Inativas"
          value={inactiveMessages}
          color="#EF4444"
          icon="🔒"
        />
        <SummaryCard
          title="Categorias"
          value={totalCategories}
          color="#F59E0B"
          icon="🏷️"
        />
      </div>

      {/* Conteúdo principal */}
      {view === "center" ? (
        <div
          className="content-grid"
          style={{ gridTemplateColumns: "1.4fr 0.9fr", alignItems: "start" }}
        >
          {/* ── Lista de mensagens ── */}
          <div className="modern-card">
            <div className="modern-card-header">
              <div>
                <h2 className="modern-card-title">Mensagens Cadastradas</h2>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    marginTop: 4,
                  }}
                >
                  {filteredMessages.length} mensagem(ns) encontrada(s).
                </p>
              </div>

              <button className="btn-primary" onClick={resetForm}>
                + Nova Mensagem
              </button>
            </div>

            {/* Filtros */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.3fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.currentTarget.value)}
              >
                <option>Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.value}>{cat.label}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Buscar por título ou conteúdo..."
                value={searchTerm}
                onInput={(e) => setSearchTerm(e.currentTarget.value)}
              />
            </div>

            {/* Tabela */}
            {loading ? (
              <LoadingState rows={6} height={62} />
            ) : filteredMessages.length === 0 ? (
              <EmptyState
                icon="💬"
                title="Nenhuma mensagem encontrada"
                description="Cadastre mensagens pastorais para visitantes, aniversariantes, afastados, doentes e grupos."
              />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Título</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMessages.map((msg) => {
                      const cat = getCategory(msg.categoria);
                      return (
                        <tr key={msg.id}>
                          <td>
                            <CategoryBadge category={cat} />
                          </td>

                          <td>
                            <div>
                              <strong
                                style={{
                                  color: "var(--text-main)",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {msg.titulo}
                              </strong>

                              <div
                                style={{
                                  color: "var(--text-muted)",
                                  fontSize: "0.75rem",
                                  maxWidth: 260,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  marginTop: 3,
                                }}
                              >
                                {msg.mensagem}
                              </div>
                            </div>
                          </td>

                          <td>
                            {msg.status === "ATIVA" ? (
                              <StatusBadge
                                label="Ativa"
                                color="#10B981"
                                icon="✅"
                              />
                            ) : (
                              <StatusBadge
                                label="Inativa"
                                color="#EF4444"
                                icon="🔒"
                              />
                            )}
                          </td>

                          <td>
                            <div className="action-btns">
                              <button
                                className="btn-icon"
                                title="Enviar"
                                onClick={() => openSendModal(msg)}
                              >
                                ✈️
                              </button>

                              <button
                                className="btn-icon"
                                title="Testar"
                                onClick={() => openTestModal(msg)}
                              >
                                🚀
                              </button>

                              <button
                                className="btn-icon"
                                title="Visualizar"
                                onClick={() => setViewMessage(msg)}
                              >
                                👁️
                              </button>

                              <button
                                className="btn-icon"
                                title="Editar"
                                onClick={() => handleEdit(msg)}
                              >
                                ✏️
                              </button>

                              <button
                                className="btn-icon delete"
                                title="Excluir"
                                onClick={() => confirmDelete(msg.id)}
                              >
                                🗑️
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

          {/* ── Formulário ── */}
          <div className="modern-card">
            <div className="modern-card-header">
              <div>
                <h2 className="modern-card-title">
                  {formId ? "Editar Mensagem" : "Nova Mensagem"}
                </h2>

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    marginTop: 4,
                  }}
                >
                  Use variáveis como {"{nome}"}, {"{igreja}"} e {"{data}"}.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSave}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <label>
                Categoria *
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.currentTarget.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Título Interno *
                <input
                  type="text"
                  placeholder="Ex: Boas-vindas para visitante"
                  value={formTitle}
                  onInput={(e) => setFormTitle(e.currentTarget.value)}
                  required
                />
              </label>

              <label>
                Mensagem *
                <textarea
                  style={{ minHeight: 170, resize: "vertical" }}
                  placeholder="Olá, {nome}! Seja bem-vindo à {igreja}..."
                  value={formContent}
                  onInput={(e) => setFormContent(e.currentTarget.value)}
                  required
                />
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.9rem 1rem",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.currentTarget.checked)}
                  style={{ width: 18, height: 18 }}
                />

                <span style={{ color: "var(--text-main)", fontWeight: 800 }}>
                  Mensagem ativa
                </span>
              </label>

              {/* Prévia */}
              <div
                style={{
                  padding: "1rem",
                  borderRadius: 18,
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.22)",
                }}
              >
                <strong style={{ color: "#C4B5FD", fontSize: "0.85rem" }}>
                  Prévia com variáveis
                </strong>

                <p
                  style={{
                    margin: "0.5rem 0 0",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {formContent
                    ? replaceVariables(formContent, "Maria")
                    : "A prévia da mensagem aparecerá aqui."}
                </p>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Limpar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Salvando..."
                    : formId
                      ? "Atualizar Mensagem"
                      : "Salvar Mensagem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <HistoryView history={history} />
      )}

      {/* ── Modal: enviar mensagem ── */}
      {showSendModal && selectedMessage && (
        <SendModal
          message={selectedMessage}
          members={members}
          sendType={sendType}
          selectedMember={selectedMember}
          selectedList={selectedList}
          sending={sending}
          onSendTypeChange={setSendType}
          onMemberChange={setSelectedMember}
          onListChange={setSelectedList}
          onClose={() => {
            setShowSendModal(false);
            setSelectedMessage(null);
          }}
          onSend={handleSendNow}
          replaceVariables={replaceVariables}
        />
      )}

      {/* ── Modal: visualizar mensagem ── */}
      {viewMessage && (
        <ViewModal message={viewMessage} onClose={() => setViewMessage(null)} />
      )}

      {/* ── Modal: testar WhatsApp ── */}
      {showTestModal && selectedMessage && (
        <TestModal
          message={selectedMessage}
          testName={testName}
          testPhone={testPhone}
          setTestName={setTestName}
          setTestPhone={setTestPhone}
          onClose={() => {
            setShowTestModal(false);
            setSelectedMessage(null);
          }}
          onOpenWhatsApp={handleWhatsAppWeb}
          replaceVariables={replaceVariables}
        />
      )}

      {/* ── ConfirmDialog: confirmar disparo em massa ── */}
      {showBulkConfirm && (
        <ConfirmDialog
          title="Confirmar Disparo em Massa"
          message={`Deseja realmente enviar esta mensagem para a lista "${lists.find((l) => l.value === selectedList)?.label || selectedList}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Enviar para todos"
          onConfirm={handleBulkSendConfirmed}
          onCancel={() => setShowBulkConfirm(false)}
        />
      )}

      {/* ── ConfirmDialog: confirmar exclusão ── */}
      {deleteId !== null && (
        <ConfirmDialog
          title="Excluir Mensagem"
          message="Tem certeza que deseja excluir esta mensagem pastoral? Essa ação não poderá ser desfeita."
          confirmLabel="Excluir"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          danger
        />
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCategory(value: string) {
  return (
    categories.find((cat) => cat.value === value) || {
      value,
      label: value,
      icon: "📄",
      color: "#6B7280",
    }
  );
}

function replaceVariables(text: string, name: string) {
  return text
    .replace(/{nome}/g, name)
    .replace(/{igreja}/g, "Igreja da Graça")
    .replace(/{data}/g, new Date().toLocaleDateString("pt-BR"));
}

function cleanPhoneNumber(phone: string) {
  return phone.replace(/\D/g, "");
}

// ─── Sub-componentes Locais ───────────────────────────────────────────────────

/** Badge específico para categoria de mensagem pastoral */
function CategoryBadge({
  category,
}: {
  category: { label: string; icon: string; color: string };
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: "0.82rem",
        fontWeight: 800,
        color: "var(--text-main)",
      }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          background: `${category.color}20`,
          border: `1px solid ${category.color}55`,
          color: category.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {category.icon}
      </span>
      {category.label}
    </span>
  );
}

/** Tabela de histórico de envios */
function HistoryView({ history }: { history: any[] }) {
  return (
    <div className="modern-card">
      <div className="modern-card-header">
        <div>
          <h2 className="modern-card-title">Histórico de Envios</h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              marginTop: 4,
            }}
          >
            Últimos registros de mensagens pastorais enviadas.
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon="📜"
          title="Nenhum envio registrado"
          description="Quando mensagens pastorais forem enviadas, o histórico aparecerá aqui."
        />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Mensagem</th>
                <th>Destinatário</th>
                <th>Status</th>
                <th>Autor</th>
              </tr>
            </thead>

            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    {h.enviado_em
                      ? new Date(h.enviado_em).toLocaleString("pt-BR")
                      : "-"}
                  </td>

                  <td>
                    <strong
                      style={{ color: "var(--text-main)", fontSize: "0.85rem" }}
                    >
                      {h.message_title || "Mensagem"}
                    </strong>
                  </td>

                  <td>
                    <strong
                      style={{ color: "var(--text-main)", fontSize: "0.85rem" }}
                    >
                      {h.member_name || "Destinatário"}
                    </strong>
                    <br />
                    <small style={{ color: "var(--text-muted)" }}>
                      {h.telefone || "-"}
                    </small>
                  </td>

                  <td>
                    {h.status === "Enviado" || h.status === "success" ? (
                      <StatusBadge label="Enviado" color="#10B981" icon="✅" />
                    ) : (
                      <StatusBadge
                        label={h.status || "Falhou"}
                        color="#EF4444"
                        icon="⚠️"
                      />
                    )}
                  </td>

                  <td>
                    <small style={{ color: "var(--text-muted)" }}>
                      {h.enviado_por || "-"}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Modal de envio de mensagem */
function SendModal(props: {
  message: PastoralMessage;
  members: Member[];
  sendType: "single" | "list";
  selectedMember: string;
  selectedList: string;
  sending: boolean;
  onSendTypeChange: (v: "single" | "list") => void;
  onMemberChange: (v: string) => void;
  onListChange: (v: string) => void;
  onClose: () => void;
  onSend: () => void;
  replaceVariables: (text: string, name: string) => string;
}) {
  const selected = props.members.find(
    (m) => m.id.toString() === props.selectedMember,
  );

  return (
    <Modal
      title="✈️ Enviar Mensagem Pastoral"
      subtitle="Escolha o destino e pré-visualize antes de enviar."
      onClose={props.onClose}
      maxWidth={620}
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <label>
          Escolha o destino
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.6rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="radio"
                checked={props.sendType === "single"}
                onChange={() => props.onSendTypeChange("single")}
              />
              Pessoa específica
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="radio"
                checked={props.sendType === "list"}
                onChange={() => props.onSendTypeChange("list")}
              />
              Lista
            </label>
          </div>
        </label>

        {props.sendType === "single" ? (
          <label>
            Membro / Visitante
            <select
              value={props.selectedMember}
              onChange={(e) => props.onMemberChange(e.currentTarget.value)}
            >
              <option value="">Selecione um nome...</option>
              {props.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.whatsapp || m.phone || "sem WhatsApp"})
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            Lista de Envio
            <select
              value={props.selectedList}
              onChange={(e) => props.onListChange(e.currentTarget.value)}
            >
              {lists.map((list) => (
                <option key={list.value} value={list.value}>
                  {list.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Prévia */}
        <div
          style={{
            background: "rgba(16,185,129,0.08)",
            padding: "1rem",
            borderRadius: 18,
            border: "1px solid rgba(16,185,129,0.22)",
          }}
        >
          <strong style={{ color: "#34D399" }}>Prévia da mensagem</strong>

          <p
            style={{
              color: "var(--text-muted)",
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              marginBottom: 0,
            }}
          >
            {props.replaceVariables(
              props.message.mensagem,
              selected?.name || "Nome do Membro",
            )}
          </p>
        </div>

        <div className="form-actions">
          <button className="btn-secondary" onClick={props.onClose}>
            Cancelar
          </button>

          <button
            className="btn-primary"
            onClick={props.onSend}
            disabled={props.sending}
          >
            {props.sending
              ? "Enviando..."
              : props.sendType === "list"
                ? "Enviar para Lista"
                : "Enviar Agora"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/** Modal de visualização de mensagem */
function ViewModal({
  message,
  onClose,
}: {
  message: PastoralMessage;
  onClose: () => void;
}) {
  const cat = getCategory(message.categoria);

  return (
    <Modal title={message.titulo} onClose={onClose} maxWidth={540}>
      <CategoryBadge category={cat} />

      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          padding: "1rem",
          borderRadius: 16,
          border: "1px solid var(--border)",
          marginTop: "1rem",
          whiteSpace: "pre-wrap",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        {message.mensagem}
      </div>

      <div className="form-actions" style={{ marginTop: "1.5rem" }}>
        <button className="btn-secondary" onClick={onClose}>
          Fechar
        </button>
      </div>
    </Modal>
  );
}

/** Modal de teste via WhatsApp Web */
function TestModal(props: {
  message: PastoralMessage;
  testName: string;
  testPhone: string;
  setTestName: (v: string) => void;
  setTestPhone: (v: string) => void;
  onClose: () => void;
  onOpenWhatsApp: () => void;
  replaceVariables: (text: string, name: string) => string;
}) {
  return (
    <Modal
      title="🚀 Testar WhatsApp"
      subtitle="Visualize como a mensagem chegará ao destinatário."
      onClose={props.onClose}
      maxWidth={430}
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <label>
          Nome de teste
          <input
            value={props.testName}
            onInput={(e) => props.setTestName(e.currentTarget.value)}
          />
        </label>

        <label>
          Número WhatsApp com DDD
          <input
            placeholder="Ex: 11999999999"
            value={props.testPhone}
            onInput={(e) => props.setTestPhone(e.currentTarget.value)}
          />
        </label>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            padding: "1rem",
            borderRadius: 16,
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
          }}
        >
          {props.replaceVariables(props.message.mensagem, props.testName)}
        </div>

        <button className="btn-primary" onClick={props.onOpenWhatsApp}>
          Abrir WhatsApp Web
        </button>

        <button className="btn-secondary" onClick={props.onClose}>
          Fechar
        </button>
      </div>
    </Modal>
  );
}
