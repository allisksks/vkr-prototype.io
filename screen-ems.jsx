/* EMS screen — events registry, event detail (params + metrics + version diff), alerts feed */

const EMSScreen = ({ project, onProjectChange, onNavigate, navPayload, setNavPayload, onAddBIBlock, onCreateAbFromMetric, addToast }) => {
  // Filter events by current project, default to backpack-brawl when "All"
  const activeProj = project || AppData.projectById("iron_shells");
  const events = AppData.events.filter(e => e.project === activeProj.id);

  const [tab, setTab] = useState((navPayload && navPayload.tab) || "registry"); // registry | alerts | versions | governance | params
  const [selectedId, setSelectedId] = useState((navPayload && navPayload.eventId) || (events[0] && events[0].id));
  const selected = events.find(e => e.id === selectedId) || events[0];

  const [diffModal, setDiffModal] = useState(null);
  const [abModal, setAbModal] = useState(null); // {metric, event}
  const [impactModal, setImpactModal] = useState(null); // event
  const [bulkSelected, setBulkSelected] = useState([]);

  // when navPayload changes, reset
  useEffect(() => {
    if (navPayload && navPayload.eventId) setSelectedId(navPayload.eventId);
    if (navPayload && navPayload.tab) setTab(navPayload.tab);
  }, [navPayload]);

  return (
    <div className="main main--sidebar">
      <ProjectSidebar
        project={activeProj}
        onSelectProject={(p) => { onProjectChange(p); setSelectedId(null); }}
      />
      <div className="page">
        <PageTitle
          crumbs={["EMS", activeProj.name]}
          title={tab === "registry" ? "Event Registry" : tab === "alerts" ? "Alert Feed" : "Version History"}
          q
          actions={[
            <button key="r" className="btn"><Icon name="download" size={14}/> Export JSON Schema</button>,
            <button key="n" className="btn btn--primary"><Icon name="plus" size={14}/> Register Event</button>,
          ]}
        />

        <div className="card">
          <div className="toolbar-row">
            <button className={"btn " + (tab === "registry" ? "btn--primary" : "")} onClick={() => setTab("registry")}>Registry</button>
            <button className={"btn " + (tab === "alerts" ? "btn--primary" : "")} onClick={() => setTab("alerts")}>
              Alerts <span className="notif" style={{marginLeft:6}}>{AppData.alerts.filter(a => (a.project === activeProj.id) && a.level !== "info").length}</span>
            </button>
            <button className={"btn " + (tab === "versions" ? "btn--primary" : "")} onClick={() => setTab("versions")}>Version History</button>
            <button className={"btn " + (tab === "governance" ? "btn--primary" : "")} onClick={() => setTab("governance")}>Governance</button>
            <button className={"btn " + (tab === "params" ? "btn--primary" : "")} onClick={() => setTab("params")}>Global Params</button>

            <div style={{flex:1}}></div>

            <div style={{position:"relative", width:240}}>
              <input className="field__input" placeholder="Search events…" style={{paddingLeft:32}}/>
              <Icon name="search" size={14} color="#7a8794" style={{position:"absolute", left:10, top:9}}/>
            </div>
            <button className="btn"><Icon name="filter" size={14}/> Filter</button>
          </div>

          {tab === "registry" && (
            <EventRegistry
              events={events}
              selected={selected}
              onSelect={(id) => setSelectedId(id)}
              bulkSelected={bulkSelected}
              setBulkSelected={setBulkSelected}
              onShowImpact={(e) => setImpactModal(e)}
              onAddBlockFromMetric={(metric) => {
                onAddBIBlock(metric, selected, activeProj);
                addToast(`Added "${metric.name}" to BI dashboard`);
              }}
              onCreateAbFromMetric={(metric) => setAbModal({ metric, event: selected })}
              onOpenDiff={(v1, v2) => setDiffModal({ v1, v2, event: selected })}
            />
          )}
          {tab === "alerts" && <AlertsFeed project={activeProj} onSelectEvent={(eid) => { setSelectedId(eid); setTab("registry"); }}/>}
          {tab === "versions" && <VersionHistory events={events} onOpenDiff={(eventId, v1, v2) => {
            const e = events.find(x => x.id === eventId);
            setDiffModal({ v1, v2, event: e });
          }}/>}
          {tab === "governance" && <GovernanceTab events={events} onSelectEvent={(eid) => { setSelectedId(eid); setTab("registry"); }}/>}
          {tab === "params" && <GlobalParamsLibrary/>}
        </div>
      </div>

      {diffModal && <DiffModal {...diffModal} onClose={() => setDiffModal(null)}/>}
      {abModal && (
        <ABMetricTemplateModal
          {...abModal}
          onClose={() => setAbModal(null)}
          onSubmit={(payload) => {
            setAbModal(null);
            onCreateAbFromMetric(payload);
            addToast(`Draft experiment created from "${abModal.metric.name}"`);
          }}
        />
      )}
      {impactModal && <ImpactModal event={impactModal} onClose={() => setImpactModal(null)}/>}
    </div>
  );
};

