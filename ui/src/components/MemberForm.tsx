import { useState } from 'preact/hooks';

export function MemberForm() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        whatsapp: '',
        birth_date: '',
        attendant_name: '',
        marital_status: '',
        observations: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch('/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage({ text: 'Cadastro realizado com sucesso!', type: 'success' });
                setFormData({
                    name: '',
                    address: '',
                    phone: '',
                    whatsapp: '',
                    birth_date: '',
                    attendant_name: '',
                    marital_status: '',
                    observations: ''
                });
            } else {
                setMessage({ text: result.error || 'Erro ao cadastrar', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Erro de conexão com o servidor', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <article>
            <header>
                <strong>Novo Cadastro de Visitante</strong>
            </header>
            <form onSubmit={handleSubmit}>
                <div className="grid">
                    <label>
                        Nome Completo *
                        <input type="text" name="name" value={formData.name} onInput={handleChange} required placeholder="Nome do visitante" />
                    </label>
                    <label>
                        WhatsApp *
                        <input type="text" name="whatsapp" value={formData.whatsapp} onInput={handleChange} required placeholder="(00) 00000-0000" />
                    </label>
                </div>

                <div className="grid">
                    <label>
                        Telefone Fixo
                        <input type="text" name="phone" value={formData.phone} onInput={handleChange} placeholder="(00) 0000-0000" />
                    </label>
                    <label>
                        Data de Nascimento
                        <input type="date" name="birth_date" value={formData.birth_date} onInput={handleChange} />
                    </label>
                </div>

                <label>
                    Endereço
                    <input type="text" name="address" value={formData.address} onInput={handleChange} placeholder="Rua, número, bairro..." />
                </label>

                <div className="grid">
                    <label>
                        Atendente (Obreiro)
                        <input type="text" name="attendant_name" value={formData.attendant_name} onInput={handleChange} placeholder="Quem realizou o atendimento" />
                    </label>
                    <label>
                        Estado Civil
                        <select name="marital_status" value={formData.marital_status} onChange={handleChange}>
                            <option value="">Selecione...</option>
                            <option value="solteiro">Solteiro(a)</option>
                            <option value="casado">Casado(a)</option>
                            <option value="divorciado">Divorciado(a)</option>
                            <option value="viuvo">Viúvo(a)</option>
                        </select>
                    </label>
                </div>

                <label>
                    Observações / Pedido de Oração
                    <textarea name="observations" value={formData.observations} onInput={handleChange} rows={3} placeholder="Descreva o pedido ou observação pastoral"></textarea>
                </label>

                {message.text && (
                    <p style={{ color: message.type === 'success' ? 'green' : 'red', fontWeight: 'bold' }}>
                        {message.text}
                    </p>
                )}

                <button type="submit" aria-busy={loading}>
                    {loading ? 'Salvando...' : 'Cadastrar Membro'}
                </button>
            </form>
        </article>
    );
}
