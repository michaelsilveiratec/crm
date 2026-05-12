import { useState, useEffect } from 'preact/hooks';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  is_visitor: boolean;
  spiritual_status: string;
  last_contact_date: string;
  follow_up_notes: string;
  status: string;
  photo_url?: string;
}

export function MembersList({ role }: { role: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'members' | 'visitors'>('all');
  const [showModal, setShowModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  const apiPrefix = role === 'pastor' ? '/api/pastor' : '/api/worker';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    address: '',
    neighborhood: '',
    city: '',
    birth_date: '',
    is_visitor: true,
    spiritual_status: 'NOVO',
    observations: '',
    photo_url: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    setLoading(true);
    fetch(`${apiPrefix}/members`)
      .then(res => res.json())
      .then(data => setMembers(data || []))
      .finally(() => setLoading(false));
  };

  const handlePhotoChange = (e: any) => {
    const file = e.currentTarget.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert('Formato inválido. Envie uma imagem JPG, PNG ou WEBP.');
      return;
    }

    if (file.size > maxSize) {
      alert('A foto deve ter no máximo 2MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || '');

      setPhotoPreview(result);
      setFormData(prev => ({
        ...prev,
        photo_url: result
      }));
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview('');
    setFormData(prev => ({
      ...prev,
      photo_url: ''
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      address: '',
      neighborhood: '',
      city: '',
      birth_date: '',
      is_visitor: true,
      spiritual_status: 'NOVO',
      observations: '',
      photo_url: ''
    });

    setPhotoPreview('');
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();

    try {
      const resp = await fetch(`${apiPrefix}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (resp.ok) {
        setShowModal(false);
        resetForm();
        fetchMembers();
      }
    } catch (err) {
      alert("Erro ao salvar cadastro");
    }
  };

  const filteredMembers = members.filter(m => {
    if (filter === 'members') return !m.is_visitor;
    if (filter === 'visitors') return m.is_visitor;
    return true;
  });

  const getSpiritualBadge = (status: string) => {
    switch (status) {
      case 'CONVERTIDO': return <span className="badge info">Convertido</span>;
      case 'BATIZADO': return <span className="badge active">Batizado</span>;
      case 'MEMBRO_ATIVO': return <span className="badge active">Membro Ativo</span>;
      case 'DISCIPULADO': return <span className="badge warning">Em Discipulado</span>;
      default: return <span className="badge secondary">Visitante</span>;
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1>👥 Gestão de Membros e Visitantes</h1>
          <p>Acompanhe a jornada espiritual de cada pessoa na igreja.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Novo Cadastro</button>
      </div>

      <div className="filters-bar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button className={`btn-secondary ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todos</button>
        <button className={`btn-secondary ${filter === 'members' ? 'active' : ''}`} onClick={() => setFilter('members')}>Apenas Membros</button>
        <button className={`btn-secondary ${filter === 'visitors' ? 'active' : ''}`} onClick={() => setFilter('visitors')}>Apenas Visitantes</button>
      </div>

      <div className="modern-card">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Status Espiritual</th>
              <th>Último Contato</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  Carregando...
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : filteredMembers.map(m => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <PhotoAvatar
                      name={m.name}
                      photo={m.photo_url || ''}
                      size={46}
                      isVisitor={m.is_visitor}
                    />

                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {m.whatsapp || m.phone || 'Sem WhatsApp'}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <span style={{ fontSize: '0.85rem', color: m.is_visitor ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
                    {m.is_visitor ? '🔸 Visitante' : '🔹 Membro'}
                  </span>
                </td>

                <td>{getSpiritualBadge(m.spiritual_status)}</td>

                <td>
                  <div style={{ fontSize: '0.85rem' }}>{m.last_contact_date || 'Nunca'}</div>
                  {m.follow_up_notes && (
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#94a3b8',
                        maxWidth: '150px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={m.follow_up_notes}
                    >
                      {m.follow_up_notes}
                    </div>
                  )}
                </td>

                <td>
                  <div className="action-btns">
                    <button className="btn-icon" title="Acompanhamento">📋</button>
                    <button className="btn-icon" title="Editar">✏️</button>
                    <button className="btn-icon delete" title="Excluir">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.68)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
        >
          <div
            className="modern-card"
            style={{
              width: '520px',
              maxWidth: '95%',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
          >
            <div className="modern-card-header">
              <div>
                <h2 className="modern-card-title">Novo Cadastro</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                  Cadastre membro ou visitante com foto de identificação.
                </p>
              </div>

              <button
                type="button"
                className="btn-icon"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <PhotoAvatar
                  name={formData.name}
                  photo={photoPreview}
                  size={82}
                  isVisitor={formData.is_visitor}
                />

                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: 4 }}>
                    Foto do Membro / Visitante
                  </strong>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5, margin: '0 0 0.8rem' }}>
                    Envie uma foto para facilitar a identificação no acompanhamento pastoral. JPG, PNG ou WEBP até 2MB.
                  </p>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <label
                      className="btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        width: 'fit-content'
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label>
                  Nome Completo
                  <input
                    type="text"
                    value={formData.name}
                    onInput={e => setFormData({ ...formData, name: e.currentTarget.value })}
                    required
                  />
                </label>

                <label>
                  E-mail
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onInput={e => setFormData({ ...formData, email: e.currentTarget.value })}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label>
                  WhatsApp
                  <input
                    type="text"
                    placeholder="Ex: 21999999999"
                    value={formData.whatsapp}
                    onInput={e => setFormData({ ...formData, whatsapp: e.currentTarget.value })}
                    required
                  />
                </label>

                <label>
                  Endereço
                  <input
                    type="text"
                    placeholder="Rua, Número..."
                    value={formData.address}
                    onInput={e => setFormData({ ...formData, address: e.currentTarget.value })}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label>
                  Bairro
                  <input
                    type="text"
                    placeholder="Ex: Engenho Novo"
                    value={formData.neighborhood}
                    onInput={e => setFormData({ ...formData, neighborhood: e.currentTarget.value })}
                  />
                </label>

                <label>
                  Cidade
                  <input
                    type="text"
                    placeholder="Ex: Rio de Janeiro"
                    value={formData.city}
                    onInput={e => setFormData({ ...formData, city: e.currentTarget.value })}
                  />
                </label>
              </div>

              <label>
                Data de Nascimento
                <input
                  type="date"
                  value={formData.birth_date}
                  onInput={e => setFormData({ ...formData, birth_date: e.currentTarget.value })}
                />
              </label>

              <label>
                Tipo de Cadastro
                <select
                  value={formData.is_visitor ? 'true' : 'false'}
                  onChange={e => setFormData({ ...formData, is_visitor: e.currentTarget.value === 'true' })}
                >
                  <option value="true">Visitante (Primeira Vez)</option>
                  <option value="false">Membro (Batizado/Convertido)</option>
                </select>
              </label>

              <label>
                Status Espiritual
                <select
                  value={formData.spiritual_status}
                  onChange={e => setFormData({ ...formData, spiritual_status: e.currentTarget.value })}
                >
                  <option value="NOVO">Novo na Igreja</option>
                  <option value="CONVERTIDO">Convertido</option>
                  <option value="BATIZADO">Batizado</option>
                  <option value="DISCIPULADO">Em Discipulado</option>
                  <option value="MEMBRO_ATIVO">Membro Ativo</option>
                </select>
              </label>

              <label>
                Observações
                <textarea
                  value={formData.observations}
                  onInput={e => setFormData({ ...formData, observations: e.currentTarget.value })}
                />
              </label>

              <div className="form-actions" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-primary">
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoAvatar({
  name,
  photo,
  size,
  isVisitor,
}: {
  name: string;
  photo: string;
  size: number;
  isVisitor: boolean;
}) {
  const initials = (name || 'PS')
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: photo
          ? 'rgba(255,255,255,0.04)'
          : isVisitor
            ? 'linear-gradient(135deg,#F59E0B,#8B5CF6)'
            : 'linear-gradient(135deg,#10B981,#2563EB)',
        border: '3px solid rgba(255,255,255,0.12)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 900,
        fontSize: size >= 80 ? '1.2rem' : '0.78rem',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt={`Foto de ${name || 'pessoa cadastrada'}`}
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
  );
}