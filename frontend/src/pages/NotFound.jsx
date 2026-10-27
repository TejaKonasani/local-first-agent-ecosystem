import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { ArrowLeft, Home } from '../components/icons.jsx'

export default function NotFound() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const home = user ? `/portal/${user.portal}` : '/login'

  return (
    <div className="notfound">
      <div>
        <div className="nf-code" aria-hidden="true">404</div>
        <h1>This page has left the building</h1>
        <p>
          The page you're looking for doesn't exist, was moved, or was never in scope for your
          role. Everything else is exactly where you left it.
        </p>
        <div className="nf-actions">
          <Link className="btn primary" to={home}>
            <ArrowLeft size={15} /> Back to {user ? 'your portal' : 'sign in'}
          </Link>
          <button
            className="btn"
            onClick={() => navigate(-1)}
          >
            <Home size={15} /> Go back
          </button>
        </div>
      </div>
    </div>
  )
}