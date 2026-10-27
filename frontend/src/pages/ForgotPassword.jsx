import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, CheckCircle, ArrowLeft, Send, AlertTriangle } from '../components/icons.jsx'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'Forgot Password | Local-First Agents'
  }, [])

  const emailErr = touched && (!email.trim() || !/\S+@\S+\.\S+/.test(email))
    ? 'Please enter a valid work email address.'
    : null

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (!email.trim() || emailErr) return
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

      <div className="auth-card auth-card-forgot" data-aos="fade-up">
        <div className="eyebrow">RECOVERY</div>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Reset password</h2>
        <p className="caption" style={{ marginBottom: 'var(--space-6)' }}>
          Enter your registered work email to receive a governed portal reset link.
        </p>

        {submitted ? (
          <div>
            {/* Green bg #E3F2E8, check icon, "Check your inbox. The link is on its way." */}
            <div className="success-banner">
              <CheckCircle size={20} style={{ flexShrink: 0 }} />
              <div>Check your inbox. The link is on its way.</div>
            </div>

            <Link
              to="/login"
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: 'var(--space-4)' }}
            >
              <ArrowLeft size={16} />
              <span>Back to sign in</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="forgot-email" className="form-label">Work email</label>
              <input
                id="forgot-email"
                type="email"
                className={`form-input ${emailErr ? 'has-error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
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

            <button
              className="btn btn-primary btn-lg"
              type="submit"
              style={{ width: '100%', marginTop: 'var(--space-2)', marginBottom: 'var(--space-5)' }}
            >
              <Send size={16} />
              <span>Send reset link</span>
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: 'var(--link-text)', fontSize: 14, fontWeight: 500 }}>
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
