/* BI screen — per-project dashboards + reports (AB Analysis, Cohort Compare) */

const BIScreen = ({ project, onProjectChange, navPayload, setNavPayload, addToast, onNavigate }) => {
  const activeProj = project || AppData.projectById("iron_shells");
  const projDashboards = AppData.dashboardsByProject[activeProj.id] || AppData.dashboardsByProject.iron_shells;

  // Active dashboard
  const [activeDashId, setActiveDashId] = useState((navPayload && navPayload.dashboardId) || projDashboards[0].id);
  // when project changes, reset dash
  useEffect(() => {
    const list = AppData.dashboardsByProject[activeProj.id] || [];
    if (!list.find(d => d.id === activeDashId)) {
      setActiveDashId(list[0]?.id || "overview");
    }
  }, [activeProj.id]);

  const dash = projDashboards.find(d => d.id === activeDashId) || projDashboards[0];

  // blocks state per (project, dash)
  const [blocksByKey, setBlocksByKey] = useState({});
  const blocksKey = `${activeProj.id}::${activeDashId}`;
  const getBlocks = (k = blocksKey) => {
    if (blocksByKey[k]) return blocksByKey[k];
    const [pid, did] = k.split("::");
    return (AppData.blockBlueprints[pid] && AppData.blockBlueprints[pid][did]) || [];
  };
  const blocks = getBlocks();
  const setBlocks = (next) => setBlocksByKey(prev => ({ ...prev, [blocksKey]: typeof next === "function" ? next(getBlocks()) : next }));

  // editor pane state
  const [editingBlock, setEditingBlock] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);

  // navPayload handlers — block coming from EMS
  useEffect(() => {
    if (navPayload && navPayload.addBlock) {
      const { metric, eventName } = navPayload.addBlock;
      const newBlock = {
        id: "nb-" + Date.now(),
        title: `${metric.name} · from ${eventName}`,
        type: metric.unit === "%" ? "bar" : metric.unit === "$" ? "line" : "area",
        span: 6, metric: metric.name, sourceEvent: eventName, formula: metric.formula, isNew: true,
      };
      setBlocks(prev => [newBlock, ...prev]);
      setNavPayload(null);
      addToast(`Added "${metric.name}" to ${dash.name}`);
    } else if (navPayload && navPayload.dashboardId) {
      setActiveDashId(navPayload.dashboardId);
      setNavPayload(null);
    }
  }, [navPayload]);

  const updateBlock = (id, changes) => setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...changes } : b));
  const deleteBlock = (id) => setBlocks(prev => prev.filter(b => b.id !== id));

  // Sidebar
  const sidebarGroups = AppData.projectGroups.map(g => ({
    id: g.id, name: g.name,
    items: g.projects.map(p => ({ id: "proj-" + p.id, name: p.name, active: activeProj.id === p.id })),
  }));

  return (
    <div className="main main--sidebar">
      <ProjectSidebar
        customGroups={sidebarGroups}
        activeItem={"proj-" + activeProj.id}
        onSelectItem={(item) => {
          if (item.id.startsWith("proj-")) {
            const p = AppData.projectById(item.id.replace("proj-",""));
            onProjectChange(p);
            const newList = AppData.dashboardsByProject[p.id] || [];
            setActiveDashId(newList[0]?.id || "overview");
          }
        }}
      />
      <div className="page" style={editingBlock ? {paddingRight: 380} : {}}>
        <PageTitle
          crumbs={["BI", activeProj.name]}
          title={dash.name + (dash.isReport ? "" : " (period)")}
          q
          actions={[
            <button key="d" className="btn" onClick={() => addToast("Download started")}><Icon name="download" size={14}/> Export</button>,
            <button key="sh" className="btn" onClick={() => setShareModal(true)}><Icon name="external" size={14}/> Share</button>,
            <button key="sc" className="btn" onClick={() => setScheduleModal(true)}><Icon name="clock" size={14}/> Schedule</button>,
            <button key="s" className="btn"><Icon name="settings" size={14}/></button>,
            !dash.isReport ? <button key="a" className="btn btn--primary" onClick={() => {
              const id = "nb-" + Date.now();
              setBlocks(prev => [...prev, { id, title:"New block", type:"line", span:4, metric:"DAU" }]);
              setEditingBlock(id);
            }}><Icon name="plus" size={14}/> Add block</button> : null,
          ]}
        />

        {/* Dashboard tabs */}
        <div className="bi-dash-tabs">
          {projDashboards.map(d => (
            <button
              key={d.id}
              className={"bi-dash-tab" + (activeDashId === d.id ? " is-active" : "") + (d.isReport ? " is-report" : "")}
              onClick={() => setActiveDashId(d.id)}
            >
              {d.isReport && <Icon name="filter" size={11}/>}
              {d.name}
            </button>
          ))}
        </div>

        {/* Body */}
        {dash.isReport && dash.reportType === "ab"     && <ABAnalysisReport project={activeProj} onNavigate={onNavigate}/>}
        {dash.isReport && dash.reportType === "cohort" && <CohortCompareReport project={activeProj} onNavigate={onNavigate} addToast={addToast}/>}

        {!dash.isReport && (
          <DashboardBody
            project={activeProj}
            dash={dash}
            blocks={blocks}
            onEdit={setEditingBlock}
            onDelete={deleteBlock}
            onChangeSpan={(id, span) => updateBlock(id, { span })}
            onAddBlock={() => {
              const id = "nb-" + Date.now();
              setBlocks(prev => [...prev, { id, title:"New block", type:"line", span:4, metric:"DAU" }]);
              setEditingBlock(id);
            }}
            onTestSegment={(segment) => onNavigate("ab", { newDraft: { fromSegment: segment, hypothesis: `Targeted variant for "${segment.name}" segment.`, metric: { name: segment.metric || "Retention D7", unit: "%", formula: "—" }, event: { name: "—", project: activeProj.id }, trafficSplit: 50, duration: 14 }})}
          />
        )}
      </div>

      {/* Sliding edit panel */}
      {editingBlock && (
        <BlockEditorPanel
          block={blocks.find(b => b.id === editingBlock)}
          project={activeProj}
          onClose={() => setEditingBlock(null)}
          onSave={(changes) => { updateBlock(editingBlock, changes); setEditingBlock(null); addToast("Block saved"); }}
          onClone={() => {
            const orig = blocks.find(b => b.id === editingBlock);
            const id = "nb-" + Date.now();
            setBlocks(prev => [...prev, { ...orig, id, title: orig.title + " (copy)" }]);
            addToast("Block cloned");
          }}
          onDelete={() => { deleteBlock(editingBlock); setEditingBlock(null); addToast("Block deleted"); }}
        />
      )}

      {shareModal && <ShareModal onClose={() => setShareModal(false)} addToast={addToast}/>}
      {scheduleModal && <ScheduleModal onClose={() => setScheduleModal(false)} addToast={addToast}/>}
    </div>
  );
};

