import { useState, useEffect } from 'preact/hooks'

export function Login({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [username, setUsername] = useState('pastor')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError('')
    
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await resp.json()
      if (resp.ok) {
        onLoginSuccess()
      } else {
        setError(data.error || 'Erro ao realizar login')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login - CRM Eclésia</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block' }}>Usuário</label>
          <input 
            type="text" 
            value={username} 
            onInput={(e) => setUsername(e.currentTarget.value)} 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block' }}>Senha</label>
          <input 
            type="password" 
            value={password} 
            onInput={(e) => setPassword(e.currentTarget.value)} 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  )
}
