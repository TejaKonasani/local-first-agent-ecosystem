import { useEffect } from 'react'
import { usePortalData } from '../hooks.js'
import {
  Kpi, Card, DocTable, RequestForm, UploadForm, Alert, PageSkeleton, Empty, fmtDate,
  SensBadge, TypeBadge,
} from '../components/ui.jsx'
import { MapPin, Inbox, Activity } from '../components/icons.jsx'

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

export default function TenantPortal() {
  const { data, loading, error, reload } = usePortalData()

  useEffect(() => {
    document.title = 'Tenant & Vendor Portal | Local-First Agents'
  }, [])

  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const c = data.counts || {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Stat Cards */}
      <div className="grid-3">
        <Kpi label="Parcels / projects" value={c.land ?? 0} icon={MapPin} accent />
        <Kpi label="My requests" value={c.requests ?? 0} icon={Inbox} />
        <Kpi label="Updates" value={data.updates?.length ?? 0} icon={Activity} />
      </div>

      {/* Grid 2: Request & Upload */}
      <div className="grid-2">
        <RequestForm onDone={reload} />
        <UploadForm onDone={reload} />
      </div>

      {/* Parcels Table */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>My parcels &amp; projects</h3>
        <DocTable
          docs={data.parcels}
          columns={[
            { key: 'title', label: 'Parcel / project' },
            { key: 'parcel', label: 'Parcel ID', render: (v) => <span className="mono-chip">{v || '—'}</span> },
            { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
            { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
            { key: 'updated_at', label: 'Updated', render: (v) => <span className="caption">{fmtDate(v)}</span> },
          ]}
          empty="No parcels or projects are linked to your profile."
        />
      </div>

      {/* Grid 2: Latest updates & Request history */}
      <div className="grid-2">
        <Card title="Latest updates" sub="Recent property notices and project milestones.">
          <DocTable docs={data.updates} columns={HALF_COLS} empty="No project updates recorded." />
        </Card>

        <Card title="My request history" sub="Inquiries submitted regarding parcels and services.">
          <RequestHistory requests={data.my_requests} />
        </Card>
      </div>
    </div>
  )
}
