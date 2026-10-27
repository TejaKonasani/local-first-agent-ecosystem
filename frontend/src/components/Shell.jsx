import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { useTheme } from '../theme.jsx'
import { Modal } from './ui.jsx'
import {
  User, BarChart, Scale, Building, Home, Search, Shield,
  Sun, Moon, LogOut, Menu, X, ShieldCheck, WifiOff,
} from './icons.jsx'

const PORTAL_META = {
  employee: {
    title: 'Internal Employee',
    eyebrow: 'INTERNAL EMPLOYEE PORTAL',
    icon: User,
    tagline: 'Assigned cases, tax matters, legal work and local AI tasks.',
  },
  management: {
    title: 'Management / Executive',
    eyebrow: 'MANAGEMENT & EXECUTIVE PORTAL',
    icon: BarChart,
    tagline: 'Firm-wide analytics, workload, risk alerts and approvals.',
  },
  counsel: {
    title: 'Advocate / External Counsel',
    eyebrow: 'EXTERNAL COUNSEL PORTAL',
    icon: Scale,
    tagline: 'Assigned cases, drafts review, legal research and scope.',
  },
  client: {
    title: 'Client Portal',
    eyebrow: 'CONFIDENTIAL CLIENT PORTAL',
    icon: Building,
    tagline: 'Track cases, review final reports, submit requests and upload.',
  },
  tenant: {
    title: 'Tenant / Buyer / Vendor',
    eyebrow: 'TENANT & VENDOR PORTAL',
    icon: Home,
    tagline: 'Linked land parcels, project updates and service requests.',
  },
  auditor: {
    title: 'Regulator / Auditor',
    eyebrow: 'REGULATOR & AUDITOR PORTAL',
    icon: Search,
    tagline: 'Explicitly shared compliance records and verifiable audit trail.',
  },
  admin: {
    title: 'Admin / System Administrator',
    eyebrow: 'SYSTEM GOVERNANCE PORTAL',
    icon: Shield,
    tagline: 'User directory, 16-agent governance, approvals and audit logs.',
  },
}

function initials(name) {
  if (!name) return '?'
  const parts = name.replace(/\(.*\)/, '').trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

function firstName(displayName) {
  if (!displayName) return 'Counsel'
  const clean = displayName.replace(/\(.*\)/, '').trim()
  return clean.split(/\s+/)[0] || 'Counsel'
}

export default function Shell({ children }) {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [showSignoutModal, setShowSignoutModal] = useState(false)

  // Listen for online/offline events (Section 7)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const meta = PORTAL_META[user?.portal] || {
    title: 'Portal',
    eyebrow: 'GOVERNED PORTAL',
    icon: ShieldCheck,
    tagline: 'Local-First Agent Ecosystem',
  }
  const Icon = meta.icon

  async function handleConfirmedSignout() {
    setShowSignoutModal(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard-layout">
      {/* 9. Accessibility: Skip link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* 7. Offline Banner */}
      {!isOnline && (
        <div className="offline-banner" role="status">
          <WifiOff size={16} />
          <span>You are offline. Changes will not be saved.</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {drawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(14, 26, 43, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 35,
          }}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 4.4 Sidebar: 240px navy #0E1A2B fixed */}
      <aside
        className={`dashboard-sidebar ${drawerOpen ? 'is-open' : ''}`}
        aria-label="Sidebar navigation"
      >
        <div>
          <div className="sidebar-logo-lockup">
            <div className="logo-tile" aria-hidden="true">
              <ShieldCheck size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>
                Local-First Agents
              </span>
              <span style={{ fontSize: 11, color: '#A9B4C7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Legal & Compliance
              </span>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Portal Navigation">
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6F8299', fontWeight: 600, padding: '0 12px 6px' }}>
              WORKSPACE
            </span>
            <Link
              to={`/portal/${user?.portal}`}
              className="sidebar-link active"
              onClick={() => setDrawerOpen(false)}
            >
              <Icon size={18} />
              <span>{meta.title}</span>
            </Link>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile-tile">
            <div className="user-avatar" aria-hidden="true">
              {initials(user?.display_name)}
            </div>
            <div className="user-info">
              <span className="user-name" title={user?.display_name}>
                {user?.display_name}
              </span>
              <span className="user-role">
                {user?.role} · {user?.portal}
              </span>
            </div>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', color: '#C3CCDB', padding: '0 8px' }}
            onClick={() => setShowSignoutModal(true)}
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main id="main-content" className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div>
            <div className="eyebrow">{meta.eyebrow}</div>
            <h2>Good morning, {firstName(user?.display_name)}</h2>
            <div className="breadcrumb-trail">
              Home / Portals / <span style={{ color: 'var(--main-text)', fontWeight: 500 }}>{meta.title}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* Dark mode toggle */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ width: 44, height: 44, padding: 0 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile hamburger menu button */}
            <button
              className="btn btn-secondary btn-sm nav-hamburger"
              onClick={() => setDrawerOpen((s) => !s)}
              aria-label="Toggle navigation drawer"
              style={{ width: 44, height: 44, padding: 0 }}
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* Children Portal Content */}
        {children}
      </main>

      {/* 5. Modal: Sign out confirmation */}
      <Modal
        isOpen={showSignoutModal}
        title="Confirm sign out"
        onClose={() => setShowSignoutModal(false)}
      >
        <p style={{ color: 'var(--secondary-text)', marginBottom: 'var(--space-6)' }}>
          Are you sure you want to sign out of <b>{user?.display_name}</b>'s portal session? Your local workspace credentials and history remain securely on your hardware.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => setShowSignoutModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirmedSignout}>
            Sign out
          </button>
        </div>
      </Modal>
    </div>
  )
}
