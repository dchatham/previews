import { useState } from "react"

const COLORS = {
  shape: { bg: "#F5F3FF", border: "#8B5CF6", text: "#5B21B6", glow: "rgba(139, 92, 246, 0.15)" },
  prototype: { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8", glow: "rgba(59, 130, 246, 0.15)" },
  gaps: { bg: "#FFF7ED", border: "#F97316", text: "#C2410C", glow: "rgba(249, 115, 22, 0.15)" },
  northstar: { bg: "#ECFDF5", border: "#10B981", text: "#065F46", glow: "rgba(16, 185, 129, 0.15)" },
  prod: { bg: "#F0FDF4", border: "#22C55E", text: "#166534", glow: "rgba(34, 197, 94, 0.15)" },
  mock: { bg: "#EFF6FF", border: "#3B82F6", text: "#1E40AF", glow: "rgba(59, 130, 246, 0.2)" },
  figma: { bg: "#FDF4FF", border: "#A855F7", text: "#7E22CE" },
}

const phases = [
  {
    id: "shape",
    label: "Shape + Data Contract",
    icon: "💎",
    color: COLORS.shape,
    subtitle: "Define the problem space and shared data shape",
    details: [
      "Claude runs 6 roles: Strategy, Product, Design, Engineering, Ops, Retro",
      "Shape Up methodology — appetite, not estimates",
      "Data Contract: entities, fields, sources, assumptions, open questions",
      "Both designer and dev build against the same shape from day one",
    ],
    tools: ["Claude Projects", "Notion", "Slack"],
  },
  {
    id: "prototype",
    label: "Rapid Design",
    icon: "⚡",
    color: COLORS.prototype,
    subtitle: "Designers and devs build in parallel",
    details: [
      "/start creates preview branch + dev server",
      "fox-ui components + Tailwind — no custom UI",
      "Mock data wrapped in <MockData> (bright blue in UI)",
      "Figma MCP pulls exact design tokens",
      "Devs can take straightforward stories (CRUD, tables, settings) end-to-end",
      "Same guardrails for everyone — fox-ui, /start, /end",
    ],
    tools: ["Claude Code", "Windsurf", "Figma MCP", "fox-ui"],
    freedom: true,
  },
  {
    id: "gaps",
    label: "Find Gaps",
    icon: "🔍",
    color: COLORS.gaps,
    subtitle: "Surface what's missing",
    details: [
      "/end scans for MOCK_, FAKE_, <MockData> patterns",
      "Data gaps added to PR body automatically",
      "Jira data-gap tickets created for engineering",
      "Engineering buddy gets notified",
    ],
    tools: ["/end skill", "Jira MCP", "GitHub"],
  },
  {
    id: "northstar",
    label: "Northstar Gate",
    icon: "⭐",
    color: COLORS.northstar,
    subtitle: "Sort carefully — not everything ships at once",
    details: [
      "Multiple preview/ branches merged into northstar",
      "Team reviews the full combined experience together",
      "Ready features (gaps filled, checks pass) → promote to main",
      "Features with open gaps stay held — has-mock-data label + Jira tickets track what's blocking",
      "Features that conflict get pulled back for reshaping",
      "This is where you slow down — everything before optimized for speed",
    ],
    tools: ["GitHub", "Preview URLs", "Jira"],
    gate: true,
  },
  {
    id: "prod",
    label: "Main → Prod",
    icon: "🚀",
    color: COLORS.prod,
    subtitle: "Ship when ready",
    details: [
      "Only moves to main when gaps are filled",
      "Auto-deploys to production",
      "backoffice → backoffice.develop.candosa.com",
      "client-app → app.develop.candosa.com",
    ],
    tools: ["CI/CD", "Vercel"],
  },
]

const Arrow = ({ from, to, label, dashed, loop, gate }) => {
  if (loop) {
    return (
      <div className="flex flex-col items-center gap-0">
        <div className="flex items-center justify-center" style={{ margin: "-4px 0" }}>
          <div className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: "rgba(249, 115, 22, 0.08)", border: "1px dashed #F97316" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8C2 4.68629 4.68629 2 8 2C10.2091 2 12.1165 3.26832 13.0955 5.12602" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M14 8C14 11.3137 11.3137 14 8 14C5.79086 14 3.88355 12.7317 2.90453 10.874" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11 5.5L13.1 5.1L13.5 7.2" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium" style={{ color: "#C2410C" }}>{label}</span>
          </div>
        </div>
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
          <path d="M12 4V24" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 20L12 28L18 20" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }

  if (gate) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="flex items-center gap-2">
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
            <path d="M12 4V24" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 20L12 28L18 20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">ready → ship</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-1">
      <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
        <path
          d="M12 4V24"
          stroke={dashed ? "#94A3B8" : "#CBD5E1"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={dashed ? "4 4" : "none"}
        />
        <path d="M6 20L12 28L18 20" stroke={dashed ? "#94A3B8" : "#CBD5E1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label && (
        <span className="absolute text-xs text-slate-400 ml-10">{label}</span>
      )}
    </div>
  )
}

const PhaseCard = ({ phase, isActive, onClick, index }) => {
  const { label, icon, color, subtitle, details, tools, freedom, gate } = phase

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer transition-all duration-300"
      style={{
        transform: isActive ? "scale(1.02)" : "scale(1)",
      }}
    >
      {gate && (
        <div
          className="absolute -inset-3 rounded-2xl transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${COLORS.northstar.glow}, rgba(34, 197, 94, 0.08))`,
            border: "2px solid #10B981",
            opacity: isActive ? 1 : 0.5,
            zIndex: 0,
          }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 shadow-sm">
            SLOW DOWN — SORT CAREFULLY
          </div>
        </div>
      )}
      {freedom && (
        <div
          className="absolute -inset-3 rounded-2xl transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${COLORS.prototype.glow}, ${COLORS.mock.glow}, ${COLORS.gaps.glow})`,
            border: "2px dashed #93C5FD",
            opacity: isActive ? 1 : 0.5,
            zIndex: 0,
          }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700 shadow-sm">
            PROTOTYPE FREEDOM ZONE
          </div>
        </div>
      )}

      <div
        className="relative z-10 overflow-hidden rounded-xl p-5 transition-shadow duration-300"
        style={{
          background: color.bg,
          border: `2px solid ${isActive ? color.border : "transparent"}`,
          boxShadow: isActive ? `0 4px 24px ${color.glow}, 0 0 0 1px ${color.border}` : `0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px ${color.border}40`,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xl" style={{ background: `${color.border}18` }}>
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: color.text }}>
                  Phase {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: color.text }}>
                {label}
              </h3>
            </div>
          </div>
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs transition-transform duration-200"
            style={{
              background: `${color.border}20`,
              color: color.text,
              transform: isActive ? "rotate(90deg)" : "rotate(0)",
            }}
          >
            →
          </div>
        </div>

        <p className="mt-2 text-sm" style={{ color: `${color.text}CC` }}>
          {subtitle}
        </p>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: isActive ? "400px" : "0",
            opacity: isActive ? 1 : 0,
            marginTop: isActive ? "16px" : "0",
          }}
        >
          <div className="space-y-2">
            {details.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-sm" style={{ color: color.text }}>
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: color.border }} />
                <span>{d}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {tools.map((t, i) => (
              <span
                key={i}
                className="rounded-md px-2 py-0.5 text-xs font-medium"
                style={{ background: `${color.border}15`, color: color.text, border: `1px solid ${color.border}30` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const GuardrailBar = () => (
  <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div className="mb-3 flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L14.9282 5V11L8 15L1.07179 11V5L8 1Z" stroke="#64748B" strokeWidth="1.5"/>
        <circle cx="8" cy="8" r="2" fill="#64748B"/>
      </svg>
      <span className="text-sm font-semibold text-slate-700">Guardrails (always active)</span>
    </div>
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
      {[
        { name: "CLAUDE.md", desc: "Workflow rules" },
        { name: "design-system.md", desc: "fox-ui + tokens" },
        { name: "react-patterns.md", desc: "Code patterns" },
        { name: "git-workflow.md", desc: "Branch rules" },
        { name: "mock-data.md", desc: "Data gap tracking" },
      ].map((g, i) => (
        <div key={i} className="rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
          <div className="text-xs font-semibold text-slate-700">{g.name}</div>
          <div className="text-xs text-slate-500">{g.desc}</div>
        </div>
      ))}
    </div>
  </div>
)

const WhoBuildsWhat = () => (
  <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
    <div className="mb-4 text-sm font-semibold text-slate-700">Who designs what</div>
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-lg bg-purple-50 p-3 ring-1 ring-purple-200">
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-purple-100 text-sm">
          🎨
        </div>
        <div>
          <div className="text-sm font-semibold text-purple-900">Designer takes it</div>
          <div className="mt-0.5 text-xs text-purple-700">
            New interaction patterns, multi-step flows, onboarding, anything where visual hierarchy and emotional tone matter. Complex UX that needs exploration.
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-lg bg-sky-50 p-3 ring-1 ring-sky-200">
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-sky-100 text-sm">
          ⚙️
        </div>
        <div>
          <div className="text-sm font-semibold text-sky-900">Dev takes it end-to-end</div>
          <div className="mt-0.5 text-xs text-sky-700">
            Data tables, CRUD views, settings pages, admin tools — stories where the Data Contract defines the fields and fox-ui defines the look. Same /start → /end flow, same guardrails.
          </div>
        </div>
      </div>
    </div>
    <p className="mt-3 text-xs text-slate-500">
      The Data Contract + guardrails mean devs can produce solid UI without a separate design pass. Don't create bottlenecks where a simple table view is waiting for design.
    </p>
  </div>
)

const NorthstarSort = () => (
  <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
    <div className="mb-4 flex items-center gap-2">
      <span className="text-sm">⭐</span>
      <span className="text-sm font-semibold text-emerald-800">The Northstar gate — sorting what ships</span>
    </div>
    <div className="space-y-2">
      {[
        { status: "ship", icon: "🚀", color: "#16A34A", bg: "#F0FDF4", label: "Ready to ship", desc: "Gaps filled, quality checks pass, data contract satisfied" },
        { status: "hold", icon: "⏸️", color: "#D97706", bg: "#FFFBEB", label: "Hold in northstar", desc: "has-mock-data label, Jira gap tickets open, needs API work" },
        { status: "reshape", icon: "🔄", color: "#DC2626", bg: "#FEF2F2", label: "Pull back & reshape", desc: "Conflicts with other features, UX doesn't hold up in combination" },
      ].map((s, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg p-3" style={{ background: s.bg, border: `1px solid ${s.color}25` }}>
          <span className="text-base">{s.icon}</span>
          <div className="flex-1">
            <span className="text-sm font-semibold" style={{ color: s.color }}>{s.label}</span>
            <span className="ml-2 text-xs text-slate-600">{s.desc}</span>
          </div>
        </div>
      ))}
    </div>
    <p className="mt-3 text-xs text-emerald-700">
      Everything before northstar optimizes for speed. This is where you get deliberate.
    </p>
  </div>
)

const MockDataDemo = () => (
  <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
    <div className="mb-3 flex items-center gap-2">
      <div className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">MOCK</div>
      <span className="text-sm font-semibold text-blue-800">What mock data looks like in the UI</span>
    </div>
    <div className="relative rounded-lg bg-white p-4 shadow-sm ring-1 ring-blue-200">
      <div className="absolute -top-2 right-2 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
        MOCK
      </div>
      <div className="space-y-2 text-blue-600">
        <div className="flex items-center justify-between border-b border-blue-100 pb-2">
          <span className="text-sm font-medium">Ana López</span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs">Active</span>
        </div>
        <div className="flex items-center justify-between border-b border-blue-100 pb-2">
          <span className="text-sm font-medium">Carlos Ruiz</span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs">Pending</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-blue-400 italic">
        gap: "Replace with useQuery(['clients'], () =&gt; clientsClient.listClients())"
      </div>
    </div>
    <p className="mt-3 text-xs text-blue-700">
      Bright blue = fake data. Visible during prototyping, tracked by /end, turned into Jira tickets for engineering.
    </p>
  </div>
)

const BranchDiagram = () => (
  <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
    <div className="mb-4 text-sm font-semibold text-slate-700">Branch flow</div>
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      {[
        { label: "preview/invite-modal", color: "#8B5CF6", type: "branch" },
        { label: "preview/dashboard-v2", color: "#3B82F6", type: "branch" },
        { label: "preview/onboarding-fix", color: "#F97316", type: "branch" },
      ].map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: b.color }} />
          <code className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{b.label}</code>
          {i < 2 && <span className="text-slate-300">+</span>}
        </div>
      ))}

      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" className="mx-1 flex-shrink-0">
        <path d="M4 10H24" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 5L26 10L20 15" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 ring-1 ring-emerald-300">
        <span className="text-sm">⭐</span>
        <code className="text-xs font-semibold text-emerald-700">northstar</code>
      </div>

      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" className="mx-1 flex-shrink-0">
        <path d="M4 10H24" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 5L26 10L20 15" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 ring-1 ring-green-300">
        <span className="text-sm">🚀</span>
        <code className="text-xs font-semibold text-green-700">main</code>
        <span className="text-xs text-green-500">→ prod</span>
      </div>
    </div>
    <p className="mt-3 text-xs text-slate-500">
      Preview branches let you prototype freely. Northstar combines them for team review. Only features that clear the gate get promoted to main → production. The rest stay held or go back for reshaping.
    </p>
  </div>
)

export default function CandosaProcess() {
  const [activePhase, setActivePhase] = useState("prototype")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          Candosa Design Process
        </div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Shape → Prototype → Ship
        </h1>
        <p className="mt-2 text-sm text-slate-500 md:text-base">
          Freedom to prototype with fake data. Guardrails that track what's real and what's not.
          Nothing hits production until the gaps are filled.
        </p>

        <div className="mt-8 space-y-0">
          {phases.map((phase, i) => (
            <div key={phase.id}>
              <PhaseCard
                phase={phase}
                index={i}
                isActive={activePhase === phase.id}
                onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
              />
              {i < phases.length - 1 && (
                <div style={{ position: "relative", zIndex: 20 }}>
                  <Arrow
                    dashed={i === 1}
                    loop={i === 2}
                    label={i === 2 ? "Reshape if needed" : null}
                    gate={i === 3}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <WhoBuildsWhat />
        <BranchDiagram />
        <NorthstarSort />
        <MockDataDemo />
        <GuardrailBar />

        <div className="mt-6 text-center text-xs text-slate-400">
          Click any phase to expand details
        </div>
      </div>
    </div>
  )
}
