import { useState, useEffect } from 'preact/hooks'

interface WorkerMessage {
  id: number
  sender_id: number
  recipient_id: number
  subject: string
  message: string
  msg_type: string
  is_read: boolean
  created_at: string
}

const typeMap: Record<string, { label: string; color: string; icon: string }> = {
  URGENTE: { label: 'Urgente', color: '#EF4444', icon: '🚨' },
  ENFERMIDADE: { label: 'Enfermidade', color: '#F59E0B', icon: '🤒' },
  ORACAO: { label: 'Oração', color: '#10B981', icon: '🙏' },
  AJUDA: { label: 'Ajuda', color: '#3B82F6', icon: '🤝' },
  VISITA: { label: 'Visita', color: '#8B5CF6', icon: '🏠' },
}

export function WorkerMessages() {
  const [messages, setMessages] = useState<WorkerMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    recipient_id: 0,
    subject: '',
    message: '',
    msg_type: 'VISITA',
  })

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)

    try {
      const resp = await fetch('/api/team/messages')
      const data = await resp.json()
      setMessages(data || [])
    } catch (err) {
      setError('Não foi possível carregar os recados internos.')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: Event) => {
    e.preventDefault()
    setSending(true)
    setError('')
    setSuccess('')

    try {
      const resp = await fetch('/api/team/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (resp.ok) {
        setShowModal(false)
        setFormData({
          recipient_id: 0,
          subject: '',
          message: '',
          msg_type: 'VISITA',
        })

        setSuccess('Recado enviado com sucesso.')
        fetchMessages()

        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Não foi possível enviar o recado.')
      }
    } catch (err) {
      setError('Erro de conexão ao enviar recado.')
    } finally {
      setSending(false)
    }
  }

  const unreadCount = messages.filter(msg => !msg.is_read).length
  const urgentCount = messages.filter(msg => msg.msg_type === 'URGENTE').length
  const prayerCount = messages.filter(msg => msg.msg_type === 'ORACAO').length

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
            Comunicação da equipe
          </span>

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

      {success && <Alert type="success" message={success} />}
      {error && <Alert type="error" message={error} />}

      <div
        className="stats-grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '1.5rem',
        }}
      >
        <SummaryCard title="Total de Recados" value={messages.length} color="#8B5CF6" icon="📨" />
        <SummaryCard title="Novos Recados" value={unreadCount} color="#10B981" icon="🟢" />
        <SummaryCard title="Urgentes" value={urgentCount} color="#EF4444" icon="🚨" />
        <SummaryCard title="Pedidos de Oração" value={prayerCount} color="#F59E0B" icon="🙏" />
      </div>

      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">Histórico de Recados</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
              Acompanhe as informações enviadas pela equipe da igreja.
            </p>
          </div>

          <button className="btn-help" onClick={fetchMessages}>
            Atualizar
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 86, borderRadius: 18 }}
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <EmptyState onCreate={() => setShowModal(true)} />
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {messages.map(msg => (
              <MessageCard key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.68)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            className="modern-card"
            style={{
              width: 520,
              maxWidth: '100%',
              margin: 0,
              boxShadow: '0 30px 90px rgba(0,0,0,0.55)',
            }}
          >
            <div className="modern-card-header">
              <div>
                <h2 className="modern-card-title">Novo Recado Interno</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                  Envie uma informação importante para o pastor.
                </p>
              </div>

              <button
                type="button"
                className="btn-icon"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSend}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <label>
                Tipo de Recado
                <select
                  value={formData.msg_type}
                  onChange={e =>
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
                Assunto
                <input
                  type="text"
                  placeholder="Ex: Membro precisa de visita"
                  value={formData.subject}
                  onInput={e =>
                    setFormData({ ...formData, subject: e.currentTarget.value })
                  }
                  required
                />
              </label>

              <label>
                Mensagem Detalhada
                <textarea
                  style={{ height: 130, resize: 'vertical' }}
                  placeholder="Descreva a situação com clareza para o pastor..."
                  value={formData.message}
                  onInput={e =>
                    setFormData({ ...formData, message: e.currentTarget.value })
                  }
                  required
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={sending}
                >
                  {sending ? 'Enviando...' : 'Enviar Recado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

function MessageCard({ msg }: { msg: WorkerMessage }) {
  const type = typeMap[msg.msg_type] || typeMap.VISITA

  return (
    <div
      style={{
        position: 'relative',
        padding: '1rem 1.1rem',
        borderRadius: 18,
        background: msg.is_read
          ? 'rgba(255,255,255,0.03)'
          : 'linear-gradient(135deg, rgba(124,58,237,0.13), rgba(17,24,39,0.88))',
        border: msg.is_read
          ? '1px solid var(--border)'
          : '1px solid rgba(124,58,237,0.35)',
        boxShadow: msg.is_read
          ? 'none'
          : '0 14px 34px rgba(124,58,237,0.14)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: 8,
            }}
          >
            <Badge color={type.color} icon={type.icon} label={type.label} />

            {!msg.is_read && (
              <span className="badge active">
                Novo
              </span>
            )}

            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
              }}
            >
              {new Date(msg.created_at).toLocaleString('pt-BR')}
            </span>
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--text-main)',
            }}
          >
            {msg.subject || 'Recado sem assunto'}
          </h3>

          <p
            style={{
              margin: '0.45rem 0 0',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              fontSize: '0.9rem',
            }}
          >
            {msg.message}
          </p>
        </div>
      </div>
    </div>
  )
}

function Badge({ color, icon, label }: { color: string; icon: string; label: string }) {
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
      }}
    >
      {icon} {label}
    </span>
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

function EmptyState({ onCreate }: { onCreate: () => void }) {
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
      <div style={{ fontSize: '2.6rem', marginBottom: '1rem' }}>📝</div>

      <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
        Nenhum recado registrado ainda
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          margin: '0.5rem auto 1.4rem',
          maxWidth: 420,
        }}
      >
        Use esta área para que obreiros enviem informações importantes ao pastor,
        como visitas, enfermidades, pedidos de oração e alertas.
      </p>

      <button className="btn-primary" onClick={onCreate}>
        Criar primeiro recado
      </button>
    </div>
  )
}