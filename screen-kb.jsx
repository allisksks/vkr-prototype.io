const kbTypeStyle = (type) => {
  const map = {
    experiment:        { bg: "#ece0fb", color: "#6d3aae" },
    research:          { bg: "#cfeaf2", color: "#1d8fb8" },
    case:              { bg: "#fde7d5", color: "#b5470d" },
    incident_report:   { bg: "#fbe2e2", color: "#c1393c" },
    playbook:          { bg: "#d8e7fa", color: "#1f4ea0" },
    decision_log:      { bg: "#fcecc7", color: "#8b6510" },
    metric_definition: { bg: "#dff3d2", color: "#2a7d34" },
  };
  return map[type] || map.experiment;
};

const kbTypeLabel = (type) => ({
  experiment: "EXPERIMENT", research: "RESEARCH", case: "CASE",
  incident_report: "INCIDENT", playbook: "PLAYBOOK",
  decision_log: "DECISION", metric_definition: "METRIC",
})[type] || type.toUpperCase();

const KBScreen = ({ navPayload, setNavPayload, kbItems, onNavigate }) => {
  const [view, setView] = useState((navPayload && navPayload.view) || "list");
  const [activeId, setActiveId] = useState((navPayload && navPayload.itemId) || null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState(null);

  useEffect(() => {
    if (navPayload && navPayload.itemId) {
      setActiveId(navPayload.itemId);
      setView("detail");
      setNavPayload(null);
    }
  }, [navPayload]);

  const filtered = kbItems
    .filter(i => typeFilter === "all" || i.type === typeFilter)
    .filter(i => !tagFilter || (i.tags || []).includes(tagFilter))
    .filter(i => {
      if (!search) return true;
      const q = search.toLowerCase();
      return i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q) || (i.tags || []).some(t => t.includes(q));
    });

  // Sort
  const [sort, setSort] = useState("date_desc");
  const sorted = [...filtered].sort((a,b) => {
    if (sort === "date_desc") return a.date < b.date ? 1 : -1;
    if (sort === "date_asc")  return a.date < b.date ? -1 : 1;
    if (sort === "views")     return (b.views || 0) - (a.views || 0);
    if (sort === "linked")    return (b.linked || 0) - (a.linked || 0);
    return 0;
  });

  const allTags = Array.from(new Set(kbItems.flatMap(i => i.tags || []))).sort();

  const active = kbItems.find(i => i.id === activeId);

  return (
    <div className="main main--sidebar">
      <ProjectSidebar/>
      <div className="page">
        <PageTitle
          crumbs={["Knowledge Base"]}
          title={view === "detail" && active ? active.title : "Institutional Memory"}
          q
          actions={view === "detail" ? [
            <button key="b" className="btn" onClick={() => setView("list")}>← Back to list</button>,
          ] : [
            <button key="n" className="btn"><Icon name="plus" size={14}/> New research</button>,
            <button key="e" className="btn btn--primary"><Icon name="download" size={14}/> Export</button>,
          ]}
        />

        {view === "list" && (
          <>
            <div className="card">
              <div className="toolbar-row" style={{padding:"14px 18px"}}>
                <div style={{position:"relative", flex:1, maxWidth:480}}>
                  <input
                    className="field__input"
                    placeholder="Search hypotheses, decisions, tags…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{paddingLeft:32, height:36}}
                  />
                  <Icon name="search" size={14} color="#7a8794" style={{position:"absolute", left:10, top:11}}/>
                </div>
                <select className="field__select" value={sort} onChange={e => setSort(e.target.value)} style={{width:180, height:36}}>
                  <option value="date_desc">Newest first</option>
                  <option value="date_asc">Oldest first</option>
                  <option value="views">Most viewed</option>
                  <option value="linked">Most linked</option>
                </select>
                <div className="row gap-4">
                  {[
                    {id:"all", label:"All", c: kbItems.length},
                    {id:"experiment", label:"A/B tests", c: kbItems.filter(i=>i.type==="experiment").length},
                    {id:"research", label:"Research", c: kbItems.filter(i=>i.type==="research").length},
                    {id:"incident_report", label:"Incidents", c: kbItems.filter(i=>i.type==="incident_report").length},
                    {id:"playbook", label:"Playbooks", c: kbItems.filter(i=>i.type==="playbook").length},
                    {id:"decision_log", label:"Decisions", c: kbItems.filter(i=>i.type==="decision_log").length},
                    {id:"metric_definition", label:"Metric defs", c: kbItems.filter(i=>i.type==="metric_definition").length},
                  ].map(f => (
                    <button key={f.id} className={"btn btn--sm " + (typeFilter === f.id ? "btn--primary" : "")} onClick={() => setTypeFilter(f.id)}>
                      {f.label} <span style={{opacity:0.7}}>({f.c})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag bar */}
              <div style={{padding:"4px 18px 14px 18px", borderBottom:"1px solid var(--line-soft)"}}>
                <div className="row gap-4 row--wrap" style={{gap:6}}>
                  <span className="muted tiny" style={{marginRight:6, fontWeight:700}}>TAGS:</span>
                  <span className={"tag" + (!tagFilter ? "" : " tag--ghost")} style={{cursor:"pointer"}} onClick={() => setTagFilter(null)}>all</span>
                  {allTags.map(t => (
                    <span
                      key={t}
                      className={"tag" + (tagFilter === t ? "" : " tag--ghost")}
                      style={{cursor:"pointer"}}
                      onClick={() => setTagFilter(t === tagFilter ? null : t)}
                    >#{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="dash-grid mt-12" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
              {sorted.map(item => {
                const proj = AppData.projectById(item.project);
                return (
                  <div key={item.id} className="kb-card" onClick={() => { setActiveId(item.id); setView("detail"); }}>
                    <div className="row gap-8" style={{alignItems:"center"}}>
                      <span className="kb-card__type" style={{
                        background: kbTypeStyle(item.type).bg,
                        color: kbTypeStyle(item.type).color,
                      }}>{kbTypeLabel(item.type)}</span>
                      {item.decision === "Accepted" && <Pill kind="ok">Accepted</Pill>}
                      {item.decision === "Rejected" && <Pill kind="crit">Rejected</Pill>}
                      <div style={{flex:1}}/>
                      <span className="muted tiny">{item.date}</span>
                    </div>
                    <h3 className="kb-card__title">{item.title}</h3>
                    <div className="kb-card__desc">{item.summary}</div>
                    <div className="kb-card__foot">
                      <span>{proj ? proj.name : "—"}</span>
                      <span>·</span>
                      <span>{item.author}</span>
                      <div style={{flex:1}}/>
                      <div className="tag-list">
                        {(item.tags || []).slice(0, 3).map(t => <span key={t} className="tag tag--ghost">#{t}</span>)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="empty" style={{gridColumn:"span 3"}}>
                  <div className="empty__face">🔎</div>
                  <div className="empty__title">No results match your search</div>
                </div>
              )}
            </div>
          </>
        )}

        {view === "detail" && active && <KBDetail item={active} allItems={kbItems} onOpen={(id) => setActiveId(id)} onNavigate={onNavigate}/>}
      </div>
    </div>
  );
};

const KBDetail = ({ item, allItems, onOpen, onNavigate }) => {
  const related = allItems
    .filter(i => i.id !== item.id)
    .filter(i => (i.tags || []).some(t => (item.tags || []).includes(t)))
    .slice(0, 4);
  const proj = AppData.projectById(item.project);

  return (
    <div className="split split--21">
      <div>
        <div className="card">
          <div className="card__body">
            <div className="row gap-8 mb-12">
              <span className="kb-card__type" style={{
                background: kbTypeStyle(item.type).bg,
                color: kbTypeStyle(item.type).color,
              }}>{kbTypeLabel(item.type)}</span>
              {item.decision === "Accepted" && <Pill kind="ok">Accepted</Pill>}
              {item.decision === "Rejected" && <Pill kind="crit">Rejected</Pill>}
              <span className="muted tiny">{item.date} · by {item.author}</span>
            </div>
            <div className="muted tiny" style={{fontWeight:700, textTransform:"uppercase", letterSpacing:0.4}}>Summary</div>
            <div style={{fontSize:14.5, marginTop:6, color:"var(--ink-2)"}}>{item.summary}</div>
          </div>
        </div>

        {item.type === "experiment" && item.refId && (() => {
          const exp = AppData.experiments.find(e => e.id === item.refId);
          if (!exp) return null;
          return (
            <div className="card">
              <div className="card__head"><div className="card__title">Experiment results</div>
                <button className="btn btn--sm btn--ghost" onClick={() => onNavigate("ab", { experimentId: exp.id, view: "results" })}>Open in A/B Splitter →</button>
              </div>
              <div className="card__body">
                <dl className="kv mb-12">
                  <dt>Hypothesis</dt><dd>{exp.hypothesis}</dd>
                  <dt>Primary metric</dt><dd>{exp.primaryMetric}</dd>
                  <dt>P(B&gt;A)</dt><dd>{exp.pValueOrPb != null ? (exp.pValueOrPb*100).toFixed(0) + "%" : "—"}</dd>
                  <dt>Lift</dt><dd style={{color: exp.lift && exp.lift.startsWith("-") ? "var(--status-crit)" : "var(--status-ok)", fontWeight:700}}>{exp.lift}</dd>
                  <dt>Owner / Decision</dt><dd>{exp.owner} · <b>{exp.decision || "—"}</b></dd>
                </dl>
                <table className="dt">
                  <thead><tr><th>Variant</th><th className="dt-num">Users</th><th className="dt-num">{exp.primaryMetric}</th></tr></thead>
                  <tbody>
                    {exp.variants.map(v => (
                      <tr key={v.id}><td><b>{v.id}</b> {v.name}</td><td className="dt-num">{v.users.toLocaleString()}</td><td className="dt-num">{v.metric}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        <div className="card">
          <div className="card__head"><div className="card__title">Decision & rationale</div></div>
          <div className="card__body" style={{lineHeight:1.6, fontSize:13.5, color:"var(--ink-2)"}}>
            {item.type === "experiment" ? (
              <>
                <p>Decision: <b style={{color: item.decision === "Accepted" ? "var(--status-ok)" : "var(--status-crit)"}}>{item.decision || "—"}</b></p>
                <p>The variant produced a measurable shift on the primary metric. The guardrails were reviewed and considered acceptable; the configuration was shipped to 100% of users in the following release.</p>
              </>
            ) : (
              <>
                <p>Key findings of this {item.type}. The analysis was driven by a Product Owner request and synthesises data across {proj ? proj.name : "the portfolio"}.</p>
                <p>The structured outputs feed back into the GQM tree for the corresponding strategic goal, and inform the experiment pipeline going forward.</p>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card__head"><div className="card__title">Comments · 2</div>
            <div className="row gap-4">
              <button className="btn btn--sm btn--ghost" title="Helpful">👍 14</button>
              <button className="btn btn--sm btn--ghost" title="Brilliant idea">💡 6</button>
              <button className="btn btn--sm btn--ghost" title="Questions">❓ 2</button>
            </div>
          </div>
          <div>
            <KBComment author="A. Volkova" when="2 days ago" text="Cross-checked the guardrails — purchase CR drop is within the historical band. Greenlit."/>
            <KBComment author="P. Orlov" when="yesterday" text="Tagged for future BP / starter pack price tests."/>
            <div style={{padding:12, borderTop:"1px solid var(--line-soft)"}}>
              <textarea className="field__textarea" placeholder="Leave a comment…" rows={2}/>
              <div className="row row--end mt-8"><button className="btn btn--primary btn--sm">Post comment</button></div>
            </div>
          </div>
        </div>
      </div>

      <div className="col gap-12">
        <div className="card">
          <div className="card__head"><div className="card__title">Metadata</div></div>
          <div className="card__body">
            <dl className="kv">
              <dt>Project</dt><dd>{proj ? proj.name : "—"}</dd>
              <dt>Author</dt><dd>{item.author}</dd>
              <dt>Date</dt><dd>{item.date}</dd>
              <dt>Type</dt><dd>{kbTypeLabel(item.type)}</dd>
              {item.decision && <><dt>Decision</dt><dd>{item.decision}</dd></>}
              {item.refId && <><dt>Linked AB</dt><dd className="dt-mono">{item.refId}</dd></>}
              {item.views   && <><dt>Views (30d)</dt><dd>{item.views}</dd></>}
              {item.linked  && <><dt>Backlinks</dt><dd>{item.linked} pages</dd></>}
            </dl>
            <div className="divider"></div>
            <div className="col gap-8">
              <button className="btn btn--sm"><Icon name="download" size={12}/> Export to .docx</button>
              <button className="btn btn--sm"><Icon name="chart-line" size={12}/> Embed in BI dashboard</button>
              <button className="btn btn--sm"><Icon name="copy" size={12}/> Copy permalink</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__head"><div className="card__title">Tags</div></div>
          <div className="card__body">
            <div className="tag-list">
              {(item.tags || []).map(t => <span key={t} className="tag">#{t}</span>)}
              <button className="btn btn--sm btn--ghost"><Icon name="plus" size={12}/> add tag</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__head"><div className="card__title">Related</div></div>
          <div>
            {related.length === 0 && <div className="empty" style={{padding:20}}><div className="muted tiny">No related items</div></div>}
            {related.map(r => (
              <div key={r.id}
                style={{padding:"10px 14px", borderBottom:"1px solid var(--line-soft)", cursor:"pointer"}}
                onClick={() => onOpen(r.id)}
              >
                <div style={{fontWeight:700, fontSize:13}}>{r.title}</div>
                <div className="tiny muted" style={{marginTop:2}}>
                  {r.type} · {r.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const KBComment = ({ author, when, text }) => (
  <div style={{padding:"12px 14px", borderBottom:"1px solid var(--line-soft)", display:"flex", gap:10, alignItems:"flex-start"}}>
    <div style={{width:30, height:30, borderRadius:"50%", background:"var(--brand-light)", color:"var(--brand)", display:"grid", placeItems:"center", fontWeight:800, fontSize:12, flexShrink:0}}>
      {author.split(" ").map(s => s[0]).join("")}
    </div>
    <div style={{flex:1}}>
      <div className="row gap-8" style={{alignItems:"baseline"}}>
        <b style={{fontSize:13}}>{author}</b>
        <span className="muted tiny">{when}</span>
      </div>
      <div style={{fontSize:13, color:"var(--ink-2)", marginTop:2}}>{text}</div>
    </div>
  </div>
);

window.KBScreen = KBScreen;
