import { useState, useEffect, useRef } from 'react'
import { api } from '../api.js'
import { useNumberCountUp, useSpotlight } from '../motion.js'
import {
  FileText, Inbox, CheckCircle, XCircle, AlertTriangle, Info, X,
  Sparkles, Send, Upload, Check, ChevronDown, Clock, ShieldCheck,
} from './icons.jsx'

/* ------------------------------------------------------------- KPI / Stat Card ---- */
export function Kpi({ label, value, hint, accent, icon: Icon }) {
  const numRef = useNumberCountUp(value)
  return (
    <div className={`card stat-card ${accent ? 'card-selected' : ''}`} data-aos="fade-up">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {Icon && (
          <span className="stat-card-icon-tile" aria-hidden="true">
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className="stat-card-value" ref={numRef}>
        {value ?? 0}
      </div>
      {hint && <div className="caption" style={{ marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

/* ------------------------------------------------------------- Badges ---- */
export function SensBadge({ s }) {
  if (!s) return null
  const cls = s === 'public'
    ? 'badge-public'
    : s === 'internal'
    ? 'badge-internal'
    : s === 'confidential'
    ? 'badge-confidential'
    : 'badge-error'

  return (
    <span className={`badge ${cls}`}>
      <span className="dot" aria-hidden="true" />
      {s}
    </span>
  )
}

export function TypeBadge({ t }) {
  if (!t) return null
  return <span className="badge badge-doc-type">{t.replace(/_/g, ' ')}</span>
}

export function StatusBadge({ s }) {
  if (!s) return null
  const cls = s === 'approved' || s === 'closed' || s === 'success' || s === 'ok'
    ? 'badge-success'
    : s === 'rejected' || s === 'error' || s === 'err'
    ? 'badge-error'
    : s === 'open' || s === 'pending' || s === 'warning' || s === 'warn'
    ? 'badge-warning'
    : 'badge-info'

  return (
    <span className={`badge ${cls}`}>
      <span className="dot" aria-hidden="true" />
      {s}
    </span>
  )
}

/* ------------------------------------------------------------- Empty State ---- */
export function Empty({
  icon: Icon = Inbox,
  title = 'No records found',
  text = 'Nothing here yet.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state" data-aos="fade-up">
      <div className="empty-icon-tile" aria-hidden="true">
        <Icon size={24} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{text}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- Alert ---- */
const ALERT_ICONS = {
  ok: CheckCircle,
  err: XCircle,
  warn: AlertTriangle,
  info: Info,
}

export function Alert({ kind = 'info', children, onDismiss }) {
  if (!children) return null
  const Icon = ALERT_ICONS[kind] || Info
  const bg = kind === 'ok'
    ? 'var(--status-success-bg)'
    : kind === 'err'
    ? 'var(--status-error-bg)'
    : kind === 'warn'
    ? 'var(--status-warning-bg)'
    : 'var(--status-info-bg)'
  const color = kind === 'ok'
    ? 'var(--status-success-text)'
    : kind === 'err'
    ? 'var(--status-error-text)'
    : kind === 'warn'
    ? 'var(--status-warning-text)'
    : 'var(--status-info-text)'
  const border = kind === 'err' ? 'var(--status-error-border)' : 'transparent'

  return (
    <div
      role={kind === 'err' ? 'alert' : 'status'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: '12px 16px',
        borderRadius: 'var(--r-md)',
        backgroundColor: bg,
        color,
        border: `1px solid ${border}`,
        marginBottom: 'var(--space-4)',
        fontSize: '14px',
      }}
    >
      <span style={{ display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon size={18} />
      </span>
      <div style={{ flex: 1 }}>{children}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss message"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 4,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- Card ---- */
export function Card({ title, sub, children, actions, spotlight = false }) {
  const spotRef = useSpotlight()
  return (
    <div
      ref={spotlight ? spotRef : null}
      className={`card ${spotlight ? 'card-spotlight' : ''}`}
      data-aos="fade-up"
    >
      {(title || actions) && (
        <div className="card-head">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {sub && <div className="card-subtitle">{sub}</div>}
          </div>
          {actions}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------- Table (Max 8 rows + View All) ---- */
export function DocTable({ docs, columns, empty = 'No records found.' }) {
  const [showAll, setShowAll] = useState(false)

  if (!docs || docs.length === 0) return <Empty text={empty} />

  const cols = columns || [
    { key: 'title', label: 'Title' },
    { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
    { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
    { key: 'matter', label: 'Matter' },
    { key: 'client', label: 'Client' },
    { key: 'updated_at', label: 'Updated', render: (v) => <span className="caption">{fmtDate(v)}</span> },
  ]

  const MAX_ROWS = 8
  const displayedDocs = showAll ? docs : docs.slice(0, MAX_ROWS)

  return (
    <div className="table-card" data-aos="fade-up">
      <div className="table-responsive">
        <table className="portal-table">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedDocs.map((d) => (
              <tr key={d.id}>
                {cols.map((c) => (
                  <td key={c.key}>
                    {c.render ? c.render(d[c.key], d) : (d[c.key] ?? <span className="caption">—</span>)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {docs.length > MAX_ROWS && (
        <div className="table-card-footer">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll ? 'Show less' : `View all (${docs.length})`}
          </button>
        </div>
      )}
    </div>
  )
}

export function fmtDate(s) {
  if (!s) return '—'
  const d = new Date(s)
  if (isNaN(d)) return s
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function fmtDateShort(s) {
  if (!s) return '—'
  const d = new Date(s)
  if (isNaN(d)) return s
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
}

export function fmtDetail(detail) {
  if (!detail) return '—'
  if (typeof detail !== 'object') return String(detail)
  const entries = Object.entries(detail)
  if (entries.length === 0) return '—'
  return entries
    .map(([k, v]) => {
      const key = k.replace(/_/g, ' ')
      const val = typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : JSON.stringify(v)
      return `${key}: ${val}`
    })
    .join(' · ')
}

/* ------------------------------------------------------------- Modal ---- */
export function Modal({ isOpen, title, children, onClose }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    panelRef.current?.focus()
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-panel" ref={panelRef} tabIndex="-1">
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
        {title && <h3 id="modal-title" style={{ marginBottom: 'var(--space-4)' }}>{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- Toast ---- */
export function Toast({ kind = 'info', message, onDone, undoAction }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onDone, 150)
    }, 5000)
    return () => clearTimeout(timer)
  }, [onDone])

  const Icon = kind === 'ok'
    ? CheckCircle
    : kind === 'err'
    ? XCircle
    : kind === 'warn'
    ? AlertTriangle
    : Info

  return (
    <div className={`toast ${exiting ? 'toast-exit' : ''}`} role="status">
      <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon size={18} />
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      {undoAction && (
        <button
          className="toast-undo-btn"
          onClick={() => {
            undoAction()
            onDone()
          }}
        >
          Undo
        </button>
      )}
      <button
        onClick={() => {
          setExiting(true)
          setTimeout(onDone, 150)
        }}
        aria-label="Dismiss toast"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          color: 'var(--secondary-text)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------- AI Panel ---- */
export function AiPanel({ prompts }) {
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [takingLong, setTakingLong] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)

  const defaultChips = [
    { label: 'Summarize my cases', prompt: 'Summarize my assigned cases and key status.' },
    { label: 'Draft a client notice', prompt: 'Draft a client notice regarding compliance updates.' },
    { label: 'Check compliance deadlines', prompt: 'Check all upcoming compliance deadlines and risk items.' },
  ]
  const chipsToRender = prompts && prompts.length > 0 ? prompts : defaultChips

  async function run(p) {
    if (!p || !p.trim()) return
    setBusy(true)
    setTakingLong(false)
    setErr(null)
    setResult(null)

    // Section 7: "Still working..." message if a request takes over 8 seconds.
    const longTimer = setTimeout(() => {
      setTakingLong(true)
    }, 8000)

    try {
      const r = await api.runAi(p.trim())
      setResult(r)
    } catch (e) {
      setErr(e.message)
    } finally {
      clearTimeout(longTimer)
      setBusy(false)
      setTakingLong(false)
    }
  }

  return (
    <div className="ai-assistant-card" data-aos="fade-up">
      <div className="card-head">
        <div>
          <h3 className="card-title">Ask the assistant</h3>
          <div className="card-subtitle">
            Governed 16-agent orchestrator with local private inference.
          </div>
        </div>
      </div>

      <div className="quick-action-chips">
        {chipsToRender.map((c) => (
          <button
            key={c.label}
            type="button"
            className="chip-pill"
            disabled={busy}
            onClick={() => {
              setPrompt(c.prompt)
              run(c.prompt)
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="ai-task-input" className="form-label">Task description</label>
        <textarea
          id="ai-task-input"
          className="form-textarea"
          placeholder="Ask the platform a task, e.g. 'Summarize my assigned cases and upcoming deadlines.'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={busy}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <button
          className="btn btn-primary"
          disabled={busy || !prompt.trim()}
          onClick={() => run(prompt)}
        >
          {busy ? (
            <span className="spinner" />
          ) : (
            <Sparkles size={16} style={{ color: 'var(--gold-300)' }} />
          )}
          <span>{busy ? 'Running…' : 'Run task'}</span>
        </button>
      </div>

      {busy && (
        <div className="ai-loading-box">
          <div className="skeleton-line" style={{ width: '85%' }} />
          <div className="skeleton-line" style={{ width: '65%' }} />
          <div className="skeleton-line" style={{ width: '75%' }} />
          <div className="ai-loading-caption">
            <span className="spinner" style={{ borderColor: 'var(--border-strong)', borderTopColor: 'var(--gold-500)' }} />
            <span>Running through 16 agents</span>
          </div>
          {takingLong && (
            <div className="caption" style={{ marginTop: 6, color: 'var(--gold-700)' }}>
              Still working on your request…
            </div>
          )}
        </div>
      )}

      {err && <Alert kind="err" onDismiss={() => setErr(null)}>{err}</Alert>}

      {result && (
        <div className="ai-result-box">
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '15px', lineHeight: 1.6 }}>
            {result.answer || (result.error ? result.error : 'No answer returned.')}
          </div>
          {!result.answer &&
            result.error &&
            /ollama|connection|unavailable/i.test(result.error) && (
              <div className="caption" style={{ marginTop: 8 }}>
                The local Ollama model is currently unreachable. Start Ollama with the configured model
                (e.g. <code>ollama pull llama3.1:8b</code>) to run local inferences. All non-AI portal
                features remain fully functional.
              </div>
            )}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              fontSize: '12px',
              color: 'var(--secondary-text)',
              marginTop: 'var(--space-3)',
              paddingTop: 'var(--space-2)',
              borderTop: '1px solid var(--border)',
              flexWrap: 'wrap',
            }}
          >
            {result.agent_id && <span>Agent: <b>{result.agent_id}</b></span>}
            {result.status && <span>Status: <b>{result.status}</b></span>}
            {result.approval_id && <span>Approval: <b>{result.approval_id}</b></span>}
            {result.latency_ms != null && <span>{result.latency_ms} ms</span>}
            {result.sources && result.sources.length > 0 && (
              <span>{result.sources.length} sources referenced</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- Request Form ---- */
export function RequestForm({ onDone }) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)
  const [touched, setTouched] = useState({})

  const subjErr = touched.subject && !subject.trim() ? 'Please enter a subject.' : null
  const msgErr = touched.message && !message.trim() ? 'Please describe your request.' : null

  async function submit(e) {
    e.preventDefault()
    setTouched({ subject: true, message: true })
    if (!subject.trim() || !message.trim()) return
    setBusy(true)
    setErr(null)
    setMsg(null)
    try {
      const r = await api.submitRequest(subject.trim(), message.trim())
      setMsg(`Request submitted successfully (ref: ${r.doc_id}).`)
      setSubject('')
      setMessage('')
      setTouched({})
      if (onDone) onDone()
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title="Submit a request" sub="Your request will be recorded and logged in your request history.">
      <form onSubmit={submit} noValidate>
        <div className="form-group">
          <label htmlFor="req-subject" className="form-label">Subject</label>
          <input
            id="req-subject"
            className={`form-input ${subjErr ? 'has-error' : ''}`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
            placeholder="e.g. Updated status on my matter"
            aria-invalid={!!subjErr}
          />
          {subjErr && (
            <div className="field-error-msg">
              <AlertTriangle size={14} /> <span>{subjErr}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="req-message" className="form-label">Message</label>
          <textarea
            id="req-message"
            className={`form-textarea ${msgErr ? 'has-error' : ''}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            placeholder="Describe your request in detail…"
            aria-invalid={!!msgErr}
          />
          {msgErr && (
            <div className="field-error-msg">
              <AlertTriangle size={14} /> <span>{msgErr}</span>
            </div>
          )}
        </div>

        {err && <Alert kind="err" onDismiss={() => setErr(null)}>{err}</Alert>}
        {msg && <Alert kind="ok" onDismiss={() => setMsg(null)}>{msg}</Alert>}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" disabled={busy} type="submit">
            {busy ? <span className="spinner" /> : <Send size={15} />}
            <span>{busy ? 'Submitting…' : 'Submit request'}</span>
          </button>
        </div>
      </form>
    </Card>
  )
}

/* ------------------------------------------------------------- Upload Form ---- */
export function UploadForm({ onDone }) {
  const [file, setFile] = useState(null)
  const [sens, setSens] = useState('internal')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (!file) return
    setBusy(true)
    setErr(null)
    setMsg(null)
    try {
      const r = await api.upload(file, sens)
      setMsg(
        r.status === 'error'
          ? `Upload processed with note: ${r.error || 'see agent logs'}`
          : `Document “${file.name}” ingested (${r.status}).`,
      )
      setFile(null)
      if (onDone) onDone()
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title="Upload a document" sub="Documents are classified for sensitivity and ingested locally.">
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="up-file" className="form-label">File</label>
          <input
            id="up-file"
            type="file"
            className="form-input"
            style={{ padding: '10px 14px' }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <div className="caption" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14} /> {file.name}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="up-sens" className="form-label">Declared sensitivity</label>
          <select
            id="up-sens"
            className="form-select"
            value={sens}
            onChange={(e) => setSens(e.target.value)}
          >
            <option value="public">public</option>
            <option value="internal">internal</option>
            <option value="confidential">confidential</option>
          </select>
        </div>

        {err && <Alert kind="err" onDismiss={() => setErr(null)}>{err}</Alert>}
        {msg && <Alert kind="ok" onDismiss={() => setMsg(null)}>{msg}</Alert>}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" disabled={busy || !file} type="submit">
            {busy ? <span className="spinner" /> : <Upload size={15} />}
            <span>{busy ? 'Uploading…' : 'Upload document'}</span>
          </button>
        </div>
      </form>
    </Card>
  )
}

/* ------------------------------------------------------------- Approvals Queue ---- */
export function ApprovalsQueue({ approvals, onDecided }) {
  const [busyId, setBusyId] = useState(null)
  const [note, setNote] = useState({})
  const [err, setErr] = useState(null)

  async function decide(id, decision) {
    setBusyId(id)
    setErr(null)
    try {
      await api.approve(id, decision, note[id] || '')
      if (onDecided) onDecided()
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusyId(null)
    }
  }

  if (!approvals || approvals.length === 0) {
    return <Empty icon={CheckCircle} title="All clear" text="No pending approvals in your queue." />
  }

  return (
    <div>
      {err && <Alert kind="err" onDismiss={() => setErr(null)}>{err}</Alert>}
      <div className="table-card">
        <div className="table-responsive">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Approval</th>
                <th>Kind</th>
                <th>Requested by</th>
                <th>When</th>
                <th>Note</th>
                <th style={{ textAlign: 'right' }}>Decision</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((a) => (
                <tr key={a.id}>
                  <td>
                    <b>{a.title}</b>
                    <div className="caption mono-chip" style={{ display: 'inline-block', marginTop: 2 }}>{a.id}</div>
                  </td>
                  <td><TypeBadge t={a.kind} /></td>
                  <td>{a.requested_by}</td>
                  <td className="caption">{fmtDateShort(a.requested_at)}</td>
                  <td>
                    <input
                      className="form-input"
                      style={{ height: 38, fontSize: 13 }}
                      placeholder="Optional note"
                      value={note[a.id] || ''}
                      aria-label={`Note for approval ${a.id}`}
                      onChange={(e) => setNote((n) => ({ ...n, [a.id]: e.target.value }))}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={busyId === a.id}
                        onClick={() => decide(a.id, 'approved')}
                      >
                        {busyId === a.id ? <span className="spinner" /> : <Check size={14} />}
                        <span>Approve</span>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={busyId === a.id}
                        onClick={() => decide(a.id, 'rejected')}
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- Audit Table ---- */
export function AuditTable({ entries, limit = 8 }) {
  const [showAll, setShowAll] = useState(false)
  const allRows = entries || []

  if (allRows.length === 0) {
    return <Empty icon={FileText} title="No audit entries" text="No audit records have been generated yet." />
  }

  const displayedRows = showAll ? allRows : allRows.slice(0, limit)

  return (
    <div className="table-card" data-aos="fade-up">
      <div className="table-responsive">
        <table className="portal-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Result</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((e, i) => (
              <tr key={i}>
                <td className="caption" style={{ whiteSpace: 'nowrap' }}>
                  {fmtDate(e.timestamp || e.ts)}
                </td>
                <td><b>{e.actor}</b></td>
                <td><TypeBadge t={e.action} /></td>
                <td>{e.result ? <StatusBadge s={e.result} /> : <span className="caption">—</span>}</td>
                <td className="caption">{fmtDetail(e.detail)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {allRows.length > limit && (
        <div className="table-card-footer">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll ? 'Show less' : `View all (${allRows.length})`}
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- Page Skeleton ---- */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading page content">
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ height: 110, padding: 20 }}>
            <div className="skeleton-line" style={{ width: '40%', height: 14 }} />
            <div className="skeleton-line" style={{ width: '60%', height: 32, marginTop: 12 }} />
          </div>
        ))}
      </div>
      <div className="card" style={{ height: 200, marginBottom: 'var(--space-6)' }}>
        <div className="skeleton-line" style={{ width: '30%', height: 20 }} />
        <div className="skeleton-line" style={{ width: '90%', height: 16, marginTop: 16 }} />
        <div className="skeleton-line" style={{ width: '75%', height: 16, marginTop: 8 }} />
      </div>
      <div className="grid-2">
        <div className="card" style={{ height: 240 }}>
          <div className="skeleton-line" style={{ width: '40%', height: 20 }} />
          <div className="skeleton-line" style={{ width: '100%', height: 40, marginTop: 16 }} />
          <div className="skeleton-line" style={{ width: '100%', height: 40, marginTop: 8 }} />
        </div>
        <div className="card" style={{ height: 240 }}>
          <div className="skeleton-line" style={{ width: '40%', height: 20 }} />
          <div className="skeleton-line" style={{ width: '100%', height: 40, marginTop: 16 }} />
          <div className="skeleton-line" style={{ width: '100%', height: 40, marginTop: 8 }} />
        </div>
      </div>
    </div>
  )
}
