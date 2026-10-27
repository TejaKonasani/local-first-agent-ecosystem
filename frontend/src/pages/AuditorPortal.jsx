import { useState, useEffect } from 'react'
import { usePortalData } from '../hooks.js'
import {
  Kpi, Card, Alert, SensBadge, TypeBadge, StatusBadge, PageSkeleton, Empty, fmtDate, fmtDetail,
} from '../components/ui.jsx'
import { Search, FileText, Activity, ChevronDown } from '../components/icons.jsx'

export default function AuditorPortal() {
  const { data, loading, error } = usePortalData()
  const [q, setQ] = useState('')

  useEffect(() => {
    document.title = 'Auditor Portal | Local-First Agents'
  }, [])

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Controlled access note */}
      <Alert kind="info">
        {data.note || 'Controlled regulator access: Only explicitly shared compliance and audit records are visible in this portal.'}
      </Alert>

      {/* Stat Cards */}
      <div className="grid-3">
        <Kpi label="Compliance records" value={data.compliance_records?.length ?? 0} icon={FileText} accent />
        <Kpi label="Audit trail entries" value={data.audit_trail?.length ?? 0} icon={Activity} />
        <Kpi label="Matching filter" value={records.length} icon={Search} />
      </div>

      {/* Compliance records section */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>Compliance &amp; audit records</h3>
        <Card>
          <div className="form-group" style={{ maxWidth: 420, marginBottom: 'var(--space-4)' }}>
            <label htmlFor="auditor-search" className="form-label">Search records</label>
            <input
              id="auditor-search"
              className="form-input"
              placeholder="Search by title, keywords or classification…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {records.length === 0 ? (
            <Empty icon={Search} title="No matching records" text="Try adjusting your search criteria." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {records.map((r) => (
                <details key={r.id} className="accordion-item">
                  <summary className="accordion-header">
                    <span>{r.title}</span>
                    <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <TypeBadge t={r.doc_type} />
                      <SensBadge s={r.sensitivity} />
                      <span className="caption">{fmtDate(r.updated_at)}</span>
                      <span className="accordion-chevron" aria-hidden="true"><ChevronDown size={18} /></span>
                    </span>
                  </summary>
                  <div className="accordion-content">
                    <pre
                      style={{
                        margin: 0,
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--r-md)',
                        backgroundColor: 'var(--ivory)',
                        border: '1px solid var(--border)',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      {r.content || '(No additional text content recorded)'}
                    </pre>
                  </div>
                </details>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Audit trail */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>Audit trail</h3>
        <Card>
          <AuditTrail entries={data.audit_trail} />
        </Card>
      </div>
    </div>
  )
}

function AuditTrail({ entries }) {
  const [showAll, setShowAll] = useState(false)
  const rows = (entries || []).slice(-100).reverse()

  if (rows.length === 0) {
    return <Empty icon={Activity} title="No audit entries" text="No audit records available in this scope." />
  }

  const MAX_ROWS = 8
  const displayed = showAll ? rows : rows.slice(0, MAX_ROWS)

  return (
    <div>
      <div className="table-responsive">
        <table className="portal-table">
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
            {displayed.map((e, i) => (
              <tr key={i}>
                <td className="caption" style={{ whiteSpace: 'nowrap' }}>{fmtDate(e.timestamp)}</td>
                <td><b>{e.actor}</b></td>
                <td><TypeBadge t={e.action} /></td>
                <td>{e.user || <span className="caption">—</span>}</td>
                <td>{e.result ? <StatusBadge s={e.result} /> : <span className="caption">—</span>}</td>
                <td className="caption">
                  {e.detail && Object.keys(e.detail).length ? fmtDetail(e.detail) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > MAX_ROWS && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll ? 'Show less' : `View all (${rows.length})`}
          </button>
        </div>
      )}
    </div>
  )
}