// ---- Dashboard body (renders filter + blocks) ----
const DashboardBody = ({ project, dash, blocks, onEdit, onDelete, onChangeSpan, onAddBlock, onTestSegment }) => (
  <>
    <div className="card">
      <FilterRow label="Project"><Chip onRemove={()=>{}}>{project.name}</Chip></FilterRow>
      <FilterRow label="Platform">
        <Chip onRemove={()=>{}}>android</Chip><Chip onRemove={()=>{}}>ios</Chip>
      </FilterRow>
      <FilterRow label="Country">
        <Chip flag="#1e5fbc" onRemove={()=>{}}>United States</Chip>
        <Chip flag="#d4a017" onRemove={()=>{}}>Germany</Chip>
        <Chip flag="#7eb344" onRemove={()=>{}}>Brazil</Chip>
      </FilterRow>
      <FilterRow label="Source">
        <Chip onRemove={()=>{}}>organic</Chip>
        <Chip kind="neg" onRemove={()=>{}}>mintegral_int</Chip>
      </FilterRow>
      <div className="filter-row" style={{gridTemplateColumns:"130px auto 1fr"}}>
        <div className="filter-row__label">
          <span className="filter-row__cb is-on"></span>
          <select className="field__select" defaultValue="Day" style={{width:110, height:28, padding:"4px 28px 4px 10px"}}>
            <option>Day</option><option>Week</option><option>Month</option>
          </select>
        </div>
        <input className="field__input" defaultValue="16/04/2026 — 15/05/2026" style={{width:240}}/>
        <div className="row gap-8">
          <button className="btn btn--primary">GO!</button>
          <button className="btn">Cancel</button>
          <button className="btn">Clear</button>
        </div>
      </div>
    </div>

    <SectionTitle q>{dash.name}</SectionTitle>

    <div className="dash-grid">
      {blocks.map(b => (
        <DashBlock
          key={b.id}
          block={b}
          project={project}
          onEdit={() => onEdit(b.id)}
          onDelete={() => onDelete(b.id)}
          onChangeSpan={(span) => onChangeSpan(b.id, span)}
          onTestSegment={onTestSegment}
        />
      ))}
      <div
        className="dash-block span-4"
        style={{
          border: "2px dashed var(--line)", boxShadow: "none", background: "transparent",
          display: "grid", placeItems: "center", color: "var(--ink-3)", fontWeight: 700,
          cursor: "pointer", minHeight: 160,
        }}
        onClick={onAddBlock}
      >
        <div style={{textAlign:"center"}}>
          <Icon name="plus" size={32} color="var(--ink-4)"/>
          <div style={{marginTop:6}}>Add block</div>
        </div>
      </div>
    </div>
  </>
);

