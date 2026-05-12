import { render } from 'preact'
import './index.css'
import { Root } from './Root'

type ThemeName = 'theme-navy' | 'theme-dark' | 'theme-light'

const validThemes: ThemeName[] = ['theme-navy', 'theme-dark', 'theme-light']

const savedTheme = localStorage.getItem('crm_theme')

const theme: ThemeName = validThemes.includes(savedTheme as ThemeName)
    ? (savedTheme as ThemeName)
    : 'theme-navy'

document.body.classList.remove('theme-navy', 'theme-dark', 'theme-light')
document.body.classList.add(theme)

render(<Root />, document.getElementById('app')!)