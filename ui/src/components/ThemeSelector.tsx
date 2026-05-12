import { useEffect, useState } from 'preact/hooks'

type ThemeName = 'theme-navy' | 'theme-dark' | 'theme-light'

interface ThemeOption {
    key: ThemeName
    title: string
    description: string
    preview: string
    icon: string
}

const THEME_STORAGE_KEY = 'crm_theme'

const themes: ThemeOption[] = [
    {
        key: 'theme-navy',
        title: 'Azul Marinho Original',
        description: 'Tema padrão do CRM Bom Samaritano',
        preview: 'navy',
        icon: '🌌',
    },
    {
        key: 'theme-dark',
        title: 'Escuro',
        description: 'Visual preto, moderno e elegante',
        preview: 'dark',
        icon: '🌑',
    },
    {
        key: 'theme-light',
        title: 'Branco',
        description: 'Visual claro para ambientes iluminados',
        preview: 'light',
        icon: '☀️',
    },
]

function isValidTheme(theme: string | null): theme is ThemeName {
    return theme === 'theme-navy' || theme === 'theme-dark' || theme === 'theme-light'
}

function applyTheme(theme: ThemeName) {
    document.body.classList.remove('theme-navy', 'theme-dark', 'theme-light')
    document.body.classList.add(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function ThemeSelector() {
    const [currentTheme, setCurrentTheme] = useState<ThemeName>('theme-navy')
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        const theme: ThemeName = isValidTheme(savedTheme) ? savedTheme : 'theme-navy'

        applyTheme(theme)
        setCurrentTheme(theme)
    }, [])

    const handleChangeTheme = (theme: ThemeName) => {
        applyTheme(theme)
        setCurrentTheme(theme)
        setSaved(true)

        setTimeout(() => {
            setSaved(false)
        }, 2500)
    }

    return (
        <div className="modern-card">
            <div className="modern-card-header">
                <div>
                    <h2 className="modern-card-title">🎨 Aparência do Sistema</h2>

                    <p
                        style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            marginTop: 4,
                        }}
                    >
                        Escolha o tema visual do CRM. A preferência ficará salva neste navegador.
                    </p>
                </div>
            </div>

            {saved && (
                <div className="theme-saved-alert">
                    ✅ Tema aplicado com sucesso.
                </div>
            )}

            <div className="theme-option-grid">
                {themes.map(theme => (
                    <button
                        key={theme.key}
                        type="button"
                        className={`theme-option-card ${currentTheme === theme.key ? 'active' : ''}`}
                        onClick={() => handleChangeTheme(theme.key)}
                    >
                        <div className={`theme-preview ${theme.preview}`} />

                        <div className="theme-option-info">
                            <strong>
                                {theme.icon} {theme.title}
                            </strong>

                            <span>{theme.description}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}