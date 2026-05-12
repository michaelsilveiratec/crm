import { useState } from 'preact/hooks'

export function MemberForm() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        whatsapp: '',
        birth_date: '',
        attendant_name: '',
        marital_status: '',
        observations: '',
        photo_url: '',
    })

    const [photoPreview, setPhotoPreview] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({
        text: '',
        type: '',
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePhotoChange = (e: any) => {
        const file = e.currentTarget.files?.[0]

        if (!file) return

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        const maxSize = 2 * 1024 * 1024

        if (!allowedTypes.includes(file.type)) {
            setMessage({
                text: 'Formato inválido. Envie uma imagem JPG, PNG ou WEBP.',
                type: 'error',
            })
            return
        }

        if (file.size > maxSize) {
            setMessage({
                text: 'A foto deve ter no máximo 2MB.',
                type: 'error',
            })
            return
        }

        const reader = new FileReader()

        reader.onload = () => {
            const result = String(reader.result || '')

            setPhotoPreview(result)
            setFormData(prev => ({
                ...prev,
                photo_url: result,
            }))

            setMessage({ text: '', type: '' })
        }

        reader.readAsDataURL(file)
    }

    const removePhoto = () => {
        setPhotoPreview('')
        setFormData(prev => ({
            ...prev,
            photo_url: '',
        }))
    }

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            phone: '',
            whatsapp: '',
            birth_date: '',
            attendant_name: '',
            marital_status: '',
            observations: '',
            photo_url: '',
        })

        setPhotoPreview('')
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: '', type: '' })

        try {
            const response = await fetch('/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (response.ok) {
                setMessage({
                    text: 'Cadastro realizado com sucesso! O pastor já poderá acompanhar este visitante.',
                    type: 'success',
                })

                resetForm()
            } else {
                setMessage({
                    text: result.error || 'Erro ao cadastrar visitante.',
                    type: 'error',
                })
            }
        } catch (error) {
            setMessage({
                text: 'Erro de conexão com o servidor. Tente novamente.',
                type: 'error',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <span
                        style={{
                            display: 'inline-flex',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 999,
                            background: 'rgba(16,185,129,0.14)',
                            border: '1px solid rgba(16,185,129,0.35)',
                            color: '#34D399',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            marginBottom: '0.75rem',
                        }}
                    >
                        Área do Obreiro
                    </span>

                    <h1>📝 Cadastro de Visitante</h1>

                    <p>
                        Registre visitantes, pedidos de oração e informações importantes para
                        o acompanhamento pastoral.
                    </p>
                </div>
            </div>

            {message.text && (
                <Alert type={message.type as 'success' | 'error'} message={message.text} />
            )}

            <div
                className="content-grid"
                style={{
                    gridTemplateColumns: '1.2fr 0.8fr',
                    alignItems: 'start',
                }}
            >
                <div className="modern-card">
                    <div className="modern-card-header">
                        <div>
                            <h2 className="modern-card-title">Novo Cadastro</h2>
                            <p
                                style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    marginTop: 4,
                                }}
                            >
                                Preencha os dados principais do visitante para que o pastor possa
                                fazer o acompanhamento.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <div
                            style={{
                                padding: '1rem',
                                borderRadius: 20,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'center',
                            }}
                        >
                            <PhotoAvatar
                                name={formData.name}
                                photo={photoPreview}
                                size={86}
                            />

                            <div style={{ flex: 1 }}>
                                <strong
                                    style={{
                                        display: 'block',
                                        color: 'var(--text-main)',
                                        fontSize: '0.95rem',
                                        marginBottom: 4,
                                    }}
                                >
                                    Foto do Visitante / Membro
                                </strong>

                                <p
                                    style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '0.8rem',
                                        lineHeight: 1.5,
                                        margin: '0 0 0.8rem',
                                    }}
                                >
                                    Envie uma foto para facilitar a identificação no acompanhamento pastoral.
                                    Formatos aceitos: JPG, PNG ou WEBP até 2MB.
                                </p>

                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                    <label
                                        className="btn-primary"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            width: 'fit-content',
                                        }}
                                    >
                                        Escolher Foto
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handlePhotoChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>

                                    {photoPreview && (
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={removePhoto}
                                        >
                                            Remover
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                            }}
                        >
                            <label>
                                Nome Completo *
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onInput={handleChange}
                                    required
                                    placeholder="Nome do visitante"
                                />
                            </label>

                            <label>
                                WhatsApp *
                                <input
                                    type="text"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onInput={handleChange}
                                    required
                                    placeholder="Ex: 11999999999"
                                />
                            </label>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                            }}
                        >
                            <label>
                                Telefone Fixo
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onInput={handleChange}
                                    placeholder="Ex: 1133334444"
                                />
                            </label>

                            <label>
                                Data de Nascimento
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onInput={handleChange}
                                />
                            </label>
                        </div>

                        <label>
                            Endereço
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onInput={handleChange}
                                placeholder="Rua, número, bairro e cidade"
                            />
                        </label>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                            }}
                        >
                            <label>
                                Atendente / Obreiro
                                <input
                                    type="text"
                                    name="attendant_name"
                                    value={formData.attendant_name}
                                    onInput={handleChange}
                                    placeholder="Quem realizou o atendimento"
                                />
                            </label>

                            <label>
                                Estado Civil
                                <select
                                    name="marital_status"
                                    value={formData.marital_status}
                                    onChange={handleChange}
                                >
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
                            <textarea
                                name="observations"
                                value={formData.observations}
                                onInput={handleChange}
                                rows={4}
                                placeholder="Descreva pedido de oração, necessidade, origem da visita ou observação pastoral..."
                                style={{ resize: 'vertical' }}
                            />
                        </label>

                        <div
                            style={{
                                padding: '1rem',
                                borderRadius: 18,
                                background: 'rgba(124,58,237,0.08)',
                                border: '1px solid rgba(124,58,237,0.22)',
                            }}
                        >
                            <strong style={{ color: '#C4B5FD', fontSize: '0.9rem' }}>
                                Importante
                            </strong>

                            <p
                                style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.82rem',
                                    lineHeight: 1.6,
                                    margin: '0.4rem 0 0',
                                }}
                            >
                                Após o cadastro, o pastor poderá visualizar este visitante,
                                enviar mensagem de boas-vindas e acompanhar o cuidado espiritual.
                            </p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={resetForm}
                                disabled={loading}
                            >
                                Limpar
                            </button>

                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Salvando...' : 'Cadastrar Visitante'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="modern-card">
                    <div className="modern-card-header">
                        <div>
                            <h2 className="modern-card-title">Resumo do Atendimento</h2>
                            <p
                                style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    marginTop: 4,
                                }}
                            >
                                Prévia rápida do cadastro antes de salvar.
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                        }}
                    >
                        <PhotoAvatar
                            name={formData.name}
                            photo={photoPreview}
                            size={96}
                        />
                    </div>

                    <PreviewCard label="Nome" value={formData.name || 'Não informado'} icon="👤" />
                    <PreviewCard label="WhatsApp" value={formData.whatsapp || 'Não informado'} icon="💬" />
                    <PreviewCard label="Atendente" value={formData.attendant_name || 'Não informado'} icon="🤝" />
                    <PreviewCard label="Estado Civil" value={formData.marital_status || 'Não informado'} icon="💍" />

                    <div
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            borderRadius: 18,
                            background: 'rgba(16,185,129,0.08)',
                            border: '1px solid rgba(16,185,129,0.22)',
                        }}
                    >
                        <strong style={{ color: '#34D399', fontSize: '0.9rem' }}>
                            Fluxo pastoral
                        </strong>

                        <p
                            style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.82rem',
                                lineHeight: 1.6,
                                margin: '0.4rem 0 0',
                            }}
                        >
                            1. Obreiro cadastra o visitante. <br />
                            2. Pastor visualiza no painel. <br />
                            3. Pastor envia mensagem de boas-vindas. <br />
                            4. Igreja acompanha a pessoa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PhotoAvatar({
    name,
    photo,
    size,
}: {
    name: string
    photo: string
    size: number
}) {
    const initials = (name || 'VS')
        .split(' ')
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase()

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: photo
                    ? 'rgba(255,255,255,0.04)'
                    : 'linear-gradient(135deg,#10B981,#2563EB)',
                border: '3px solid rgba(255,255,255,0.12)',
                boxShadow: '0 14px 34px rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: size >= 90 ? '1.4rem' : '1.05rem',
                overflow: 'hidden',
                flexShrink: 0,
            }}
        >
            {photo ? (
                <img
                    src={photo}
                    alt="Foto do visitante"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            ) : (
                initials
            )}
        </div>
    )
}

function PreviewCard({
    label,
    value,
    icon,
}: {
    label: string
    value: string
    icon: string
}) {
    return (
        <div
            style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: '0.9rem 0',
                borderBottom: '1px solid var(--border)',
            }}
        >
            <div
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(124,58,237,0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>

            <div style={{ minWidth: 0 }}>
                <div
                    style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                    }}
                >
                    {label}
                </div>

                <div
                    style={{
                        color: 'var(--text-main)',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {value}
                </div>
            </div>
        </div>
    )
}

function Alert({
    type,
    message,
}: {
    type: 'success' | 'error'
    message: string
}) {
    const isSuccess = type === 'success'

    return (
        <div
            style={{
                padding: '0.9rem 1rem',
                borderRadius: 16,
                background: isSuccess ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)',
                border: isSuccess
                    ? '1px solid rgba(16,185,129,0.3)'
                    : '1px solid rgba(239,68,68,0.3)',
                color: isSuccess ? '#34D399' : '#F87171',
                fontWeight: 800,
                fontSize: '0.85rem',
                marginBottom: '1rem',
            }}
        >
            {isSuccess ? '✅' : '⚠️'} {message}
        </div>
    )
}