import { useState } from 'preact/hooks'

export function Login({
  onLoginSuccess,
  onNavigate
}: {
  onLoginSuccess: () => void
  onNavigate: (path: string) => void
}) {
  const [churchSlug, setChurchSlug] = useState(
    localStorage.getItem('crm-church-slug') || 'bom-samaritano-matriz'
  )
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [showForgot, setShowForgot] = useState(false)
  const [recoveryTarget, setRecoveryTarget] = useState('')
  const [recoveryMsg, setRecoveryMsg] = useState('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ church_slug: churchSlug, username, password }),
      })

      const data = await resp.json()

      if (resp.ok) {
        localStorage.setItem('crm-church-slug', churchSlug)
        onLoginSuccess()
      } else {
        setError(data.error || 'Usuário, senha ou igreja inválidos.')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRecoveryMsg('')

    try {
      const resp = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: recoveryTarget }),
      })

      const data = await resp.json()
      setRecoveryMsg(data.message || 'Se os dados estiverem corretos, enviaremos as instruções de recuperação.')
    } catch (err) {
      setError('Erro ao processar recuperação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        background:
          'radial-gradient(circle at top left, rgba(124,58,237,0.26), transparent 35%), radial-gradient(circle at bottom right, rgba(37,99,235,0.18), transparent 32%), linear-gradient(135deg,#030712 0%,#070B1A 45%,#020617 100%)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <section
        style={{
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontWeight: 900,
            fontSize: '1.25rem',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 28px rgba(124,58,237,0.45)',
              color: '#fff',
              fontWeight: 900,
            }}
          >
            ✚
          </div>
          CRM Bom Samaritano
        </div>

        <div style={{ maxWidth: 560 }}>
          <span
            style={{
              display: 'inline-flex',
              padding: '0.42rem 0.85rem',
              borderRadius: 999,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.36)',
              color: '#C4B5FD',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '1.3rem',
            }}
          >
            Plataforma pastoral segura
          </span>

          <h1
            style={{
              fontSize: '3rem',
              lineHeight: 1.08,
              letterSpacing: '-0.05em',
              fontWeight: 900,
              margin: 0,
            }}
          >
            Acesse o painel da sua igreja com segurança e cuidado.
          </h1>

          <p
            style={{
              color: '#9CA3AF',
              fontSize: '1rem',
              lineHeight: 1.7,
              marginTop: '1.4rem',
            }}
          >
            Gerencie visitantes, membros, mensagens pastorais, aniversariantes,
            pedidos de oração e acompanhamento espiritual em um único lugar.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginTop: '2rem',
            }}
          >
            <InfoCard title="Seguro" desc="Login protegido" color="#10B981" />
            <InfoCard title="Pastoral" desc="Cuidado real" color="#7C3AED" />
            <InfoCard title="WhatsApp" desc="Mensagens rápidas" color="#2563EB" />
          </div>
        </div>

        <p style={{ color: '#6B7280', fontSize: '0.8rem' }}>
          © 2026 CRM Bom Samaritano. Feito para igrejas que cuidam de pessoas.
        </p>
      </section>

      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <article
          style={{
            width: '100%',
            maxWidth: 430,
            padding: '2rem',
            borderRadius: 26,
            background: 'rgba(17,24,39,0.76)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.48)',
            backdropFilter: 'blur(18px)',
          }}
        >
          {!showForgot ? (
            <>
              <header style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                <div
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 20,
                    background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    boxShadow: '0 0 32px rgba(124,58,237,0.5)',
                  }}
                >
                  ⛪
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#fff',
                    letterSpacing: '-0.03em',
                  }}
                >
                  Entrar no Sistema
                </h2>

                <p style={{ color: '#9CA3AF', fontSize: '0.88rem', marginTop: 6 }}>
                  Acesse o painel administrativo da sua igreja
                </p>
              </header>

              <form onSubmit={handleSubmit}>
                <FieldLabel text="ID da Igreja">
                  <input
                    type="text"
                    placeholder="ex: bom-samaritano-matriz"
                    value={churchSlug}
                    onInput={(e) => setChurchSlug(e.currentTarget.value)}
                    required
                    style={inputStyle}
                  />
                </FieldLabel>

                <FieldLabel text="Usuário">
                  <input
                    type="text"
                    placeholder="Digite seu usuário"
                    value={username}
                    onInput={(e) => setUsername(e.currentTarget.value)}
                    required
                    style={inputStyle}
                  />
                </FieldLabel>

                <FieldLabel text="Senha">
                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                    required
                    style={inputStyle}
                  />
                </FieldLabel>

                <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true)
                      setError('')
                      setRecoveryMsg('')
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#A78BFA',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 700,
                    }}
                  >
                    Esqueceu seu login ou senha?
                  </button>
                </div>

                {error && <Alert type="error" message={error} />}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: 52,
                    marginTop: '0.5rem',
                    borderRadius: 14,
                    border: 'none',
                    background: loading
                      ? 'rgba(124,58,237,0.55)'
                      : 'linear-gradient(135deg,#7C3AED,#8B5CF6)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 14px 32px rgba(124,58,237,0.38)',
                  }}
                >
                  {loading ? 'Autenticando...' : 'Entrar no Sistema'}
                </button>
              </form>

              <div style={{ marginTop: '1.4rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => onNavigate('/')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#6B7280',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Voltar para a página inicial
                </button>
              </div>
            </>
          ) : (
            <>
              <header style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                <div
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 20,
                    background: 'linear-gradient(135deg,#F59E0B,#7C3AED)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: '0 0 32px rgba(245,158,11,0.35)',
                  }}
                >
                  🔐
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#fff',
                  }}
                >
                  Recuperar acesso
                </h2>

                <p style={{ color: '#9CA3AF', fontSize: '0.88rem', marginTop: 6 }}>
                  Informe seu e-mail ou telefone cadastrado
                </p>
              </header>

              <form onSubmit={handleForgotSubmit}>
                <FieldLabel text="E-mail ou telefone">
                  <input
                    type="text"
                    value={recoveryTarget}
                    onInput={(e) => setRecoveryTarget(e.currentTarget.value)}
                    placeholder="Ex: pastor@email.com"
                    required
                    style={inputStyle}
                  />
                </FieldLabel>

                {recoveryMsg && <Alert type="success" message={recoveryMsg} />}
                {error && <Alert type="error" message={error} />}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: 52,
                    marginTop: '0.5rem',
                    borderRadius: 14,
                    border: 'none',
                    background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 14px 32px rgba(124,58,237,0.38)',
                  }}
                >
                  {loading ? 'Enviando...' : 'Enviar instruções'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false)
                    setRecoveryTarget('')
                    setRecoveryMsg('')
                    setError('')
                  }}
                  style={{
                    width: '100%',
                    marginTop: 12,
                    height: 48,
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#D1D5DB',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Voltar para login
                </button>
              </form>
            </>
          )}
        </article>
      </section>
    </main>
  )
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
  fontSize: '0.9rem',
}

function FieldLabel({ text, children }: { text: string; children: any }) {
  return (
    <label
      style={{
        display: 'block',
        color: '#CBD5E1',
        fontWeight: 700,
        fontSize: '0.82rem',
        marginBottom: 2,
      }}
    >
      {text}
      {children}
    </label>
  )
}

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  const isSuccess = type === 'success'

  return (
    <div
      style={{
        padding: '0.85rem 1rem',
        borderRadius: 14,
        background: isSuccess ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)',
        border: isSuccess ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
        color: isSuccess ? '#34D399' : '#F87171',
        fontSize: '0.84rem',
        fontWeight: 700,
        marginBottom: '1rem',
      }}
    >
      {isSuccess ? '✅' : '⚠️'} {message}
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
        padding: '1rem',
      }}
    >
      <div style={{ color, fontSize: '1rem', fontWeight: 900 }}>{title}</div>
      <div style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: 4 }}>{desc}</div>
    </div>
  )
}