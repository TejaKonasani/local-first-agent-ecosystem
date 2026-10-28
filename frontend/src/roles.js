// Roles (Step 1 of 2) Controller
import { initCommonUI, icons, prefersReducedMotion } from './app.js'

const ROLES = [
  {
    key: 'employee',
    title: 'Internal Employee',
    desc: 'Cases, tax and legal work',
    accentDark: '#60A5FA',
    accentLight: '#2563EB',
    iconSvg: icons.user,
  },
  {
    key: 'management',
    title: 'Management',
    desc: 'Firm-wide oversight',
    accentDark: '#F59E0B',
    accentLight: '#B45309',
    iconSvg: icons.barChart,
  },
  {
    key: 'advocate',
    title: 'Advocate',
    desc: 'External counsel matters',
    accentDark: '#F472B6',
    accentLight: '#BE185D',
    iconSvg: icons.scale,
  },
  {
    key: 'client',
    title: 'Client',
    desc: 'Your matter and documents',
    accentDark: '#34D399',
    accentLight: '#047857',
    iconSvg: icons.building,
  },
  {
    key: 'tenant',
    title: 'Tenant or Buyer',
    desc: 'Property and vendor tasks',
    accentDark: '#FB923C',
    accentLight: '#C2410C',
    iconSvg: icons.home,
  },
  {
    key: 'auditor',
    title: 'Auditor',
    desc: 'Read-only audit review',
    accentDark: '#A78BFA',
    accentLight: '#6D28D9',
    iconSvg: icons.search,
  },
  {
    key: 'admin',
    title: 'Administrator',
    desc: 'Users and system control',
    accentDark: '#22D3EE',
    accentLight: '#0E7490',
    iconSvg: icons.shield,
  },
]

export function renderRolesGrid(containerId = 'roles-grid') {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ROLES.map(
    (r) => `
    <a
      href="login.html?role=${r.key}"
      class="glass-card card-spotlight glass-card-interactive role-card"
      data-role="${r.key}"
      style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; min-height: 190px;"
      aria-label="Select role: ${r.title}"
    >
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
        <span class="icon-tile icon-tile-44" aria-hidden="true">
          ${r.iconSvg}
        </span>
        <span class="badge badge-role" style="font-size: 11px;">Select</span>
      </div>
      <div>
        <h3 style="font-size: 19px; margin-bottom: 6px;">${r.title}</h3>
        <p class="text-small">${r.desc}</p>
      </div>
      <div style="display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--lk); margin-top: auto;">
        <span>Continue</span>
        ${icons.arrowRight}
      </div>
    </a>
  `
  ).join('')

  // Handoff click handler
  const cards = container.querySelectorAll('.role-card')
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault()
      const roleKey = card.getAttribute('data-role')
      sessionStorage.setItem('nushift_role', roleKey)
      const targetUrl = `login.html?role=${encodeURIComponent(roleKey)}`

      if (prefersReducedMotion()) {
        window.location.href = targetUrl
        return
      }

      // 9. Role card select: scales 1.03 for 150ms then page fades out 200ms
      card.style.transform = 'scale(1.03)'
      card.style.transition = 'transform 150ms ease-out'
      setTimeout(() => {
        document.body.classList.add('page-transition-exit-active')
        setTimeout(() => {
          window.location.href = targetUrl
        }, 200)
      }, 150)
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI()
  renderRolesGrid()
})
