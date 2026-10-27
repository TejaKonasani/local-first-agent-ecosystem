import { usePortalData } from '../hooks.js'
import {
  Kpi, Card, DocTable, RequestForm, UploadForm, Alert, PageSkeleton, Empty, fmtDate,
  SensBadge, TypeBadge,
} from '../components/ui.jsx'
import { useRevealGroup } from '../motion.js'
import { MapPin, Inbox, Activity } from '../components/icons.jsx'

const HALF_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
  { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
  { key: 'updated_at', label: 'Updated', render: (v) => <span className="muted nowrap">{fmtDate(v)}</span> },
]

function RequestHistory({ requests }) {
  if (!requests || requests.length === 0)
    return <Empty icon={Inbox} text="You haven't submitted any requests yet." />
  return (
    <div className="table-wrap">
      <table className="data">
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
              <td className="muted nowrap">{fmtDate(r.created_at)}</td>
              <td className="muted small mono">{r.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TenantPortal() {
  const { data, loading, error, reload } = usePortalData()
  const ref = useRevealGroup()
  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const c = data.counts || {}
  return (
    <div ref={ref}>
      <div className="grid cols-3">
        <Kpi label="Parcels / projects" value={c.land ?? 0} icon={MapPin} accent />
        <Kpi label="My requests" value={c.requests ?? 0} icon={Inbox} />
        <Kpi label="Updates" value={data.updates?.length ?? 0} icon={Activity} />
      </div>

      <div className="grid cols-2 mt-20">
        <div className="reveal"><RequestForm onDone={reload} /></div>
        <div className="reveal" data-reveal-delay="0.08"><UploadForm onDone={reload} /></div>
      </div>

      <div className="section-title reveal">My parcels &amp; projects</div>
      <div className="reveal">
        <Card>
          <DocTable
            docs={data.parcels}
            columns={[
              { key: 'title', label: 'Parcel / project' },
              { key: 'parcel', label: 'Parcel ID', render: (v) => <span className="mono muted">{v || '—'}</span> },
              { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
              { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
              { key: 'updated_at', label: 'Updated', render: (v) => <span className="muted nowrap">{fmtDate(v)}</span> },
            ]}
            empty="No parcels or projects are linked to you yet."
          />
        </Card>
      </div>

      <div className="grid cols-2 mt-20">
        <div className="reveal">
          <div className="section-title">Latest updates</div>
          <Card><DocTable docs={data.updates} columns={HALF_COLS} empty="No updates yet." /></Card>
        </div>
        <div className="reveal" data-reveal-delay="0.08">
          <div className="section-title">My request history</div>
          <Card>
            <RequestHistory requests={data.my_requests} />
          </Card>
        </div>
      </div>
    </div>
  )
}