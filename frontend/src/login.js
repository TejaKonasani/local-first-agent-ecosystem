// Login (Step 2 of 2) Controller
import { initCommonUI, icons, prefersReducedMotion, ROLE_CONFIGS } from './app.js'
import { api, setSession } from './api.js'

let currentRoleKey = 'employee'
let currentRoleConfig = ROLE_CONFIGS.employee
let demoCreds = {}

export async function initLoginPage() {
  initCommonUI()

  // 1. Resolve role from URL query or sessionStorage
  const params = new URLSearchParams(window.location.search)
  let roleQuery = params.get('role') || sessionStorage.getItem('nushift_role')

  if (!roleQuery || !ROLE_CONFIGS[roleQuery.toLowerCase()]) {
    // Direct visits to Login with no role redirect to Roles
    window.location.replace('roles.html')
    return
  }

  currentRoleKey = roleQuery.toLowerCase()
  currentRoleConfig = ROLE_CONFIGS[currentRoleKey]
  document.body.setAttribute('data-role', currentRoleKey)
  document.title = `Sign in as ${currentRoleConfig.title} | Nushift`

  // Render Role Details in Left Column
  renderRoleHeader()

  // Load demo credentials to prefill
  await loadDemoLogins()

  // Attach Form Handlers
  setupForm()
}

function renderRoleHeader() {
  const leftCol = document.getElementById('login-role-summary')
  if (!leftCol) return

  const iconSvg = icons[currentRoleConfig.iconName] || icons.shield

  leftCol.innerHTML = `
    <a href="roles.html" class="btn btn-ghost btn-sm" style="align-self: flex-start; margin-bottom: 24px; padding-left: 0; color: var(--mu);">
      ${icons.arrowLeft}
      <span>Change role</span>
    </a>

    <div class="icon-tile icon-tile-72" style="margin-bottom: 24px;" aria-hidden="true">
      ${iconSvg}
    </div>

    <span class="eyebrow" style="margin-bottom: 12px; display: inline-block;">STEP 2 OF 2</span>
    <h1 style="font-size: 44px; line-height: 1.15; margin-bottom: 16px;">
      Signing in as <span style="color: var(--role);">${currentRoleConfig.title}</span>
    </h1>
    <p style="font-size: 18px; line-height: 1.6; color: var(--mu); max-width: 440px;">
      ${currentRoleConfig.tagline}
    </p>
  `

  // Update button text
  const submitBtn = document.getElementById('login-submit-btn')
  if (submitBtn) {
    submitBtn.innerHTML = `
      <span class="btn-text">Sign in as ${currentRoleConfig.title}</span>
      <span class="btn-icon">${icons.arrowRight}</span>
    `
  }
}

async function loadDemoLogins() {
  const usernameInput = document.getElementById('login-username')
  const passwordInput = document.getElementById('login-password')

  // Built-in demo fallback mapping
  const fallback = {
    employee: { username: 'employee1', password: 'employee123' },
    management: { username: 'manager1', password: 'manager123' },
    advocate: { username: 'counsel1', password: 'counsel123' },
    counsel: { username: 'counsel1', password: 'counsel123' },
    client: { username: 'client1', password: 'client123' },
    tenant: { username: 'tenant1', password: 'tenant123' },
    auditor: { username: 'auditor1', password: 'auditor123' },
    admin: { username: 'admin', password: 'admin123' },
  }

  try {
    const res = await api.demo()
    const logins = res.logins || []
    logins.forEach((l) => {
      demoCreds[l.portal] = { username: l.username, password: l.password }
    })
  } catch {
    demoCreds = fallback
  }

  // Pre-fill credentials
  const targetPortal = currentRoleConfig.portal
  const cred = demoCreds[targetPortal] || fallback[currentRoleKey] || fallback[targetPortal]
  if (cred) {
    if (usernameInput) usernameInput.value = cred.username
    if (passwordInput) passwordInput.value = cred.password
  }
}

