export function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const plans = [
    {
      name: 'Essencial',
      price: 'R$ 49',
      desc: 'Para igrejas pequenas começarem com organização pastoral.',
      features: [
        'Cadastro de visitantes',
        'Cadastro de membros',
        'Pedidos de oração',
        'Aniversariantes',
        'Até 3 obreiros',
        'Mensagens pastorais básicas',
      ],
      highlight: false,
    },
    {
      name: 'Pastoreio',
      price: 'R$ 97',
      desc: 'O plano mais completo para igrejas em crescimento.',
      features: [
        'Tudo do Essencial',
        'WhatsApp automático',
        'Membros afastados',
        'Membros doentes',
        'Visitas pastorais',
        'Santa Ceia nas casas',
        'Até 10 obreiros',
      ],
      highlight: true,
    },
    {
      name: 'Avivamento',
      price: 'R$ 197',
      desc: 'Para igrejas maiores, ministérios e sedes regionais.',
      features: [
        'Tudo do Pastoreio',
        'Multi pastores',
        'Multi unidades',
        'Relatórios avançados',
        'Backup automático',
        'Suporte prioritário',
        'Acessos ilimitados',
      ],
      highlight: false,
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      color: '#fff',
      background:
        'radial-gradient(circle at top left, rgba(124,58,237,0.25), transparent 35%), radial-gradient(circle at top right, rgba(37,99,235,0.2), transparent 30%), linear-gradient(135deg,#030712 0%,#070B1A 45%,#020617 100%)',
    }}>
      <nav style={{
        maxWidth: 1180,
        margin: '0 auto',
        padding: '1.2rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: '1.2rem' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(124,58,237,0.45)',
          }}>
            ✚
          </div>
          CRM Bom Samaritano
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Funcionalidades</a>
          <a href="#pricing" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Planos</a>
          <button onClick={() => onNavigate('/login')} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            borderRadius: 10,
            fontWeight: 700,
          }}>
            Entrar
          </button>
          <button onClick={() => onNavigate('/register')} style={{
            background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)',
            border: 'none',
            color: '#fff',
            padding: '0.65rem 1.4rem',
            borderRadius: 10,
            fontWeight: 800,
            boxShadow: '0 10px 25px rgba(124,58,237,0.35)',
          }}>
            Começar grátis
          </button>
        </div>
      </nav>

      <header style={{
        maxWidth: 1180,
        margin: '0 auto',
        padding: '5rem 1.5rem 4rem',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '3rem',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            padding: '0.4rem 0.8rem',
            borderRadius: 999,
            background: 'rgba(124,58,237,0.14)',
            border: '1px solid rgba(124,58,237,0.35)',
            color: '#C4B5FD',
            fontSize: '0.82rem',
            fontWeight: 800,
            marginBottom: '1.2rem',
          }}>
            Plataforma SaaS para igrejas que cuidam de pessoas
          </div>

          <h1 style={{
            fontSize: '3.7rem',
            lineHeight: 1.05,
            margin: 0,
            fontWeight: 900,
            letterSpacing: '-0.05em',
          }}>
            O CRM pastoral inteligente para igrejas que desejam cuidar melhor.
          </h1>

          <p style={{
            color: '#9CA3AF',
            fontSize: '1.15rem',
            lineHeight: 1.7,
            margin: '1.5rem 0 2rem',
            maxWidth: 620,
          }}>
            Organize visitantes, acompanhe membros, envie mensagens pelo WhatsApp,
            cuide de aniversariantes, afastados, doentes e fortaleça o pastoreio da sua igreja.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('/register')} style={{
              padding: '1rem 2rem',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1rem',
              boxShadow: '0 15px 35px rgba(124,58,237,0.4)',
            }}>
              Criar conta grátis por 7 dias
            </button>

            <button style={{
              padding: '1rem 2rem',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1rem',
            }}>
              Ver demonstração
            </button>
          </div>

          <p style={{ color: '#6B7280', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Sem instalação. Acesse pelo computador, tablet ou celular.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 26,
          padding: '1rem',
          boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(18px)',
        }}>
          <div style={{
            borderRadius: 20,
            background: '#111827',
            padding: '1.2rem',
            minHeight: 360,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <strong>Dashboard Pastoral</strong>
              <span style={{ color: '#10B981', fontSize: '0.8rem' }}>● Online</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MiniStat title="Membros" value="1.248" color="#2563EB" />
              <MiniStat title="Visitantes" value="86" color="#7C3AED" />
              <MiniStat title="Aniversários" value="24" color="#F59E0B" />
              <MiniStat title="Orações" value="17" color="#10B981" />
            </div>

            <div style={{
              marginTop: 18,
              height: 140,
              borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.12))',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C4B5FD',
              fontWeight: 800,
            }}>
              Gráfico de crescimento da igreja
            </div>

            <div style={{
              marginTop: 18,
              display: 'grid',
              gap: 10,
            }}>
              <Activity text="Novo visitante cadastrado" />
              <Activity text="Mensagem enviada para aniversariante" />
              <Activity text="Pedido de oração recebido" />
            </div>
          </div>
        </div>
      </header>

      <section id="features" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.4rem', margin: 0, fontWeight: 900 }}>Tudo para cuidar melhor da igreja</h2>
            <p style={{ color: '#9CA3AF', marginTop: 10 }}>
              Um sistema criado para a rotina real de pastores, obreiros e equipes ministeriais.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
            <FeatureCard title="WhatsApp Pastoral" desc="Envie boas-vindas, aniversários, avisos, oração e acompanhamento automaticamente." />
            <FeatureCard title="Gestão de Visitantes" desc="O obreiro cadastra visitantes e o pastor acompanha tudo no painel." />
            <FeatureCard title="Membros Afastados" desc="Crie mensagens de cuidado para quem precisa retornar à comunhão." />
            <FeatureCard title="Membros Doentes" desc="Organize orações, visitas e mensagens de apoio pastoral." />
            <FeatureCard title="Visitas Pastorais" desc="Agende visitas, acompanhe status e registre Santa Ceia nas casas." />
            <FeatureCard title="Dashboard Inteligente" desc="Veja crescimento, aniversariantes, pedidos de oração e relatórios." />
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: '5rem 1.5rem', background: 'rgba(255,255,255,0.025)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.4rem', margin: 0, fontWeight: 900 }}>Planos para cada fase da sua igreja</h2>
            <p style={{ color: '#9CA3AF', marginTop: 10 }}>Comece simples e evolua conforme sua igreja cresce.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.3rem' }}>
            {plans.map(plan => (
              <div key={plan.name} style={{
                position: 'relative',
                padding: '2rem',
                borderRadius: 24,
                background: plan.highlight
                  ? 'linear-gradient(180deg, rgba(124,58,237,0.25), rgba(17,24,39,0.95))'
                  : 'rgba(17,24,39,0.78)',
                border: plan.highlight
                  ? '1px solid rgba(139,92,246,0.65)'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: plan.highlight
                  ? '0 0 45px rgba(124,58,237,0.32)'
                  : '0 20px 40px rgba(0,0,0,0.25)',
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)',
                    padding: '0.35rem 0.9rem',
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    fontWeight: 900,
                  }}>
                    MAIS ESCOLHIDO
                  </div>
                )}

                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{plan.name}</h3>
                <p style={{ color: '#9CA3AF', minHeight: 48 }}>{plan.desc}</p>

                <div style={{ margin: '1.5rem 0' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{plan.price}</span>
                  <span style={{ color: '#9CA3AF' }}>/mês</span>
                </div>

                <button onClick={() => onNavigate('/register')} style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: 14,
                  border: 'none',
                  background: plan.highlight
                    ? 'linear-gradient(135deg,#7C3AED,#8B5CF6)'
                    : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontWeight: 900,
                  marginBottom: '1.5rem',
                }}>
                  Começar agora
                </button>

                <div style={{ display: 'grid', gap: 10 }}>
                  {plan.features.map(item => (
                    <div key={item} style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: '#6B7280',
      }}>
        © 2026 CRM Bom Samaritano. Feito para igrejas que cuidam de pessoas.
      </footer>
    </div>
  )
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{
      background: 'rgba(17,24,39,0.76)',
      padding: '1.7rem',
      borderRadius: 22,
      border: '1px solid rgba(255,255,255,0.09)',
      boxShadow: '0 20px 45px rgba(0,0,0,0.28)',
      backdropFilter: 'blur(16px)',
    }}>
      <div style={{
        width: 42,
        height: 42,
        borderRadius: 14,
        background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
        marginBottom: '1rem',
        boxShadow: '0 0 22px rgba(124,58,237,0.4)',
      }} />
      <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.6rem' }}>{title}</h3>
      <p style={{ color: '#9CA3AF', lineHeight: 1.6, fontSize: '0.93rem' }}>{desc}</p>
    </div>
  )
}

function MiniStat({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div style={{
      background: `${color}20`,
      border: `1px solid ${color}55`,
      borderRadius: 16,
      padding: '1rem',
    }}>
      <div style={{ color, fontWeight: 900, fontSize: '1.3rem' }}>{value}</div>
      <div style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>{title}</div>
    </div>
  )
}

function Activity({ text }: { text: string }) {
  return (
    <div style={{
      padding: '0.8rem',
      borderRadius: 14,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#D1D5DB',
      fontSize: '0.85rem',
    }}>
      {text}
    </div>
  )
}