// ---- Dashboard block ----
const DashBlock = ({ block, project, onEdit, onDelete, onChangeSpan, onTestSegment }) => (
  <div className={`dash-block span-${block.span || 6}`} style={block.isNew ? {borderColor:"var(--brand)", boxShadow:"0 0 0 2px rgba(42,107,224,0.15)"} : {}}>
    <div className="dash-block__head">
      <div>
        <div className="dash-block__title">{block.title}</div>
        {block.sourceEvent && (
          <div className="tiny muted" style={{marginTop:2}}>
            from <span className="dt-mono">{block.sourceEvent}</span> · <span className="dt-mono">{block.formula}</span>
          </div>
        )}
      </div>
      <div className="dash-block__actions">
        <button className="dash-block__act-btn" title="Test on segment" onClick={() => onTestSegment({ name: block.title + " users", metric: block.metric })}><Icon name="flask" size={14}/></button>
        <button className="dash-block__act-btn" title="Span -" onClick={() => onChangeSpan(Math.max(3, (block.span || 6) - 3))}>—</button>
        <button className="dash-block__act-btn" title="Span +" onClick={() => onChangeSpan(Math.min(12, (block.span || 6) + 3))}>+</button>
        <button className="dash-block__act-btn" title="Edit" onClick={onEdit}><Icon name="edit" size={14}/></button>
        <button className="dash-block__act-btn" title="Delete" onClick={onDelete}><Icon name="trash" size={14}/></button>
      </div>
    </div>
    <div style={{flex:1, minHeight: 0}}>
      {renderBlockBody(block, project)}
    </div>
  </div>
);

function renderBlockBody(block, project) {
  const seed = (project ? project.id : "global") + ":" + block.id + ":" + block.metric;
  switch (block.type) {
    case "line":
      return <LineChart seed={seed} height={180} series={[
        { label: block.metric, values: smoothBI(seededSeries(seed, 28, 60, 140)) },
        { label: "prev", values: smoothBI(seededSeries(seed+"prev", 28, 50, 130)) },
      ]}/>;
    case "area":
      return <AreaChart seed={seed} height={180}/>;
    case "bar":
      return <BarChart seed={seed} height={180}
        labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}
        series={[{label: block.metric, values: seededSeries(seed, 7, 30, 100)}, {label:"prev wk", values: seededSeries(seed+"p", 7, 25, 90)}]}
        palette={["#2A6BE0","#a0a8b5"]}
      />;
    case "stacked":
      return <StackedArea seed={seed} height={180}/>;
    case "heatmap":
      return <Heatmap seed={seed} rows={6} cols={20} height={180}
        rowLabels={["W19","W20","W21","W22","W23","W24"]}
        colLabels={["D1","","D5","","D10","","D15","","D20","","D25","","D30"]}/>;
    case "funnel":
      return <Funnel steps={[
        { label: "Step 1", value: 10000 },
        { label: "Step 2", value: 7620 },
        { label: "Step 3", value: 5840 },
        { label: "Step 4", value: 1900 },
      ]}/>;
    case "table":
      return (
        <table className="dt" style={{fontSize:12}}>
          <thead><tr><th>Item</th><th className="dt-num">Users</th><th className="dt-num">Metric</th><th className="dt-num">Δ</th></tr></thead>
          <tbody>
            {[["United States", "48 120", "$0.092", "+3.4%"],["Brazil", "21 410", "$0.041", "+1.2%"],["Germany", "18 220", "$0.118", "-0.4%"],["Mexico", "17 980", "$0.038", "+2.1%"],["United Kingdom", "14 880", "$0.097", "+0.8%"]].map((r,i) => (
              <tr key={i}><td><b>{r[0]}</b></td><td className="dt-num">{r[1]}</td><td className="dt-num">{r[2]}</td><td className="dt-num" style={{color: r[3].startsWith("-") ? "var(--status-crit)" : "var(--status-ok)", fontWeight:700}}>{r[3]}</td></tr>
            ))}
          </tbody>
        </table>
      );
    case "number":
      return (
        <div style={{display:"grid", placeItems:"center", height:"100%"}}>
          <div style={{fontSize:36, fontWeight:800, color:"var(--accent-teal)"}}>{(seededSeries(seed, 1, 100, 9000)[0]|0).toLocaleString()}</div>
          <div className="muted tiny" style={{textTransform:"uppercase", letterSpacing:0.4, fontWeight:700}}>{block.metric}</div>
        </div>
      );
    default:
      return <div className="empty" style={{padding:20}}><div className="muted">No data preview</div></div>;
  }
}

