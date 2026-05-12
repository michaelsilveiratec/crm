import { useState, useEffect } from 'preact/hooks'

interface User {
    id: number
    name: string
    username: string
    email: string
    phone: string
    role: string
    provisional_access: boolean
}

interface UserForm {
    name: string
    username: string
    email: string
    phone: string
    password: string
}

const emptyForm: UserForm = {
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [updatingId, setUpdatingId] = useState<number | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [formData, setFormData] = useState<UserForm>(emptyForm)

    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [newPassword, setNewPassword] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await fetch('/api/pastor/users')

            if (!response.ok) {
                throw new Error('Erro ao carregar usuários da equipe.')
            }

            const data = await response.json()
            setUsers(data || [])
        } catch (err: any) {
            setError(err.message || 'Não foi possível carregar a equipe.')
        } finally {
            setLoading(false)
        }
    }

    const showSuccess = (message: string) => {
        setSuccess(message)
        setTimeout(() => setSuccess(''), 3000)
    }

    const openCreateModal = () => {
        setModalMode('create')
        setSelectedUser(null)
        setFormData(emptyForm)
        setError('')
        setSuccess('')
        setShowModal(true)
    }

    const openEditModal = (user: User) => {
        if (user.role !== 'obreiro') {
            setError('Somente obreiros podem ser editados por esta tela.')
            return
        }

        setModalMode('edit')
        setSelectedUser(user)
        setFormData({
            name: user.name || '',
            username: user.username || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
        })
        setError('')
        setSuccess('')
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedUser(null)
        setFormData(emptyForm)
        setSaving(false)
    }

    const handleSaveUser = async (e: Event) => {
        e.preventDefault()

        try {
            setSaving(true)
            setError('')
            setSuccess('')

            if (!formData.name.trim() || !formData.username.trim()) {
                throw new Error('Nome e login são obrigatórios.')
            }

            if (modalMode === 'create' && formData.password.length < 6) {
                throw new Error('A senha precisa ter no mínimo 6 caracteres.')
            }

            const url =
                modalMode === 'create'
                    ? '/api/pastor/users'
                    : `/api/pastor/users/${selectedUser?.id}`

            const method = modalMode === 'create' ? 'POST' : 'PUT'

            const payload =
                modalMode === 'create'
                    ? formData
                    : {
                        name: formData.name,
                        username: formData.username,
                        email: formData.email,
                        phone: formData.phone,
                    }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const result = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao salvar usuário.')
            }

            closeModal()
            await fetchUsers()

            showSuccess(
                modalMode === 'create'
                    ? 'Obreiro criado com sucesso.'
                    : 'Obreiro atualizado com sucesso.'
            )
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar usuário.')
        } finally {
            setSaving(false)
        }
    }

    const toggleAccess = async (userId: number, currentAccess: boolean) => {
        try {
            setUpdatingId(userId)
            setError('')
            setSuccess('')

            const response = await fetch(`/api/pastor/users/${userId}/grant-admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grant: !currentAccess }),
            })

            const result = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao atualizar permissão do obreiro.')
            }

            await fetchUsers()

            showSuccess(
                !currentAccess
                    ? 'Acesso provisório liberado com sucesso.'
                    : 'Acesso provisório bloqueado com sucesso.'
            )
        } catch (err: any) {
            setError(err.message || 'Não foi possível atualizar a permissão.')
        } finally {
            setUpdatingId(null)
        }
    }

    const openPasswordModal = (user: User) => {
        if (user.role !== 'obreiro') {
            setError('Somente senha de obreiros pode ser resetada por esta tela.')
            return
        }

        setSelectedUser(user)
        setNewPassword('')
        setError('')
        setSuccess('')
        setShowPasswordModal(true)
    }

    const closePasswordModal = () => {
        setShowPasswordModal(false)
        setSelectedUser(null)
        setNewPassword('')
    }

    const handleResetPassword = async (e: Event) => {
        e.preventDefault()

        try {
            setSaving(true)
            setError('')

            if (newPassword.length < 6) {
                throw new Error('A nova senha precisa ter no mínimo 6 caracteres.')
            }

            const response = await fetch(`/api/pastor/users/${selectedUser?.id}/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword }),
            })

            const result = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao resetar senha.')
            }

            closePasswordModal()
            showSuccess('Senha resetada com sucesso.')
        } catch (err: any) {
            setError(err.message || 'Erro ao resetar senha.')
        } finally {
            setSaving(false)
        }
    }

    const deleteUser = async (user: User) => {
        if (user.role !== 'obreiro') {
            setError('Pastor não pode ser excluído por esta tela.')
            return
        }

        const confirmed = confirm(`Deseja realmente excluir o acesso de ${user.name}?`)

        if (!confirmed) return

        try {
            setUpdatingId(user.id)
            setError('')
            setSuccess('')

            const response = await fetch(`/api/pastor/users/${user.id}`, {
                method: 'DELETE',
            })

            const result = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao excluir usuário.')
            }

            await fetchUsers()
            showSuccess('Obreiro excluído com sucesso.')
        } catch (err: any) {
            setError(err.message || 'Erro ao excluir usuário.')
        } finally {
            setUpdatingId(null)
        }
    }

    const totalUsers = users.length
    const totalPastores = users.filter(u => u.role === 'pastor').length
    const totalObreiros = users.filter(u => u.role === 'obreiro').length
    const totalLiberados = users.filter(u => u.role === 'obreiro' && u.provisional_access).length

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <span
                        style={{
                            display: 'inline-flex',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 999,
                            background: 'rgba(124,58,237,0.14)',
                            border: '1px solid rgba(124,58,237,0.35)',
                            color: '#C4B5FD',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            marginBottom: '0.75rem',
                        }}
                    >
                        Gestão da equipe
                    </span>

                    <h1>🛡️ Obreiros e Acessos</h1>

                    <p>
                        Somente o Pastor Administrador pode criar, editar, resetar senha,
                        excluir e liberar acessos dos obreiros.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button className="btn-secondary" onClick={fetchUsers}>
                        Atualizar
                    </button>

                    <button className="btn-primary" onClick={openCreateModal}>
                        + Novo Obreiro
                    </button>
                </div>
            </div>

            {success && <Alert type="success" message={success} />}
            {error && <Alert type="error" message={error} />}

            <div
                className="stats-grid"
                style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    marginBottom: '1.5rem',
                }}
            >
                <SummaryCard title="Total de Usuários" value={totalUsers} color="#8B5CF6" icon="👥" />
                <SummaryCard title="Pastores" value={totalPastores} color="#2563EB" icon="⛪" />
                <SummaryCard title="Obreiros" value={totalObreiros} color="#10B981" icon="🤝" />
                <SummaryCard title="Acessos Liberados" value={totalLiberados} color="#F59E0B" icon="🔓" />
            </div>

            <div className="modern-card">
                <div className="modern-card-header">
                    <div>
                        <h2 className="modern-card-title">Equipe da Igreja</h2>
                        <p
                            style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.8rem',
                                marginTop: 4,
                            }}
                        >
                            O obreiro não possui CRUD. Ele só acessa as áreas permitidas pelo Pastor.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <LoadingState />
                ) : users.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div style={{ overflowX: 'auto' }}>
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
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <Avatar name={user.name} role={user.role} />

                                                <div>
                                                    <strong
                                                        style={{
                                                            color: 'var(--text-main)',
                                                            fontSize: '0.9rem',
                                                        }}
                                                    >
                                                        {user.name || 'Usuário sem nome'}
                                                    </strong>

                                                    <div
                                                        style={{
                                                            color: 'var(--text-muted)',
                                                            fontSize: '0.72rem',
                                                        }}
                                                    >
                                                        ID #{user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                {user.username}
                                            </span>
                                        </td>

                                        <td>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                                {user.email || 'Sem e-mail'}
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                                {user.phone || 'Sem telefone'}
                                            </div>
                                        </td>

                                        <td>
                                            <RoleBadge role={user.role} />
                                        </td>

                                        <td>
                                            {user.role === 'pastor' ? (
                                                <StatusBadge label="Administrador" color="#2563EB" icon="🛡️" />
                                            ) : user.provisional_access ? (
                                                <StatusBadge label="Liberado" color="#10B981" icon="✅" />
                                            ) : (
                                                <StatusBadge label="Bloqueado" color="#EF4444" icon="🔒" />
                                            )}
                                        </td>

                                        <td>
                                            {user.role === 'obreiro' ? (
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
                                                        title={user.provisional_access ? 'Bloquear acesso' : 'Liberar acesso'}
                                                        disabled={updatingId === user.id}
                                                        onClick={() => toggleAccess(user.id, user.provisional_access)}
                                                    >
                                                        {user.provisional_access ? '🔒' : '🔓'}
                                                    </button>

                                                    <button
                                                        className="btn-icon delete"
                                                        title="Excluir"
                                                        disabled={updatingId === user.id}
                                                        onClick={() => deleteUser(user)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                                    Acesso principal do Pastor
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <UserModal
                    mode={modalMode}
                    formData={formData}
                    saving={saving}
                    onChange={setFormData}
                    onClose={closeModal}
                    onSubmit={handleSaveUser}
                />
            )}

            {showPasswordModal && selectedUser && (
                <PasswordModal
                    user={selectedUser}
                    password={newPassword}
                    saving={saving}
                    onPasswordChange={setNewPassword}
                    onClose={closePasswordModal}
                    onSubmit={handleResetPassword}
                />
            )}
        </div>
    )
}

