import { useEffect } from 'react'
import { usePortalData } from '../hooks.js'
import {
  Kpi, Card, DocTable, AiPanel, Alert, PageSkeleton, TypeBadge, SensBadge, fmtDate,
} from '../components/ui.jsx'
import { Briefcase, Percent, BookOpen, FileText } from '../components/icons.jsx'

const HALF_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
  { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
  { key: 'updated_at', label: 'Updated', render: (v) => <span className="caption">{fmtDate(v)}</span> },
]

export default function EmployeePortal() {
  const { data, loading, error } = usePortalData()

  useEffect(() => {
    document.title = 'Employee Portal | Local-First Agents'
  }, [])

  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const c = data.counts || {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* 4.4 Stat cards: 4 columns, label 13px, number 40px Fraunces, 32px icon tile */}
      <div className="grid-4">
        <Kpi label="Assigned cases" value={c.cases ?? 0} icon={Briefcase} />
        <Kpi label="Tax matters" value={c.tax ?? 0} icon={Percent} />
        <Kpi label="Legal work" value={data.legal_work?.length ?? 0} icon={BookOpen} />
        <Kpi label="Drafts" value={c.drafts ?? 0} icon={FileText} accent />
      </div>

      {/* AI Assistant Card */}
      <AiPanel prompts={data.ai_tasks} />

      {/* Assigned Cases Table */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>My assigned cases</h3>
        <DocTable docs={data.cases} empty="No cases assigned to your account." />
      </div>

      {/* Grid 2: Tax Matters & Legal Work */}
      <div className="grid-2">
        <div>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Tax matters</h3>
          <DocTable docs={data.tax_matters} columns={HALF_COLS} empty="No tax matters recorded." />
        </div>
        <div>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Legal work (statutes & judgments)</h3>
          <DocTable docs={data.legal_work} columns={HALF_COLS} empty="No legal work items." />
        </div>
      </div>

      {/* Drafts in my queue */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>Drafts in my queue</h3>
        <DocTable docs={data.drafts} empty="No drafts awaiting your review." />
      </div>

      {/* All documents in scope */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>All documents in scope</h3>
        <DocTable docs={data.documents} empty="No documents currently in your role scope." />
      </div>
    </div>
  )
}
