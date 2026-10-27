import { useState } from 'react'
import { usePortalData } from '../hooks.js'
import {
  Kpi, Card, Alert, SensBadge, TypeBadge, PageSkeleton, Empty, fmtDate, fmtDetail,
} from '../components/ui.jsx'
import { useRevealGroup } from '../motion.js'
import { Search, FileText, Activity, ChevronDown } from '../components/icons.jsx'

export default function AuditorPortal() {
  const { data, loading, error } = usePortalData()
  const [q, setQ] = useState('')
  const ref = useRevealGroup()
  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const records = (data.compliance_records || []).filter((r) => {
    if (!q.trim()) return true
    const s = q.toLowerCase()
    return (
      (r.title || '').toLowerCase().includes(s) ||
      (r.content || '').toLowerCase().includes(s) ||
      (r.doc_type || '').toLowerCase().includes(s)
    )
  })

  return (
    <div ref={ref}>
      <Alert kind="info">{data.note || 'You see only explicitly shared compliance/audit records (controlled access).'}</Alert>

      <div className="grid cols-3">
        <Kpi label="Compliance records" value={data.compliance_records?.length ?? 0} icon={FileText} accent />
        <Kpi label="Audit trail entries" value={data.audit_trail?.length ?? 0} icon={Activity} />
        <Kpi label="Matching" value={records.length} icon={Search} />
      </div>

      <div className="section-title reveal">Compliance &amp; audit records</div>
      <div className="reveal">
        <Card>
          <div className="row" style={{ marginBottom: 14, maxWidth: 420 }}>
            <input
              placeholder="Search records by title, content or type…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search compliance records"
            />
          </div>
          {records.length === 0 && <Empty icon={Search} text="No matching records." />}
          <div style={{ display: 'grid', gap: 12 }}>
            {records.map((r) => (
              <details key={r.id} className="record">
                <summary>
                  {r.title}
                  <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TypeBadge t={r.doc_type} />
                    <SensBadge s={r.sensitivity} />
                    <span className="muted small">{fmtDate(r.updated_at)}</span>
                    <span className="chev" aria-hidden="true"><ChevronDown /></span>
                  </span>
                </summary>
                <div className="record-body">
                  <pre>{r.content || '(no content)'}</pre>
                </div>
              </details>
            ))}
          </div>
        </Card>
      </div>

      <div className="section-title reveal">Audit trail</div>
      <div className="reveal">
        <Card>
          <AuditTrail entries={data.audit_trail} />
        </Card>
      </div>
    </div>
  )
}

function AuditTrail({ entries }) {
  const rows = (entries || []).slice(-100).reverse()
  if (rows.length === 0) return <Empty icon={Activity} text="No audit entries." />
  return (
    <div className="table-wrap scrollbox">
      <table className="data">
        <thead>
          <tr>
            <th>Time</th>
            <th>Actor</th>
            <th>Action</th>
            <th>User</th>
            <th>Result</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e, i) => (
            <tr key={i}>
              <td className="audit-time">{fmtDate(e.timestamp)}</td>
              <td>{e.actor}</td>
              <td><span className="badge type">{e.action}</span></td>
              <td>{e.user || <span className="muted">—</span>}</td>
              <td>{e.result || <span className="muted">—</span>}</td>
              <td className="muted small">
                {e.detail && Object.keys(e.detail).length ? fmtDetail(e.detail) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}