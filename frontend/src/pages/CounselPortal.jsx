import { usePortalData } from '../hooks.js'
import { Kpi, Card, DocTable, AiPanel, Alert, PageSkeleton, TypeBadge, SensBadge, fmtDate } from '../components/ui.jsx'
import { useRevealGroup } from '../motion.js'
import { Briefcase, FileText, BookOpen } from '../components/icons.jsx'

const HALF_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
  { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
  { key: 'updated_at', label: 'Updated', render: (v) => <span className="muted nowrap">{fmtDate(v)}</span> },
]

export default function CounselPortal() {
  const { data, loading, error } = usePortalData()
  const ref = useRevealGroup()
  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const c = data.counts || {}
  return (
    <div ref={ref}>
      <div className="grid cols-3">
        <Kpi label="Assigned cases" value={c.cases ?? 0} icon={Briefcase} accent />
        <Kpi label="Drafts to review" value={c.drafts ?? 0} icon={FileText} />
        <Kpi label="Research items" value={data.research?.length ?? 0} icon={BookOpen} />
      </div>

      <div className="section-title reveal">AI-assisted tasks</div>
      <div className="reveal"><AiPanel prompts={data.ai_tasks} /></div>

      <div className="section-title reveal">My assigned cases</div>
      <div className="reveal"><Card><DocTable docs={data.cases} empty="No cases assigned to you." /></Card></div>

      <div className="grid cols-2 mt-20">
        <div className="reveal">
          <div className="section-title">Drafts awaiting your review</div>
          <Card><DocTable docs={data.drafts_to_review} columns={HALF_COLS} empty="No drafts to review." /></Card>
        </div>
        <div className="reveal" data-reveal-delay="0.08">
          <div className="section-title">Legal research</div>
          <Card><DocTable docs={data.research} columns={HALF_COLS} empty="No research items." /></Card>
        </div>
      </div>

      <div className="section-title reveal">All documents in scope</div>
      <div className="reveal"><Card><DocTable docs={data.documents} empty="No documents in your scope." /></Card></div>
    </div>
  )
}