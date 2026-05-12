import { ThemeSelector } from './ThemeSelector'

export function Settings() {
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
            Configurações da igreja
          </span>

          <h1>⚙️ Configurações</h1>

          <p>
            Personalize a aparência do CRM e ajuste informações principais da igreja.
          </p>
        </div>
      </div>

      <ThemeSelector />

      <div
        className="content-grid"
        style={{
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'start',
        }}
      >
        <div className="modern-card">
          <div className="modern-card-header">
            <div>
              <h2 className="modern-card-title">🏛️ Perfil da Igreja</h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  marginTop: 4,
                }}
              >
                Informações principais da congregação e integração WhatsApp.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Nome da Congregação</label>
              <input type="text" value="Bom Samaritano Matriz" disabled />
            </div>

            <div className="form-group">
              <label>Slug SaaS</label>
              <input type="text" value="bom-samaritano-matriz" disabled />
            </div>

            <div className="form-group">
              <label>WhatsApp Oficial</label>
              <input type="text" placeholder="Ex: 11999999999" />
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: 18,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.22)',
              }}
            >
              <strong style={{ color: '#34D399', fontSize: '0.9rem' }}>
                Segurança ativa
              </strong>

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  margin: '0.35rem 0 0',
                }}
              >
                Os acessos são separados por perfil: Pastor Administrador e Obreiro.
              </p>
            </div>

            <button className="btn-primary" style={{ width: 'fit-content' }}>
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="modern-card">
          <div className="modern-card-header">
            <div>
              <h2 className="modern-card-title">🛡️ Controle de Acessos</h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  marginTop: 4,
                }}
              >
                O CRUD de usuários fica na tela Obreiros, acessível somente ao Pastor Administrador.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              borderRadius: 18,
              background: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.22)',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
            }}
          >
            Para criar, editar, resetar senha, bloquear ou excluir obreiros, acesse o menu:
            <br />
            <strong style={{ color: 'var(--text-main)' }}>Obreiros</strong>
          </div>
        </div>
      </div>
    </div>
  )
}