function setupForm() {
  const form = document.getElementById('login-form')
  const card = document.getElementById('login-glass-card')
  const usernameInput = document.getElementById('login-username')
  const passwordInput = document.getElementById('login-password')
  const submitBtn = document.getElementById('login-submit-btn')
  const errorBanner = document.getElementById('login-error-banner')
  const pwToggle = document.getElementById('pw-toggle-btn')
  const userErrText = document.getElementById('username-error')
  const passErrText = document.getElementById('password-error')

  // Password visibility toggle
  let pwVisible = false
  if (pwToggle) {
    pwToggle.addEventListener('click', () => {
      pwVisible = !pwVisible
      passwordInput.type = pwVisible ? 'text' : 'password'
      pwToggle.innerHTML = pwVisible ? icons.eyeOff : icons.eye
      pwToggle.setAttribute('aria-label', pwVisible ? 'Hide password' : 'Show password')
    })
  }

  // Inline validation on blur
  usernameInput?.addEventListener('blur', () => {
    if (!usernameInput.value.trim()) {
      usernameInput.classList.add('has-error')
      if (userErrText) {
        userErrText.innerHTML = `${icons.alertTriangle} <span>Enter the username for this role.</span>`
        userErrText.style.display = 'flex'
      }
    } else {
      usernameInput.classList.remove('has-error')
      if (userErrText) userErrText.style.display = 'none'
    }
  })

  passwordInput?.addEventListener('blur', () => {
    if (!passwordInput.value) {
      passwordInput.classList.add('has-error')
      if (passErrText) {
        passErrText.innerHTML = `${icons.alertTriangle} <span>Enter the password for this account.</span>`
        passErrText.style.display = 'flex'
      }
    } else {
      passwordInput.classList.remove('has-error')
      if (passErrText) passErrText.style.display = 'none'
    }
  })

  form?.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorBanner.style.display = 'none'

    const u = usernameInput.value.trim()
    const p = passwordInput.value

    if (!u || !p) {
      if (!u && userErrText) {
        usernameInput.classList.add('has-error')
        userErrText.innerHTML = `${icons.alertTriangle} <span>Enter the username for this role.</span>`
        userErrText.style.display = 'flex'
      }
      if (!p && passErrText) {
        passwordInput.classList.add('has-error')
        passErrText.innerHTML = `${icons.alertTriangle} <span>Enter the password for this account.</span>`
        passErrText.style.display = 'flex'
      }
      return
    }

    // Loading state: button text stays, spinner replaces arrow, inputs disabled
    submitBtn.disabled = true
    usernameInput.disabled = true
    passwordInput.disabled = true
    const iconSpan = submitBtn.querySelector('.btn-icon')
    if (iconSpan) {
      iconSpan.innerHTML = `<span class="spinner" style="width: 18px; height: 18px; border-width: 2px;"></span>`
    }

    try {
      const res = await api.login(u, p)
      setSession(res.token, res.user)

      // Store portal role
      sessionStorage.setItem('nushift_role', res.user.portal)

      if (prefersReducedMotion()) {
        window.location.href = `workspace.html?role=${encodeURIComponent(res.user.portal)}`
        return
      }

      // Page transition exit
      document.body.classList.add('page-transition-exit-active')
      setTimeout(() => {
        window.location.href = `workspace.html?role=${encodeURIComponent(res.user.portal)}`
      }, 200)
    } catch (err) {
      // Wrong credentials: card shakes 6px twice in 300ms and error banner appears
      submitBtn.disabled = false
      usernameInput.disabled = false
      passwordInput.disabled = false
      if (iconSpan) iconSpan.innerHTML = icons.arrowRight

      errorBanner.innerHTML = `
        <span style="color: var(--status-error-fg);" aria-hidden="true">${icons.alertCircle}</span>
        <div style="flex: 1; font-size: 14px; color: var(--status-error-fg);">
          ${err.message || 'Invalid credentials for this role. Check username and password.'}
        </div>
      `
      errorBanner.style.display = 'flex'

      if (card) {
        card.classList.remove('shake')
        void card.offsetWidth // force reflow
        card.classList.add('shake')
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', initLoginPage)
