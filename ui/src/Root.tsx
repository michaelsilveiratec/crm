import { useState, useEffect } from 'preact/hooks'
import { Login } from './Login'
import { Register } from './Register'
import { LandingPage } from './LandingPage'
import { App } from './app'
import { UniverseBubbles } from './components/UniverseBubbles'

export function Root() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  const checkAuth = async () => {
    try {
      const resp = await fetch('/api/me')
      const logged = resp.ok

      setIsLoggedIn(logged)

      if (logged && ['/login', '/register', '/'].includes(window.location.pathname)) {
        navigate('/app')
      }
    } catch (err) {
      setIsLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    navigate('/app')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate('/login')
  }

  if (loading) {
    return (
      <>
        <UniverseBubbles />

        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(circle at top left, rgba(124,58,237,0.25), transparent 35%), radial-gradient(circle at bottom right, rgba(37,99,235,0.18), transparent 32%), linear-gradient(135deg,#030712 0%,#070B1A 45%,#020617 100%)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <section
            style={{
              textAlign: 'center',
              padding: '2rem',
              borderRadius: 24,
              background: 'rgba(17,24,39,0.75)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: '4px solid rgba(124,58,237,0.2)',
                borderTopColor: '#8B5CF6',
                margin: '0 auto 1rem',
                animation: 'spin 0.8s linear infinite',
              }}
            />

            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
              Carregando CRM Bom Samaritano
            </h2>

            <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginTop: 6 }}>
              Preparando o painel da sua igreja...
            </p>

            <style>
              {`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </section>
        </main>
      </>
    )
  }

  if (isLoggedIn) {
    return (
      <>
        <UniverseBubbles />
        <App onLogout={handleLogout} />
      </>
    )
  }

  if (currentPath === '/login') {
    return (
      <>
        <UniverseBubbles />
        <Login onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />
      </>
    )
  }

  if (currentPath === '/register') {
    return (
      <>
        <UniverseBubbles />
        <Register onNavigate={navigate} />
      </>
    )
  }

  return (
    <>
      <UniverseBubbles />
      <LandingPage onNavigate={navigate} />
    </>
  )
}