import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { ArrowLeft, Home } from '../components/icons.jsx'

export default function NotFound() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dashboardPath = user ? `/portal/${user.portal}` : '/login'

  useEffect(() => {
    document.title = '404 Not Found | Local-First Agents'
  }, [])

  return (
    <div className="error-page-wrap">
      <div data-aos="fade-up" style={{ maxWidth: 520 }}>
        {/* Huge 404 numeral */}
        <div className="error-404-numeral" aria-hidden="true">
          404
        </div>

        {/* H1 36px "This page could not be found" */}
        <h1 style={{ fontSize: 36, margin: 'var(--space-2) 0 var(--space-3)' }}>
          This page could not be found
        </h1>

        {/* One sentence */}
        <p className="caption" style={{ fontSize: 16, margin: '0 auto var(--space-6)' }}>
          The requested resource does not exist, has been archived, or is restricted beyond your portal permissions.
        </p>

        {/* Primary "Go to dashboard" and secondary "Go back" */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={dashboardPath} className="btn btn-primary">
            <Home size={18} />
            <span>Go to dashboard</span>
          </Link>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>Go back</span>
          </button>
        </div>
      </div>
    </div>
  )
}
