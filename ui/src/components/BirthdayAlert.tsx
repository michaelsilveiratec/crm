import { useState, useEffect } from 'preact/hooks'

interface Birthday {
  id: number
  name: string
  whatsapp: string
  birth_date: string
}

export function BirthdayAlert() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBirthdays()
  }, [])

  const fetchBirthdays = async () => {
    setLoading(true)
    setError('')

    try {
      const resp = await fetch('/api/pastor/birthdays')

      if (!resp.ok) {
        throw new Error('Erro ao obter aniversariantes.')
      }

      const data = await resp.json()
      setBirthdays(data || [])
    } catch (e: any) {
      setError(e.message || 'Não foi possível carregar aniversariantes.')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (memberId: number, name: string) => {
    setSendingId(memberId)
    setError('')

    const template = `Olá, ${name}! 🎉

A Igreja da Graça deseja a você um feliz aniversário!

Que o Senhor te abençoe, te guarde, ilumine seus caminhos e derrame sobre sua vida graça, paz, saúde e muitas vitórias.

“Ensina-nos a contar os nossos dias, de tal maneira que alcancemos coração sábio.” Salmo 90:12`

    try {
      const resp = await fetch('/api/pastor/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId, template }),
      })

      if (!resp.ok) {
        throw new Error('Falha ao gerar link do WhatsApp.')
      }

      const { url } = await resp.json()
      window.open(url, '_blank')
    } catch (e: any) {
      setError(e.message || 'Erro ao enviar mensagem.')
    } finally {
      setSendingId(null)
    }
  }

  return (
    <section className="modern-card" style={{ marginBottom: '1.5rem' }}>
      <div className="modern-card-header">
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
            Cuidado pastoral
          </span>

          <h2 className="modern-card-title">🎂 Aniversariantes do Dia</h2>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginTop: 4,
            }}
          >
            Envie uma mensagem de carinho e bênção para quem está completando
            mais um ano de vida.
          </p>
        </div>

        {!loading && birthdays.length > 0 && (
          <div
            style={{
              minWidth: 56,
              height: 56,
              borderRadius: 18,
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.35)',
              color: '#FCD34D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 900,
            }}
          >
            {birthdays.length}
          </div>
        )}
      </div>

      {error && <Alert message={error} />}

      {loading ? (
        <LoadingState />
      ) : birthdays.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {birthdays.map(birthday => (
            <BirthdayCard
              key={birthday.id}
              birthday={birthday}
              sending={sendingId === birthday.id}
              onSend={() => sendMessage(birthday.id, birthday.name)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function BirthdayCard({
  birthday,
  sending,
  onSend,
}: {
  birthday: Birthday
  sending: boolean
  onSend: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        borderRadius: 18,
        background:
          'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(17,24,39,0.88))',
        border: '1px solid rgba(245,158,11,0.24)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <Avatar name={birthday.name} />

        <div style={{ minWidth: 0 }}>
          <strong
            style={{
              display: 'block',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {birthday.name}
          </strong>

          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
            }}
          >
            {formatDate(birthday.birth_date)} · {formatPhone(birthday.whatsapp)}
          </span>
        </div>
      </div>

      <button
        className="btn-primary"
        type="button"
        onClick={onSend}
        disabled={sending}
        style={{
          whiteSpace: 'nowrap',
          background: 'linear-gradient(135deg,#10B981,#059669)',
        }}
      >
        {sending ? 'Abrindo...' : 'Enviar WhatsApp'}
      </button>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = (name || 'AN')
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#F59E0B,#EC4899)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 900,
        fontSize: '0.82rem',
        boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

function LoadingState() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: 72,
            borderRadius: 18,
          }}
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
        padding: '2.5rem 1rem',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.03)',
        border: '1px dashed rgba(255,255,255,0.12)',
      }}
    >
      <div style={{ fontSize: '2.4rem', marginBottom: '0.8rem' }}>🎂</div>

      <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
        Nenhum aniversariante hoje
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          margin: '0.5rem auto 0',
          maxWidth: 420,
        }}
      >
        Quando houver aniversariantes cadastrados para o dia, eles aparecerão
        aqui para envio rápido de mensagem pastoral.
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

function formatDate(date: string) {
  if (!date) return 'Data não informada'

  const parsed = new Date(`${date}T00:00:00`)

  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('pt-BR')
}

function formatPhone(phone: string) {
  if (!phone) return 'Sem WhatsApp'

  const digits = phone.replace(/\D/g, '')

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }

  return phone
}