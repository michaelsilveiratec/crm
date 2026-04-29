import { useState, useEffect } from 'preact/hooks'
import { Login } from './Login'
import { MemberForm } from './components/MemberForm'
import { Dashboard } from './components/Dashboard'

export function App() {
  const [user, setUser] = useState<{ role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form'>('dashboard')

  const checkAuth = async () => {
    try {
      const resp = await fetch('/api/me')
      if (resp.ok) {
        const data = await resp.json()
        setUser(data)
        // Se for obreiro, forçar a aba para form
        if (data.role === 'obreiro') {
          setActiveTab('form')
        }
      } else {
        setUser(null)
      }
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    setUser(null)
  }

  if (loading) return <div style={{ padding: '2rem' }} aria-busy="true">Carregando...</div>

  if (!user) {
    return <Login onLoginSuccess={checkAuth} />
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <hgroup>
          <h1>CRM Eclésia</h1>
          <p>Gestão Pastoral Leve</p>
        </hgroup>
        <div>
          <span>Olá, <strong>{user.role}</strong> | </span>
          <button className="secondary outline" onClick={handleLogout} style={{ padding: '5px 15px', fontSize: '0.8rem' }}>Sair</button>
        </div>
      </header>
      
      {user.role === 'pastor' && (
        <nav style={{ marginBottom: '2rem', borderBottom: '1px solid var(--pico-muted-border-color)' }}>
          <ul>
            <li>
              <a 
                href="#" 
                className={activeTab === 'dashboard' ? 'secondary' : 'contrast'} 
                onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
                style={activeTab === 'dashboard' ? { fontWeight: 'bold', textDecoration: 'underline' } : {}}
              >
                Painel Pastoral
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeTab === 'form' ? 'secondary' : 'contrast'} 
                onClick={(e) => { e.preventDefault(); setActiveTab('form'); }}
                style={activeTab === 'form' ? { fontWeight: 'bold', textDecoration: 'underline' } : {}}
              >
                Novo Cadastro
              </a>
            </li>
          </ul>
        </nav>
      )}

      <main>
        {activeTab === 'dashboard' ? <Dashboard /> : <MemberForm />}
      </main>
    </div>
  )
}
