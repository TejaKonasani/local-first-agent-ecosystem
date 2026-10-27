import { useEffect } from 'react'
import { usePortalData } from '../hooks.js'
import {
  Kpi, Card, DocTable, RequestForm, UploadForm, Alert, PageSkeleton, Empty, fmtDate,
  TypeBadge, SensBadge,
} from '../components/ui.jsx'
import { Briefcase, FileText, Inbox } from '../components/icons.jsx'

const HALF_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
  { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
  { key: 'updated_at', label: 'Updated', render: (v) => <span className="caption">{fmtDate(v)}</span> },
]

function RequestHistory({ requests }) {
  if (!requests || requests.length === 0) {
    return <Empty icon={Inbox} title="No requests" text="You haven't submitted any requests yet." />
  }
  return (
    <div className="table-responsive">
      <table className="portal-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Submitted</th>
            <th>Ref</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td><b>{r.subject || r.title}</b></td>
              <td className="caption">{fmtDate(r.created_at)}</td>
              <td className="caption mono-chip">{r.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ClientPortal() {
  const { data, loading, error, reload } = usePortalData()

  useEffect(() => {
    document.title = 'Client Portal | Local-First Agents'
  }, [])

  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const c = data.counts || {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Stat Cards */}
      <div className="grid-3">
        <Kpi label="My cases" value={c.cases ?? 0} icon={Briefcase} accent />
        <Kpi label="Reviewed reports" value={data.reports?.length ?? 0} icon={FileText} />
        <Kpi label="My requests" value={c.requests ?? 0} icon={Inbox} />
      </div>

      {/* Grid 2: Request Form & Upload Form */}
      <div className="grid-2">
        <RequestForm onDone={reload} />
        <UploadForm onDone={reload} />
      </div>

      {/* My Cases */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>My cases</h3>
        <DocTable docs={data.cases} empty="No cases are currently visible to your account." />
      </div>

      {/* Grid 2: Reviewed Reports & Request History */}
      <div className="grid-2">
        <Card title="Reviewed reports" sub="Approved final legal reports and summaries.">
          <DocTable docs={data.reports} columns={HALF_COLS} empty="No reports shared with you yet." />
        </Card>

        <Card title="My request history" sub="Chronological tracking of submitted inquiries.">
          <RequestHistory requests={data.my_requests} />
        </Card>
      </div>
    </div>
  )
}
