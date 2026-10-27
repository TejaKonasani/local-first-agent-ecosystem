import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { useTheme } from '../theme.jsx'
import {
  User, BarChart, Scale, Building, Home, Search, Shield, Cpu,
  Sun, Moon, LogOut, Menu, X, ShieldCheck,
} from './icons.jsx'

const PORTAL_META = {
  employee: {
    title: 'Internal Employee',
    icon: User,
    tagline: 'Assigned cases, documents, tax, legal work and AI tasks.',
  },
  management: {
    title: 'Management / Executive',
    icon: BarChart,
    tagline: 'Firm-wide operations, analytics, risk and workload.',
  },
  counsel: {
    title: 'Advocate / External Counsel',
    icon: Scale,
    tagline: 'Assigned cases, research, draft review and collaboration.',
  },
  client: {
    title: 'Client',
    icon: Building,
    tagline: 'Submit requests, upload documents, track cases and reports.',
  },
  tenant: {
    title: 'Tenant / Buyer / Vendor',
    icon: Home,
    tagline: 'Property & project info, requests and updates.',
  },
  auditor: {
    title: 'Regulator / Auditor',
    icon: Search,
    tagline: 'Explicitly shared compliance & audit records.',
  },
  admin: {
    title: 'Admin / System Administrator',
    icon: Shield,
    tagline: 'Platform overview, users, AI ops, governance and audit.',
  },
}

function initials(name) {
  if (!name) return '?'
  const parts = name.replace(/\(.*\)/, '').trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

export default function Shell({ children }) {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const meta = PORTAL_META[user?.portal] || {
    title: 'Portal',
    icon: ShieldCheck,
    tagline: '',
  }
  const Icon = meta.icon

  async function doLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="shell">
      {menuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={'sidebar' + (menuOpen ? ' open' : '')} aria-label="Primary">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <ShieldCheck size={22} />
          </span>
          <div>
            <div className="mark">Local-First Agent</div>
            <div className="name">Legal &amp; Compliance Ecosystem</div>
          </div>
        </div>

        <nav className="nav" aria-label="Portal navigation">
          <div className="navlabel">Your workspace</div>
          <a
            className="active"
            href="#"
            aria-current="page"
            onClick={(e) => {
              e.preventDefault()
              setMenuOpen(false)
              navigate(`/portal/${user.portal}`)
            }}
          >
            <span className="ico" aria-hidden="true">
              <Icon />
            </span>
            <span>{meta.title}</span>
          </a>
        </nav>

        <div className="sidebar-foot">
          <div className="userchip">
            <div className="avatar" aria-hidden="true">{initials(user.display_name)}</div>
            <div className="who">
              <div className="nm">{user.display_name}</div>
              <div className="rl">{user.role} · {user.portal}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={doLogout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
            <div style={{ minWidth: 0 }}>
              <h1>
                <span className="topbar-ico" aria-hidden="true">
                  <Icon />
                </span>
                {meta.title}
              </h1>
              <div className="tagline">{meta.tagline}</div>
            </div>
          </div>
          <div className="topbar-right">
            <div className="signedin">
              Signed in as <b>{user.username}</b>
            </div>
            <button
              className="theme-toggle"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}