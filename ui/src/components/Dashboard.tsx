import { useState, useEffect } from 'preact/hooks'
import { LineChart, DonutChart, MiniBar, Sk } from './Charts'

interface Stats {
  total_members: number
  new_members_month: number
  birthdays_month: number
  birthdays_today: any[]
  growth_data: { month: string; count: number }[]
}

interface Visit {
  id: number
  status: string
  carried_holy_communion?: boolean
}

interface Member {
  id: number
  is_visitor: boolean
  name: string
  birth_date: string
  whatsapp: string
  spiritual_status?: string
}

interface Activity {
  id: number
  user_name: string
  action: string
  details: string
  created_at: string
}

interface Msg {
  id: number
  sender_id: number
  subject: string
  message: string
  msg_type: string
  created_at: string
}

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace('.', ',')}k` : String(n)

const colors = ['#7C3AED', '#2563EB', '#10B981', '#F59E0B', '#EC4899', '#EF4444']

export function Dashboard({
  onNavigate,
  userName,
  userRole,
}: {
  onNavigate: (tab: string) => void
  userName?: string
  userRole?: string
}) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  const safeJson = async (url: string, fallback: any) => {
    try {
      const resp = await fetch(url)
      if (!resp.ok) return fallback
      return await resp.json()
    } catch {
      return fallback
    }
  }

  const fetchDashboard = async () => {
    setLoading(true)
    setError('')

    try {
      const [s, v, m, a, msg] = await Promise.all([
        safeJson('/api/pastor/dashboard-stats', null),
        safeJson('/api/pastor/visits', []),
        safeJson('/api/pastor/members', []),
        safeJson('/api/pastor/activities', []),
        safeJson('/api/team/messages', []),
      ])

      setStats(s)
      setVisits(v || [])
      setMembers(m || [])
      setActivities(a || [])
      setMsgs(msg || [])

      if (!s) {
        setError('Algumas informações do dashboard não foram carregadas.')
      }
    } finally {
      setLoading(false)
    }
  }

  const visitors = members.filter(m => m.is_visitor).length
  const totalMembers = stats?.total_members ?? members.filter(m => !m.is_visitor).length
  const realizadas = visits.filter(v => v.status === 'Realizada').length
  const agendadas = visits.filter(v => v.status === 'Agendada').length
  const pendentes = visits.filter(v => ['Pendente', 'Reagendada'].includes(v.status)).length
  const santaCeia = visits.filter(v => v.carried_holy_communion).length
  const oracoes = msgs.filter(m => ['ORACAO', 'URGENTE', 'AJUDA', 'ENFERMIDADE'].includes(m.msg_type)).length
  const batizados = members.filter(m => m.spiritual_status === 'BATIZADO').length

  const visitStatus = [
    { label: 'Agendadas', value: agendadas, color: '#8B5CF6' },
    { label: 'Realizadas', value: realizadas, color: '#10B981' },
    { label: 'Pendentes', value: pendentes, color: '#F59E0B' },
    { label: 'Canceladas', value: visits.filter(v => v.status === 'Cancelada').length, color: '#EF4444' },
  ]

  const groupData = [
    { label: 'Visitantes', value: visitors, color: '#8B5CF6' },
    { label: 'Membros', value: totalMembers, color: '#10B981' },
    { label: 'Batizados', value: batizados, color: '#06B6D4' },
    { label: 'Pedidos de oração', value: oracoes, color: '#F59E0B' },
    { label: 'Visitas', value: visits.length, color: '#2563EB' },
  ]

  const maxGroup = Math.max(...groupData.map(g => g.value), 1)

  const upcoming = getUpcomingBirthdays(members)
  const prayerMsgs = msgs
    .filter(m => ['ORACAO', 'URGENTE', 'AJUDA', 'ENFERMIDADE'].includes(m.msg_type))
    .slice(0, 5)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 292px',
        minHeight: '100vh',
      }}
    >
      <div style={{ overflowY: 'auto', padding: '1.5rem 2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
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
              Painel pastoral
            </span>

            <h1
              style={{
                fontSize: '1.65rem',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                margin: 0,
                background: 'linear-gradient(135deg,#fff 40%,#9CA3AF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Bem-vindo, {userRole === 'pastor' ? `Pr. ${userName || ''}` : userName || 'usuário'} 👋
            </h1>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
                margin: '4px 0 0',
              }}
            >
              Que Deus abençoe o seu dia e o cuidado com as pessoas da igreja.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <QuickBtn icon="👤" label="Novo Visitante" color="#8B5CF6" onClick={() => onNavigate('visitantes')} />
            <QuickBtn icon="🏠" label="Nova Visita" color="#10B981" onClick={() => onNavigate('visitas')} />
            <QuickBtn icon="✉️" label="Mensagem" color="#3B82F6" onClick={() => onNavigate('mensagens')} />
            <QuickBtn icon="🔄" label="Atualizar" color="#F59E0B" onClick={fetchDashboard} />
          </div>
        </div>

        {error && <Alert message={error} />}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            marginBottom: '1.5rem',
          }}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
          ) : (
            <>
              <StatCard icon="👥" label="Membros" value={totalMembers} sub={`+${stats?.new_members_month ?? 0} este mês`} color="#2563EB" />
              <StatCard icon="🚶" label="Visitantes" value={visitors} sub="Cadastrados" color="#8B5CF6" />
              <StatCard icon="🎂" label="Aniversariantes" value={stats?.birthdays_month ?? upcoming.length} sub="Este mês" color="#F59E0B" />
              <StatCard icon="🏠" label="Visitas" value={realizadas} sub={`${agendadas} agendadas`} color="#10B981" />
              <StatCard icon="🙏" label="Oração" value={oracoes} sub="Em acompanhamento" color="#EF4444" />
              <StatCard icon="🍇" label="Santa Ceia" value={santaCeia} sub="Nas casas" color="#EC4899" />
            </>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr) minmax(260px, 1fr)',
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div className="modern-card" style={{ margin: 0 }}>
            <div className="modern-card-header">
              <div>
                <h2 className="modern-card-title">📈 Crescimento da Igreja</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>
                  Evolução dos últimos meses
                </p>
              </div>
            </div>

            {loading ? <Sk h="190px" r="16px" /> : <LineChart data={stats?.growth_data ?? []} />}
          </div>

          <div className="modern-card" style={{ margin: 0 }}>
            <h2 className="modern-card-title" style={{ marginBottom: 12 }}>
              🎯 Visão Geral
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DonutChart
                segments={[
                  { label: 'Membros', value: totalMembers, color: '#10B981' },
                  { label: 'Visitantes', value: visitors, color: '#8B5CF6' },
                  { label: 'Oração', value: oracoes, color: '#F59E0B' },
                ]}
                total={Math.max(totalMembers + visitors + oracoes, 1)}
                label="Pessoas"
              />
            </div>

            <Legend
              items={[
                { label: 'Membros', value: totalMembers, color: '#10B981' },
                { label: 'Visitantes', value: visitors, color: '#8B5CF6' },
                { label: 'Oração', value: oracoes, color: '#F59E0B' },
              ]}
            />
          </div>

          <div className="modern-card" style={{ margin: 0 }}>
            <h2 className="modern-card-title" style={{ marginBottom: 14 }}>
              📋 Resumo do Mês
            </h2>

            {[
              { label: 'Novos membros', value: stats?.new_members_month ?? 0, color: '#10B981' },
              { label: 'Novos visitantes', value: visitors, color: '#8B5CF6' },
              { label: 'Visitas realizadas', value: realizadas, color: '#3B82F6' },
              { label: 'Batismos', value: batizados, color: '#06B6D4' },
              { label: 'Santa Ceia em casa', value: santaCeia, color: '#EC4899' },
            ].map(item => (
              <SummaryLine key={item.label} {...item} />
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 1.3fr) minmax(260px, 1.2fr) minmax(250px, 1fr) minmax(260px, 1.2fr)',
            gap: 12,
          }}
        >
          <div className="modern-card" style={{ margin: 0 }}>
            <h2 className="modern-card-title" style={{ marginBottom: 12 }}>
              ⚡ Atividade Recente
            </h2>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <ActivitySkeleton key={i} />)
            ) : activities.length === 0 ? (
              <EmptyMini text="Sem atividades recentes." />
            ) : (
              activities.slice(0, 5).map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>

          <div className="modern-card" style={{ margin: 0 }}>
            <h2 className="modern-card-title" style={{ marginBottom: 14 }}>
              👥 Indicadores Pastorais
            </h2>

            {groupData.map(g => (
              <MiniBar key={g.label} label={g.label} value={g.value} max={maxGroup} color={g.color} />
            ))}
          </div>

          <div className="modern-card" style={{ margin: 0 }}>
            <h2 className="modern-card-title" style={{ marginBottom: 10 }}>
              🏠 Visitas
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
              <DonutChart segments={visitStatus} total={Math.max(visits.length, 1)} label="Total" />
            </div>

            <Legend items={visitStatus} total={visits.length} />
          </div>

          <div className="modern-card" style={{ margin: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <h2 className="modern-card-title">🙏 Pedidos de Oração</h2>

              <button
                className="btn-help"
                style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                onClick={() => onNavigate('recados')}
              >
                Ver todos
              </button>
            </div>

            {prayerMsgs.length === 0 ? (
              <EmptyMini text="Nenhum pedido em aberto." />
            ) : (
              prayerMsgs.map(m => <PrayerItem key={m.id} msg={m} />)
            )}
          </div>
        </div>
      </div>

      <RightPanel
        loading={loading}
        upcoming={upcoming}
        msgs={msgs}
        onNavigate={onNavigate}
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 90,
          height: 90,
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
        <div
          style={{
            fontSize: '1.65rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'var(--text-main)',
          }}
        >
          {typeof value === 'number' ? fmt(value) : value}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
          {label}
        </div>

        {sub && (
          <div style={{ fontSize: '0.7rem', color, fontWeight: 700, marginTop: 3 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

function QuickBtn({
  icon,
  label,
  color,
  onClick,
}: {
  icon: string
  label: string
  color: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0.6rem 1rem',
        borderRadius: 12,
        border: `1px solid ${color}44`,
        background: `${color}18`,
        color,
        fontWeight: 800,
        fontSize: '0.8rem',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  )
}

function PriorityBadge({ type }: { type: string }) {
  const map: Record<string, [string, string]> = {
    URGENTE: ['#EF4444', 'Urgente'],
    AJUDA: ['#F59E0B', 'Ajuda'],
    ORACAO: ['#10B981', 'Oração'],
    ENFERMIDADE: ['#F59E0B', 'Enfermidade'],
    VISITA: ['#3B82F6', 'Visita'],
  }

  const [color, label] = map[type] || ['#6B7280', type || 'Info']

  return (
    <span
      style={{
        background: `${color}20`,
        color,
        border: `1px solid ${color}40`,
        borderRadius: 999,
        padding: '2px 8px',
        fontSize: '0.68rem',
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function Legend({
  items,
  total,
}: {
  items: { label: string; value: number; color: string }[]
  total?: number
}) {
  return (
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
      {items.map(item => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.72rem',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: item.color,
              flexShrink: 0,
            }}
          />

          <span style={{ color: 'var(--text-muted)', flex: 1 }}>{item.label}</span>

          <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
            {item.value}
            {typeof total === 'number' && total > 0
              ? ` (${Math.round((item.value / total) * 100)}%)`
              : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

function SummaryLine({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
      </div>

      <span style={{ fontSize: '0.875rem', fontWeight: 800, color }}>
        +{value}
      </span>
    </div>
  )
}

function ActivityItem({ activity }: { activity: Activity }) {
  const initials = (activity.user_name || 'US')
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.6rem',
          fontWeight: 900,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.78rem',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {activity.action}
        </p>

        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {formatDateTime(activity.created_at)}
        </p>
      </div>
    </div>
  )
}

function PrayerItem({ msg }: { msg: Msg }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
        gap: 6,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.78rem',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {msg.subject || 'Pedido de oração'}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {msg.message}
        </p>
      </div>

      <PriorityBadge type={msg.msg_type} />
    </div>
  )
}

function RightPanel({
  loading,
  upcoming,
  msgs,
  onNavigate,
}: {
  loading: boolean
  upcoming: (Member & { diff: number; day: string; month: string })[]
  msgs: Msg[]
  onNavigate: (tab: string) => void
}) {
  return (
    <aside
      style={{
        borderLeft: '1px solid var(--border)',
        overflowY: 'auto',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <SideSection
        title="🎂 Próximos Aniversariantes"
        button="Ver todos"
        onClick={() => onNavigate('aniversariantes')}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SideSkeleton key={i} />)
        ) : upcoming.length === 0 ? (
          <EmptyMini text="Nenhum aniversariante nos próximos 30 dias." />
        ) : (
          upcoming.map(member => <BirthdayMini key={member.id} member={member} />)
        )}
      </SideSection>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      <SideSection
        title="📝 Recados dos Obreiros"
        button="Ver todos"
        onClick={() => onNavigate('recados')}
      >
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SideSkeleton key={i} />)
        ) : msgs.length === 0 ? (
          <EmptyMini text="Nenhum recado." />
        ) : (
          msgs.slice(0, 5).map(msg => <WorkerMsgMini key={msg.id} msg={msg} />)
        )}
      </SideSection>
    </aside>
  )
}

function SideSection({
  title,
  button,
  onClick,
  children,
}: {
  title: string
  button: string
  onClick: () => void
  children: any
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 800 }}>
          {title}
        </h3>

        <button
          className="btn-help"
          style={{ fontSize: '0.7rem', padding: '2px 8px' }}
          onClick={onClick}
        >
          {button}
        </button>
      </div>

      {children}
    </div>
  )
}

function BirthdayMini({
  member,
}: {
  member: Member & { diff: number; day: string; month: string }
}) {
  const initials = (member.name || 'AN')
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const color = colors[member.id % colors.length]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 900,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.8rem',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {member.name}
        </p>

        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {member.day}/{member.month}
        </p>
      </div>

      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 800,
          color: member.diff === 0 ? '#F59E0B' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
        }}
      >
        {member.diff === 0 ? 'Hoje! 🎉' : `${member.diff} dias`}
      </span>
    </div>
  )
}

function WorkerMsgMini({ msg }: { msg: Msg }) {
  return (
    <div
      style={{
        marginBottom: 12,
        padding: '8px 10px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '70%',
          }}
        >
          {msg.subject || 'Recado'}
        </span>

        <PriorityBadge type={msg.msg_type} />
      </div>

      <p
        style={{
          margin: 0,
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {msg.message}
      </p>
    </div>
  )
}

function StatSkeleton() {
  return (
    <div className="stat-card">
      <Sk w="50px" h="50px" r="16px" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Sk h="26px" w="60%" />
        <Sk h="12px" />
      </div>
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
      <Sk w="30px" h="30px" r="50%" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Sk h="11px" w="70%" />
        <Sk h="10px" w="50%" />
      </div>
    </div>
  )
}

function SideSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
      <Sk w="36px" h="36px" r="50%" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Sk h="12px" w="80%" />
        <Sk h="10px" w="50%" />
      </div>
    </div>
  )
}

function EmptyMini({ text }: { text: string }) {
  return (
    <p
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        textAlign: 'center',
        padding: '1rem 0',
      }}
    >
      {text}
    </p>
  )
}

function Alert({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '0.9rem 1rem',
        borderRadius: 16,
        background: 'rgba(245,158,11,0.14)',
        border: '1px solid rgba(245,158,11,0.3)',
        color: '#FCD34D',
        fontWeight: 800,
        fontSize: '0.85rem',
        marginBottom: '1rem',
      }}
    >
      ⚠️ {message}
    </div>
  )
}

function getUpcomingBirthdays(members: Member[]) {
  const today = new Date()

  return members
    .map(member => {
      if (!member.birth_date) return null

      const parts = member.birth_date.split('-')
      const month = parts[1]
      const day = parts[2]

      if (!month || !day) return null

      const bday = new Date(today.getFullYear(), Number(month) - 1, Number(day))

      if (Number.isNaN(bday.getTime())) return null

      if (bday < startOfDay(today)) {
        bday.setFullYear(today.getFullYear() + 1)
      }

      const diff = Math.ceil((bday.getTime() - startOfDay(today).getTime()) / 86400000)

      if (diff < 0 || diff > 30) return null

      return {
        ...member,
        diff,
        day,
        month,
      }
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.diff - b.diff)
    .slice(0, 6) as (Member & { diff: number; day: string; month: string })[]
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatDateTime(value: string) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('pt-BR')
}