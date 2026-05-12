import { useState, useEffect } from 'preact/hooks'

interface PastoralVisit {
  id: number
  member_id: number
  address: string
  visit_date: string
  visit_time: string
  responsible_id: number
  conducted_by: string
  notes: string
  result: string
  status: string
  carried_holy_communion: boolean
}

interface Member {
  id: number
  name: string
}

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  Agendada: { label: 'Agendada', color: '#8B5CF6', icon: '📅' },
  Realizada: { label: 'Realizada', color: '#10B981', icon: '✅' },
  Cancelada: { label: 'Cancelada', color: '#EF4444', icon: '✕' },
  Reagendada: { label: 'Reagendada', color: '#F59E0B', icon: '🔁' },
  Pendente: { label: 'Pendente', color: '#F59E0B', icon: '⏳' },
}

export function PastoralVisits({ role }: { role: string }) {
  const [visits, setVisits] = useState<PastoralVisit[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const apiPrefix = role === 'pastor' ? '/api/pastor' : '/api/worker'

  const [formData, setFormData] = useState({
    member_id: 0,
    address: '',
    visit_date: '',
    visit_time: '',
    responsible_id: 0,
    conducted_by: '',
    notes: '',
    result: '',
    status: 'Agendada',
    carried_holy_communion: false,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      const [vRes, mRes] = await Promise.all([
        fetch(`${apiPrefix}/visits`),
        fetch(`${apiPrefix}/members`),
      ])

      if (!vRes.ok || !mRes.ok) {
        throw new Error('Erro ao carregar visitas pastorais.')
      }

      const vData = await vRes.json()
      const mData = await mRes.json()

      setVisits(vData || [])
      setMembers(mData || [])
    } catch (err: any) {
      setError(err.message || 'Não foi possível carregar os dados de visitas.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: Event) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const resp = await fetch(`${apiPrefix}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!resp.ok) {
        throw new Error('Erro ao salvar visita pastoral.')
      }

      setShowModal(false)

      setFormData({
        member_id: 0,
        address: '',
        visit_date: '',
        visit_time: '',
        responsible_id: 0,
        conducted_by: '',
        notes: '',
        result: '',
        status: 'Agendada',
        carried_holy_communion: false,
      })

      setSuccess('Visita pastoral agendada com sucesso.')
      await fetchData()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Erro de conexão ao salvar visita.')
    } finally {
      setSaving(false)
    }
  }

  const totalVisits = visits.length
  const scheduled = visits.filter(v => v.status === 'Agendada').length
  const completed = visits.filter(v => v.status === 'Realizada').length
  const communion = visits.filter(v => v.carried_holy_communion).length
  const pending = visits.filter(v => ['Pendente', 'Reagendada'].includes(v.status)).length

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
            Cuidado pastoral nas casas
          </span>

          <h1>🏠 Visitas Pastorais</h1>

          <p>
            Organize visitas, acompanhamento espiritual, Santa Ceia nas casas e
            cuidado com membros que precisam de atenção pastoral.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-help" onClick={fetchData}>
            Atualizar
          </button>

          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Agendar Visita
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
        <SummaryCard title="Total de Visitas" value={totalVisits} color="#8B5CF6" icon="🏠" />
        <SummaryCard title="Agendadas" value={scheduled} color="#2563EB" icon="📅" />
        <SummaryCard title="Realizadas" value={completed} color="#10B981" icon="✅" />
        <SummaryCard title="Santa Ceia" value={communion} color="#F59E0B" icon="🍇" />
        <SummaryCard title="Pendências" value={pending} color="#EF4444" icon="⏳" />
      </div>

      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h2 className="modern-card-title">Agenda de Visitas</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
              Acompanhe visitas agendadas, realizadas e pedidos de Santa Ceia.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : visits.length === 0 ? (
          <EmptyState onCreate={() => setShowModal(true)} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Membro</th>
                  <th>Data/Hora</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th>Santa Ceia</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {visits.map(visit => {
                  const member = members.find(m => m.id === visit.member_id)
                  const status = statusMap[visit.status] || {
                    label: visit.status || 'Sem status',
                    color: '#6B7280',
                    icon: '•',
                  }

                  return (
                    <tr key={visit.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={member?.name || 'Membro'} />

                          <div>
                            <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                              {member ? member.name : 'Membro não encontrado'}
                            </strong>

                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                              Por: {visit.conducted_by || 'Responsável não informado'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ color: 'var(--text-main)', fontSize: '0.86rem', fontWeight: 700 }}>
                          {formatDate(visit.visit_date)}
                        </div>

                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          {visit.visit_time || '--:--'}
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            maxWidth: 220,
                            color: 'var(--text-muted)',
                            fontSize: '0.84rem',
                            lineHeight: 1.45,
                          }}
                        >
                          {visit.address || 'Endereço não informado'}
                        </div>
                      </td>

                      <td>
                        <StatusBadge label={status.label} color={status.color} icon={status.icon} />
                      </td>

                      <td>
                        {visit.carried_holy_communion ? (
                          <StatusBadge label="Sim" color="#F59E0B" icon="🍇" />
                        ) : (
                          <StatusBadge label="Não" color="#6B7280" icon="—" />
                        )}
                      </td>

                      <td>
                        <div
                          style={{
                            maxWidth: 220,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-muted)',
                            fontSize: '0.82rem',
                          }}
                          title={visit.notes || visit.result}
                        >
                          {visit.notes || visit.result || 'Sem observações'}
                        </div>
                      </td>

                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-icon"
                            title="Ver detalhes"
                            type="button"
                            onClick={() => alert(buildVisitDetails(visit, member?.name))}
                          >
                            👁️
                          </button>

                          <button
                            className="btn-icon"
                            title="Editar visita"
                            type="button"
                          >
                            ✏️
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
              width: 560,
              maxWidth: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              margin: 0,
              boxShadow: '0 30px 90px rgba(0,0,0,0.55)',
            }}
          >
            <div className="modern-card-header">
              <div>
                <h2 className="modern-card-title">Agendar Nova Visita</h2>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                  Registre a visita pastoral e informe se será levada Santa Ceia.
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
              onSubmit={handleSave}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <label>
                Membro
                <select
                  value={formData.member_id}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      member_id: parseInt(e.currentTarget.value),
                    })
                  }
                  required
                >
                  <option value="">Selecione...</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Endereço da visita
                <input
                  type="text"
                  placeholder="Informe o endereço completo"
                  value={formData.address}
                  onInput={e =>
                    setFormData({ ...formData, address: e.currentTarget.value })
                  }
                  required
                />
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <label>
                  Data
                  <input
                    type="date"
                    value={formData.visit_date}
                    onInput={e =>
                      setFormData({ ...formData, visit_date: e.currentTarget.value })
                    }
                    required
                  />
                </label>

                <label>
                  Horário
                  <input
                    type="time"
                    value={formData.visit_time}
                    onInput={e =>
                      setFormData({ ...formData, visit_time: e.currentTarget.value })
                    }
                    required
                  />
                </label>
              </div>

              <label>
                Responsável / Realizado por
                <input
                  type="text"
                  placeholder="Ex: Pr. João ou Obreira Maria"
                  value={formData.conducted_by}
                  onInput={e =>
                    setFormData({ ...formData, conducted_by: e.currentTarget.value })
                  }
                />
              </label>

              <label>
                Status
                <select
                  value={formData.status}
                  onChange={e =>
                    setFormData({ ...formData, status: e.currentTarget.value })
                  }
                >
                  <option value="Agendada">Agendada</option>
                  <option value="Realizada">Realizada</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Reagendada">Reagendada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.9rem 1rem',
                  borderRadius: 16,
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.22)',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.carried_holy_communion}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      carried_holy_communion: e.currentTarget.checked,
                    })
                  }
                  style={{ width: 18, height: 18 }}
                />

                <span style={{ color: '#FCD34D', fontWeight: 800 }}>
                  Levar Santa Ceia nesta visita?
                </span>
              </label>

              <label>
                Observações Pastorais
                <textarea
                  placeholder="Descreva a necessidade, pedido de oração ou situação pastoral..."
                  value={formData.notes}
                  onInput={e =>
                    setFormData({ ...formData, notes: e.currentTarget.value })
                  }
                  style={{ minHeight: 110, resize: 'vertical' }}
                />
              </label>

              <label>
                Resultado da visita
                <textarea
                  placeholder="Preencha após a visita ser realizada..."
                  value={formData.result}
                  onInput={e =>
                    setFormData({ ...formData, result: e.currentTarget.value })
                  }
                  style={{ minHeight: 90, resize: 'vertical' }}
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

                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Salvando...' : 'Agendar Visita'}
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
  value: number | string
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

