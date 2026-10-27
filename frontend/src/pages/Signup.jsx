import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle } from '../components/icons.jsx'

const ROLES = [
  { value: 'employee', label: 'Internal Employee' },
  { value: 'manager', label: 'Management / Executive' },
  { value: 'counsel', label: 'External Counsel' },
  { value: 'client', label: 'Client' },
  { value: 'tenant', label: 'Tenant / Buyer / Vendor' },
  { value: 'auditor', label: 'Regulator / Auditor' },
]

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('employee')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'Create Account | Local-First Agents'
  }, [])

  // Validation rules
  const nameErr = touched.fullName && !fullName.trim()
    ? 'Please enter your full legal or professional name.'
    : null

  const emailErr = touched.email && (!email.trim() || !/\S+@\S+\.\S+/.test(email))
    ? 'Please provide a valid work email address.'
    : null

  // Helper text: "Use at least 12 characters."
  // Inline validation: explain fix, e.g. "Password needs a number and a symbol."
  let passErr = null
  if (touched.password) {
    if (password.length < 12) {
      passErr = 'Password must be at least 12 characters long.'
    } else if (!/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      passErr = 'Password needs at least one number and one symbol.'
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched({ fullName: true, email: true, password: true })
    if (nameErr || emailErr || passErr || !fullName || !email || password.length < 12) return

    setSubmitted(true)
  }

  return (
    <div className="auth-page">
      {/* Logo above card with 32px gap */}
      <Link to="/" className="logo-brand">
        <div className="logo-tile" aria-hidden="true">
          <ShieldCheck size={20} />
        </div>
        <span className="logo-brand-text">Local-First Agents</span>
      </Link>

      <div className="auth-card" data-aos="fade-up">
        <div className="eyebrow">REGISTRATION</div>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Create your account</h2>
        <p className="caption" style={{ marginBottom: 'var(--space-6)' }}>
          Join your organization's private, hardware-governed legal portal.
        </p>

        {submitted ? (
          <div>
            <div className="success-banner">
              <CheckCircle size={20} style={{ flexShrink: 0 }} />
              <div>
                <b>Account request registered.</b> Your credentials are queued for administrator verification.
              </div>
            </div>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="signup-name" className="form-label">Full name</label>
              <input
                id="signup-name"
                className={`form-input ${nameErr ? 'has-error' : ''}`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                placeholder="Eleanor Vance"
                autoComplete="name"
                aria-invalid={!!nameErr}
                required
              />
              {nameErr && (
                <div className="field-error-msg">
                  <AlertTriangle size={14} /> <span>{nameErr}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">Work email</label>
              <input
                id="signup-email"
                type="email"
                className={`form-input ${emailErr ? 'has-error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="name@firm.internal"
                autoComplete="email"
                aria-invalid={!!emailErr}
                required
              />
              {emailErr && (
                <div className="field-error-msg">
                  <AlertTriangle size={14} /> <span>{emailErr}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="signup-role" className="form-label">Role</label>
              <select
                id="signup-role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">Password</label>
              <input
                id="signup-password"
                type="password"
                className={`form-input ${passErr ? 'has-error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="••••••••••••"
                autoComplete="new-password"
                aria-invalid={!!passErr}
                required
              />
              <div className="field-helper">Use at least 12 characters.</div>
              {passErr && (
                <div className="field-error-msg">
                  <AlertTriangle size={14} /> <span>{passErr}</span>
                </div>
              )}
            </div>

            <button
              className="btn btn-primary btn-lg"
              type="submit"
              style={{ width: '100%', marginTop: 'var(--space-2)', marginBottom: 'var(--space-5)' }}
            >
              <span>Create account</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--secondary-text)' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--link-text)', fontWeight: 600 }}>
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
