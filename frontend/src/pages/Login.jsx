import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { api } from '../api.js'
import {
  ShieldCheck, User, BarChart, Scale, Building, Home, Search, Shield,
  Eye, EyeOff, ArrowRight, Check, AlertTriangle,
} from '../components/icons.jsx'

const PORTAL_ICONS = {
  employee: User,
  management: BarChart,
  counsel: Scale,
  client: Building,
  tenant: Home,
  auditor: Search,
  admin: Shield,
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [logins, setLogins] = useState([])
  const [sel, setSel] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  useEffect(() => {
    document.title = 'Sign in | Local-First Agents'
    api
      .demo()
      .then((r) => {
        setLogins(r.logins || [])
        if (r.logins && r.logins.length > 0) {
          const first = r.logins[0]
          setSel(first.portal)
          setUsername(first.username)
          setPassword(first.password)
        }
      })
      .catch(() => {
        // Offline demo fallback still maintains operational credentials
      })
  }, [])

  function pickRole(l) {
    setSel(l.portal)
    setUsername(l.username)
    setPassword(l.password)
    setErr(null)
  }

  async function submit(e) {
    e.preventDefault()
    if (!username || !password) return
    setBusy(true)
    setErr(null)
    try {
      const user = await login(username, password)
      navigate(`/portal/${user.portal}`, { replace: true })
    } catch (e2) {
      setErr(e2.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-split">
      {/* 4.2 Left Panel: 5/12 navy #0E1A2B with subtle 48px grid */}
      <div className="login-left">
        <div className="login-grid-bg" aria-hidden="true" />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" className="logo-brand">
            <div className="logo-tile" aria-hidden="true">
              <ShieldCheck size={20} />
            </div>
            <span className="logo-brand-text" style={{ color: '#FFFFFF' }}>
              Local-First Agents
            </span>
          </Link>

          <h2 className="login-left-headline">
            One governed platform.<br />
            Seven role-based portals.
          </h2>
          <p className="login-left-subtext">
            Enterprise legal and compliance workflows running privately on your local hardware.
            Governed by 16 multi-agent orchestrators with built-in sensitivity ladders, approval gates,
            and immutable audit trails.
          </p>
        </div>

        <div className="login-demo-note" style={{ position: 'relative', zIndex: 1 }}>
          Demo evaluation build · In-memory state · Local privacy guaranteed
        </div>
      </div>

      {/* 4.2 Right Panel: 7/12 ivory with max-width 480px */}
      <div className="login-right">
        <div className="login-form-wrap" data-aos="fade-up">
          <div className="eyebrow">SIGN IN</div>
          <h2 style={{ marginBottom: 'var(--space-2)' }}>Choose your portal</h2>
          <p className="caption" style={{ marginBottom: 'var(--space-5)' }}>
            Select a demo portal below to autofill credentials, or enter custom account details.
          </p>

          {/* 7 Role Cards in 2-column grid */}
          {logins.length > 0 && (
            <div className="role-grid-login" role="group" aria-label="Portal selection">
              {logins.map((l) => {
                const Icon = PORTAL_ICONS[l.portal] || ShieldCheck
                const isSelected = sel === l.portal
                return (
                  <button
                    key={l.portal}
                    type="button"
                    className={`role-card-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => pickRole(l)}
                    aria-pressed={isSelected}
                  >
                    <div className="role-card-name">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Icon size={16} />
                        <span>{l.name}</span>
                      </span>
                      {isSelected && (
                        <span className="check-icon" aria-hidden="true">
                          <Check size={16} />
                        </span>
                      )}
                    </div>
                    <div className="role-card-desc mono-chip">
                      {l.username} · {l.password}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          <form onSubmit={submit} noValidate>
            <div className="form-group">
              <label htmlFor="login-username" className="form-label">Username</label>
              <input
                id="login-username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Password"
                  style={{ paddingRight: 48 }}
                  required
                />
                <button
                  type="button"
                  className="pw-toggle-btn"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {err && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: 'var(--status-error-bg)',
                  color: 'var(--status-error-text)',
                  border: '1px solid var(--status-error-border)',
                  borderRadius: 'var(--r-md)',
                  padding: '10px 14px',
                  fontSize: 13,
                  marginBottom: 'var(--space-4)',
                }}
              >
                <AlertTriangle size={16} style={{ color: 'var(--status-error-border)', flexShrink: 0 }} />
                <span>{err}</span>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: 'var(--space-4)' }}
              disabled={busy || !username || !password}
              type="submit"
            >
              {busy ? <span className="spinner" /> : <ArrowRight size={18} />}
              <span>{busy ? 'Signing in…' : 'Sign in'}</span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
              <Link to="/forgot-password" style={{ color: 'var(--link-text)' }}>
                Forgot your password?
              </Link>
              <Link to="/signup" style={{ color: 'var(--link-text)' }}>
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
