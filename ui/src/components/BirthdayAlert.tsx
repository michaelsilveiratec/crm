import { useState, useEffect } from 'preact/hooks';

interface Birthday {
  id: number;
  name: string;
  whatsapp: string;
  birth_date: string;
}

export function BirthdayAlert() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const resp = await fetch('/api/pastor/birthdays');
        if (!resp.ok) throw new Error('Erro ao obter aniversariantes');
        const data = await resp.json();
        setBirthdays(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBirthdays();
  }, []);

  const sendMessage = async (memberId: number, template: string) => {
    try {
      const resp = await fetch('/api/pastor/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId, template })
      });
      if (!resp.ok) throw new Error('Falha ao gerar link');
      const { url } = await resp.json();
      window.open(url, '_blank');
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) return <div aria-busy="true">Carregando aniversariantes...</div>;
  if (error) return <article style={{ borderColor: 'var(--pico-del-color)' }}>{error}</article>;

  if (birthdays.length === 0) return null; // nothing to show

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Aniversariantes do dia</h2>
      <ul>
        {birthdays.map(b => (
          <li key={b.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{b.name}</strong> ({new Date(b.birth_date).toLocaleDateString('pt-BR')})
            <button
              className="contrast"
              style={{ marginLeft: '1rem' }}
              onClick={() => sendMessage(b.id, `Feliz aniversário, ${b.name}!`)}
            >
              Enviar WhatsApp
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
