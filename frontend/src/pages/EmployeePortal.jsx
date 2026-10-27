import { usePortalData } from '../hooks.js'
import { Kpi, Card, DocTable, AiPanel, Alert, PageSkeleton, TypeBadge, SensBadge, fmtDate } from '../components/ui.jsx'
import { useRevealGroup } from '../motion.js'
import { Briefcase, Percent, BookOpen, FileText } from '../components/icons.jsx'

const HALF_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'doc_type', label: 'Type', render: (v) => <TypeBadge t={v} /> },
  { key: 'sensitivity', label: 'Sensitivity', render: (v) => <SensBadge s={v} /> },
  { key: 'updated_at', label: 'Updated', render: (v) => <span className="muted nowrap">{fmtDate(v)}</span> },
]

export default function EmployeePortal() {
  const { data, loading, error } = usePortalData()
  const ref = useRevealGroup()
  if (loading) return <PageSkeleton />
  if (error) return <Alert kind="err">{error}</Alert>

  const c = data.counts || {}
  return (
    <div ref={ref}>
      <div className="grid cols-4">
        <Kpi label="Assigned cases" value={c.cases ?? 0} icon={Briefcase} />
        <Kpi label="Tax matters" value={c.tax ?? 0} icon={Percent} />
        <Kpi label="Legal work" value={data.legal_work?.length ?? 0} icon={BookOpen} />
        <Kpi label="Drafts" value={c.drafts ?? 0} icon={FileText} accent />
      </div>

      <div className="section-title reveal">AI-assisted tasks</div>
      <div className="reveal"><AiPanel prompts={data.ai_tasks} /></div>

      <div className="section-title reveal">My assigned cases</div>
      <div className="reveal"><Card><DocTable docs={data.cases} empty="No cases assigned to you yet." /></Card></div>

      <div className="grid cols-2 mt-20">
        <div className="reveal">
          <div className="section-title">Tax matters</div>
          <Card><DocTable docs={data.tax_matters} columns={HALF_COLS} empty="No tax matters." /></Card>
        </div>
        <div className="reveal" data-reveal-delay="0.08">
          <div className="section-title">Legal work (statutes &amp; judgments)</div>
          <Card><DocTable docs={data.legal_work} columns={HALF_COLS} empty="No legal work items." /></Card>
        </div>
      </div>

      <div className="section-title reveal">Drafts in my queue</div>
      <div className="reveal"><Card><DocTable docs={data.drafts} empty="No drafts awaiting you." /></Card></div>

      <div className="section-title reveal">All documents in scope</div>
      <div className="reveal"><Card><DocTable docs={data.documents} empty="No documents in your scope." /></Card></div>
    </div>
  )
}