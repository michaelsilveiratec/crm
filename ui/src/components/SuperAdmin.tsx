import { useState, useEffect } from 'preact/hooks'

interface Church {
  id: number
  name: string
  slug: string
  email: string
  phone: string
  plan: string
  status: string
  created_at: string
}

interface Stats {
  total_churches: number
  total_users: number
  total_members: number
}

const planMap: Record<string, { label: string; color: string }> = {
  essencial: { label: 'Essencial', color: '#2563EB' },
  pastoreio: { label: 'Pastoreio', color: '#8B5CF6' },
  avivamento: { label: 'Avivamento', color: '#F59E0B' },
  enterprise: { label: 'Enterprise', color: '#10B981' },
}

export function SuperAdmin() {
  const [churches, setChurches] = useState<Church[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      const [chResp, stResp] = await Promise.all([
        fetch('/api/superadmin/churches'),
        fetch('/api/superadmin/stats'),
      ])

      if (!chResp.ok || !stResp.ok) {
        throw new Error('Erro ao carregar dados do Super Admin.')
      }

      setChurches(await chResp.json())
      setStats(await stResp.json())
    } catch (err: any) {
      setError(err.message || 'Não foi possível carregar os dados.')
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active'

    const confirmMsg =
      newStatus === 'blocked'
        ? 'Deseja realmente bloquear esta igreja? O pastor e os obreiros perderão o acesso.'
        : 'Deseja realmente ativar esta igreja novamente?'

    if (!confirm(confirmMsg)) return

    setUpdatingId(id)
    setError('')
    setSuccess('')

    try {
      const resp = await fetch(`/api/superadmin/churches/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!resp.ok) {
        throw new Error('Erro ao atualizar status da igreja.')
      }

      setSuccess(
        newStatus === 'blocked'
          ? 'Igreja bloqueada com sucesso.'
          : 'Igreja ativada com sucesso.'
      )

      await fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Não foi possível atualizar o status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const activeChurches = churches.filter(ch => ch.status === 'active').length
  const blockedChurches = churches.filter(ch => ch.status !== 'active').length
  const monthlyEstimate = churches.reduce((total, ch) => {
    const plan = (ch.plan || '').toLowerCase()
    if (plan === 'essencial') return total + 49
    if (plan === 'pastoreio') return total + 97
    if (plan === 'avivamento') return total + 197
    if (plan === 'enterprise') return total + 297
    return total
  }, 0)

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <span
            style={{
              display: 'inline-flex',
              padding: '0.35rem 0.75rem',
              borderRadius: 999,
              background: 'rgba(245,158,11,0.14)',
              border: '1px solid rgba(245,158,11,0.35)',
              color: '#FCD34D',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
            }}
          >
            Plataforma SaaS Global
          </span>

          <h1>👑 Painel Super Admin</h1>

          <p>
            Gerencie igrejas, assinaturas, bloqueios, usuários e crescimento da
            plataforma CRM Bom Samaritano.
          </p>
        </div>

        <button className="btn-help" onClick={fetchData}>
          Atualizar
        </button>
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
          value={`R$ ${monthlyEstimate.toLocaleString('pt-BR')}`}
          color="#10B981"
          icon="💰"
        />
      </div>

      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">Igrejas e Assinaturas</h2>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                marginTop: 4,
              }}
            >
              Controle o status das igrejas cadastradas, planos e acesso à
              plataforma.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : churches.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ overflowX: 'auto' }}>
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
                {churches.map(church => {
                  const plan = planMap[(church.plan || '').toLowerCase()] || {
                    label: church.plan || 'Sem plano',
                    color: '#6B7280',
                  }

                  const isActive = church.status === 'active'

                  return (
                    <tr key={church.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={church.name} />

                          <div>
                            <strong
                              style={{
                                color: 'var(--text-main)',
                                fontSize: '0.9rem',
                              }}
                            >
                              {church.name || 'Igreja sem nome'}
                            </strong>

                            <div
                              style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.72rem',
                              }}
                            >
                              ID #{church.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <code
                          style={{
                            fontSize: '0.78rem',
                            color: '#C4B5FD',
                            background: 'rgba(124,58,237,0.12)',
                            padding: '0.25rem 0.55rem',
                            borderRadius: 8,
                            border: '1px solid rgba(124,58,237,0.25)',
                          }}
                        >
                          {church.slug}
                        </code>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>
                            {church.email || 'Sem e-mail'}
                          </span>

                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                            {church.phone || 'Sem telefone'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <StatusBadge label={plan.label} color={plan.color} icon="💼" />
                      </td>

                      <td>
                        {isActive ? (
                          <StatusBadge label="Ativa" color="#10B981" icon="✅" />
                        ) : (
                          <StatusBadge label="Bloqueada" color="#EF4444" icon="🔒" />
                        )}
                      </td>

                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {church.created_at
                          ? new Date(church.created_at).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>

                      <td>
                        <div className="action-btns">
                          <button
                            type="button"
                            onClick={() => toggleStatus(church.id, church.status)}
                            disabled={updatingId === church.id}
                            style={{
                              padding: '0.45rem 0.75rem',
                              borderRadius: 10,
                              border: isActive
                                ? '1px solid rgba(239,68,68,0.35)'
                                : '1px solid rgba(16,185,129,0.35)',
                              background: isActive
                                ? 'rgba(239,68,68,0.14)'
                                : 'rgba(16,185,129,0.14)',
                              color: isActive ? '#F87171' : '#34D399',
                              fontSize: '0.75rem',
                              fontWeight: 900,
                              cursor: updatingId === church.id ? 'not-allowed' : 'pointer',
                              opacity: updatingId === church.id ? 0.65 : 1,
                            }}
                          >
                            {updatingId === church.id
                              ? 'Atualizando...'
                              : isActive
                                ? 'Bloquear'
                                : 'Ativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
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
  value: number | string
  color: string
  icon: string
}) {
  return (
    <div
      className="stat-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
        <h3
          style={{
            margin: 0,
            fontSize: '1.55rem',
            fontWeight: 900,
            color: 'var(--text-main)',
          }}
        >
          {value}
        </h3>

        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          {title}
        </p>
      </div>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = (name || 'IG')
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
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
        <div
          key={i}
          className="skeleton"
          style={{ height: 62, borderRadius: 16 }}
        />
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
      <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>⛪</div>

      <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
        Nenhuma igreja cadastrada
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          margin: '0.5rem auto 0',
          maxWidth: 460,
        }}
      >
        Quando novas igrejas criarem conta na plataforma, elas aparecerão nesta
        área para controle de planos, acessos e bloqueios.
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