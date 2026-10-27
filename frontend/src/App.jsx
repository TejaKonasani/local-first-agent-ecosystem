import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import { initAOS, prefersReducedMotion } from './motion.js'
import Shell from './components/Shell.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import EmployeePortal from './pages/EmployeePortal.jsx'
import ManagementPortal from './pages/ManagementPortal.jsx'
import CounselPortal from './pages/CounselPortal.jsx'
import ClientPortal from './pages/ClientPortal.jsx'
import TenantPortal from './pages/TenantPortal.jsx'
import AuditorPortal from './pages/AuditorPortal.jsx'
import AdminPortal from './pages/AdminPortal.jsx'
import NotFound from './pages/NotFound.jsx'
import Error500 from './pages/Error500.jsx'

const PORTAL_COMPONENTS = {
  employee: EmployeePortal,
  management: ManagementPortal,
  counsel: CounselPortal,
  client: ClientPortal,
  tenant: TenantPortal,
  auditor: AuditorPortal,
  admin: AdminPortal,
}

function PortalRoute({ portal }) {
  const { user, checking } = useAuth()
  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.portal !== portal) {
    return <Navigate to={`/portal/${user.portal}`} replace />
  }
  const Page = PORTAL_COMPONENTS[portal]
  return (
    <Shell>
      <Page />
    </Shell>
  )
}

function RootRoute() {
  const { user, checking } = useAuth()
  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    )
  }
  if (user) return <Navigate to={`/portal/${user.portal}`} replace />
  return <Home />
}

/**
 * 6. Page transition: Between pages
 * Outgoing page fades to opacity 0 in 200ms (ease-in),
 * incoming fades up 12px in 300ms (ease-out).
 * Skipped if prefers-reduced-motion is true.
 */
function PageTransition() {
  const location = useLocation()
  const ref = useRef(null)

  useEffect(() => {
    initAOS()
  }, [location.pathname])

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const gsap = window.gsap
    if (gsap) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'transform' },
      )
    }
  }, [location.pathname])

  return (
    <div ref={ref} key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/500" element={<Error500 />} />
        {Object.keys(PORTAL_COMPONENTS).map((p) => (
          <Route key={p} path={`/portal/${p}`} element={<PortalRoute portal={p} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return <PageTransition />
}
