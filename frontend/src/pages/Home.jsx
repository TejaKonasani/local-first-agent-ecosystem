import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useHeroMotion, useSpotlight } from '../motion.js'
import { useTheme } from '../theme.jsx'
import {
  ShieldCheck, ArrowRight, User, BarChart, Scale, Building, Home as HomeIcon,
  Search, Shield, Menu, X, ChevronDown, CheckCircle, Lock, Sun, Moon,
} from '../components/icons.jsx'

const ROLES_LIST = [
  {
    role: 'Employee',
    icon: User,
    desc: 'Assigned cases, tax matters, draft preparation, and governed legal agent tasks.',
    portal: 'employee',
  },
  {
    role: 'Management',
    icon: BarChart,
    desc: 'Firm-wide operational analytics, case workloads, risk monitors, and approval gates.',
    portal: 'management',
  },
  {
    role: 'External Counsel',
    icon: Scale,
    desc: 'Assigned client proceedings, legal research libraries, and draft reviews.',
    portal: 'counsel',
  },
  {
    role: 'Client',
    icon: Building,
    desc: 'Direct case status tracking, reviewed advisory reports, and document uploads.',
    portal: 'client',
  },
  {
    role: 'Tenant & Vendor',
    icon: HomeIcon,
    desc: 'Land parcel records, project milestone updates, and structured maintenance inquiries.',
    portal: 'tenant',
  },
  {
    role: 'Auditor & Regulator',
    icon: Search,
    desc: 'Explicitly shared compliance records and cryptographically verifiable audit trails.',
    portal: 'auditor',
  },
  {
    role: 'Administrator',
    icon: Shield,
    desc: 'User identity management, agent orchestrator control, and compliance policies.',
    portal: 'admin',
  },
]

const FAQ_ITEMS = [
  {
    q: 'How does local-first inference protect confidential client data?',
    a: 'Every LLM execution and document vector search runs on your local workstation or private intranet hardware. Data is never transmitted to external third-party cloud providers.',
  },
  {
    q: 'What role-based controls are enforced across the portals?',
    a: 'Our strict sensitivity ladder (public, internal, confidential, restricted) prevents cross-role data leaks. External counsel, auditors, and clients only see records explicitly permitted for their role.',
  },
  {
    q: 'How do approval gates function before actions take effect?',
    a: 'High-risk operations—such as document publication, client dissemination, or voice synthesis—require cryptographic sign-off in the manager queue before dispatch.',
  },
]

