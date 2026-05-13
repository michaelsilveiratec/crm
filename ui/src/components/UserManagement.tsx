import { useState, useEffect } from "preact/hooks";
import {
  SummaryCard,
  StatusBadge,
  LoadingState,
  EmptyState,
  Alert,
  Avatar,
  PageBadge,
  Modal,
  ConfirmDialog,
} from "./shared";
import { useNotification } from "../hooks/useNotification";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  provisional_access: boolean;
}

interface UserForm {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

const emptyForm: UserForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
};

// ─── Componente principal ─────────────────────────────────────────────────────

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { success, error, showSuccess, showError, clearSuccess, clearError } =
    useNotification();

  // Modal de criação/edição
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserForm>(emptyForm);
  const [formError, setFormError] = useState("");

  // Modal de reset de senha
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Confirmação de exclusão
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      clearError();

      const response = await fetch("/api/pastor/users");
      if (!response.ok) throw new Error("Erro ao carregar usuários da equipe.");

      const data = await response.json();
      setUsers(data || []);
    } catch (err: any) {
      showError(err.message || "Não foi possível carregar a equipe.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ─── Modal de usuário ─────────────────────────────────────────────────────

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormData(emptyForm);
    setFormError("");
    clearError();
    clearSuccess();
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    if (user.role !== "obreiro") {
      showError("Somente obreiros podem ser editados por esta tela.");
      return;
    }
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
    });
    setFormError("");
    clearError();
    clearSuccess();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData(emptyForm);
    setFormError("");
    setSaving(false);
  };

  const handleSaveUser = async (e: Event) => {
    e.preventDefault();
    setFormError("");

    try {
      setSaving(true);

      if (!formData.name.trim() || !formData.username.trim()) {
        throw new Error("Nome e login são obrigatórios.");
      }
      if (modalMode === "create" && formData.password.length < 6) {
        throw new Error("A senha precisa ter no mínimo 6 caracteres.");
      }

      const url =
        modalMode === "create"
          ? "/api/pastor/users"
          : `/api/pastor/users/${selectedUser?.id}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const payload =
        modalMode === "create"
          ? formData
          : {
              name: formData.name,
              username: formData.username,
              email: formData.email,
              phone: formData.phone,
            };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Erro ao salvar usuário.");

      closeModal();
      await fetchUsers();
      showSuccess(
        modalMode === "create"
          ? "Obreiro criado com sucesso."
          : "Obreiro atualizado com sucesso.",
      );
    } catch (err: any) {
      setFormError(err.message || "Erro ao salvar usuário.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Toggle de acesso ─────────────────────────────────────────────────────

  const toggleAccess = async (userId: number, currentAccess: boolean) => {
    try {
      setUpdatingId(userId);
      clearError();
      clearSuccess();

      const response = await fetch(`/api/pastor/users/${userId}/grant-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grant: !currentAccess }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Erro ao atualizar permissão.");

      await fetchUsers();
      showSuccess(
        !currentAccess
          ? "Acesso provisório liberado com sucesso."
          : "Acesso provisório bloqueado com sucesso.",
      );
    } catch (err: any) {
      showError(err.message || "Não foi possível atualizar a permissão.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── Modal de senha ───────────────────────────────────────────────────────

  const openPasswordModal = (user: User) => {
    if (user.role !== "obreiro") {
      showError("Somente senha de obreiros pode ser resetada por esta tela.");
      return;
    }
    setSelectedUser(user);
    setNewPassword("");
    setFormError("");
    clearError();
    clearSuccess();
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
    setNewPassword("");
    setFormError("");
  };

  const handleResetPassword = async (e: Event) => {
    e.preventDefault();
    setFormError("");

    try {
      setSaving(true);

      if (newPassword.length < 6) {
        throw new Error("A nova senha precisa ter no mínimo 6 caracteres.");
      }

      const response = await fetch(
        `/api/pastor/users/${selectedUser?.id}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        },
      );

      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Erro ao resetar senha.");

      closePasswordModal();
      showSuccess("Senha resetada com sucesso.");
    } catch (err: any) {
      setFormError(err.message || "Erro ao resetar senha.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Exclusão de usuário (com ConfirmDialog) ──────────────────────────────

  const requestDeleteUser = (user: User) => {
    if (user.role !== "obreiro") {
      showError("Pastor não pode ser excluído por esta tela.");
      return;
    }
    setConfirmDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!confirmDelete) return;
    const user = confirmDelete;
    setConfirmDelete(null);

    try {
      setUpdatingId(user.id);
      clearError();
      clearSuccess();

      const response = await fetch(`/api/pastor/users/${user.id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Erro ao excluir usuário.");

      await fetchUsers();
      showSuccess("Obreiro excluído com sucesso.");
    } catch (err: any) {
      showError(err.message || "Erro ao excluir usuário.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── Contadores ───────────────────────────────────────────────────────────

  const totalUsers = users.length;
  const totalPastores = users.filter((u) => u.role === "pastor").length;
  const totalObreiros = users.filter((u) => u.role === "obreiro").length;
  const totalLiberados = users.filter(
    (u) => u.role === "obreiro" && u.provisional_access,
  ).length;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <PageBadge color="green">Gestão da equipe</PageBadge>
          <h1>🛡️ Obreiros e Acessos</h1>
          <p>
            Somente o Pastor Administrador pode criar, editar, resetar senha,
            excluir e liberar acessos dos obreiros.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button
            className="btn-secondary"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            {refreshing ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
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

          <button className="btn-primary" onClick={openCreateModal}>
            + Novo Obreiro
          </button>
        </div>
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
          title="Total de Usuários"
          value={totalUsers}
          color="#8B5CF6"
          icon="👥"
        />
        <SummaryCard
          title="Pastores"
          value={totalPastores}
          color="#2563EB"
          icon="⛪"
        />
        <SummaryCard
          title="Obreiros"
          value={totalObreiros}
          color="#10B981"
          icon="🤝"
        />
        <SummaryCard
          title="Acessos Liberados"
          value={totalLiberados}
          color="#F59E0B"
          icon="🔓"
        />
      </div>

      {/* Tabela */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">Equipe da Igreja</h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                marginTop: 4,
              }}
            >
              O obreiro não possui CRUD. Ele só acessa as áreas permitidas pelo
              Pastor.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState rows={5} height={62} />
        ) : users.length === 0 ? (
          <EmptyState
            icon="🤝"
            title="Nenhum usuário encontrado"
            description="Quando obreiros forem cadastrados, eles aparecerão nesta área para gerenciamento."
            actionLabel="+ Novo Obreiro"
            onAction={openCreateModal}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Login</th>
                  <th>Contato</th>
                  <th>Cargo</th>
                  <th>Status</th>
                  <th>Ações do Pastor</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isPastor = user.role === "pastor";

                  return (
                    <tr
                      key={user.id}
                      style={
                        isPastor
                          ? {
                              background: "rgba(124,58,237,0.06)",
                              borderLeft: "3px solid rgba(124,58,237,0.45)",
                            }
                          : {}
                      }
                    >
                      {/* Nome */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Avatar
                            name={user.name}
                            gradient={
                              isPastor
                                ? "linear-gradient(135deg,#7C3AED,#2563EB)"
                                : "linear-gradient(135deg,#10B981,#2563EB)"
                            }
                          />
                          <div>
                            <strong
                              style={{
                                color: "var(--text-main)",
                                fontSize: "0.9rem",
                              }}
                            >
                              {user.name || "Usuário sem nome"}
                            </strong>
                            <div
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.72rem",
                              }}
                            >
                              ID #{user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Login */}
                      <td>
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {user.username}
                        </span>
                      </td>

                      {/* Contato */}
                      <td>
                        <div
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.78rem",
                          }}
                        >
                          {user.email || "Sem e-mail"}
                        </div>
                        <div
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.78rem",
                          }}
                        >
                          {user.phone || "Sem telefone"}
                        </div>
                      </td>

                      {/* Cargo */}
                      <td>
                        {isPastor ? (
                          <StatusBadge
                            label="Pastor Admin"
                            color="#8B5CF6"
                            icon="⛪"
                          />
                        ) : (
                          <StatusBadge
                            label="Obreiro"
                            color="#10B981"
                            icon="🤝"
                          />
                        )}
                      </td>

                      {/* Status de acesso */}
                      <td>
                        {isPastor ? (
                          <StatusBadge
                            label="Administrador"
                            color="#2563EB"
                            icon="🛡️"
                          />
                        ) : user.provisional_access ? (
                          <StatusBadge
                            label="Liberado"
                            color="#10B981"
                            icon="✅"
                          />
                        ) : (
                          <StatusBadge
                            label="Bloqueado"
                            color="#EF4444"
                            icon="🔒"
                          />
                        )}
                      </td>

                      {/* Ações */}
                      <td>
                        {user.role === "obreiro" ? (
                          <div className="action-btns">
                            <button
                              className="btn-icon"
                              title="Editar"
                              onClick={() => openEditModal(user)}
                            >
                              ✏️
                            </button>

                            <button
                              className="btn-icon"
                              title="Resetar senha"
                              onClick={() => openPasswordModal(user)}
                            >
                              🔑
                            </button>

                            <button
                              className="btn-icon"
                              title={
                                user.provisional_access
                                  ? "Bloquear acesso"
                                  : "Liberar acesso"
                              }
                              disabled={updatingId === user.id}
                              onClick={() =>
                                toggleAccess(user.id, user.provisional_access)
                              }
                            >
                              {updatingId === user.id
                                ? "⏳"
                                : user.provisional_access
                                  ? "🔒"
                                  : "🔓"}
                            </button>

                            <button
                              className="btn-icon delete"
                              title="Excluir"
                              disabled={updatingId === user.id}
                              onClick={() => requestDeleteUser(user)}
                            >
                              🗑️
                            </button>
                          </div>
                        ) : (
                          <span
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.82rem",
                            }}
                          >
                            Acesso principal do Pastor
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

      {/* ─── Modal: Criar / Editar obreiro ─── */}
      {showModal && (
        <Modal
          title={modalMode === "create" ? "Novo Obreiro" : "Editar Obreiro"}
          subtitle="O acesso criado será de obreiro. Ele não terá permissão de CRUD administrativo."
          onClose={closeModal}
          maxWidth={560}
        >
          <form
            onSubmit={handleSaveUser}
            style={{ display: "grid", gap: "1rem", padding: "0.25rem 0" }}
          >
            {formError && <Alert type="error" message={formError} />}

            <label>
              Nome completo *
              <input
                type="text"
                value={formData.name}
                onInput={(e) =>
                  setFormData({ ...formData, name: e.currentTarget.value })
                }
                required
              />
            </label>

            <label>
              Login *
              <input
                type="text"
                value={formData.username}
                onInput={(e) =>
                  setFormData({ ...formData, username: e.currentTarget.value })
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
                E-mail
                <input
                  type="email"
                  value={formData.email}
                  onInput={(e) =>
                    setFormData({ ...formData, email: e.currentTarget.value })
                  }
                />
              </label>

              <label>
                Telefone / WhatsApp
                <input
                  type="text"
                  value={formData.phone}
                  onInput={(e) =>
                    setFormData({ ...formData, phone: e.currentTarget.value })
                  }
                />
              </label>
            </div>

            {modalMode === "create" && (
              <label>
                Senha inicial *
                <input
                  type="password"
                  value={formData.password}
                  minLength={6}
                  onInput={(e) =>
                    setFormData({
                      ...formData,
                      password: e.currentTarget.value,
                    })
                  }
                  required
                />
              </label>
            )}

            <div
              style={{
                padding: "1rem",
                borderRadius: 16,
                background: "rgba(16,185,129,0.10)",
                border: "1px solid rgba(16,185,129,0.28)",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                lineHeight: 1.6,
              }}
            >
              ✅ Este usuário será cadastrado como <strong>Obreiro</strong>. Ele
              não poderá criar, editar ou excluir usuários. Somente o Pastor
              Administrador terá esse CRUD.
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving
                  ? "Salvando..."
                  : modalMode === "create"
                    ? "Criar Obreiro"
                    : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── Modal: Resetar senha ─── */}
      {showPasswordModal && selectedUser && (
        <Modal
          title="Resetar Senha"
          subtitle={`Defina uma nova senha para ${selectedUser.name}.`}
          onClose={closePasswordModal}
          maxWidth={440}
        >
          <form
            onSubmit={handleResetPassword}
            style={{ display: "grid", gap: "1rem", padding: "0.25rem 0" }}
          >
            {formError && <Alert type="error" message={formError} />}

            <label>
              Nova senha *
              <input
                type="password"
                value={newPassword}
                minLength={6}
                onInput={(e) => setNewPassword(e.currentTarget.value)}
                required
              />
            </label>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={closePasswordModal}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Salvando..." : "Resetar Senha"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ─── ConfirmDialog: Excluir obreiro ─── */}
      {confirmDelete && (
        <ConfirmDialog
          title="Excluir obreiro?"
          message={`Deseja realmente excluir o acesso de "${confirmDelete.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={confirmDeleteUser}
          onCancel={() => setConfirmDelete(null)}
          danger
          confirmLabel="Sim, excluir"
        />
      )}
    </div>
  );
}
