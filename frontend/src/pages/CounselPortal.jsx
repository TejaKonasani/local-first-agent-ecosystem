import { useEffect } from 'react'
import { usePortalData } from '../hooks.js'
import {
  Kpi, Card, DocTable, AiPanel, Alert, PageSkeleton, TypeBadge, SensBadge, fmtDate,
} from '../components/ui.jsx'
import { Briefcase, FileText, BookOpen } from '../components/icons.jsx'

const HALF_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
  { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
  { key: 'updated_at', label: 'Updated', render: (v) => <span className="caption">{fmtDate(v)}</span> },
]

export default function CounselPortal() {
  const { data, loading, error } = usePortalData()

  useEffect(() => {
    document.title = 'External Counsel Portal | Local-First Agents'
  }, [])

  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const c = data.counts || {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Stat cards */}
      <div className="grid-3">
        <Kpi label="Assigned cases" value={c.cases ?? 0} icon={Briefcase} accent />
        <Kpi label="Drafts to review" value={c.drafts ?? 0} icon={FileText} />
        <Kpi label="Research items" value={data.research?.length ?? 0} icon={BookOpen} />
      </div>

      {/* AI Assistant */}
      <AiPanel prompts={data.ai_tasks} />

      {/* My assigned cases */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>My assigned cases</h3>
        <DocTable docs={data.cases} empty="No cases currently assigned to counsel." />
      </div>

      {/* Grid 2: Drafts & Research */}
      <div className="grid-2">
        <div>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Drafts awaiting review</h3>
          <DocTable docs={data.drafts_to_review} columns={HALF_COLS} empty="No drafts awaiting review." />
        </div>
        <div>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Legal research</h3>
          <DocTable docs={data.research} columns={HALF_COLS} empty="No research items shared." />
        </div>
      </div>

      {/* All documents in scope */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>All documents in scope</h3>
        <DocTable docs={data.documents} empty="No documents within counsel scope." />
      </div>
    </div>
  )
}
