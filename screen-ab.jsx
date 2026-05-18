/* A/B Splitter — experiments list / designer / results */

const ABScreen = ({ project, onProjectChange, navPayload, setNavPayload, addToast, onSaveToKB, onOpenBI }) => {
  const activeProj = project || AppData.projectById("iron_shells");

  const [experiments, setExperiments] = useState(AppData.experiments);
  const [view, setView] = useState((navPayload && navPayload.view) || "list"); // list | designer | results
  const [activeId, setActiveId] = useState((navPayload && navPayload.experimentId) || null);
  const [filterStatus, setFilterStatus] = useState("All");

  // navPayload trigger: a draft created from EMS
  useEffect(() => {
    if (navPayload && navPayload.newDraft) {
      const draft = navPayload.newDraft;
      const id = "ab-" + Date.now();
      const newExp = {
        id,
        title: `[Draft] ${draft.metric.name} test on ${draft.event.name}`,
        project: draft.event.project,
        hypothesis: draft.hypothesis,
        primaryMetric: draft.metric.name,
        metricType: draft.metric.unit === "$" ? "continuous" : "binary",
        status: "Draft",
        progress: 0,
        pValueOrPb: null,
        lift: null,
        startedAt: null,
        endsAt: null,
        owner: "A. Volkova",
        trafficShare: draft.trafficSplit,
        variants: [
          { id: "A", name: "Control", split: 0.5, users: 0, metric: "—" },
          { id: "B", name: "Test B",  split: 0.5, users: 0, metric: "—" },
        ],
        secondary: [],
        inclusion: ["platform: ALL", "cohort_date ≥ 2026-04-15"],
        eventSource: draft.event.name,
      };
      setExperiments(prev => [newExp, ...prev]);
      setActiveId(id);
      setView("designer");
      setNavPayload(null);
    }
    if (navPayload && navPayload.experimentId) {
      setActiveId(navPayload.experimentId);
      setView(navPayload.view || "results");
      setNavPayload(null);
    }
  }, [navPayload]);

  const active = experiments.find(e => e.id === activeId);
  const list = experiments.filter(e => (activeProj && e.project === activeProj.id) && (filterStatus === "All" || e.status === filterStatus));

  return (
    <div className="main main--sidebar">
      <ProjectSidebar
        project={activeProj}
        onSelectProject={(p) => { onProjectChange(p); setView("list"); setActiveId(null); }}
      />
      <div className="page">
        <PageTitle
          crumbs={["A/B Splitter", activeProj.name]}
          title={view === "list" ? "Experiments" : view === "designer" ? (active ? active.title : "New experiment") : (active ? active.title : "Results")}
          q
          actions={view === "list" ? [
            <button key="n" className="btn btn--primary" onClick={() => {
              const id = "ab-" + Date.now();
              const newExp = {
                id, title: "New experiment", project: activeProj.id,
                hypothesis: "", primaryMetric: "Retention D1", metricType: "binary",
                status: "Draft", progress: 0, pValueOrPb: null, lift: null,
                owner: "A. Volkova", trafficShare: 50,
                variants: [
                  { id: "A", name: "Control", split: 0.5, users: 0, metric: "—" },
                  { id: "B", name: "Test B", split: 0.5, users: 0, metric: "—" },
                ],
                secondary: [], inclusion: ["platform: ALL"],
              };
              setExperiments(prev => [newExp, ...prev]);
              setActiveId(id);
              setView("designer");
            }}><Icon name="plus" size={14}/> New experiment</button>,
          ] : [
            <button key="b" className="btn" onClick={() => setView("list")}>← Back to list</button>,
          ]}
        />

        {view === "list" && (
          <ExperimentList
            list={list}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            onOpen={(e) => { setActiveId(e.id); setView(e.status === "Draft" ? "designer" : "results"); }}
          />
        )}
        {view === "designer" && active && (
          <ExperimentDesigner
            experiment={active}
            onChange={(changes) => setExperiments(prev => prev.map(e => e.id === active.id ? { ...e, ...changes } : e))}
            onLaunch={() => {
              setExperiments(prev => prev.map(e => e.id === active.id ? { ...e, status: "Active", progress: 1, startedAt: "2026-05-18", endsAt: "2026-06-01" } : e));
              setView("results");
              addToast("Experiment launched");
            }}
          />
        )}
        {view === "results" && active && (
          <ExperimentResults
            experiment={active}
            onSaveToKB={() => {
              onSaveToKB(active);
              addToast("Saved to Knowledge Base");
            }}
            onOpenBI={() => onOpenBI(active)}
            onClose={(decision) => {
              setExperiments(prev => prev.map(e => e.id === active.id ? { ...e, status: "Completed", decision, progress: 100 } : e));
              addToast(`Experiment closed · ${decision}`);
            }}
          />
        )}
      </div>
    </div>
  );
};

