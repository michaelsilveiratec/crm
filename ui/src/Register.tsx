import { useState } from 'preact/hooks'

export function Register({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [formData, setFormData] = useState({
    church_name: '',
    church_slug: '',
    admin_name: '',
    username: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const resp = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await resp.json()

      if (resp.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Erro ao realizar cadastro.')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main style={pageStyle}>
        <section style={successCardStyle}>
          <div style={successIconStyle}>✓</div>

          <h1 style={successTitleStyle}>Igreja cadastrada com sucesso!</h1>

          <p style={successTextStyle}>
            O painel da <strong>{formData.church_name}</strong> está pronto para começar.
          </p>

          <div style={successInfoStyle}>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.85rem' }}>
              ID da igreja
            </p>
            <strong style={{ color: '#fff' }}>{formData.church_slug}</strong>
          </div>

          <button
            onClick={() => onNavigate('/login')}
            style={primaryButtonStyle}
          >
            Ir para o Login
          </button>
        </section>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <section style={leftPanelStyle}>
        <div style={brandStyle}>
          <div style={brandIconStyle}>✚</div>
          <span>CRM Bom Samaritano</span>
        </div>

        <div style={{ maxWidth: 560 }}>
          <span style={badgeStyle}>Teste grátis por 7 dias</span>

          <h1 style={heroTitleStyle}>
            Cadastre sua igreja e comece a cuidar melhor das pessoas.
          </h1>

          <p style={heroTextStyle}>
            Crie seu painel pastoral em poucos minutos. Organize visitantes,
            acompanhe membros, envie mensagens e fortaleça o cuidado espiritual
            da sua igreja.
          </p>

          <div style={benefitsGridStyle}>
            <InfoCard title="Sem instalação" desc="Acesse direto pelo navegador" color="#7C3AED" />
            <InfoCard title="Multiusuário" desc="Pastor e obreiros separados" color="#2563EB" />
            <InfoCard title="Pastoral" desc="Cuidado, visitas e mensagens" color="#10B981" />
          </div>
        </div>

        <p style={{ color: '#6B7280', fontSize: '0.8rem' }}>
          © 2026 CRM Bom Samaritano. Plataforma para igrejas que cuidam de pessoas.
        </p>
      </section>

      <section style={formPanelStyle}>
        <article style={registerCardStyle}>
          <header style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div style={formIconStyle}>⛪</div>

            <h2 style={formTitleStyle}>Criar conta da igreja</h2>

            <p style={formSubtitleStyle}>
              Configure sua igreja e o primeiro Pastor Administrador.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <div style={sectionTitleStyle}>Dados da Igreja</div>

            <div style={gridStyle}>
              <FieldLabel text="Nome da Igreja">
                <input
                  type="text"
                  placeholder="Ex: Igreja da Graça Rochdale"
                  value={formData.church_name}
                  onInput={e => {
                    const value = e.currentTarget.value
                    updateField('church_name', value)

                    if (!formData.church_slug) {
                      updateField('church_slug', generateSlug(value))
                    }
                  }}
                  required
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel text="ID da Igreja">
                <input
                  type="text"
                  placeholder="ex: igreja-graca-rochdale"
                  value={formData.church_slug}
                  onInput={e => updateField('church_slug', generateSlug(e.currentTarget.value))}
                  required
                  style={inputStyle}
                />
              </FieldLabel>
            </div>

            <div style={dividerStyle} />

            <div style={sectionTitleStyle}>Pastor Administrador</div>

            <div style={gridStyle}>
              <FieldLabel text="Nome completo">
                <input
                  type="text"
                  placeholder="Nome do Pastor"
                  value={formData.admin_name}
                  onInput={e => updateField('admin_name', e.currentTarget.value)}
                  required
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel text="E-mail">
                <input
                  type="email"
                  placeholder="pastor@email.com"
                  value={formData.email}
                  onInput={e => updateField('email', e.currentTarget.value)}
                  required
                  style={inputStyle}
                />
              </FieldLabel>
            </div>

            <div style={gridStyle}>
              <FieldLabel text="Usuário de login">
                <input
                  type="text"
                  placeholder="ex: pastor.michael"
                  value={formData.username}
                  onInput={e => updateField('username', e.currentTarget.value)}
                  required
                  style={inputStyle}
                />
              </FieldLabel>

              <FieldLabel text="Senha">
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onInput={e => updateField('password', e.currentTarget.value)}
                  required
                  minLength={6}
                  style={inputStyle}
                />
              </FieldLabel>
            </div>

            {error && <Alert message={error} />}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...primaryButtonStyle,
                marginTop: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1
              }}
            >
              {loading ? 'Criando igreja...' : 'Criar minha igreja agora'}
            </button>
          </form>

          <footer style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                style={linkButtonStyle}
              >
                Fazer login
              </button>
            </p>
          </footer>
        </article>
      </section>
    </main>
  )
}

const pageStyle = {
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: '1.05fr 0.95fr',
  background:
    'radial-gradient(circle at top left, rgba(124,58,237,0.26), transparent 35%), radial-gradient(circle at bottom right, rgba(37,99,235,0.18), transparent 32%), linear-gradient(135deg,#030712 0%,#070B1A 45%,#020617 100%)',
  color: '#fff',
  fontFamily: 'Inter, sans-serif'
}

const leftPanelStyle = {
  padding: '3rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRight: '1px solid rgba(255,255,255,0.08)'
}

const formPanelStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem'
}

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontWeight: 900,
  fontSize: '1.25rem'
}