function Avatar({ name }: { name: string }) {
  const initials = (name || 'MB')
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
        background: 'linear-gradient(135deg,#10B981,#2563EB)',
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
      <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>🏠</div>

      <h3 style={{ margin: 0, color: 'var(--text-main)' }}>
        Nenhuma visita pastoral agendada
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          margin: '0.5rem auto 1.4rem',
          maxWidth: 480,
        }}
      >
        Agende visitas para membros, enfermos, afastados ou famílias que precisam
        de cuidado pastoral e acompanhamento espiritual.
      </p>

      <button className="btn-primary" onClick={onCreate}>
        Agendar primeira visita
      </button>
    </div>
  )
}

function Alert({
  type,
  message,
}: {
  type: 'success' | 'error'
  message: string
}) {
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

function formatDate(date: string) {
  if (!date) return '-'

  const parsed = new Date(`${date}T00:00:00`)

  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('pt-BR')
}

function buildVisitDetails(visit: PastoralVisit, memberName?: string) {
  return [
    `Membro: ${memberName || 'Não encontrado'}`,
    `Data: ${formatDate(visit.visit_date)}`,
    `Horário: ${visit.visit_time || '-'}`,
    `Endereço: ${visit.address || '-'}`,
    `Responsável: ${visit.conducted_by || '-'}`,
    `Status: ${visit.status || '-'}`,
    `Santa Ceia: ${visit.carried_holy_communion ? 'Sim' : 'Não'}`,
    `Observações: ${visit.notes || '-'}`,
    `Resultado: ${visit.result || '-'}`,
  ].join('\n')
}