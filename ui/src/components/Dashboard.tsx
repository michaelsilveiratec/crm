import { useState, useEffect } from 'preact/hooks';
import { BirthdayAlert } from './BirthdayAlert';
export function Dashboard() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch('/api/pastor/members');
                if (!response.ok) {
                    throw new Error('Erro ao carregar dados do painel.');
                }
                const data = await response.json();
                setMembers(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (m.attendant_name && m.attendant_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Métricas simples
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let countThisWeek = 0;
    let countThisMonth = 0;

    members.forEach(m => {
        const d = new Date(m.created_at);
        if (d >= startOfWeek) countThisWeek++;
        if (d >= startOfMonth) countThisMonth++;
    });

    if (loading) return <div aria-busy="true">Carregando painel...</div>;
    if (error) return <article style={{ borderColor: 'var(--pico-del-color)' }}>{error}</article>;

    return (
        <div>
            <div className="grid">
                <article>
                    <header><strong>Visitantes nesta Semana</strong></header>
                    <h1 style={{ marginBottom: 0, color: 'var(--pico-primary)' }}>{countThisWeek}</h1>
                </article>
                <article>
                    <header><strong>Visitantes neste Mês</strong></header>
                    <h1 style={{ marginBottom: 0, color: 'var(--pico-primary)' }}>{countThisMonth}</h1>
                </article>
                <article>
                    <header><strong>Total de Cadastros</strong></header>
                    <h1 style={{ marginBottom: 0 }}>{members.length}</h1>
                </article>
            </div>

            <article>
                <header>
                    <nav>
                        <ul>
                            <li><strong>Lista de Visitantes e Membros</strong></li>
                        </ul>
                        <ul>
                            <li>
                                <input 
                                    type="search" 
                                    placeholder="Buscar por nome ou atendente..." 
                                    value={searchTerm}
                                    onInput={(e: any) => setSearchTerm(e.target.value)}
                                    style={{ marginBottom: 0 }}
                                />
                            </li>
                        </ul>
                    </nav>
                </header>

                <div className="overflow-auto">
                    <table className="striped">
                        <thead>
                            <tr>
                                <th scope="col">Data</th>
                                <th scope="col">Nome</th>
                                <th scope="col">WhatsApp</th>
                                <th scope="col">Atendente</th>
                                <th scope="col">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>Nenhum registro encontrado.</td>
                                </tr>
                            ) : (
                                filteredMembers.map(m => (
                                    <tr key={m.id}>
                                        <td>{new Date(m.created_at).toLocaleDateString('pt-BR')}</td>
                                        <td><strong>{m.name}</strong></td>
                                        <td>
                                            <a href={`https://wa.me/${m.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                                {m.whatsapp}
                                            </a>
                                        </td>
                                        <td>{m.attendant_name || '-'}</td>
                                        <td>
                                            <details>
                                                <summary>Ver mais</summary>
                                                <p>
                                                    <strong>Nascimento:</strong> {m.birth_date ? new Date(m.birth_date).toLocaleDateString('pt-BR') : '-'}<br/>
                                                    <strong>Estado Civil:</strong> {m.marital_status || '-'}<br/>
                                                    <strong>Endereço:</strong> {m.address || '-'}
                                                </p>
                                                {m.observations && (
                                                    <blockquote>
                                                        {m.observations}
                                                    </blockquote>
                                                )}
                                            </details>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </article>
        </div>
    );
}