const brandIconStyle = {
  width: 42,
  height: 42,
  borderRadius: 14,
  background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 28px rgba(124,58,237,0.45)',
  color: '#fff',
  fontWeight: 900
}

const badgeStyle = {
  display: 'inline-flex',
  padding: '0.42rem 0.85rem',
  borderRadius: 999,
  background: 'rgba(124,58,237,0.15)',
  border: '1px solid rgba(124,58,237,0.36)',
  color: '#C4B5FD',
  fontSize: '0.82rem',
  fontWeight: 800,
  marginBottom: '1.3rem'
}

const heroTitleStyle = {
  fontSize: '3rem',
  lineHeight: 1.08,
  letterSpacing: '-0.05em',
  fontWeight: 900,
  margin: 0
}

const heroTextStyle = {
  color: '#9CA3AF',
  fontSize: '1rem',
  lineHeight: 1.7,
  marginTop: '1.4rem'
}

const benefitsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 12,
  marginTop: '2rem'
}

const registerCardStyle = {
  width: '100%',
  maxWidth: 620,
  padding: '2rem',
  borderRadius: 26,
  background: 'rgba(17,24,39,0.76)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 30px 80px rgba(0,0,0,0.48)',
  backdropFilter: 'blur(18px)'
}

const formIconStyle = {
  width: 62,
  height: 62,
  borderRadius: 20,
  background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
  margin: '0 auto 1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.6rem',
  boxShadow: '0 0 32px rgba(124,58,237,0.5)'
}

const formTitleStyle = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 900,
  color: '#fff',
  letterSpacing: '-0.03em'
}

const formSubtitleStyle = {
  color: '#9CA3AF',
  fontSize: '0.88rem',
  marginTop: 6
}

const sectionTitleStyle = {
  color: '#C4B5FD',
  fontSize: '0.78rem',
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '0.8rem'
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem'
}

const dividerStyle = {
  height: 1,
  background: 'rgba(255,255,255,0.08)',
  margin: '1.2rem 0'
}

const inputStyle = {
  width: '100%',
  height: 48,
  marginTop: 6,
  marginBottom: 14,
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(15,23,42,0.88)',
  color: '#fff',
  padding: '0 1rem',
  outline: 'none',
  fontSize: '0.9rem'
}

const primaryButtonStyle = {
  width: '100%',
  height: 52,
  borderRadius: 14,
  border: 'none',
  background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)',
  color: '#fff',
  fontWeight: 900,
  fontSize: '0.95rem',
  boxShadow: '0 14px 32px rgba(124,58,237,0.38)'
}

const linkButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#A78BFA',
  fontWeight: 800,
  cursor: 'pointer',
  padding: 0
}

const successCardStyle = {
  width: '100%',
  maxWidth: 520,
  margin: 'auto',
  padding: '2.4rem',
  borderRadius: 28,
  background: 'rgba(17,24,39,0.8)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 30px 80px rgba(0,0,0,0.48)',
  backdropFilter: 'blur(18px)',
  textAlign: 'center'
}

const successIconStyle = {
  width: 76,
  height: 76,
  borderRadius: 24,
  margin: '0 auto 1.2rem',
  background: 'linear-gradient(135deg,#10B981,#7C3AED)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 900,
  boxShadow: '0 0 36px rgba(16,185,129,0.38)'
}

const successTitleStyle = {
  margin: 0,
  fontSize: '1.8rem',
  fontWeight: 900,
  letterSpacing: '-0.04em'
}

const successTextStyle = {
  color: '#9CA3AF',
  lineHeight: 1.7,
  margin: '1rem 0'
}

const successInfoStyle = {
  padding: '1rem',
  borderRadius: 18,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  margin: '1.2rem 0'
}

function FieldLabel({ text, children }: { text: string; children: any }) {
  return (
    <label
      style={{
        display: 'block',
        color: '#CBD5E1',
        fontWeight: 700,
        fontSize: '0.82rem',
        marginBottom: 2
      }}
    >
      {text}
      {children}
    </label>
  )
}

function Alert({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '0.85rem 1rem',
        borderRadius: 14,
        background: 'rgba(239,68,68,0.14)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#F87171',
        fontSize: '0.84rem',
        fontWeight: 700,
        marginBottom: '1rem'
      }}
    >
      ⚠️ {message}
    </div>
  )
}

function InfoCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}44`,
        borderRadius: 18,
        padding: '1rem'
      }}
    >
      <div style={{ color, fontSize: '1rem', fontWeight: 900 }}>{title}</div>
      <div style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: 4 }}>{desc}</div>
    </div>
  )
}