// ---- Experiment list (per project) ----
const ExperimentList = ({ list, filterStatus, setFilterStatus, onOpen }) => (
  <div className="card">
    <div className="toolbar-row">
      {["All","Draft","Active","Completed"].map(s => (
        <button key={s} className={"btn btn--sm " + (filterStatus === s ? "btn--primary" : "")} onClick={() => setFilterStatus(s)}>{s}</button>
      ))}
      <div style={{flex:1}}/>
      <div style={{position:"relative", width:240}}>
        <input className="field__input" placeholder="Search experiments…" style={{paddingLeft:32}}/>
        <Icon name="search" size={14} color="#7a8794" style={{position:"absolute", left:10, top:9}}/>
      </div>
    </div>
    {list.length === 0 ? (
      <div className="empty"><div className="empty__face">🧪</div><div className="empty__title">No experiments in this project (with this filter)</div></div>
    ) : (
      <table className="dt">
        <thead>
          <tr>
            <th>ID</th>
            <th>Experiment</th>
            <th>Primary metric</th>
            <th>Status</th>
            <th style={{width:200}}>Progress</th>
            <th className="dt-num">P(B&gt;A)</th>
            <th className="dt-num">Lift</th>
            <th>Decision</th>
            <th>Owner</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map(e => (
            <tr key={e.id} style={{cursor:"pointer"}} onClick={() => onOpen(e)}>
              <td className="dt-mono muted">{e.id}</td>
              <td><b>{e.title}</b><div className="tiny muted">{e.hypothesis.slice(0, 80)}{e.hypothesis.length > 80 ? "…" : ""}</div></td>
              <td>{e.primaryMetric}<div className="tiny muted">{e.metricType}</div></td>
              <td>
                {e.status === "Active"    && <Pill kind="info">Active</Pill>}
                {e.status === "Completed" && <Pill kind="ok">Completed</Pill>}
                {e.status === "Draft"     && <Pill kind="draft">Draft</Pill>}
                {e.status === "Paused"    && <Pill kind="warn">Paused</Pill>}
              </td>
              <td>
                <div className="bar">
                  <div className={"bar__fill " + (e.status === "Completed" ? "bar__fill--ok" : "")} style={{width: e.progress + "%"}}></div>
                </div>
                <div className="tiny muted" style={{marginTop:2}}>{e.startedAt || "—"} → {e.endsAt || "—"}</div>
              </td>
              <td className="dt-num">{e.pValueOrPb == null ? "—" : e.pValueOrPb.toFixed(2)}</td>
              <td className="dt-num" style={{fontWeight:700, color: !e.lift ? "var(--ink-3)" : (e.lift.startsWith("-")) ? "var(--status-crit)" : "var(--status-ok)"}}>{e.lift || "—"}</td>
              <td>
                {e.decision === "Accepted" && <Pill kind="ok">Accepted</Pill>}
                {e.decision === "Rejected" && <Pill kind="crit">Rejected</Pill>}
                {!e.decision && <span className="muted">—</span>}
              </td>
              <td className="tiny">{e.owner}</td>
              <td><Icon name="chevron-right" size={14} color="var(--ink-3)"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

// ---- Designer ----
const ExperimentDesigner = ({ experiment, onChange, onLaunch }) => {
  const e = experiment;
  return (
    <div>
      <div className="card">
        <div className="card__head"><div className="card__title">1. Hypothesis</div></div>
        <div className="card__body">
          <div className="field">
            <div className="field__label">Hypothesis statement</div>
            <textarea className="field__textarea" rows={3} value={e.hypothesis} onChange={ev => onChange({hypothesis: ev.target.value})}/>
          </div>
          <div className="row gap-12 mt-12">
            <div className="field" style={{flex:1}}>
              <div className="field__label">Title</div>
              <input className="field__input" value={e.title} onChange={ev => onChange({title: ev.target.value})}/>
            </div>
            <div className="field" style={{flex:1}}>
              <div className="field__label">Owner</div>
              <input className="field__input" value={e.owner} onChange={ev => onChange({owner: ev.target.value})}/>
            </div>
            <div className="field" style={{flex:1}}>
              <div className="field__label">Tags</div>
              <input className="field__input" defaultValue="liveops, retention" placeholder="comma-separated"/>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__head"><div className="card__title">2. Primary metric</div></div>
        <div className="card__body">
          <div className="row gap-12">
            <div className="field" style={{flex:1}}>
              <div className="field__label">Metric</div>
              <select className="field__select" value={e.primaryMetric} onChange={ev => onChange({primaryMetric: ev.target.value})}>
                <option>Retention D1</option><option>Retention D7</option><option>ARPU D7</option>
                <option>Tutorial Completion</option><option>Purchase CR</option><option>Banner CTR</option>
                <option>Session Length</option>
              </select>
              {e.eventSource && (
                <div className="muted tiny mt-8">Source event: <span className="dt-mono">{e.eventSource}</span></div>
              )}
            </div>
            <div className="field" style={{flex:1}}>
              <div className="field__label">Metric type</div>
              <select className="field__select" value={e.metricType} onChange={ev => onChange({metricType: ev.target.value})}>
                <option value="binary">Binary — Bayesian Beta(1,1)</option>
                <option value="continuous">Continuous — Normal approx.</option>
              </select>
            </div>
            <div className="field" style={{flex:1}}>
              <div className="field__label">Decision threshold</div>
              <input className="field__input" defaultValue="P(B>A) ≥ 0.95"/>
            </div>
          </div>
          <div className="row gap-12 mt-12">
            <div className="field" style={{flex:1}}>
              <div className="field__label">Minimum detectable effect</div>
              <input className="field__input" defaultValue="+1.5pp"/>
            </div>
            <div className="field" style={{flex:1}}>
              <div className="field__label">Expected baseline</div>
              <input className="field__input" defaultValue={e.metricType === "binary" ? "32%" : "$0.080"}/>
            </div>
            <div className="field" style={{flex:1}}>
              <div className="field__label">Estimated duration</div>
              <input className="field__input" defaultValue="14 days @ current DAU" readOnly style={{background:"var(--brand-tint)"}}/>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__head"><div className="card__title">3. Variants & traffic</div>
          <button className="btn btn--sm btn--ghost"><Icon name="plus" size={12}/> Add variant</button>
        </div>
        <table className="dt">
          <thead><tr><th>ID</th><th>Name</th><th>Description</th><th className="dt-num">Traffic %</th></tr></thead>
          <tbody>
            {e.variants.map((v, i) => (
              <tr key={v.id}>
                <td><b>{v.id}</b></td>
                <td><input className="field__input" defaultValue={v.name}/></td>
                <td><input className="field__input" defaultValue={i === 0 ? "Holdout, original config" : "New configuration"}/></td>
                <td><input className="field__input" defaultValue={(v.split*100).toFixed(0) + "%"} style={{width:90, textAlign:"right"}}/></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card__body" style={{borderTop:"1px solid var(--line-soft)"}}>
          <div className="field__label" style={{marginBottom:6}}>Total traffic share</div>
          <div className="row gap-8">
            <input type="range" min="5" max="100" defaultValue={e.trafficShare} style={{flex:1}}/>
            <input className="field__input" defaultValue={e.trafficShare + "%"} style={{width:80, textAlign:"right"}}/>
          </div>
          <div className="muted tiny mt-8">User assignment: <span className="dt-mono">hash(user_id + experiment_id) mod 10000</span> · deterministic, sticky across sessions.</div>
        </div>
      </div>

      <div className="card">
        <div className="card__head"><div className="card__title">4. Inclusion criteria (JSONB)</div></div>
        <div className="card__body">
          <div className="row gap-12">
            <div className="field" style={{flex:1}}>
              <div className="field__label">Platforms</div>
              <div className="filter-row__chips">
                <Chip>iOS</Chip><Chip>Android</Chip>
              </div>
            </div>
            <div className="field" style={{flex:1}}>
              <div className="field__label">Countries</div>
              <div className="filter-row__chips">
                <Chip flag="#1e5fbc">US</Chip><Chip flag="#d4a017">DE</Chip><Chip flag="#7eb344">BR</Chip>
                <button className="btn btn--sm btn--ghost"><Icon name="plus" size={12}/> add</button>
              </div>
            </div>
            <div className="field" style={{flex:1}}>
              <div className="field__label">Min install date (cohort)</div>
              <input className="field__input" defaultValue="2026-04-15" />
            </div>
          </div>
          <div className="field mt-12">
            <div className="field__label">Custom rule (SQL)</div>
            <input className="field__input dt-mono" defaultValue="app_version >= '11.4.0' AND user_segment != 'whale'"/>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__head"><div className="card__title">5. Pre-flight checks</div></div>
        <table className="dt">
          <tbody>
            <tr><td>Sum of traffic_split = 1.0</td><td className="dt-num"><Pill kind="ok">✓ Passed</Pill></td></tr>
            <tr><td>Estimated power at MDE</td><td className="dt-num"><Pill kind="ok">82%</Pill></td></tr>
            <tr><td>Sample size per variant</td><td className="dt-num">≥ 14 200 users</td></tr>
            <tr><td>Overlapping active experiments</td><td className="dt-num"><Pill kind="warn">1 overlap</Pill></td></tr>
            <tr><td>EMS event {e.eventSource ? <span className="dt-mono">{e.eventSource}</span> : "selected"} health</td><td className="dt-num"><Pill kind="ok">OK · v7</Pill></td></tr>
          </tbody>
        </table>
      </div>

      <div className="row row--end gap-8 mt-16">
        <button className="btn">Save draft</button>
        <button className="btn btn--success btn--lg" onClick={onLaunch}><Icon name="play" size={14}/> Launch experiment</button>
      </div>
    </div>
  );
};

// ---- Results ----
const ExperimentResults = ({ experiment, onSaveToKB, onOpenBI, onClose }) => {
  const e = experiment;
  const [closeMode, setCloseMode] = useState(null);
  const [statMethod, setStatMethod] = useState("bayesian"); // bayesian | frequentist | sequential
  const [showSegments, setShowSegments] = useState(false);
  const aMetric = e.variants[0].metric;
  const bMetric = e.variants[1] ? e.variants[1].metric : "—";
  const totalUsers = e.variants.reduce((s, v) => s + v.users, 0);

  return (
    <div>
      {/* Hypothesis & status banner */}
      <div className="card">
        <div className="card__body">
          <div className="row row--between" style={{alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div className="muted tiny" style={{fontWeight:700, textTransform:"uppercase", letterSpacing:0.4, marginBottom:4}}>Hypothesis</div>
              <div style={{fontSize:15, fontWeight:600, color:"var(--ink)"}}>{e.hypothesis}</div>
              <div className="row gap-8 mt-12">
                <span className="tag">{e.primaryMetric}</span>
                <span className="tag">{e.metricType}</span>
                <span className="tag">Owner {e.owner}</span>
                <span className="tag">{e.startedAt} → {e.endsAt}</span>
                {e.status === "Active"    && <Pill kind="info">Active</Pill>}
                {e.status === "Completed" && <Pill kind="ok">Completed</Pill>}
              </div>
            </div>
            <div className="row gap-8">
              <button className="btn" onClick={onOpenBI}><Icon name="chart-line" size={14}/> View in BI</button>
              {e.status === "Completed" && (
                <>
                  <button className="btn"><Icon name="copy" size={14}/> Create follow-up</button>
                  <button className="btn"><Icon name="play" size={14}/> Rollout plan</button>
                </>
              )}
              {e.status === "Completed"
                ? <button className="btn btn--primary" onClick={onSaveToKB}><Icon name="book" size={14}/> Save to KB</button>
                : <button className="btn btn--danger" onClick={() => setCloseMode("open")}>Close experiment</button>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation banner */}
      {e.status === "Active" && e.pValueOrPb >= 0.9 && (
        <div className="recommend-banner">
          <div className="recommend-banner__icon">!</div>
          <div>
            <div>Recommended action: <b>{e.lift && e.lift.startsWith("-") ? "Reject" : "Accept variant B"}</b></div>
            <div className="tiny" style={{fontWeight:600, opacity:0.85}}>P(B&gt;A) reached {(e.pValueOrPb*100).toFixed(1)}% — above 95% threshold</div>
          </div>
        </div>
      )}

      {/* Top stats */}
      <div className="metric-grid">
        <MetricTile label="Users assigned" value={totalUsers.toLocaleString()}/>
        <MetricTile label="Primary metric (A)" value={aMetric}/>
        <MetricTile label="Primary metric (B)" value={bMetric}/>
        <MetricTile
          label="Lift"
          value={e.lift || "—"}
          delta={e.pValueOrPb == null ? "n/a" : `P(B>A)=${(e.pValueOrPb*100).toFixed(0)}%`}
          deltaDir={e.lift && e.lift.startsWith("-") ? "down" : "up"}
        />
        <MetricTile label="Sample power" value="82%"/>
        <MetricTile label="Days running" value={e.startedAt ? Math.max(1, Math.round((new Date("2026-05-18") - new Date(e.startedAt)) / 86400000)) + "d" : "—"}/>
      </div>

      {/* Bayesian posterior + variant bars */}
      <div className="card mt-16">
        <div className="card__head">
          <div className="card__title">Statistical analysis</div>
          <div className="row gap-4">
            <button className={"btn btn--sm " + (statMethod === "bayesian"   ? "btn--primary":"")} onClick={() => setStatMethod("bayesian")}>Bayesian</button>
            <button className={"btn btn--sm " + (statMethod === "frequentist" ? "btn--primary":"")} onClick={() => setStatMethod("frequentist")}>Frequentist</button>
            <button className={"btn btn--sm " + (statMethod === "sequential" ? "btn--primary":"")} onClick={() => setStatMethod("sequential")}>Sequential</button>
          </div>
        </div>
        <div className="card__body">
          {statMethod === "bayesian" && (
            <>
              <PosteriorChart
                aMean={parseFloat(String(aMetric).replace(/[^\d.-]/g,"")) / (String(aMetric).includes("%") ? 100 : String(aMetric).includes("$") ? 1 : 100) || 0.32}
                bMean={parseFloat(String(bMetric).replace(/[^\d.-]/g,"")) / (String(bMetric).includes("%") ? 100 : String(bMetric).includes("$") ? 1 : 100) || 0.34}
                aSd={0.012}
                bSd={0.012}
              />
              <div className="muted tiny mt-8">Beta(1,1) prior · Numerical integration over 1000 points on [0.001, 0.999]. P(B&gt;A) recalculated hourly.</div>
            </>
          )}
          {statMethod === "frequentist" && (
            <table className="dt">
              <tbody>
                <tr><td>Test</td><td>Two-sample two-tailed z-test</td></tr>
                <tr><td>p-value</td><td className="dt-num"><b>{e.pValueOrPb ? (1 - e.pValueOrPb).toFixed(4) : "—"}</b></td></tr>
                <tr><td>95% confidence interval (lift)</td><td className="dt-mono">[{e.lift && e.lift.startsWith("+") ? "+0.4pp" : "-0.2pp"}, {e.lift && e.lift.startsWith("+") ? "+3.2pp" : "+0.8pp"}]</td></tr>
                <tr><td>Effect size (Cohen's h)</td><td className="dt-num">0.038</td></tr>
                <tr><td>Statistical power</td><td className="dt-num">82%</td></tr>
                <tr><td>Verdict</td><td>{e.pValueOrPb >= 0.95 ? <Pill kind="ok">Reject H₀ at α=0.05</Pill> : <Pill kind="warn">Insufficient evidence</Pill>}</td></tr>
              </tbody>
            </table>
          )}
          {statMethod === "sequential" && (
            <div>
              <div className="row gap-12" style={{fontSize:13}}>
                <div className="metric-tile" style={{flex:1}}><div className="metric-tile__label">Always-valid p-value</div><div className="metric-tile__val">0.041</div></div>
                <div className="metric-tile" style={{flex:1}}><div className="metric-tile__label">Optional stopping safe</div><div className="metric-tile__val" style={{color:"var(--status-ok)"}}>Yes</div></div>
                <div className="metric-tile" style={{flex:1}}><div className="metric-tile__label">Spending function</div><div className="metric-tile__val" style={{fontSize:14}}>O'Brien-Fleming</div></div>
              </div>
              <div className="muted tiny mt-8">Sequential test allows you to peek at results before the planned sample size without inflating type-I error.</div>
            </div>
          )}
        </div>
      </div>

      {/* Segment breakdown toggle */}
      <div className="card">
        <div className="card__head">
          <div className="card__title">Segment breakdown</div>
          <button className="btn btn--sm btn--ghost" onClick={() => setShowSegments(s => !s)}>{showSegments ? "Hide" : "Show breakdown"}</button>
        </div>
        {showSegments && (
          <table className="dt">
            <thead><tr><th>Segment</th><th className="dt-num">Users (A)</th><th className="dt-num">Users (B)</th><th className="dt-num">{e.primaryMetric} (A)</th><th className="dt-num">{e.primaryMetric} (B)</th><th className="dt-num">Lift</th><th>Sig?</th></tr></thead>
            <tbody>
              {[
                { name: "iOS · US",          uA: 12_311, uB: 12_280, mA: "31.1%", mB: "33.7%", lift: "+2.6pp", sig: true },
                { name: "iOS · ROW",         uA: 9_104,  uB: 9_092,  mA: "30.8%", mB: "32.5%", lift: "+1.7pp", sig: false },
                { name: "Android · US",      uA: 18_421, uB: 18_410, mA: "33.0%", mB: "34.4%", lift: "+1.4pp", sig: true },
                { name: "Android · ROW",     uA: 32_558, uB: 32_530, mA: "32.4%", mB: "33.9%", lift: "+1.5pp", sig: true },
                { name: "Mintegral_int",     uA: 4_220,  uB: 4_180,  mA: "28.1%", mB: "27.0%", lift: "-1.1pp", sig: false, bad: true },
                { name: "Organic users",     uA: 28_440, uB: 28_500, mA: "34.2%", mB: "36.1%", lift: "+1.9pp", sig: true },
              ].map((s,i) => (
                <tr key={i} className={s.bad ? "row-warn" : ""}>
                  <td><b>{s.name}</b></td>
                  <td className="dt-num">{s.uA.toLocaleString()}</td>
                  <td className="dt-num">{s.uB.toLocaleString()}</td>
                  <td className="dt-num">{s.mA}</td>
                  <td className="dt-num">{s.mB}</td>
                  <td className="dt-num" style={{color: s.lift.startsWith("-") ? "var(--status-crit)" : "var(--status-ok)", fontWeight:700}}>{s.lift}</td>
                  <td>{s.sig ? (s.bad ? <Pill kind="warn">guardrail</Pill> : <Pill kind="ok">Yes</Pill>) : <Pill kind="draft">No</Pill>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Variants table */}
      <div className="card">
        <div className="card__head"><div className="card__title">Variants</div></div>
        <table className="dt">
          <thead>
            <tr><th>ID</th><th>Name</th><th className="dt-num">Traffic</th><th className="dt-num">Users</th><th className="dt-num">{e.primaryMetric}</th><th>Δ vs A</th></tr>
          </thead>
          <tbody>
            {e.variants.map((v, i) => (
              <tr key={v.id}>
                <td><b>{v.id}</b></td>
                <td>{v.name}</td>
                <td className="dt-num">{(v.split*100).toFixed(0)}%</td>
                <td className="dt-num">{v.users.toLocaleString()}</td>
                <td className="dt-num"><b>{v.metric}</b></td>
                <td>
                  {i === 0 ? <span className="muted">baseline</span> : (
                    <span style={{color: e.lift && !e.lift.startsWith("-") ? "var(--status-ok)" : "var(--status-crit)", fontWeight:700}}>
                      {e.lift || "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Secondary metrics */}
      {e.secondary && e.secondary.length > 0 && (
        <div className="card">
          <div className="card__head"><div className="card__title">Secondary metrics & guardrails</div></div>
          <table className="dt">
            <thead><tr><th>Metric</th><th className="dt-num">A</th><th className="dt-num">B</th><th className="dt-num">Lift</th><th>Significant?</th></tr></thead>
            <tbody>
              {e.secondary.map((s, i) => (
                <tr key={i} className={s.bad ? "row-warn" : ""}>
                  <td><b>{s.name}</b></td>
                  <td className="dt-num">{s.a}</td>
                  <td className="dt-num">{s.b}</td>
                  <td className="dt-num" style={{color: s.lift.startsWith("-") ? "var(--status-crit)" : "var(--status-ok)", fontWeight:700}}>{s.lift}</td>
                  <td>{s.sig ? (s.bad ? <Pill kind="crit">Guardrail breach</Pill> : <Pill kind="ok">Yes</Pill>) : <Pill kind="draft">No</Pill>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inclusion criteria */}
      <div className="card">
        <div className="card__head"><div className="card__title">Inclusion criteria</div></div>
        <div className="card__body">
          <ul style={{margin:0, paddingLeft:18, lineHeight:1.8}}>
            {e.inclusion.map((c, i) => <li key={i} className="dt-mono" style={{fontSize:12.5}}>{c}</li>)}
          </ul>
        </div>
      </div>

      {closeMode && (
        <Modal
          title="Close experiment"
          onClose={() => setCloseMode(null)}
          footer={<>
            <button className="btn" onClick={() => setCloseMode(null)}>Cancel</button>
          </>}
        >
          <div className="mb-12">You're about to mark <b>{e.title}</b> as Completed. The Knowledge Base record will be generated automatically.</div>
          <div className="field">
            <div className="field__label">Decision</div>
            <select className="field__select" defaultValue="Accepted" id="ab-decision">
              <option>Accepted</option>
              <option>Rejected</option>
              <option>Inconclusive</option>
            </select>
          </div>
          <div className="field mt-12">
            <div className="field__label">Decision rationale</div>
            <textarea className="field__textarea" rows={4} defaultValue={`Based on P(B>A)=${e.pValueOrPb ? (e.pValueOrPb*100).toFixed(0) : "—"}% and observed lift ${e.lift}, ...`}/>
          </div>
          <div className="row row--end gap-8 mt-12">
            <button className="btn btn--primary" onClick={() => {
              const dec = document.getElementById("ab-decision").value;
              setCloseMode(null);
              onClose(dec);
            }}>Confirm close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

window.ABScreen = ABScreen;