function smoothBI(arr, k = 1) {
  return arr.map((_, i) => {
    let s = 0, c = 0;
    for (let j = -k; j <= k; j++) {
      if (i + j >= 0 && i + j < arr.length) { s += arr[i + j]; c++; }
    }
    return s / c;
  });
}

// ---- Block editor side panel ----
const BlockEditorPanel = ({ block, project, onClose, onSave, onClone, onDelete }) => {
  const [tab, setTab] = useState("viz");
  const [title, setTitle] = useState(block.title);
  const [type, setType] = useState(block.type);
  const [metric, setMetric] = useState(block.metric);
  const [span, setSpan] = useState(block.span);
  const [groupBy, setGroupBy] = useState("date");
  const [palette, setPalette] = useState("Default");
  const [period, setPeriod] = useState("daily");
  const [smoothing, setSmoothing] = useState("7d");
  const [breakdown, setBreakdown] = useState("none");
  const [sql, setSql] = useState(buildSqlForBlock(block, project));

  return (
    <aside className="bi-side-panel">
      <div className="bi-side-panel__head">
        <div className="modal__title">Edit block</div>
        <button className="modal__close" onClick={onClose}>×</button>
      </div>

      <div className="bi-side-panel__tabs">
        <button className={"editor-tab" + (tab === "viz" ? " is-active" : "")} onClick={() => setTab("viz")}><Icon name="chart-line" size={12}/> Visualization</button>
        <button className={"editor-tab" + (tab === "sql" ? " is-active" : "")} onClick={() => setTab("sql")}><Icon name="code" size={12}/> SQL</button>
        <button className={"editor-tab" + (tab === "format" ? " is-active" : "")} onClick={() => setTab("format")}><Icon name="settings" size={12}/> Format</button>
      </div>

      <div className="bi-side-panel__body">
        {tab === "viz" && (
          <>
            <div className="field">
              <div className="field__label">Title</div>
              <input className="field__input" value={title} onChange={e => setTitle(e.target.value)}/>
            </div>
            <div className="field">
              <div className="field__label">Metric</div>
              <select className="field__select" value={metric} onChange={e => setMetric(e.target.value)}>
                {["DAU","MAU","ARPU","ARPDAU","ARPPU","Revenue","Installs","Retention D1","Retention D7","Retention D30","LTV","CPI","Sessions","Session Length","CR","Match starts","Win Rate","Run length","Floor reached","Harvests","Merges","Chain Depth"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="field">
              <div className="field__label">Visualization</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:6}}>
                {[
                  {t:"line",label:"Line",ic:"chart-line"},
                  {t:"area",label:"Area",ic:"chart-line"},
                  {t:"bar",label:"Bar",ic:"chart-bar"},
                  {t:"stacked",label:"Stack",ic:"chart-bar"},
                  {t:"heatmap",label:"Heat",ic:"table"},
                  {t:"funnel",label:"Funnel",ic:"filter"},
                  {t:"table",label:"Table",ic:"table"},
                  {t:"number",label:"Number",ic:"chart-pie"},
                ].map(v => (
                  <button key={v.t} className={"btn btn--sm " + (type === v.t ? "btn--primary" : "")} onClick={() => setType(v.t)} style={{flexDirection:"column", height:46, gap:2, padding:0}}>
                    <Icon name={v.ic} size={14}/><span style={{fontSize:10}}>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <div className="field__label">Width (cols)</div>
              <div className="row gap-4">
                {[3,4,6,8,12].map(s => (
                  <button key={s} className={"btn btn--sm " + (span === s ? "btn--primary" : "")} onClick={() => setSpan(s)} style={{minWidth:36}}>{s}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <div className="field__label">Breakdown</div>
              <select className="field__select" value={breakdown} onChange={e => setBreakdown(e.target.value)}>
                <option value="none">No breakdown</option>
                <option value="platform">Platform</option>
                <option value="country">Country</option>
                <option value="acquisition_channel">Acquisition channel</option>
                <option value="user_segment">User segment (whale / dolphin / minnow / non-payer)</option>
              </select>
            </div>
            <div className="field">
              <div className="field__label">Aggregation</div>
              <select className="field__select" value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="field">
              <div className="field__label">Smoothing (moving avg)</div>
              <select className="field__select" value={smoothing} onChange={e => setSmoothing(e.target.value)}>
                <option value="off">Off</option><option value="7d">7-day</option><option value="14d">14-day</option><option value="30d">30-day</option>
              </select>
            </div>
            <div className="divider"></div>
            <div className="row gap-8">
              <button className="btn btn--sm" onClick={onClone}><Icon name="copy" size={12}/> Clone</button>
              <button className="btn btn--sm"><Icon name="download" size={12}/> CSV</button>
              <button className="btn btn--sm"><Icon name="external" size={12}/> Pin to Hub</button>
            </div>

            <div className="divider"></div>

            <div style={{fontSize:11, fontWeight:800, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:0.4, marginBottom:8}}>Preview</div>
            <div style={{background: "#fff", padding:10, borderRadius:6, border:"1px solid var(--line)"}}>
              <div style={{fontWeight:700, fontSize:13, marginBottom:6}}>{title}</div>
              {renderBlockBody({...block, type, metric}, project)}
            </div>
          </>
        )}

        {tab === "sql" && (
          <>
            <div className="row gap-8 mb-12">
              <button className="btn btn--success btn--sm"><Icon name="play" size={12}/> Run</button>
              <button className="btn btn--sm"><Icon name="save" size={12}/> Save</button>
              <button className="btn btn--sm"><Icon name="copy" size={12}/> Copy</button>
            </div>
            <textarea className="sql-input" value={sql} onChange={e => setSql(e.target.value)} rows={14}/>
            <div className="mt-12">
              <div className="field__label" style={{marginBottom:6}}>Result preview · 5 of 28</div>
              <table className="dt" style={{fontSize:12}}>
                <thead><tr><th>date</th><th className="dt-num">value</th><th className="dt-num">prev</th><th className="dt-num">Δ%</th></tr></thead>
                <tbody>
                  {[["2026-05-15","148,220","135,011","+9.8%"],["2026-05-14","144,108","132,002","+9.2%"],["2026-05-13","142,331","130,544","+9.0%"],["2026-05-12","140,109","129,210","+8.4%"],["2026-05-11","139,202","128,300","+8.5%"]].map((r,i) => (
                    <tr key={i}><td className="dt-mono">{r[0]}</td><td className="dt-num">{r[1]}</td><td className="dt-num">{r[2]}</td><td className="dt-num" style={{color:"#2a7d34", fontWeight:700}}>{r[3]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "format" && (
          <>
            <div className="field">
              <div className="field__label">Color palette</div>
              <select className="field__select" value={palette} onChange={e => setPalette(e.target.value)}>
                <option>Default</option><option>Revenue</option><option>Danger</option><option>Cool</option><option>Monochrome</option>
              </select>
            </div>
            <div className="field">
              <div className="field__label">Number format</div>
              <select className="field__select" defaultValue="auto">
                <option value="auto">Auto</option><option value="thousands">Thousands separator</option><option value="millions">Millions (1.2M)</option><option value="percent">Percentage</option><option value="currency">Currency ($)</option>
              </select>
            </div>
            <div className="field">
              <div className="field__label">Conditional formatting</div>
              <div className="muted tiny">Add rule:</div>
              <div className="row gap-4 mt-8">
                <select className="field__select" style={{flex:1}}><option>value</option><option>delta</option></select>
                <select className="field__select" style={{width:60}}><option>&gt;</option><option>&lt;</option><option>=</option></select>
                <input className="field__input" defaultValue="0.95" style={{width:90}}/>
                <button className="btn btn--sm">+ Add</button>
              </div>
            </div>
            <div className="field">
              <div className="field__label">Comparisons</div>
              <select className="field__select" defaultValue="prev_period">
                <option value="prev_period">Previous period</option>
                <option value="prev_year">Previous year</option>
                <option value="none">No comparison</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className="bi-side-panel__foot">
        <button className="btn btn--danger btn--sm" onClick={onDelete}><Icon name="trash" size={12}/> Delete</button>
        <div style={{flex:1}}/>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" onClick={() => onSave({ title, type, metric, span })}><Icon name="save" size={14}/> Save</button>
      </div>
    </aside>
  );
};

function buildSqlForBlock(block, project) {
  return `-- ${block.title}
SELECT
  date_trunc('day', ts)         AS date,
  COUNT(DISTINCT user_id)       AS value,
  LAG(COUNT(DISTINCT user_id)) OVER (ORDER BY date_trunc('day', ts))
                                AS prev_value
FROM raw_events
WHERE project_id = '${project.id}'
  AND event_name = '${block.sourceEvent || "session_start"}'
  AND ts BETWEEN :start_date AND :end_date
GROUP BY 1
ORDER BY 1;`;
}

// ---- Share & Schedule modals ----
const ShareModal = ({ onClose, addToast }) => (
  <Modal title="Share dashboard" onClose={onClose}
    footer={<><button className="btn" onClick={onClose}>Close</button>
      <button className="btn btn--primary" onClick={() => { addToast("Link copied to clipboard"); onClose(); }}><Icon name="copy" size={14}/> Copy link</button></>}>
    <div className="field">
      <div className="field__label">Share link</div>
      <input className="field__input dt-mono" readOnly value="https://gdc.analytics/d/iron_shells/overview?v=2026-05-15"/>
    </div>
    <div className="field mt-12">
      <div className="field__label">Access</div>
      <select className="field__select" defaultValue="team">
        <option value="team">My team (12 members)</option>
        <option value="org">Whole organisation</option>
        <option value="link">Anyone with the link</option>
        <option value="private">Only me</option>
      </select>
    </div>
    <div className="field mt-12">
      <div className="field__label">Slack channel (optional)</div>
      <input className="field__input" defaultValue="#bi-iron-shells"/>
    </div>
  </Modal>
);

const ScheduleModal = ({ onClose, addToast }) => (
  <Modal title="Schedule report" onClose={onClose}
    footer={<><button className="btn" onClick={onClose}>Cancel</button>
      <button className="btn btn--primary" onClick={() => { addToast("Report scheduled — first delivery Monday 9am"); onClose(); }}><Icon name="check" size={14}/> Schedule</button></>}>
    <div className="row gap-12">
      <div className="field" style={{flex:1}}>
        <div className="field__label">Frequency</div>
        <select className="field__select" defaultValue="weekly">
          <option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option>
        </select>
      </div>
      <div className="field" style={{flex:1}}>
        <div className="field__label">Day & time</div>
        <input className="field__input" defaultValue="Monday, 09:00 UTC"/>
      </div>
    </div>
    <div className="field mt-12">
      <div className="field__label">Recipients</div>
      <div className="filter-row__chips">
        <Chip kind="blue">a.volkova@gdc.io</Chip>
        <Chip kind="blue">p.orlov@gdc.io</Chip>
        <Chip kind="blue">ceo@gdc.io</Chip>
        <button className="btn btn--sm btn--ghost"><Icon name="plus" size={12}/> add</button>
      </div>
    </div>
    <div className="field mt-12">
      <div className="field__label">Format</div>
      <div className="row gap-8">
        <label className="row gap-4"><input type="radio" name="fmt" defaultChecked/> PDF</label>
        <label className="row gap-4"><input type="radio" name="fmt"/> CSV</label>
        <label className="row gap-4"><input type="radio" name="fmt"/> Slack message</label>
      </div>
    </div>
  </Modal>
);

window.BIScreen = BIScreen;
