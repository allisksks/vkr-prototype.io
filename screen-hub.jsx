/* Hub / Home screen — entry point with portfolio + 4 tools + activity */

const HubScreen = ({ project, onNavigate, onProjectChange }) => {
  const projects = project ? [project] : AppData.allProjects;
  const portfolioStats = {
    projects: AppData.allProjects.length,
    events: AppData.events.length,
    dashboards: AppData.dashboards.length,
    activeAB: AppData.experiments.filter(e => e.status === "Active").length,
    completedAB: AppData.experiments.filter(e => e.status === "Completed").length,
    kbItems: AppData.knowledge.length,
  };
  const alertCount = AppData.alerts.filter(a => a.level === "crit" || a.level === "warn").length;

  return (
    <div className="hub">
      <div className="hub__hero">
        <div>
          <h1 className="hub__hero-title">
            Welcome back, Alisa. <br/>
            Your <em>analytics ecosystem</em> is ready.
          </h1>
          <div className="hub__hero-sub">
            One workspace for events, dashboards, experiments and institutional knowledge across all GDC products. {project ? "Showing data for " : "Showing portfolio view — "}<b>{project ? project.name : `${portfolioStats.projects} active projects`}</b>.
          </div>
        </div>
        <div className="hub__hero-stats">
          <div className="hub__stat"><div className="hub__stat-val">{portfolioStats.projects}</div><div className="hub__stat-label">Projects</div></div>
          <div className="hub__stat"><div className="hub__stat-val">{portfolioStats.events}</div><div className="hub__stat-label">Events tracked</div></div>
          <div className="hub__stat"><div className="hub__stat-val" style={{color:"#43c08a"}}>{portfolioStats.activeAB}</div><div className="hub__stat-label">Active A/B</div></div>
          <div className="hub__stat"><div className="hub__stat-val" style={{color: alertCount ? "#e94646" : "#22c55e"}}>{alertCount}</div><div className="hub__stat-label">Open alerts</div></div>
        </div>
      </div>

      <div className="hub__grid">
        <ToolCard
          tool={TOOLS[0]}
          title="Event Marking Service"
          desc="Central registry of game events with auto-versioning, pre-release validation and statistical alerting. Spot bad markup in 2–4 hours instead of 2 days."
          stats={[
            { val: portfolioStats.events, label: "Events" },
            { val: AppData.alerts.filter(a=>a.level==="crit").length, label: "Critical", red: true },
            { val: "v7", label: "Latest version" },
          ]}
          onClick={() => onNavigate("ems")}
        />
        <ToolCard
          tool={TOOLS[1]}
          title="Business Intelligence"
          desc="Self-service dashboards for cohort analysis, retention, monetisation and version comparison — with raw SQL & visual editor fallback for analysts."
          stats={[
            { val: portfolioStats.dashboards, label: "Dashboards" },
            { val: "4h", label: "Avg TTI" },
            { val: "120+", label: "Saved queries" },
          ]}
          onClick={() => onNavigate("bi")}
        />
        <ToolCard
          tool={TOOLS[2]}
          title="A/B Splitter"
          desc="Bayesian experimentation: deterministic user bucketing, hourly P(B>A) recalculation, automatic recommendation when threshold is reached."
          stats={[
            { val: portfolioStats.activeAB, label: "Active", green: true },
            { val: portfolioStats.completedAB, label: "Completed (90d)" },
            { val: "0.95", label: "Decision threshold" },
          ]}
          onClick={() => onNavigate("ab")}
        />
        <ToolCard
          tool={TOOLS[3]}
          title="Knowledge Base"
          desc="Institutional memory of A/B-tests, research and incident postmortems — auto-populated from completed experiments and searchable across all projects."
          stats={[
            { val: portfolioStats.kbItems, label: "Items" },
            { val: AppData.knowledge.filter(k=>k.type==="experiment").length, label: "Experiments" },
            { val: AppData.knowledge.filter(k=>k.type==="research").length, label: "Research" },
          ]}
          onClick={() => onNavigate("kb")}
        />
      </div>

      <div className="hub__grid mt-16" style={{gridTemplateColumns:"2fr 1fr"}}>
        <div className="card">
          <div className="card__head">
            <div className="card__title"><Icon name="users" size={16}/> Portfolio snapshot</div>
            <span className="muted tiny">Health score = 0.4·D7 + 0.4·ARPDAU + 0.2·DAU-trend</span>
          </div>
          <table className="dt">
            <thead>
              <tr>
                <th>Project</th>
                <th>Genre</th>
                <th className="dt-num">DAU</th>
                <th className="dt-num">D7</th>
                <th className="dt-num">ARPDAU</th>
                <th>Trend</th>
                <th style={{width:120}}>Health</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 8).map((p, i) => (
                <tr key={p.id} style={{cursor:"pointer"}} onClick={() => { onProjectChange(p); onNavigate("bi"); }}>
                  <td><b>{p.name}</b><div className="tiny muted">{p.platforms.join(", ")}</div></td>
                  <td className="muted">{p.genre}</td>
                  <td className="dt-num">{p.dau >= 1_000_000 ? (p.dau/1_000_000).toFixed(1) + "M" : (p.dau/1000).toFixed(0) + "K"}</td>
                  <td className="dt-num">{(15 + (i*3.1) % 17).toFixed(1)}%</td>
                  <td className="dt-num">${(0.04 + (i*0.013) % 0.09).toFixed(3)}</td>
                  <td><Sparkline values={seededSeries(p.id, 14, 30, 80)} color={p.color} width={70}/></td>
                  <td>
                    <div style={{display:"flex", alignItems:"center", gap:6}}>
                      <div className="bar" style={{flex:1, height:6}}>
                        <div className={"bar__fill " + (p.health > 80 ? "bar__fill--ok" : p.health > 65 ? "bar__fill--warn" : "bar__fill--crit")} style={{width: p.health + "%"}}></div>
                      </div>
                      <span className="dt-num tiny" style={{fontWeight:800, width:24, textAlign:"right"}}>{p.health}</span>
                    </div>
                  </td>
                  <td>
                    {p.status === "ok"   && <Pill kind="ok">Healthy</Pill>}
                    {p.status === "warn" && <Pill kind="warn">Watch</Pill>}
                    {p.status === "crit" && <Pill kind="crit">Critical</Pill>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card__head">
            <div className="card__title"><Icon name="alert" size={16}/> Active alerts</div>
            <button className="btn btn--ghost btn--sm" onClick={() => onNavigate("ems", { tab: "alerts" })}>Open EMS →</button>
          </div>
          <div>
            {AppData.alerts.slice(0,5).map(a => {
              const proj = AppData.projectById(a.project);
              return (
                <div key={a.id} style={{padding:"10px 14px", borderBottom:"1px solid var(--line-soft)", display:"flex", gap:10, alignItems:"flex-start", cursor:"pointer"}}
                  onClick={() => { onProjectChange(proj); onNavigate("ems", { tab: "alerts" }); }}
                >
                  <div style={{ width:4, alignSelf:"stretch",
                    background: a.level === "crit" ? "#e94646" : a.level === "warn" ? "#f5a623" : "#4aa8d8",
                    borderRadius:2
                  }}></div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700, fontSize:13}}>
                      <span className="dt-mono">{a.event}</span> · {a.reason.replace("_", " ")}
                    </div>
                    <div className="tiny muted" style={{marginTop:2}}>
                      {proj && proj.name} · obs <b style={{color:"var(--ink)"}}>{a.observed}</b> vs base <b>{a.expected}</b> · {a.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity feed */}
      <div className="card mt-16">
        <div className="card__head">
          <div className="card__title"><Icon name="clock" size={16}/> Recent activity</div>
          <button className="btn btn--ghost btn--sm">View all</button>
        </div>
        <div>
          {AppData.activity.map((a, i) => (
            <div key={i} style={{padding:"10px 16px", borderBottom: i < AppData.activity.length - 1 ? "1px solid var(--line-soft)" : "none", display:"grid", gridTemplateColumns:"70px 24px 1fr", alignItems:"center", gap:8, fontSize:13, cursor:"pointer"}}
              onClick={() => onNavigate(a.tool)}
            >
              <span className="muted tiny">{a.time}</span>
              <Icon name={a.icon} size={14} color="var(--ink-3)"/>
              <span>{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ToolCard = ({ tool, title, desc, stats, onClick }) => (
  <div
    className="tool-card"
    style={{ "--tool-color": tool.color, "--tool-bg": tool.bg }}
    onClick={onClick}
  >
    <div className="tool-card__head">
      <div className="tool-card__icon"><Icon name={tool.icon} size={22} color={tool.color}/></div>
      <div style={{flex:1}}>
        <div className="tool-card__sub">{tool.label}</div>
        <h3 className="tool-card__name">{title}</h3>
      </div>
      <Icon name="chevron-right" size={20} color="var(--ink-4)"/>
    </div>
    <div className="tool-card__desc">{desc}</div>
    <div className="tool-card__stats">
      {stats.map((s, i) => (
        <div key={i} className="tool-card__stat">
          <b style={{color: s.red ? "var(--status-crit)" : s.green ? "var(--status-ok)" : "var(--ink)"}}>{s.val}</b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  </div>
);

window.HubScreen = HubScreen;
