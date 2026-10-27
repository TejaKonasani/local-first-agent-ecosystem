import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, ShieldCheck } from '../components/icons.jsx'

export default function Error500() {
  useEffect(() => {
    document.title = '500 Server Error | Local-First Agents'
  }, [])

  return (
    <div className="auth-page">
      <Link to="/" className="logo-brand">
        <div className="logo-tile" aria-hidden="true">
          <ShieldCheck size={20} />
        </div>
        <span className="logo-brand-text">Local-First Agents</span>
      </Link>

      <div className="auth-card" style={{ textAlign: 'center' }} data-aos="fade-up">
        {/* Red "Error 500" badge */}
        <div className="error-500-badge">
          Error 500
        </div>

        {/* H1 32px */}
        <h1 style={{ fontSize: 32, marginBottom: 'var(--space-3)' }}>
          System encountered an issue
        </h1>

        {/* Reassurance sentence */}
        <p className="caption" style={{ fontSize: 16, margin: '0 auto var(--space-6)', maxWidth: '40ch' }}>
          Your local session and disk state remain secure and uncorrupted. The orchestrator failed to complete the requested operation.
        </p>

        {/* "Try again" and "Contact admin" */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            <span>Try again</span>
          </button>
          <a
            href="mailto:admin@firm.internal?subject=Error%20500%20Report"
            className="btn btn-secondary"
          >
            Contact admin
          </a>
        </div>
      </div>
    </div>
  )
}
