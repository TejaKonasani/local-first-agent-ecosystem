import { useEffect, useState } from 'react'
import { usePortalData } from '../hooks.js'
import { api } from '../api.js'
import {
  Kpi, Card, Alert, ApprovalsQueue, AuditTable, PageSkeleton,
} from '../components/ui.jsx'
import {
  FileText, Cpu, CheckCircle, Users, Plus, User, AlertTriangle,
} from '../components/icons.jsx'

const ROLES = ['employee', 'manager', 'counsel', 'client', 'tenant', 'auditor', 'admin']

function UsersManager({ onDone }) {
  const [users, setUsers] = useState([])
  const [err, setErr] = useState(null)
  const [ok, setOk] = useState(null)
  const [form, setForm] = useState({ username: '', password: '', role: 'employee', display_name: '' })
  const [busy, setBusy] = useState(false)
  const [touched, setTouched] = useState({})

  async function load() {
    try {
      const r = await api.adminUsers()
      setUsers(r.users || [])
    } catch (e) {
      setErr(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function toggle(u) {
    try {
      await api.adminEnableUser(u.username, !u.enabled)
      setOk(`User “${u.username}” ${u.enabled ? 'disabled' : 'enabled'}.`)
      await load()
    } catch (e) {
      setErr(e.message)
    }
  }

  const userErr = touched.username && !form.username.trim()
    ? 'Username is required to create a governed account.'
    : null
  const passErr = touched.password && form.password.length < 6
    ? 'Password must be at least 6 characters.'
    : null

  async function create(e) {
    e.preventDefault()
    setTouched({ username: true, password: true })
    if (!form.username.trim() || form.password.length < 6) return
    setBusy(true)
    setErr(null)
    setOk(null)
    try {
      await api.adminCreateUser(form.username.trim(), form.password, form.role, form.display_name)
      setOk(`User “${form.username.trim()}” created successfully.`)
      setForm({ username: '', password: '', role: 'employee', display_name: '' })
      setTouched({})
      await load()
      if (onDone) onDone()
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {err && <Alert kind="err" onDismiss={() => setErr(null)}>{err}</Alert>}
      {ok && <Alert kind="ok" onDismiss={() => setOk(null)}>{ok}</Alert>}

      <div className="table-responsive">
        <table className="portal-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Portal</th>
              <th>Sensitivity</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.username}>
                <td>
                  <b>{u.username}</b>
                  <div className="caption">{u.display_name}</div>
                </td>
                <td><span className="badge badge-doc-type">{u.role}</span></td>
                <td>{u.portal}</td>
                <td><span className={`badge badge-${u.max_sensitivity}`}>{u.max_sensitivity}</span></td>
                <td>
                  <span className={`badge ${u.enabled ? 'badge-success' : 'badge-error'}`}>
                    <span className="dot" aria-hidden="true" />
                    {u.enabled ? 'enabled' : 'disabled'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => toggle(u)}>
                    {u.enabled ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={create}
        style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}
        noValidate
      >
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> <span>Create a new user</span>
        </div>

        <div className="grid-4" style={{ marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="new-username" className="form-label">Username</label>
            <input
              id="new-username"
              className={`form-input ${userErr ? 'has-error' : ''}`}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              placeholder="e.g. employee2"
              aria-invalid={!!userErr}
            />
            {userErr && (
              <div className="field-error-msg">
                <AlertTriangle size={13} /> <span>{userErr}</span>
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="new-password" className="form-label">Password</label>
            <input
              id="new-password"
              type="password"
              className={`form-input ${passErr ? 'has-error' : ''}`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder="Min 6 characters"
              aria-invalid={!!passErr}
            />
            {passErr && (
              <div className="field-error-msg">
                <AlertTriangle size={13} /> <span>{passErr}</span>
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="new-role" className="form-label">Role</label>
            <select
              id="new-role"
              className="form-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="new-name" className="form-label">Display name</label>
            <input
              id="new-name"
              className="form-input"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              placeholder="Full name"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" disabled={busy} type="submit">
            {busy ? <span className="spinner" /> : <User size={16} />}
            <span>{busy ? 'Creating…' : 'Create user'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default function AdminPortal() {
  const { data, loading, error, reload } = usePortalData()

  useEffect(() => {
    document.title = 'Admin Portal | Local-First Agents'
  }, [])

  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const kpi = data.kpi || {}
  const learning = data.learning

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* 4.4 Stat cards */}
      <div className="grid-4">
        <Kpi label="Documents" value={kpi.documents ?? 0} icon={FileText} />
        <Kpi label="Agents" value={kpi.agents ?? 0} icon={Cpu} />
        <Kpi label="Pending approvals" value={kpi.pending_approvals ?? 0} icon={CheckCircle} />
        <Kpi label="Active users" value={kpi.users ?? 0} icon={Users} accent />
      </div>

      {/* User Management */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>User management</h3>
        <Card>
          <UsersManager onDone={reload} />
        </Card>
      </div>

      {/* Grid 2: AI Agents & Pending Approvals */}
      <div className="grid-2">
        <Card title="AI agents" sub="The governed 16-agent orchestrator hierarchy.">
          <div className="table-responsive" style={{ maxHeight: 380, overflowY: 'auto' }}>
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(data.agents || []).map((a) => (
                  <tr key={a.id}>
                    <td>
                      <b>{a.name}</b>
                      <div className="caption mono-chip" style={{ display: 'inline-block', marginTop: 2 }}>{a.id}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${a.enabled ? 'badge-success' : 'badge-error'}`}>
                        <span className="dot" aria-hidden="true" />
                        {a.enabled ? 'enabled' : 'disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Pending approvals" sub="Governed approvals queue for gated workflows.">
          <ApprovalsQueue approvals={data.pending_approvals} onDecided={reload} />
        </Card>
      </div>

      {/* Self-learning engine */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>Self-learning engine</h3>
        <Card>
          {learning && learning.error ? (
            <div className="caption">{learning.error}</div>
          ) : learning ? (
            <div className="grid-4">
              <Kpi label="Learning runs" value={learning.total_runs ?? 0} />
              <Kpi label="Promoted insights" value={learning.total_promoted ?? 0} accent />
              <Kpi
                label="Hold-out accuracy"
                value={learning.holdout_accuracy != null ? `${(learning.holdout_accuracy * 100).toFixed(0)}%` : '—'}
              />
              <Kpi label="Budget / run" value={learning.budget_per_run ?? '—'} />
            </div>
          ) : (
            <div className="caption">Self-learning orchestrator telemetry not currently active.</div>
          )}
        </Card>
      </div>

      {/* Audit trail */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>System audit trail</h3>
        <AuditTable entries={data.recent_audit} limit={8} />
      </div>
    </div>
  )
}
