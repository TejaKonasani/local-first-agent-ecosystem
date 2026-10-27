import { useState } from 'react'
import { api } from '../api.js'
import { useCountUp, useRevealGroup } from '../motion.js'
import {
  FileText, FolderOpen, Inbox, CheckCircle, XCircle, AlertTriangle, Info, X,
  Sparkles, Send, Upload, Check,
} from './icons.jsx'

/* ---------------------------------------------------------------- KPI ---- */
export function Kpi({ label, value, hint, accent, icon: Icon }) {
  const numRef = useCountUp(value)
  return (
    <div className={'kpi' + (accent ? ' accent' : '')}>
      {Icon && (
        <span className="kpi-icon" aria-hidden="true">
          <Icon />
        </span>
      )}
      <div className="label">{label}</div>
      <div className="value" ref={numRef}>{value ?? 0}</div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}

/* ------------------------------------------------------------- badges ---- */
export function SensBadge({ s }) {
  if (!s) return null
  return (
    <span className={`badge sens-${s}`}>
      <span className="dot" aria-hidden="true" />
      {s}
    </span>
  )
}

export function TypeBadge({ t }) {
  if (!t) return null
  return <span className="badge type">{t.replace(/_/g, ' ')}</span>
}

export function StatusBadge({ s }) {
  if (!s) return null
  return (
    <span className={`badge status-${s}`}>
      <span className="dot" aria-hidden="true" />
      {s}
    </span>
  )
}

/* --------------------------------------------------------------- empty ---- */
export function Empty({ icon: Icon = Inbox, text = 'Nothing here yet.', title }) {
  return (
    <div className="empty">
      <span className="big" aria-hidden="true">
        <Icon />
      </span>
      {title && <div className="empty-title">{title}</div>}
      <div>{text}</div>
    </div>
  )
}

/* -------------------------------------------------------------- alert ---- */
const ALERT_ICONS = { ok: CheckCircle, err: XCircle, warn: AlertTriangle, info: Info }

export function Alert({ kind = 'info', children, onDismiss }) {
  if (!children) return null
  const Icon = ALERT_ICONS[kind] || Info
  return (
    <div className={`alert ${kind}`} role={kind === 'err' ? 'alert' : 'status'}>
      <span className="alert-icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="alert-msg">{children}</span>
      {onDismiss && (
        <button className="alert-close" onClick={onDismiss} aria-label="Dismiss message">
          <X />
        </button>
      )}
    </div>
  )
}

/* --------------------------------------------------------------- card ---- */
export function Card({ title, sub, children, actions, pad = true }) {
  return (
    <div className={'card' + (pad ? '' : ' card-pad')}>
      {(title || actions) && (
        <div className="card-head">
          <div>
            {title && <h3>{title}</h3>}
            {sub && <div className="cardsub">{sub}</div>}
          </div>
          {actions}
        </div>
      )}
      <div className={pad ? '' : 'card-body'}>{children}</div>
    </div>
  )
}

/* -------------------------------------------------------------- table ---- */
export function DocTable({ docs, columns, empty = 'No records found.' }) {
  if (!docs || docs.length === 0) return <Empty text={empty} />
  const cols = columns || [
    { key: 'title', label: 'Title' },
    { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
    { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
    { key: 'matter', label: 'Matter' },
    { key: 'client', label: 'Client' },
    { key: 'updated_at', label: 'Updated', render: (v) => <span className="muted nowrap">{fmtDate(v)}</span> },
  ]
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>{cols.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {docs.map((d) => (
            <tr key={d.id}>
              {cols.map((c) => (
                <td key={c.key}>
                  {c.render ? c.render(d[c.key], d) : (d[c.key] ?? <span className="muted">—</span>)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function fmtDate(s) {
  if (!s) return '—'
  const d = new Date(s)
  if (isNaN(d)) return s
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

// Compact date-only form for tight table columns.
export function fmtDateShort(s) {
  if (!s) return '—'
  const d = new Date(s)
  if (isNaN(d)) return s
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
}

// Human-readable rendering of an audit detail object (no raw JSON).
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
/* --------------------------------------------------------------- toast ---- */
export function Toast({ kind = 'info', message, onDone }) {
  const [leaving, setLeaving] = useState(false)
  const Icon = kind === 'ok' ? CheckCircle : kind === 'err' ? XCircle : Info
  function close() {
    setLeaving(true)
    setTimeout(onDone, 200)
  }
  return (
    <div className={'toast ' + kind} role="status">
      <span className="toast-ico" aria-hidden="true">
        <Icon />
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      <button className="alert-close" onClick={close} aria-label="Dismiss">
        <X />
      </button>
    </div>
  )
}

/* ----------------------------------------------------------- AI panel ---- */
export function AiPanel({ prompts }) {
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)

  async function run(p) {
    if (!p || !p.trim()) return
    setBusy(true)
    setErr(null)
    setResult(null)
    try {
      const r = await api.runAi(p.trim())
      setResult(r)
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card
      title="AI-assisted tasks"
      sub="Runs through the governed 16-agent orchestrator (local Ollama)."
    >
      {prompts && prompts.length > 0 && (
        <div className="row wrap" style={{ marginBottom: 14 }}>
          {prompts.map((p) => (
            <button
              key={p.label}
              type="button"
              className="chip"
              disabled={busy}
              onClick={() => {
                setPrompt(p.prompt)
                run(p.prompt)
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div className="row">
        <textarea
          placeholder="Ask the platform a task, e.g. 'Summarize my assigned cases and upcoming deadlines.'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ minHeight: 64 }}
          aria-label="Task prompt"
        />
      </div>
      <div className="row end" style={{ marginTop: 4 }}>
        <button className="btn gold" disabled={busy} onClick={() => run(prompt)}>
          {busy ? <span className="spinner" /> : <Sparkles size={15} />}
          {busy ? 'Running…' : 'Run task'}
        </button>
      </div>
      {err && <Alert kind="err" onDismiss={() => setErr(null)}>{err}</Alert>}
      {result && (
        <div className="ai-result">
          {result.answer || (result.error ? result.error : 'No answer returned.')}
          {!result.answer &&
            result.error &&
            /ollama|connection|unavailable/i.test(result.error) && (
              <div className="muted small" style={{ marginTop: 8 }}>
                The local Ollama model is not reachable. Start Ollama and pull the configured model
                (e.g. <code>ollama pull llama3.1:8b</code>) to run AI tasks. Everything else in this
                portal works without it.
              </div>
            )}
          <div className="ai-meta">
            {result.agent_id && <span>agent: <b>{result.agent_id}</b></span>}
            {result.status && <span>status: <b>{result.status}</b></span>}
            {result.approval_id && <span>approval: <b>{result.approval_id}</b></span>}
            {result.latency_ms != null && <span>{result.latency_ms} ms</span>}
            {result.sources && result.sources.length > 0 && (
              <span>{result.sources.length} source(s)</span>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

/* ------------------------------------------------------ request form ---- */
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
      setMsg(`Request submitted (ref ${r.doc_id}). The firm has been notified.`)
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
    <Card title="Submit a request" sub="Send a request to the firm. It is logged and appears in your request history.">
      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="req-subject">Subject</label>
          <input
            id="req-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
            placeholder="e.g. Updated status on my matter"
            className={subjErr ? 'invalid' : ''}
            aria-invalid={!!subjErr}
          />
          {subjErr && <span className="field-error"><AlertTriangle size={13} /> {subjErr}</span>}
        </div>
        <div className="field">
          <label htmlFor="req-message">Message</label>
          <textarea
            id="req-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            placeholder="Describe what you need…"
            className={msgErr ? 'invalid' : ''}
            aria-invalid={!!msgErr}
          />
          {msgErr && <span className="field-error"><AlertTriangle size={13} /> {msgErr}</span>}
        </div>
        {err && <Alert kind="err" onDismiss={() => setErr(null)}>{err}</Alert>}
        {msg && <Alert kind="ok" onDismiss={() => setMsg(null)}>{msg}</Alert>}
        <div className="row end">
          <button className="btn primary" disabled={busy} type="submit">
            {busy ? <span className="spinner" /> : <Send size={15} />}
            {busy ? 'Submitting…' : 'Submit request'}
          </button>
        </div>
      </form>
    </Card>
  )
}

/* ------------------------------------------------------- upload form ---- */
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
          ? `Upload processed with a note: ${r.error || 'see agent'}`
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
    <Card title="Upload a document" sub="Documents are run through intake/OCR and classified for sensitivity.">
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="up-file">File</label>
          <input
            id="up-file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <span className="field-hint" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={13} /> {file.name}
            </span>
          )}
        </div>
        <div className="field">
          <label htmlFor="up-sens">Declared sensitivity</label>
          <select id="up-sens" value={sens} onChange={(e) => setSens(e.target.value)}>
            <option value="public">public</option>
            <option value="internal">internal</option>
            <option value="confidential">confidential</option>
          </select>
        </div>
        {err && <Alert kind="err" onDismiss={() => setErr(null)}>{err}</Alert>}
        {msg && <Alert kind="ok" onDismiss={() => setMsg(null)}>{msg}</Alert>}
        <div className="row end">
          <button className="btn primary" disabled={busy || !file} type="submit">
            {busy ? <span className="spinner" /> : <Upload size={15} />}
            {busy ? 'Uploading…' : 'Upload document'}
          </button>
        </div>
      </form>
    </Card>
  )
}

/* --------------------------------------------------- approvals queue ---- */
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

  if (!approvals || approvals.length === 0)
    return <Empty icon={CheckCircle} text="No pending approvals." title="All clear" />
  return (
    <div>
      {err && <Alert kind="err" onDismiss={() => setErr(null)}>{err}</Alert>}
      <div className="table-wrap">
        <table className="data">
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
                  <div className="muted small mono">{a.id}</div>
                </td>
                <td><span className="badge type">{a.kind}</span></td>
                <td>{a.requested_by}</td>
                <td className="muted nowrap">{fmtDateShort(a.requested_at)}</td>
                <td style={{ minWidth: 160 }}>
                  <input
                    placeholder="optional note"
                    value={note[a.id] || ''}
                    aria-label={`Note for approval ${a.id}`}
                    onChange={(e) => setNote((n) => ({ ...n, [a.id]: e.target.value }))}
                  />
                </td>
                <td>
                  <div className="row" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn sm"
                      disabled={busyId === a.id}
                      onClick={() => decide(a.id, 'approved')}
                      style={busyId === a.id ? {} : { borderColor: 'var(--success-500)', color: 'var(--success-600)' }}
                    >
                      {busyId === a.id ? <span className="spinner" /> : <Check size={13} />}
                      Approve
                    </button>
                    <button className="btn sm danger" disabled={busyId === a.id} onClick={() => decide(a.id, 'rejected')}>
                      <X size={13} /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -------------------------------------------------------- audit table ---- */
export function AuditTable({ entries, limit = 20 }) {
  const rows = (entries || []).slice(0, limit)
  if (rows.length === 0) return <Empty icon={FileText} text="No audit entries yet." />
  return (
    <div className="table-wrap scrollbox">
      <table className="data">
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
          {rows.map((e, i) => (
            <tr key={i}>
              <td className="audit-time">{fmtDate(e.timestamp || e.ts)}</td>
              <td>{e.actor}</td>
              <td><span className="badge type">{e.action}</span></td>
              <td>{e.result ? <StatusBadge s={e.result} /> : <span className="muted">—</span>}</td>
              <td className="muted small">{fmtDetail(e.detail)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------- page skeleton ---- */
export function PageSkeleton() {
  const ref = useRevealGroup()
  return (
    <div ref={ref} aria-busy="true" aria-label="Loading">
      <div className="grid cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="kpi skeleton" style={{ height: 108 }} />
        ))}
      </div>
      <div className="card skeleton mt-20" style={{ height: 220 }} />
      <div className="grid cols-2 mt-20">
        <div className="card skeleton" style={{ height: 260 }} />
        <div className="card skeleton" style={{ height: 260 }} />
      </div>
    </div>
  )
}