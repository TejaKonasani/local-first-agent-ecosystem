import { useEffect } from 'react'
import { usePortalData } from '../hooks.js'
import {
  Kpi, Card, ApprovalsQueue, AuditTable, Alert, SensBadge, PageSkeleton, Empty,
} from '../components/ui.jsx'
import {
  FileText, Briefcase, CheckCircle, Percent, MapPin, Users, Shield,
} from '../components/icons.jsx'

function SensDist({ dist }) {
  const entries = Object.entries(dist || {})
  if (entries.length === 0) return <div className="caption">No classification data.</div>
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1
  const order = ['public', 'internal', 'confidential', 'restricted']
  const colors = {
    public: 'var(--status-success-text)',
    internal: 'var(--status-info-text)',
    confidential: 'var(--gold-500)',
    restricted: 'var(--status-error-text)',
  }
  const sorted = order.filter((k) => dist[k]).map((k) => [k, dist[k]])

  return (
    <div>
      <div className="sens-bar-track" role="img" aria-label="Sensitivity distribution bar">
        {sorted.map(([k, v]) => (
          <div
            key={k}
            className="sens-bar-segment"
            style={{ width: `${(v / total) * 100}%`, backgroundColor: colors[k] }}
            title={`${k}: ${v} documents`}
          />
        ))}
      </div>
      <div className="sens-bar-legend">
        {sorted.map(([k, v]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <SensBadge s={k} /> <b>{v}</b>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ManagementPortal() {
  const { data, loading, error, reload } = usePortalData()

  useEffect(() => {
    document.title = 'Management Portal | Local-First Agents'
  }, [])

  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const kpi = data.kpi || {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* 4.4 Stat cards: 4 columns */}
      <div className="grid-4">
        <Kpi label="Documents" value={kpi.documents ?? 0} icon={FileText} accent />
        <Kpi label="Open cases" value={kpi.open_cases ?? 0} icon={Briefcase} />
        <Kpi label="Pending approvals" value={kpi.pending_approvals ?? 0} icon={CheckCircle} />
        <Kpi label="Tax matters" value={kpi.tax_matters ?? 0} icon={Percent} />
      </div>

      <div className="grid-4">
        <Kpi label="Land parcels" value={kpi.land_parcels ?? 0} icon={MapPin} />
        <Kpi label="Entity profiles" value={kpi.entities ?? 0} icon={Users} />
        <Kpi label="Compliance records" value={data.counts?.compliance ?? 0} icon={Shield} />
        <Kpi label="Drafts" value={data.counts?.drafts ?? 0} icon={FileText} />
      </div>

      {/* Grid 2: Workload & Risk alerts */}
      <div className="grid-2">
        <Card title="Workload by matter" sub="Active case proceedings grouped by client matter.">
          {data.workload && data.workload.length > 0 ? (
            <div className="table-responsive">
              <table className="portal-table">
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
                      <td>{w.client || <span className="caption">—</span>}</td>
                      <td className="caption">{w.deadline || '—'}</td>
                      <td style={{ textAlign: 'right' }}><b>{w.items}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="No active workload" text="No open matters recorded." />
          )}
        </Card>

        <Card title="Risk alerts" sub="Real-time compliance monitors and thresholds.">
          {data.risk_alerts && data.risk_alerts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {data.risk_alerts.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    borderLeft: '3px solid var(--gold-500)',
                    backgroundColor: 'var(--table-header-bg)',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                  <div className="caption" style={{ marginTop: 2 }}>{r.summary}</div>
                </div>
              ))}
            </div>
          ) : (
            <Empty title="No risk alerts" text="All compliance metrics within safe parameters." />
          )}
        </Card>
      </div>

      {/* Grid 2: Pending Approvals & Sensitivity Distribution */}
      <div className="grid-2">
        <Card title="Pending approvals" sub="Approve or reject gated compliance actions.">
          <ApprovalsQueue approvals={data.pending_approvals} onDecided={reload} />
        </Card>

        <Card title="Sensitivity distribution" sub="Firm-wide document classification ladder.">
          <SensDist dist={data.sensitivity_distribution} />
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>Recent activity</h3>
        <AuditTable entries={data.recent_audit} limit={8} />
      </div>
    </div>
  )
}
