import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from './auth.jsx'
import Login from './pages/Login.jsx'
import Shell from './components/Shell.jsx'
import EmployeePortal from './pages/EmployeePortal.jsx'
import ManagementPortal from './pages/ManagementPortal.jsx'
import CounselPortal from './pages/CounselPortal.jsx'
import ClientPortal from './pages/ClientPortal.jsx'
import TenantPortal from './pages/TenantPortal.jsx'
import AuditorPortal from './pages/AuditorPortal.jsx'
import AdminPortal from './pages/AdminPortal.jsx'
import NotFound from './pages/NotFound.jsx'

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
  if (checking) return <div className="page-center"><span className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.portal !== portal) {
    // Signed in, but not for this portal — bounce to their own portal.
    return <Navigate to={`/portal/${user.portal}`} replace />
  }
  const Page = PORTAL_COMPONENTS[portal]
  return (
    <Shell>
      <Page />
    </Shell>
  )
}

/**
 * Wraps routed content in a keyed container so every navigation runs a
 * gentle fade/slide page transition (skipped for reduced-motion users).
 */
function PageTransition() {
  const location = useLocation()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(
      el,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out', clearProps: 'transform' },
    )
  }, [location.pathname])

  return (
    <div ref={ref} key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={
          <RootRedirect />
        } />
        <Route path="/login" element={<Login />} />
        {Object.keys(PORTAL_COMPONENTS).map((p) => (
          <Route key={p} path={`/portal/${p}`} element={<PortalRoute portal={p} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

function RootRedirect() {
  const { user, checking } = useAuth()
  if (checking) return <div className="page-center"><span className="spinner" /></div>
  if (user) return <Navigate to={`/portal/${user.portal}`} replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return <PageTransition />
}