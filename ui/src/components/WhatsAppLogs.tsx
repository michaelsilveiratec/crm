import { useState, useEffect } from 'preact/hooks'

interface WhatsAppLog {
  phone: string
  message: string
  status: string
  error_msg: string
  sent_at: string
}

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  sent: { label: 'Enviado', color: '#10B981', icon: '✅' },
  simulated: { label: 'Simulado', color: '#8B5CF6', icon: '🧪' },
  error: { label: 'Erro', color: '#EF4444', icon: '⚠️' },
  pending: { label: 'Pendente', color: '#F59E0B', icon: '⏳' },
}

export function WhatsAppLogs() {
  const [logs, setLogs] = useState<WhatsAppLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/pastor/whatsapp/logs')
      const data = await res.json()
      setLogs(data || [])
    } catch (err) {
      setError('Não foi possível carregar o histórico de envios.')
    } finally {
      setLoading(false)
    }
  }

  const totalSent = logs.filter(log => log.status === 'sent').length
  const totalSimulated = logs.filter(log => log.status === 'simulated').length
  const totalErrors = logs.filter(log => log.status === 'error').length
  const totalPending = logs.filter(log => log.status === 'pending').length

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <span
            style={{
              display: 'inline-flex',
              padding: '0.35rem 0.75rem',
              borderRadius: 999,
              background: 'rgba(16,185,129,0.14)',
              border: '1px solid rgba(16,185,129,0.35)',
              color: '#34D399',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
            }}
          >
            WhatsApp Pastoral
          </span>

          <h1>📜 Histórico de Envios</h1>

          <p>
            Acompanhe mensagens automáticas e manuais enviadas para visitantes,
            membros, aniversariantes e grupos da igreja.
          </p>
        </div>

        <button className="btn-help" onClick={fetchLogs}>
          Atualizar
        </button>
      </div>

      {error && <Alert message={error} />}

      <div
        className="stats-grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '1.5rem',
        }}
      >
        <SummaryCard title="Total de Envios" value={logs.length} color="#8B5CF6" icon="📨" />
        <SummaryCard title="Enviadas" value={totalSent} color="#10B981" icon="✅" />
        <SummaryCard title="Simuladas" value={totalSimulated} color="#8B5CF6" icon="🧪" />
        <SummaryCard title="Erros" value={totalErrors} color="#EF4444" icon="⚠️" />
        {totalPending > 0 && (
          <SummaryCard title="Pendentes" value={totalPending} color="#F59E0B" icon="⏳" />
        )}
      </div>

      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">Relatório de Mensagens</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
              Veja o status, telefone, conteúdo e possíveis erros de envio.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : logs.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ overflowX: 'auto' }}>
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
                {logs.map((log, i) => {
                  const status = statusMap[log.status] || {
                    label: log.status || 'Desconhecido',
                    color: '#6B7280',
                    icon: '•',
                  }

                  return (
                    <tr key={i}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {log.sent_at
                          ? new Date(log.sent_at).toLocaleString('pt-BR')
                          : '-'}
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>
                            {formatPhone(log.phone)}
                          </strong>

                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                            WhatsApp
                          </span>
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            maxWidth: 360,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                          }}
                          title={log.message}
                        >
                          {log.message || 'Mensagem não informada'}
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
                        {log.error_msg ? (
                          <span
                            style={{
                              color: '#F87171',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                            }}
                          >
                            {log.error_msg}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-sub)', fontSize: '0.78rem' }}>
                            Sem erro
                          </span>
                        )}
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
  value: number
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
            fontSize: '1.65rem',
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
          style={{ height: 58, borderRadius: 16 }}
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
      <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>💬</div>

      <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
        Nenhum envio registrado ainda
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          margin: '0.5rem auto 0',
          maxWidth: 460,
        }}
      >
        Assim que mensagens forem enviadas pelo WhatsApp, o histórico aparecerá
        aqui com status, telefone, horário e detalhes do envio.
      </p>
    </div>
  )
}

function Alert({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '0.9rem 1rem',
        borderRadius: 16,
        background: 'rgba(239,68,68,0.14)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#F87171',
        fontWeight: 800,
        fontSize: '0.85rem',
        marginBottom: '1rem',
      }}
    >
      ⚠️ {message}
    </div>
  )
}

function formatPhone(phone: string) {
  if (!phone) return '-'

  const digits = phone.replace(/\D/g, '')

  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  return phone
}