function UserModal({
    mode,
    formData,
    saving,
    onChange,
    onClose,
    onSubmit,
}: {
    mode: 'create' | 'edit'
    formData: UserForm
    saving: boolean
    onChange: (data: UserForm) => void
    onClose: () => void
    onSubmit: (e: Event) => void
}) {
    return (
        <div style={modalOverlayStyle}>
            <div className="modern-card" style={modalCardStyle}>
                <div className="modern-card-header">
                    <div>
                        <h2 className="modern-card-title">
                            {mode === 'create' ? 'Novo Obreiro' : 'Editar Obreiro'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                            O acesso criado será de obreiro. Ele não terá permissão de CRUD administrativo.
                        </p>
                    </div>

                    <button className="btn-icon" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <label>
                        Nome completo *
                        <input
                            type="text"
                            value={formData.name}
                            onInput={e => onChange({ ...formData, name: e.currentTarget.value })}
                            required
                        />
                    </label>

                    <label>
                        Login *
                        <input
                            type="text"
                            value={formData.username}
                            onInput={e => onChange({ ...formData, username: e.currentTarget.value })}
                            required
                        />
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <label>
                            E-mail
                            <input
                                type="email"
                                value={formData.email}
                                onInput={e => onChange({ ...formData, email: e.currentTarget.value })}
                            />
                        </label>

                        <label>
                            Telefone / WhatsApp
                            <input
                                type="text"
                                value={formData.phone}
                                onInput={e => onChange({ ...formData, phone: e.currentTarget.value })}
                            />
                        </label>
                    </div>

                    {mode === 'create' && (
                        <label>
                            Senha inicial *
                            <input
                                type="password"
                                value={formData.password}
                                minLength={6}
                                onInput={e => onChange({ ...formData, password: e.currentTarget.value })}
                                required
                            />
                        </label>
                    )}

                    <div
                        style={{
                            padding: '1rem',
                            borderRadius: 16,
                            background: 'rgba(16,185,129,0.10)',
                            border: '1px solid rgba(16,185,129,0.28)',
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                        }}
                    >
                        ✅ Este usuário será cadastrado como <strong>Obreiro</strong>. Ele não poderá criar,
                        editar ou excluir usuários. Somente o Pastor Administrador terá esse CRUD.
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>

                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? 'Salvando...' : mode === 'create' ? 'Criar Obreiro' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function PasswordModal({
    user,
    password,
    saving,
    onPasswordChange,
    onClose,
    onSubmit,
}: {
    user: User
    password: string
    saving: boolean
    onPasswordChange: (value: string) => void
    onClose: () => void
    onSubmit: (e: Event) => void
}) {
    return (
        <div style={modalOverlayStyle}>
            <div className="modern-card" style={modalCardStyle}>
                <div className="modern-card-header">
                    <div>
                        <h2 className="modern-card-title">Resetar Senha</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                            Defina uma nova senha para {user.name}.
                        </p>
                    </div>

                    <button className="btn-icon" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <label>
                        Nova senha *
                        <input
                            type="password"
                            value={password}
                            minLength={6}
                            onInput={e => onPasswordChange(e.currentTarget.value)}
                            required
                        />
                    </label>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>

                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? 'Salvando...' : 'Resetar Senha'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function SummaryCard({
    title,
    value,
    color,
    icon,
}: {
    title: string
    value: number
    color: string
    icon: string
}) {
    return (
        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div
                style={{
                    position: 'absolute',
                    right: -20,
                    top: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: color,
                    opacity: 0.12,
                    filter: 'blur(22px)',
                }}
            />

            <div
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 16,
                    background: `${color}20`,
                    border: `1px solid ${color}55`,
                    color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>

            <div>
                <h3 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)' }}>
                    {value}
                </h3>

                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {title}
                </p>
            </div>
        </div>
    )
}

function Avatar({ name, role }: { name: string; role: string }) {
    const initials = (name || 'US')
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase()

    const bg =
        role === 'pastor'
            ? 'linear-gradient(135deg,#7C3AED,#2563EB)'
            : 'linear-gradient(135deg,#10B981,#2563EB)'

    return (
        <div
            style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '0.8rem',
                boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    )
}

function RoleBadge({ role }: { role: string }) {
    if (role === 'pastor') {
        return <StatusBadge label="Pastor Admin" color="#8B5CF6" icon="⛪" />
    }

    return <StatusBadge label="Obreiro" color="#10B981" icon="🤝" />
}

function StatusBadge({
    label,
    color,
    icon,
}: {
    label: string
    color: string
    icon: string
}) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.25rem 0.65rem',
                borderRadius: 999,
                background: `${color}20`,
                border: `1px solid ${color}55`,
                color,
                fontSize: '0.72rem',
                fontWeight: 900,
                whiteSpace: 'nowrap',
            }}
        >
            {icon} {label}
        </span>
    )
}