function SpotlightCard({ children, className = '' }) {
  const spotRef = useSpotlight()
  return (
    <div ref={spotRef} className={`card-spotlight ${className}`}>
      {children}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('platform')
  const [openFaq, setOpenFaq] = useState(null)

  const textContainerRef = useRef(null)
  const auditCardRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    document.title = 'Local-First Agents | Governed Legal & Compliance Platform'
  }, [])

  // Section 6: Hero GSAP animations
  useHeroMotion({ textContainerRef, auditCardRef, glowRef })

  function scrollToSection(id, tabName) {
    setActiveTab(tabName)
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 4.1 Sticky Top Navbar (72px tall, max-width 1200px) */}
      <header className="home-nav">
        <div className="home-nav-inner">
          <Link to="/" className="logo-brand">
            <div className="logo-tile" aria-hidden="true">
              <ShieldCheck size={20} />
            </div>
            <span className="logo-brand-text">Local-First Agents</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
            <a
              href="#platform"
              className={`nav-link ${activeTab === 'platform' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('platform', 'platform') }}
            >
              Platform
            </a>
            <a
              href="#roles"
              className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('roles', 'roles') }}
            >
              Roles
            </a>
            <a
              href="#security"
              className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('security', 'security') }}
            >
              Security
            </a>
            <a
              href="#faq"
              className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('faq', 'faq') }}
            >
              Docs
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={toggle}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                style={{ width: 44, height: 44, padding: 0 }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link to="/login" className="btn btn-secondary btn-sm" style={{ height: 44 }}>
                Sign in
              </Link>
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            style={{ width: 44, height: 44 }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* 4.1 Hero Section: 2 columns (7/5 grid), radial glow, text stagger, card float */}
      <section className="home-hero-wrap" ref={glowRef}>
        <div className="container">
          <div className="home-hero-grid">
            {/* Left Column (7/12) */}
            <div ref={textContainerRef}>
              <div className="eyebrow hero-stagger-item">LEGAL &amp; COMPLIANCE PLATFORM</div>
              <h1 className="hero-stagger-item" style={{ margin: 'var(--space-2) 0 var(--space-4)' }}>
                One governed platform.<br />
                Seven role-based portals.
              </h1>
              <p className="hero-subtext hero-stagger-item">
                Private, hardware-bound AI coordination for law practices, compliance officers,
                and corporate legal teams. Maintain full privilege with local inference.
              </p>
              <div
                className="hero-stagger-item"
                style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}
              >
                <Link to="/login" className="btn btn-primary btn-lg">
                  <span>Open your portal</span>
                  <ArrowRight size={18} />
                </Link>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => scrollToSection('platform', 'platform')}
                >
                  See how it works
                </button>
              </div>
              <div className="hero-caption hero-stagger-item">
                <Lock size={15} style={{ color: 'var(--gold-700)' }} />
                <span>Your data never leaves your machine.</span>
              </div>
            </div>

            {/* Right Column (5/12): Floating Audit Trail Card */}
            <div ref={auditCardRef}>
              <div className="hero-audit-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={18} style={{ color: 'var(--gold-700)' }} />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>Verified Audit Trail</span>
                  </div>
                  <span className="badge badge-success">
                    <span className="dot" aria-hidden="true" />
                    Live Ledger
                  </span>
                </div>

                <div className="audit-row">
                  <div>
                    <div style={{ fontWeight: 600 }}>Privileged Case Summary</div>
                    <div className="caption">Matter M-104 · Employee Portal</div>
                  </div>
                  <span className="badge badge-internal">
                    <span className="dot" aria-hidden="true" />
                    Internal
                  </span>
                </div>

                <div className="audit-row">
                  <div>
                    <div style={{ fontWeight: 600 }}>External Counsel Review</div>
                    <div className="caption">Court Draft · Gate Approved</div>
                  </div>
                  <span className="badge badge-confidential">
                    <span className="dot" aria-hidden="true" />
                    Confidential
                  </span>
                </div>

                <div className="audit-row">
                  <div>
                    <div style={{ fontWeight: 600 }}>Regulator Compliance Export</div>
                    <div className="caption">Audit Session #409 · Read-only</div>
                  </div>
                  <span className="badge badge-public">
                    <span className="dot" aria-hidden="true" />
                    Public
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.1 Feature Section: 3 equal cards (01 to 03 eyebrow, H3, one sentence) */}
      <section id="platform" className="features-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }} data-aos="fade-up">
            <div className="eyebrow">GOVERNANCE ARCHITECTURE</div>
            <h2>Built for rigorous legal compliance</h2>
          </div>

          <div className="features-grid">
            <SpotlightCard className="feature-card" data-aos="fade-up" data-aos-delay="0">
              <div className="feature-number">01</div>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>Role-scoped access</h3>
              <p className="caption" style={{ fontSize: 15, margin: 0 }}>
                Every participant accesses an isolated portal scoped strictly to authorized documents and client matters.
              </p>
            </SpotlightCard>

            <SpotlightCard className="feature-card" data-aos="fade-up" data-aos-delay="80">
              <div className="feature-number">02</div>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>Approval gates</h3>
              <p className="caption" style={{ fontSize: 15, margin: 0 }}>
                Autonomous agents prepare drafts and summaries, but outward dissemination mandates human partner sign-off.
              </p>
            </SpotlightCard>

            <SpotlightCard className="feature-card" data-aos="fade-up" data-aos-delay="160">
              <div className="feature-number">03</div>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>Local inference</h3>
              <p className="caption" style={{ fontSize: 15, margin: 0 }}>
                Embeddings, parsing, and LLM reasoning run natively on local hardware without sending tokens across public clouds.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* 4.1 Seven Portals Section: 4+3 grid */}
      <section id="roles" className="portals-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }} data-aos="fade-up">
            <div className="eyebrow">SEVEN PORTALS</div>
            <h2>Tailored environments for every role</h2>
          </div>

          {/* First row of 4 */}
          <div className="portals-grid-4">
            {ROLES_LIST.slice(0, 4).map((r, i) => {
              const Icon = r.icon
              return (
                <SpotlightCard key={r.role} className="portal-card" data-aos="fade-up" data-aos-delay={i * 80}>
                  <div className="portal-card-icon" aria-hidden="true">
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: 18 }}>{r.role}</h3>
                  <p className="caption" style={{ fontSize: 14 }}>{r.desc}</p>
                </SpotlightCard>
              )
            })}
          </div>

          {/* Second row of 3 */}
          <div className="portals-grid-3">
            {ROLES_LIST.slice(4).map((r, i) => {
              const Icon = r.icon
              return (
                <SpotlightCard key={r.role} className="portal-card" data-aos="fade-up" data-aos-delay={(i + 4) * 80}>
                  <div className="portal-card-icon" aria-hidden="true">
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: 18 }}>{r.role}</h3>
                  <p className="caption" style={{ fontSize: 14 }}>{r.desc}</p>
                </SpotlightCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" style={{ paddingBottom: 'var(--section-gap)' }}>
        <div className="container" style={{ maxWidth: 840 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }} data-aos="fade-up">
            <div className="eyebrow">FREQUENTLY ASKED QUESTIONS</div>
            <h2>Governance &amp; Deployment</h2>
          </div>

          <div data-aos="fade-up">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className={`accordion-item ${openFaq === idx ? 'is-open' : ''}`}>
                <button
                  className="accordion-header"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{item.q}</span>
                  <span className="accordion-chevron" aria-hidden="true">
                    <ChevronDown size={18} />
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="accordion-content">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.1 Navy CTA Band */}
      <section id="security" className="container" data-aos="fade-up">
        <div className="cta-band">
          <div className="eyebrow" style={{ color: 'var(--gold-300)' }}>READY TO DEPLOY</div>
          <h2>Bring sovereign intelligence to your firm</h2>
          <p>
            Experience seamless multi-agent orchestration without compromising on client confidentiality or data jurisdiction.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg" style={{ backgroundColor: 'var(--gold-500)', color: 'var(--navy-900)' }}>
            Sign in to your portal
          </Link>
        </div>
      </section>

      {/* 4.1 Footer: Navy bg, 3 columns, copyright row */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="logo-brand">
                <div className="logo-tile" aria-hidden="true">
                  <ShieldCheck size={20} />
                </div>
                <span className="logo-brand-text" style={{ color: '#FFFFFF' }}>Local-First Agents</span>
              </div>
              <p className="footer-brand-p">
                Private, role-governed legal &amp; compliance platform running strictly on local hardware.
              </p>
            </div>

            <div className="footer-col">
              <h5>Navigation</h5>
              <ul className="footer-links">
                <li><a href="#platform" onClick={(e) => { e.preventDefault(); scrollToSection('platform', 'platform') }}>Platform</a></li>
                <li><a href="#roles" onClick={(e) => { e.preventDefault(); scrollToSection('roles', 'roles') }}>Seven Portals</a></li>
                <li><a href="#security" onClick={(e) => { e.preventDefault(); scrollToSection('security', 'security') }}>Security Gates</a></li>
                <li><Link to="/login">Sign in</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Contact &amp; Support</h5>
              <ul className="footer-links">
                <li><a href="mailto:compliance@localfirstagents.internal">compliance@localfirstagents.internal</a></li>
                <li><span style={{ color: '#A9B4C7', fontSize: 14 }}>Security response: Tier 1</span></li>
                <li><span style={{ color: '#A9B4C7', fontSize: 14 }}>Version 1.0.0 Evaluation</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Local-First Agent Ecosystem. All rights reserved.</span>
            <span>Local privacy guaranteed · In-memory demonstrator</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