// ---------------------- Event registry (table + detail panel) ----------------------
const EventRegistry = ({ events, selected, onSelect, onAddBlockFromMetric, onCreateAbFromMetric, onOpenDiff, bulkSelected, setBulkSelected, onShowImpact }) => {
  const allSelected = bulkSelected.length === events.length && events.length > 0;
  return (
    <>
      {bulkSelected.length > 0 && (
        <div style={{padding:"8px 16px", background:"#fef3d1", borderBottom:"1px solid var(--line-soft)", display:"flex", gap:8, alignItems:"center", fontSize:13}}>
          <b>{bulkSelected.length}</b> selected ·
          <button className="btn btn--sm"><Icon name="check" size={12}/> Bulk validate</button>
          <button className="btn btn--sm"><Icon name="download" size={12}/> Export schema</button>
          <button className="btn btn--sm btn--danger"><Icon name="trash" size={12}/> Archive</button>
          <button className="btn btn--sm btn--ghost" onClick={() => setBulkSelected([])}>Clear</button>
        </div>
      )}
      <div className="split split--12">
      {/* Left: events table */}
      <div style={{borderRight:"1px solid var(--line-soft)"}}>
        <table className="dt">
          <thead>
            <tr>
              <th style={{width:30}}><input type="checkbox" checked={allSelected} onChange={() => setBulkSelected(allSelected ? [] : events.map(e=>e.id))}/></th>
              <th>event_name</th>
              <th>ver</th>
              <th>schema_hash</th>
              <th>30m</th>
              <th>status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr
                key={e.id}
                className={(selected && selected.id === e.id ? "is-selected " : "") + (e.status === "crit" ? "row-crit" : e.status === "warn" ? "row-warn" : "")}
                style={{cursor:"pointer"}}
              >
                <td onClick={ev => ev.stopPropagation()}>
                  <input type="checkbox" checked={bulkSelected.includes(e.id)} onChange={() => setBulkSelected(s => s.includes(e.id) ? s.filter(x=>x!==e.id) : [...s, e.id])}/>
                </td>
                <td className="dt-mono" onClick={() => onSelect(e.id)}>{e.name}</td>
                <td onClick={() => onSelect(e.id)}><span className="tag">v{e.version}</span></td>
                <td className="dt-mono muted" onClick={() => onSelect(e.id)}>{e.hash}</td>
                <td className="dt-num" onClick={() => onSelect(e.id)}>{e.eventsLast30m.toLocaleString()}</td>
                <td onClick={() => onSelect(e.id)}>
                  {e.status === "ok"   && <Pill kind="ok">OK</Pill>}
                  {e.status === "warn" && <Pill kind="warn">Warning</Pill>}
                  {e.status === "crit" && <Pill kind="crit">Critical</Pill>}
                </td>
                <td><button className="btn btn--sm btn--ghost" onClick={ev => { ev.stopPropagation(); onShowImpact(e); }} title="Impact analysis"><Icon name="external" size={12}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: event details */}
      <div>
        {selected ? (
          <EventDetail
            event={selected}
            onAddBlockFromMetric={onAddBlockFromMetric}
            onCreateAbFromMetric={onCreateAbFromMetric}
            onOpenDiff={onOpenDiff}
          />
        ) : (
          <div className="empty">
            <div className="empty__face">📂</div>
            <div className="empty__title">Pick an event to inspect</div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

// ---------------------- Event detail ----------------------
const EventDetail = ({ event, onAddBlockFromMetric, onCreateAbFromMetric, onOpenDiff }) => {
  const [subtab, setSubtab] = useState("schema"); // schema | metrics | versions | alerts

  return (
    <div>
      <div style={{padding:"14px 18px", borderBottom:"1px solid var(--line-soft)"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div>
            <div className="dt-mono" style={{fontSize:17, fontWeight:800, color:"var(--ink)"}}>{event.name}</div>
            <div className="row gap-8 mt-8">
              <span className="tag">v{event.version}</span>
              <span className="tag tag--ghost">hash <b className="dt-mono">{event.hash}</b></span>
              <span className="tag tag--ghost">owner {event.owner}</span>
              {event.status === "ok"   && <Pill kind="ok">OK</Pill>}
              {event.status === "warn" && <Pill kind="warn">Warning</Pill>}
              {event.status === "crit" && <Pill kind="crit">Critical</Pill>}
            </div>
          </div>
          <div className="row gap-8">
            <button className="btn"><Icon name="copy" size={14}/> Schema</button>
            <button className="btn btn--primary"><Icon name="edit" size={14}/> New version</button>
          </div>
        </div>
        <div className="mt-12 muted tiny">{event.condition}</div>
      </div>

      <div style={{display:"flex", gap:0, padding:"0 18px", borderBottom:"1px solid var(--line-soft)", background:"var(--brand-tint)"}}>
        {[
          {id:"schema", label:"Parameters"},
          {id:"metrics", label:`Key metrics (${event.metrics.length})`},
          {id:"versions", label:`Versions (${event.versions.length})`},
          {id:"alerts", label:"Monitoring"},
        ].map(t => (
          <button key={t.id}
            className="editor-tab"
            style={{
              padding: "10px 16px",
              color: subtab === t.id ? "var(--brand)" : "var(--ink-3)",
              borderBottom: subtab === t.id ? "2px solid var(--brand)" : "2px solid transparent",
            }}
            onClick={() => setSubtab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{padding:"14px 18px"}}>
        {subtab === "schema" && <SchemaTab event={event}/>}
        {subtab === "metrics" && <MetricsTab event={event} onAddBlockFromMetric={onAddBlockFromMetric} onCreateAbFromMetric={onCreateAbFromMetric}/>}
        {subtab === "versions" && <VersionsTab event={event} onOpenDiff={onOpenDiff}/>}
        {subtab === "alerts" && <MonitoringTab event={event}/>}

        <HourlyEventsChart event={event}/>
      </div>
    </div>
  );
};

// ---- Parameters tab ----
const SchemaTab = ({ event }) => (
  <div>
    <div style={{fontSize:12, fontWeight:800, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:0.4, padding:"4px 12px 8px"}}>
      Global parameters (inherited from all events) · {AppData.globalParamSet.length}
    </div>
    <div style={{border:"1px solid var(--line-soft)", borderRadius:6, overflow:"hidden"}}>
      <div className="param-row" style={{background:"var(--bg)", fontSize:11.5, fontWeight:800, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:0.3}}>
        <div>Name</div><div>Type</div><div>Req</div><div>Description</div>
      </div>
      {AppData.globalParamSet.map(p => <ParamRow key={p.name} param={p}/>)}
    </div>

    <div style={{fontSize:12, fontWeight:800, color:"var(--accent-teal)", textTransform:"uppercase", letterSpacing:0.4, padding:"16px 12px 8px"}}>
      Custom parameters of <span className="dt-mono">{event.name}</span> · {event.customParams.length}
    </div>
    <div style={{border:"1px solid var(--line-soft)", borderRadius:6, overflow:"hidden"}}>
      <div className="param-row" style={{background:"var(--bg)", fontSize:11.5, fontWeight:800, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:0.3}}>
        <div>Name</div><div>Type</div><div>Req</div><div>Description</div>
      </div>
      {event.customParams.map(p => <ParamRow key={p.name} param={p}/>)}
    </div>

    <div style={{marginTop:18}}>
      <div className="row gap-8 mb-8">
        <span style={{fontWeight:800, fontSize:13, color:"var(--ink-2)"}}>JSON Schema (Draft-07)</span>
        <button className="btn btn--sm"><Icon name="download" size={12}/> Export</button>
        <button className="btn btn--sm"><Icon name="copy" size={12}/> Copy</button>
      </div>
      <pre className="code-block">
{`{
  `}<span style={{color:"#79b8ff"}}>"$schema"</span>{`: `}<span style={{color:"#b9e08c"}}>"https://json-schema.org/draft-07/schema#"</span>{`,
  `}<span style={{color:"#79b8ff"}}>"title"</span>{`: `}<span style={{color:"#b9e08c"}}>"${event.name}"</span>{`,
  `}<span style={{color:"#79b8ff"}}>"$comment"</span>{`: `}<span style={{color:"#b9e08c"}}>"${event.condition.replace(/"/g,'\\"')}"</span>{`,
  `}<span style={{color:"#79b8ff"}}>"type"</span>{`: `}<span style={{color:"#b9e08c"}}>"object"</span>{`,
  `}<span style={{color:"#79b8ff"}}>"required"</span>{`: [${event.customParams.filter(p=>p.required).map(p=>`"${p.name}"`).join(", ")}],
  `}<span style={{color:"#79b8ff"}}>"properties"</span>{`: {
${event.customParams.map(p => `    "${p.name}": { "type": "${p.type === "int" || p.type === "float" ? "number" : p.type === "ts" ? "string" : p.type === "enum" ? "string" : p.type}" }`).join(",\n")}
  }
}`}
      </pre>
    </div>
  </div>
);

// ---- Metrics tab ----
const MetricsTab = ({ event, onAddBlockFromMetric, onCreateAbFromMetric }) => (
  <div>
    <div className="row gap-8 mb-12" style={{color:"var(--ink-2)", fontSize:13}}>
      <Icon name="lightning" size={14} color="#e07a3a"/>
      <span>The following metrics can be built from <b className="dt-mono">{event.name}</b> events. Click any metric to push it into a BI dashboard or set it up as a primary metric for an A/B test.</span>
    </div>

    <table className="dt">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Formula</th>
          <th className="dt-num">Current</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {event.metrics.map(m => (
          <tr key={m.id}>
            <td><b>{m.name}</b></td>
            <td className="dt-mono muted">{m.formula}</td>
            <td className="dt-num"><b>{m.value}</b></td>
            <td>
              <div className="row gap-8">
                <button className="btn btn--sm btn--primary" onClick={() => onAddBlockFromMetric(m)}>
                  <Icon name="chart-line" size={12}/> Add to BI
                </button>
                <button className="btn btn--sm" onClick={() => onCreateAbFromMetric(m)}>
                  <Icon name="flask" size={12}/> A/B template
                </button>
                <button className="btn btn--sm btn--ghost"><Icon name="code" size={12}/> SQL</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ---- Versions tab ----
const VersionsTab = ({ event, onOpenDiff }) => {
  const [v1, setV1] = useState(event.versions[Math.min(1, event.versions.length - 1)].v);
  const [v2, setV2] = useState(event.versions[0].v);
  return (
    <div>
      <div className="row gap-8 mb-12">
        <span style={{fontWeight:700}}>Compare</span>
        <select className="field__select" value={v1} onChange={e => setV1(+e.target.value)} style={{width:120}}>
          {event.versions.map(v => <option key={v.v} value={v.v}>v{v.v}</option>)}
        </select>
        <span>→</span>
        <select className="field__select" value={v2} onChange={e => setV2(+e.target.value)} style={{width:120}}>
          {event.versions.map(v => <option key={v.v} value={v.v}>v{v.v}</option>)}
        </select>
        <button className="btn btn--primary btn--sm" onClick={() => onOpenDiff(v1, v2)}>Open full diff</button>
      </div>

      <table className="dt">
        <thead>
          <tr><th>Version</th><th>Date</th><th>Author</th><th>Change</th><th>State</th></tr>
        </thead>
        <tbody>
          {event.versions.map((v, i) => (
            <tr key={v.v}>
              <td><b>v{v.v}</b></td>
              <td>{v.date}</td>
              <td>{v.author}</td>
              <td>{v.note}</td>
              <td>{i === 0 ? <Pill kind="ok">active</Pill> : <Pill kind="draft">archived</Pill>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---- Monitoring tab ----
const MonitoringTab = ({ event }) => {
  const ratio = event.eventsLast30m / event.baseline;
  const cls = ratio < 0.5 ? "crit" : (ratio < 0.9 || ratio > 1.5) ? "warn" : "ok";
  return (
    <div>
      <div className="metric-grid">
        <MetricTile label="Events last 30m" value={event.eventsLast30m.toLocaleString()}/>
        <MetricTile label="Baseline" value={event.baseline.toLocaleString()}/>
        <MetricTile label="Ratio vs baseline" value={(ratio*100).toFixed(1) + "%"}
          delta={cls === "ok" ? "healthy" : cls === "warn" ? "watch" : "critical"} deltaDir={cls === "ok" ? "up" : "down"}/>
        <MetricTile label="Last check" value={event.lastCheck}/>
      </div>

      <div className="card mt-16">
        <div className="card__head">
          <div className="card__title">Frequency · last 48h</div>
          <span className="muted tiny">baseline shown as dashed line</span>
        </div>
        <div className="card__body">
          <LineChart
            seed={`mon-${event.id}`}
            series={[
              { label: "observed", values: seededSeries(event.id + "obs", 48, event.baseline * (cls==="crit"?0.05:cls==="warn"?0.7:0.85), event.baseline * 1.15) },
              { label: "baseline", values: Array(48).fill(event.baseline) },
            ]}
            palette={["#2A6BE0","#a0a8b5"]}
            height={220}
          />
        </div>
      </div>

      <div className="card mt-16">
        <div className="card__head"><div className="card__title">Alert rules</div><button className="btn btn--sm"><Icon name="plus" size={12}/> New rule</button></div>
        <table className="dt">
          <thead>
            <tr><th>Rule</th><th>Condition</th><th>Channel</th><th>State</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Frequency drop</td>
              <td className="dt-mono">count &lt; baseline × 0.5 → critical</td>
              <td>Slack #data-alerts + email</td>
              <td>{cls === "crit" ? <Pill kind="crit">firing</Pill> : <Pill kind="ok">ok</Pill>}</td>
            </tr>
            <tr>
              <td>Frequency dip</td>
              <td className="dt-mono">count ∈ [base×0.5, base×0.9) → warning</td>
              <td>Slack #data-alerts</td>
              <td>{cls === "warn" ? <Pill kind="warn">firing</Pill> : <Pill kind="ok">ok</Pill>}</td>
            </tr>
            <tr>
              <td>Null rate</td>
              <td className="dt-mono">NULL(any required) &gt; 5%</td>
              <td>Slack #data-alerts</td>
              <td><Pill kind="ok">ok</Pill></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------------- Alerts feed ----------------------
const AlertsFeed = ({ project, onSelectEvent }) => {
  const list = AppData.alerts.filter(a => a.project === project.id);
  if (!list.length) return <div className="empty"><div className="empty__face">✓</div><div className="empty__title">No alerts in this project.</div></div>;
  return (
    <table className="dt">
      <thead>
        <tr><th>Level</th><th>Event</th><th>Reason</th><th className="dt-num">Observed</th><th className="dt-num">Expected</th><th>Time</th><th>Note</th><th></th></tr>
      </thead>
      <tbody>
        {list.map(a => {
          const ev = AppData.events.find(e => e.name === a.event && e.project === a.project);
          return (
            <tr key={a.id} className={a.level === "crit" ? "row-crit" : a.level === "warn" ? "row-warn" : ""}>
              <td>{a.level === "crit" ? <Pill kind="crit">critical</Pill> : a.level === "warn" ? <Pill kind="warn">warning</Pill> : <Pill kind="info">info</Pill>}</td>
              <td className="dt-mono">{a.event}</td>
              <td>{a.reason.replace("_"," ")}</td>
              <td className="dt-num">{a.observed}</td>
              <td className="dt-num">{a.expected}</td>
              <td>{a.time}</td>
              <td className="muted">{a.note}</td>
              <td>
                {ev && <button className="btn btn--sm btn--ghost" onClick={() => onSelectEvent(ev.id)}>Inspect →</button>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// ---------------------- Version history (all events) ----------------------
const VersionHistory = ({ events, onOpenDiff }) => (
  <table className="dt">
    <thead><tr><th>Event</th><th>Version</th><th>Date</th><th>Author</th><th>Change</th><th></th></tr></thead>
    <tbody>
      {events.flatMap(e => e.versions.map(v => ({ ...v, e }))).sort((a,b) => a.date < b.date ? 1 : -1).map((v,i) => (
        <tr key={v.e.id + v.v}>
          <td className="dt-mono">{v.e.name}</td>
          <td><b>v{v.v}</b></td>
          <td>{v.date}</td>
          <td>{v.author}</td>
          <td>{v.note}</td>
          <td><button className="btn btn--sm btn--ghost" onClick={() => onOpenDiff(v.e.id, Math.max(1,v.v-1), v.v)}>Diff →</button></td>
        </tr>
      ))}
    </tbody>
  </table>
);

// ---------------------- Diff modal ----------------------
const DiffModal = ({ event, v1, v2, onClose }) => {
  // fake diff content
  const sameParams = event.customParams.slice(0, 2);
  const added = event.customParams.slice(-1);
  const modified = event.customParams.slice(2, 3);
  return (
    <Modal title={`${event.name} — diff v${v1} → v${v2}`} onClose={onClose} size="lg"
      footer={<><button className="btn" onClick={onClose}>Close</button><button className="btn btn--primary"><Icon name="download" size={14}/> Download diff JSON</button></>}>
      <div className="row gap-8 mb-12">
        <span className="tag" style={{background:"#e8f5dd", color:"#2a7d34"}}>+ {added.length} added</span>
        <span className="tag" style={{background:"#fbe2e2", color:"#c1393c"}}>− 0 removed</span>
        <span className="tag" style={{background:"#fcecc7", color:"#8b6510"}}>~ {modified.length} modified</span>
        <span className="muted tiny">{event.versions.find(v => v.v === v2)?.note}</span>
      </div>
      <div style={{border:"1px solid var(--line-soft)", borderRadius:6, overflow:"hidden"}}>
        <div className="diff-line same">  "type": "object",</div>
        <div className="diff-line same">  "required": [</div>
        {sameParams.map(p => <div key={p.name} className="diff-line same">    "{p.name}",</div>)}
        {added.map(p => <div key={p.name} className="diff-line add">+   "{p.name}",</div>)}
        <div className="diff-line same">  ],</div>
        <div className="diff-line same">  "properties": &#123;</div>
        {sameParams.map(p => <div key={p.name+"_p"} className="diff-line same">    "{p.name}": &#123; "type": "{p.type}" &#125;,</div>)}
        {modified.map(p => (
          <Fragment key={p.name+"_m"}>
            <div className="diff-line mod">-   "{p.name}": &#123; "type": "string" &#125;,</div>
            <div className="diff-line mod">+   "{p.name}": &#123; "type": "{p.type}" &#125;,</div>
          </Fragment>
        ))}
        {added.map(p => <div key={p.name+"_a"} className="diff-line add">+   "{p.name}": &#123; "type": "{p.type}", "required": {String(p.required)} &#125;,</div>)}
        <div className="diff-line same">  &#125;</div>
        <div className="diff-line same">&#125;</div>
      </div>
    </Modal>
  );
};

// ---------------------- AB Metric template modal (EMS → AB) ----------------------
const ABMetricTemplateModal = ({ metric, event, onClose, onSubmit }) => {
  const [hypothesis, setHypothesis] = useState(`Changing the in-game configuration related to "${event.name}" will improve ${metric.name} by ≥ 1pp vs baseline.`);
  const [effect, setEffect] = useState(metric.name === "ARPU" ? "+5%" : "+1.5pp");
  const [trafficSplit, setTrafficSplit] = useState(50);
  const [duration, setDuration] = useState(14);
  return (
    <Modal
      title={`A/B Test from "${metric.name}"`}
      onClose={onClose}
      size="lg"
      footer={<>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" onClick={() => onSubmit({hypothesis, metric, event, effect, trafficSplit, duration})}>
          <Icon name="flask" size={14}/> Create draft experiment
        </button>
      </>}
    >
      <div className="row gap-8 mb-12" style={{background:"var(--brand-tint)", padding:"10px 14px", borderRadius:6, color:"var(--ink-2)"}}>
        <Icon name="lightning" size={16} color="#e07a3a"/>
        <span><b>Template pre-fill:</b> linking event <span className="dt-mono">{event.name}</span> · primary metric <b>{metric.name}</b> ({metric.formula}). The splitter will deterministically bucket users by <span className="dt-mono">hash(user_id + experiment_id)</span>.</span>
      </div>

      <div className="col gap-12">
        <div className="field">
          <div className="field__label">Hypothesis</div>
          <textarea className="field__textarea" rows={3} value={hypothesis} onChange={e => setHypothesis(e.target.value)}/>
        </div>

        <div className="row gap-12" style={{alignItems:"flex-start"}}>
          <div className="field" style={{flex:1}}>
            <div className="field__label">Primary metric</div>
            <input className="field__input" value={metric.name} readOnly/>
          </div>
          <div className="field" style={{flex:1}}>
            <div className="field__label">Metric type</div>
            <select className="field__select" defaultValue={metric.unit === "$" ? "continuous" : "binary"}>
              <option value="binary">Binary (Bayesian Beta)</option>
              <option value="continuous">Continuous (Normal approx.)</option>
            </select>
          </div>
          <div className="field" style={{flex:1}}>
            <div className="field__label">Min. detectable effect</div>
            <input className="field__input" value={effect} onChange={e => setEffect(e.target.value)}/>
          </div>
        </div>

        <div className="row gap-12">
          <div className="field" style={{flex:1}}>
            <div className="field__label">Variants</div>
            <div className="col gap-8">
              <div className="row gap-8">
                <div style={{flex:1}}>
                  <input className="field__input" defaultValue="Control"/>
                </div>
                <input className="field__input" defaultValue="50%" style={{width:90}}/>
              </div>
              <div className="row gap-8">
                <div style={{flex:1}}>
                  <input className="field__input" defaultValue="Test B"/>
                </div>
                <input className="field__input" defaultValue="50%" style={{width:90}}/>
              </div>
              <button className="btn btn--sm btn--ghost" style={{alignSelf:"flex-start"}}><Icon name="plus" size={12}/> Add variant</button>
            </div>
          </div>
          <div className="field" style={{flex:1}}>
            <div className="field__label">Traffic share</div>
            <input className="field__input" value={trafficSplit + "%"} onChange={e => setTrafficSplit(parseInt(e.target.value)||0)}/>
            <div className="field__label" style={{marginTop:10}}>Expected duration (days)</div>
            <input className="field__input" value={duration} onChange={e => setDuration(parseInt(e.target.value)||0)}/>
            <div className="muted tiny mt-8">Calculated from MDE, current DAU and traffic share. Threshold P(B&gt;A) ≥ 0.95.</div>
          </div>
        </div>

        <div className="field">
          <div className="field__label">Inclusion criteria (JSONB)</div>
          <textarea className="field__textarea" rows={3} defaultValue={`{
  "platform": ["ios", "android"],
  "country": "ALL",
  "cohort_date_min": "2026-04-15"
}`}/>
        </div>
      </div>
    </Modal>
  );
};

window.EMSScreen = EMSScreen;

// ---------------------- Impact Analysis modal ----------------------
const ImpactModal = ({ event, onClose }) => {
  // Pretend: count usages
  const usedDashboards = AppData.dashboards.filter(d => d.project === event.project).slice(0, 3);
  const usedExperiments = AppData.experiments.filter(e => e.eventSource === event.name || e.project === event.project).slice(0, 2);
  return (
    <Modal title={`Impact analysis · ${event.name}`} onClose={onClose}
      footer={<button className="btn btn--primary" onClick={onClose}>Close</button>}>
      <div className="muted tiny mb-12" style={{fontWeight:700, textTransform:"uppercase", letterSpacing:0.3}}>
        Downstream dependencies — confirm impact before changing the schema or deprecating.
      </div>

      <div className="card">
        <div className="card__head"><div className="card__title">Used in BI dashboards · {usedDashboards.length}</div></div>
        <table className="dt">
          <thead><tr><th>Dashboard</th><th>Project</th><th className="dt-num">Blocks</th></tr></thead>
          <tbody>
            {usedDashboards.map(d => (
              <tr key={d.id}><td><b>{d.name}</b></td><td>{AppData.projectById(d.project)?.name}</td><td className="dt-num">{(1 + Math.abs(d.id.length % 3))}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card__head"><div className="card__title">A/B experiments referencing this event · {usedExperiments.length}</div></div>
        <table className="dt">
          <thead><tr><th>Experiment</th><th>Status</th><th className="dt-num">Users</th></tr></thead>
          <tbody>
            {usedExperiments.map(e => (
              <tr key={e.id}><td><b>{e.title}</b></td><td>{e.status}</td><td className="dt-num">{e.variants.reduce((s,v)=>s+v.users,0).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card__head"><div className="card__title">Downstream events triggered after</div></div>
        <ul style={{margin:0, paddingLeft:18}}>
          <li className="dt-mono">level_complete</li>
          <li className="dt-mono">iap_purchase</li>
          <li className="dt-mono">chest_open</li>
        </ul>
      </div>

      <div style={{padding:14, background:"#fef3d1", borderRadius:6, fontSize:13, marginTop:14}}>
        <b>Recommendation:</b> deprecating <span className="dt-mono">{event.name}</span> would impact <b>{usedDashboards.length}</b> dashboards and <b>{usedExperiments.length}</b> A/B tests. Coordinate with the teams listed above before scheduling sunset.
      </div>
    </Modal>
  );
};

// ---------------------- Governance Tab ----------------------
const GovernanceTab = ({ events, onSelectEvent }) => {
  const totalEvents = events.length;
  const withDesc = events.filter(e => e.condition && e.condition.length > 20).length;
  const withOwner = events.filter(e => e.owner).length;
  const stale = events.filter(e => e.updated < "2026-03-01");
  const orphans = events.filter(e => !e.metrics || e.metrics.length === 0);
  const violations = events.filter(e => /[A-Z]/.test(e.name));

  const score = Math.round((withDesc / totalEvents) * 50 + (withOwner / totalEvents) * 30 + (1 - stale.length / totalEvents) * 20);

  const Stat = ({ label, value, total, color }) => (
    <div className="metric-tile">
      <div className="metric-tile__label">{label}</div>
      <div className="metric-tile__val" style={{color}}>{value}{total ? <span style={{color:"var(--ink-3)", fontSize:14}}> / {total}</span> : null}</div>
      <div className="bar" style={{marginTop:6}}>
        <div className={"bar__fill " + (color === "var(--status-ok)" ? "bar__fill--ok" : color === "var(--status-warn)" ? "bar__fill--warn" : "bar__fill--crit")} style={{width: (total ? (value/total)*100 : value) + "%"}}></div>
      </div>
    </div>
  );

  return (
    <div className="card__body">
      <div className="metric-grid mb-12">
        <Stat label="Coverage score" value={score} total={100} color={score > 80 ? "var(--status-ok)" : score > 60 ? "var(--status-warn)" : "var(--status-crit)"}/>
        <Stat label="Events with description" value={withDesc} total={totalEvents} color="var(--status-ok)"/>
        <Stat label="Events with owner" value={withOwner} total={totalEvents} color="var(--status-ok)"/>
        <Stat label="Stale (>90 days)" value={stale.length} total={totalEvents} color="var(--status-warn)"/>
      </div>

      <div className="card">
        <div className="card__head"><div className="card__title">Action items</div></div>
        <table className="dt">
          <thead><tr><th>Issue</th><th>Event</th><th>Severity</th><th></th></tr></thead>
          <tbody>
            {stale.map(e => (
              <tr key={"s-"+e.id}><td>Stale schema — no updates in 90+ days</td><td className="dt-mono">{e.name}</td><td><Pill kind="warn">warning</Pill></td><td><button className="btn btn--sm btn--ghost" onClick={() => onSelectEvent(e.id)}>Inspect →</button></td></tr>
            ))}
            {orphans.map(e => (
              <tr key={"o-"+e.id}><td>Orphan — no BI metrics defined</td><td className="dt-mono">{e.name}</td><td><Pill kind="info">info</Pill></td><td><button className="btn btn--sm btn--ghost" onClick={() => onSelectEvent(e.id)}>Inspect →</button></td></tr>
            ))}
            {violations.map(e => (
              <tr key={"v-"+e.id}><td>Naming convention — uppercase letters in event_name</td><td className="dt-mono">{e.name}</td><td><Pill kind="warn">warning</Pill></td><td><button className="btn btn--sm btn--ghost" onClick={() => onSelectEvent(e.id)}>Inspect →</button></td></tr>
            ))}
            {stale.length === 0 && orphans.length === 0 && violations.length === 0 && (
              <tr><td colSpan={4}><div className="empty" style={{padding:30}}><div className="empty__face">✓</div><div className="empty__title">No governance issues. Nice.</div></div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------------- Hourly events chart (always at bottom of event card) ----------------------
const HourlyEventsChart = ({ event }) => {
  // 24-hour bar chart. Each bar = events received from DB in that hour.
  // Status logic: critical if < 50% baseline, warning if 50–90% or > 150%, ok if in range.
  // Two special states:
  //   - "not implemented": when status === "crit" AND most hours near zero (e.g. tutorial_step regression)
  //   - "ok with gap": one or two hours dipped
  const hourBaseline = event.baseline / 48; // 30m baseline → ~half of hourly
  const hourlyBase = hourBaseline * 2;

  // Deterministic per-event hourly values
  const hash = event.id.split("").reduce((h,c) => (h*31 + c.charCodeAt(0)) | 0, 0);
  function rnd(i) {
    let x = Math.abs(Math.sin(hash + i * 17.31)) * 1000;
    return x - Math.floor(x);
  }

  const hours = Array.from({ length: 24 }, (_, i) => {
    let v;
    if (event.status === "crit" && event.eventsLast30m / event.baseline < 0.1) {
      // event broken — almost no data in last 6-8 hours, normal before
      const sinceRelease = i >= 17 ? 0.0 : (0.85 + (rnd(i) - 0.5) * 0.25);
      v = hourlyBase * sinceRelease;
    } else if (event.status === "warn") {
      // dipped for last few hours
      const dip = i >= 19 ? (0.55 + rnd(i) * 0.2) : (0.95 + (rnd(i) - 0.5) * 0.2);
      v = hourlyBase * dip;
    } else {
      // healthy with small day/night curve
      const dayCurve = 0.85 + 0.3 * Math.sin((i / 24) * Math.PI * 2 - Math.PI / 3);
      v = hourlyBase * dayCurve * (0.92 + rnd(i) * 0.15);
    }
    const ratio = v / hourlyBase;
    const status = ratio < 0.5 ? "crit" : (ratio < 0.9 || ratio > 1.5) ? "warn" : "ok";
    return { hour: i, value: v, ratio, status };
  });

  const max = Math.max(...hours.map(h => h.value), hourlyBase * 1.4);
  const critHours = hours.filter(h => h.status === "crit").length;
  const warnHours = hours.filter(h => h.status === "warn").length;
  const totalDay = hours.reduce((s, h) => s + h.value, 0);
  const expectedDay = hourlyBase * 24;
  const notImplemented = event.status === "crit" && event.eventsLast30m / event.baseline < 0.05;

  // Active alerts derived from same condition
  const activeAlerts = AppData.alerts.filter(a => a.event === event.name && a.project === event.project);

  return (
    <div className="card mt-16">
      <div className="card__head">
        <div className="card__title">
          <Icon name="clock" size={16} color={notImplemented ? "var(--status-crit)" : critHours > 0 ? "var(--status-crit)" : warnHours > 0 ? "var(--status-warn)" : "var(--status-ok)"}/>
          Events received · last 24 hours
        </div>
        <div className="row gap-8">
          {notImplemented && <Pill kind="crit">Event not firing</Pill>}
          {!notImplemented && critHours > 0 && <Pill kind="crit">{critHours} critical hours</Pill>}
          {!notImplemented && critHours === 0 && warnHours > 0 && <Pill kind="warn">{warnHours} dips</Pill>}
          {!notImplemented && critHours === 0 && warnHours === 0 && <Pill kind="ok">Healthy</Pill>}
          <span className="muted tiny">baseline ≈ {Math.round(hourlyBase).toLocaleString()}/h</span>
        </div>
      </div>

      <div className="card__body">
        <HourlyBars hours={hours} max={max} baseline={hourlyBase}/>

        <div className="row gap-16 mt-12" style={{justifyContent:"center", fontSize:11.5, fontWeight:700, color:"var(--ink-3)"}}>
          <div className="row gap-4"><span style={{width:14, height:8, background:"#43c08a", borderRadius:2, display:"inline-block"}}></span> OK (≥ 90% baseline)</div>
          <div className="row gap-4"><span style={{width:14, height:8, background:"#f5a623", borderRadius:2, display:"inline-block"}}></span> Warning (50–90%)</div>
          <div className="row gap-4"><span style={{width:14, height:8, background:"#e94646", borderRadius:2, display:"inline-block"}}></span> Critical (&lt; 50%)</div>
          <div className="row gap-4"><span style={{width:18, borderTop:"1.5px dashed #4a5764", display:"inline-block"}}></span> baseline</div>
        </div>

        <div className="metric-grid mt-16">
          <MetricTile label="Last hour" value={Math.round(hours[hours.length-1].value).toLocaleString()}
            delta={`${(hours[hours.length-1].ratio*100).toFixed(0)}% of baseline`}
            deltaDir={hours[hours.length-1].status === "ok" ? "up" : "down"}/>
          <MetricTile label="24h total" value={Math.round(totalDay).toLocaleString()}
            delta={`${((totalDay/expectedDay)*100).toFixed(0)}% of expected`}
            deltaDir={totalDay > expectedDay * 0.9 ? "up" : "down"}/>
          <MetricTile label="Gaps detected" value={`${critHours + warnHours} of 24`}
            delta={notImplemented ? "event missing" : critHours > 0 ? "critical dips" : warnHours > 0 ? "minor dips" : "no gaps"}
            deltaDir={critHours > 0 || notImplemented ? "down" : "up"}/>
          <MetricTile label="Active alerts" value={activeAlerts.length}
            delta={activeAlerts.length ? activeAlerts[0].reason.replace("_"," ") : "none"}
            deltaDir={activeAlerts.length ? "down" : "up"}/>
        </div>

        {(notImplemented || critHours > 0) && (
          <div style={{
            marginTop: 14, padding: "10px 14px",
            background: notImplemented ? "#fbe2e2" : "#fef0e2",
            border: notImplemented ? "1px solid #f1bdbd" : "1px solid #f1cda1",
            borderRadius: 6, display: "flex", gap: 10, alignItems: "flex-start",
            fontSize: 13,
          }}>
            <Icon name="alert" size={18} color={notImplemented ? "var(--status-crit)" : "var(--status-warn)"} style={{flexShrink:0, marginTop:1}}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:800, color: notImplemented ? "var(--status-crit)" : "var(--ink)"}}>
                {notImplemented
                  ? `Event "${event.name}" is not firing or not implemented`
                  : `${critHours} hour${critHours > 1 ? "s" : ""} with frequency < 50% of baseline`}
              </div>
              <div className="tiny muted" style={{marginTop:3}}>
                {notImplemented
                  ? "Last 6+ hours show near-zero traffic for this event. Most likely cause: SDK not initialised on the new build, missing implementation call, or wrong event_name. Check the latest release build."
                  : `EMS alert rule "frequency_drop < baseline × 0.5" triggered. Critical alerts have been sent to the analyst and CTO via Slack #data-alerts.`}
              </div>
              <div className="row gap-4 mt-8">
                <button className="btn btn--sm btn--ghost"><Icon name="external" size={12}/> Open in alert feed</button>
                <button className="btn btn--sm btn--ghost"><Icon name="check" size={12}/> Acknowledge</button>
                <button className="btn btn--sm btn--ghost"><Icon name="code" size={12}/> SDK debug</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Small SVG bar component for the hourly chart
const HourlyBars = ({ hours, max, baseline }) => {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const onR = () => ref.current && setW(ref.current.clientWidth);
    onR();
    const ro = new ResizeObserver(onR);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const h = 180;
  const padX = 28, padTop = 16, padBot = 28;
  const gap = 2;
  const barW = (w - padX * 2 - gap * 23) / 24;
  const norm = v => h - padBot - (v / max) * (h - padTop - padBot);
  const baseY = norm(baseline);
  const baseColor = { ok: "#43c08a", warn: "#f5a623", crit: "#e94646" };

  return (
    <div ref={ref} style={{width:"100%"}}>
      <svg width={w} height={h}>
        {/* y axis ticks */}
        {[0, 0.5, 1, 1.5].map((t, i) => (
          <g key={i}>
            <line x1={padX} y1={norm(baseline * t)} x2={w - 4} y2={norm(baseline * t)} stroke="#eceff4"/>
            <text x={padX - 6} y={norm(baseline * t) + 3} fontSize="10" fill="#7a8794" textAnchor="end">{Math.round(baseline * t).toLocaleString()}</text>
          </g>
        ))}
        {/* bars */}
        {hours.map((hr, i) => {
          const x = padX + i * (barW + gap);
          const y = norm(hr.value);
          const bh = h - padBot - y;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={Math.max(2, bh)} fill={baseColor[hr.status]} rx="2">
                <title>{`${String(hr.hour).padStart(2,'0')}:00 — ${Math.round(hr.value).toLocaleString()} events (${(hr.ratio*100).toFixed(0)}% of baseline)`}</title>
              </rect>
              {hr.status === "crit" && (
                <text x={x + barW/2} y={y - 4} fontSize="11" textAnchor="middle" fill="#e94646" fontWeight="800">!</text>
              )}
            </g>
          );
        })}
        {/* baseline */}
        <line x1={padX} y1={baseY} x2={w - 4} y2={baseY} stroke="#4a5764" strokeWidth="1.5" strokeDasharray="4 4"/>
        <text x={w - 8} y={baseY - 4} fontSize="10" fill="#4a5764" textAnchor="end" fontWeight="700">baseline</text>
        {/* x axis labels — every 3 hours */}
        {hours.map((hr, i) => i % 3 === 0 && (
          <text key={"x-"+i} x={padX + i * (barW + gap) + barW/2} y={h - 8} fontSize="10" fill="#7a8794" textAnchor="middle">
            {String(hr.hour).padStart(2, '0')}:00
          </text>
        ))}
      </svg>
    </div>
  );
};
const GlobalParamsLibrary = () => {
  const params = AppData.globalParamSet.map(p => ({...p, usedIn: AppData.events.filter(e => true).length }));
  return (
    <div className="card__body">
      <div className="row gap-8 mb-12">
        <div style={{position:"relative", flex:1, maxWidth: 300}}>
          <input className="field__input" placeholder="Search global params…" style={{paddingLeft:32}}/>
          <Icon name="search" size={14} color="#7a8794" style={{position:"absolute", left:10, top:9}}/>
        </div>
        <button className="btn btn--primary"><Icon name="plus" size={14}/> Add global param</button>
      </div>
      <div style={{border:"1px solid var(--line-soft)", borderRadius:6, overflow:"hidden"}}>
        <div className="param-row" style={{background:"var(--bg)", fontSize:11.5, fontWeight:800, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:0.3, gridTemplateColumns:"200px 100px 70px 70px 1fr 100px"}}>
          <div>Name</div><div>Type</div><div>Req</div><div>Used in</div><div>Description</div><div></div>
        </div>
        {params.map(p => (
          <div key={p.name} className="param-row" style={{gridTemplateColumns:"200px 100px 70px 70px 1fr 100px"}}>
            <div className="param-row__name">{p.name}</div>
            <div className={`param-row__type t-${p.type}`}>{p.type}</div>
            <div className="param-row__req">{p.required ? "required" : ""}</div>
            <div className="dt-num"><b>{p.usedIn}</b></div>
            <div className="param-row__desc">{p.desc}</div>
            <div><button className="btn btn--sm btn--ghost">edit</button></div>
          </div>
        ))}
      </div>
    </div>
  );
};
