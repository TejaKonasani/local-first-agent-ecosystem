import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { api } from '../api.js'
import { useParallax } from '../motion.js'
import {
  ShieldCheck, User, BarChart, Scale, Building, Home, Search, Shield,
  Lock, Eye, EyeOff, ArrowRight, Check,
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
  const parallaxRef = useParallax()
  const [logins, setLogins] = useState([])
  const [sel, setSel] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  useEffect(() => {
    api
      .demo()
      .then((r) => {
        setLogins(r.logins)
        if (r.logins.length) {
          const first = r.logins[0]
          setSel(first.portal)
          setUsername(first.username)
          setPassword(first.password)
        }
      })
      .catch(() => {
        /* offline demo still works */
      })
  }, [])

  function pick(l) {
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
    <div className="login-wrap" ref={parallaxRef}>
      <div className="login-hero">
        <div className="hero-grid" data-parallax="0.04" aria-hidden="true" />
        <div className="hero-orb a" data-parallax="0.08" aria-hidden="true" />
        <div className="hero-orb b" data-parallax="0.05" aria-hidden="true" />

        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <ShieldCheck size={24} />
          </span>
          <div className="brand-text">
            <div className="mark">Local-First Agent Ecosystem</div>
            <div className="name">Legal &amp; Compliance Platform</div>
          </div>
        </div>

        <div>
          <h2>
            One governed platform.
            <br />
            <em>Seven role-based portals.</em>
          </h2>
          <p>
            A 16-agent legal &amp; compliance platform running on local Ollama inference —
            with a sensitivity ladder, approval gates and a full audit trail.
          </p>
          <div className="feats">
            <div>
              <span className="feat-ico" aria-hidden="true"><ShieldCheck /></span>
              <span><b>Role-scoped access</b> — you only see what your role may see</span>
            </div>
            <div>
              <span className="feat-ico" aria-hidden="true"><Check /></span>
              <span><b>Approval gates</b> for drafts, external sharing and voice</span>
            </div>
            <div>
              <span className="feat-ico" aria-hidden="true"><Lock /></span>
              <span><b>Append-only audit trail</b> on every action</span>
            </div>
            <div>
              <span className="feat-ico" aria-hidden="true"><Shield /></span>
              <span><b>Local inference</b> — your data stays on your machine</span>
            </div>
          </div>
        </div>

        <div className="foot">Demo build · demo credentials only · not for production use</div>
      </div>

      <div className="login-body">
        <div className="login-card">
          <div className="head">
            <h1>Sign in to your portal</h1>
            <p>Pick a demo role to autofill, or enter credentials directly.</p>
          </div>

          {logins.length > 0 && (
            <div className="portal-grid" role="group" aria-label="Demo roles">
              {logins.map((l) => {
                const Icon = PORTAL_ICONS[l.portal] || ShieldCheck
                return (
                  <button
                    key={l.portal}
                    className={'portal-tile' + (sel === l.portal ? ' sel' : '')}
                    onClick={() => pick(l)}
                    type="button"
                    aria-pressed={sel === l.portal}
                  >
                    <div className="pt-name">
                      <span className="pt-ico" aria-hidden="true">
                        <Icon size={14} />
                      </span>
                      {l.name}
                    </div>
                    <div className="pt-cred">{l.username} · {l.password}</div>
                  </button>
                )
              })}
            </div>
          )}

          <form className="login-form" onSubmit={submit} noValidate>
            <div className="creds-hint">
              Demo login — e.g. <code>employee1 / employee123</code>. Click a role above to autofill.
            </div>
            <div className="field">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="username"
              />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-faint)',
                    padding: 6,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 6,
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {err && (
              <div className="alert err" role="alert">
                <span className="alert-msg">{err}</span>
              </div>
            )}
            <button className="btn primary block" disabled={busy} type="submit">
              {busy ? <span className="spinner" /> : <ArrowRight size={15} />}
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}