function LoadingState() {
    return (
        <div style={{ display: 'grid', gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 62, borderRadius: 16 }} />
            ))}
        </div>
    )
}

function EmptyState() {
    return (
        <div
            style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.12)',
            }}
        >
            <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>🤝</div>

            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
                Nenhum usuário encontrado
            </h3>

            <p
                style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    margin: '0.5rem auto 0',
                    maxWidth: 460,
                }}
            >
                Quando obreiros forem cadastrados, eles aparecerão nesta área para gerenciamento.
            </p>
        </div>
    )
}

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
    const isSuccess = type === 'success'

    return (
        <div
            style={{
                padding: '0.9rem 1rem',
                borderRadius: 16,
                background: isSuccess ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)',
                border: isSuccess
                    ? '1px solid rgba(16,185,129,0.3)'
                    : '1px solid rgba(239,68,68,0.3)',
                color: isSuccess ? '#34D399' : '#F87171',
                fontWeight: 800,
                fontSize: '0.85rem',
                marginBottom: '1rem',
            }}
        >
            {isSuccess ? '✅' : '⚠️'} {message}
        </div>
    )
}

const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.68)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '1rem',
} as any

const modalCardStyle = {
    width: '560px',
    maxWidth: '96%',
    maxHeight: '92vh',
    overflowY: 'auto',
} as any