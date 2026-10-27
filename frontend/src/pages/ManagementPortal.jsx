import { usePortalData } from '../hooks.js'
import {
  Kpi, Card, ApprovalsQueue, AuditTable, Alert, SensBadge, PageSkeleton, Empty,
} from '../components/ui.jsx'
import { useRevealGroup } from '../motion.js'
import {
  FileText, Briefcase, CheckCircle, Percent, MapPin, Users, Shield,
} from '../components/icons.jsx'

function SensDist({ dist }) {
  const entries = Object.entries(dist || {})
  if (entries.length === 0) return <div className="muted">No data.</div>
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1
  const order = ['public', 'internal', 'confidential', 'restricted']
  const colors = {
    public: 'var(--success-500)',
    internal: 'var(--primary-500)',
    confidential: 'var(--warning-500)',
    restricted: 'var(--error-500)',
  }
  const sorted = order.filter((k) => dist[k]).map((k) => [k, dist[k]])
  return (
    <div>
      <div className="sens-bar" role="img" aria-label="Sensitivity distribution">
        {sorted.map(([k, v]) => (
          <div
            key={k}
            style={{ width: `${(v / total) * 100}%`, background: colors[k] }}
            title={`${k}: ${v}`}
          />
        ))}
      </div>
      <div className="sens-legend">
        {sorted.map(([k, v]) => (
          <span key={k}>
            <SensBadge s={k} /> {v}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ManagementPortal() {
  const { data, loading, error } = usePortalData()
  const ref = useRevealGroup()
  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const kpi = data.kpi || {}
  return (
    <div ref={ref}>
      <div className="grid cols-4">
        <Kpi label="Documents" value={kpi.documents ?? 0} icon={FileText} accent />
        <Kpi label="Open cases" value={kpi.open_cases ?? 0} icon={Briefcase} />
        <Kpi label="Pending approvals" value={kpi.pending_approvals ?? 0} icon={CheckCircle} />
        <Kpi label="Tax matters" value={kpi.tax_matters ?? 0} icon={Percent} />
      </div>
      <div className="grid cols-4 mt-20">
        <Kpi label="Land parcels" value={kpi.land_parcels ?? 0} icon={MapPin} />
        <Kpi label="Entity profiles" value={kpi.entities ?? 0} icon={Users} />
        <Kpi label="Compliance records" value={data.counts?.compliance ?? 0} icon={Shield} />
        <Kpi label="Drafts" value={data.counts?.drafts ?? 0} icon={FileText} />
      </div>

      <div className="grid cols-2 mt-20">
        <div className="reveal">
          <Card title="Workload by matter" sub="Open case work grouped by matter / client.">
            {data.workload && data.workload.length ? (
              <div className="table-wrap">
                <table className="data">
                  <thead>
                    <tr>
                      <th>Matter</th>
                      <th>Client</th>
                      <th>Deadline</th>
                      <th style={{ textAlign: 'right' }}>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.workload.map((w) => (
                      <tr key={w.matter}>
                        <td><b>{w.matter}</b></td>
                        <td>{w.client || <span className="muted">—</span>}</td>
                        <td className="muted">{w.deadline || '—'}</td>
                        <td style={{ textAlign: 'right' }}>{w.items}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty text="No workload recorded." />
            )}
          </Card>
        </div>

        <div className="reveal" data-reveal-delay="0.08">
          <Card title="Risk alerts" sub="Latest compliance snapshots.">
            {data.risk_alerts && data.risk_alerts.length ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {data.risk_alerts.map((r, i) => (
                  <div key={i} className="risk-item">
                    <b>{r.title}</b>
                    <div className="muted small">{r.summary}</div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty text="No risk alerts." />
            )}
          </Card>
        </div>
      </div>

      <div className="grid cols-2 mt-20">
        <div className="reveal">
          <Card title="Pending approvals" sub="Approve or reject gated actions.">
            <ApprovalsQueue approvals={data.pending_approvals} />
          </Card>
        </div>
        <div className="reveal" data-reveal-delay="0.08">
          <Card title="Sensitivity distribution" sub="How documents are classified across the firm.">
            <SensDist dist={data.sensitivity_distribution} />
          </Card>
        </div>
      </div>

      <div className="section-title reveal">Recent activity</div>
      <div className="reveal">
        <Card>
          <AuditTable entries={data.recent_audit} limit={12} />
        </Card>
      </div>
    </div>
  )
}