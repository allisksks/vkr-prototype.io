/* BI reports — AB Analysis (Block 1A) & Cohort Compare (Block 1B) */

// ====================================================================
// AB ANALYSIS REPORT
// ====================================================================
const ABAnalysisReport = ({ project, onNavigate }) => {
  const D = AppData.abAnalysisData;
  const exp = AppData.experiments.find(e => e.id === D.experimentId);
  const [section, setSection] = useState("overview"); // tab-like internal nav
  const [filters, setFilters] = useState({
    os: "All",
    startDate: "2026-05-04",
    endDate: "2026-05-21",
    versions: "",
    sources: ["organic", "applovin_int", "mintegral_int"],
    lifetime: 9,
    control: "base",
    test: ["on"],
  });
  const [computing, setComputing] = useState(false);

  return (
    <div>
      {/* Filter block */}
      <div className="card">
        <div className="card__head">
          <div className="card__title">
            <Icon name="filter" size={16} color="#6d3aae"/>
            AB Analysis · <span className="dt-mono">{exp ? exp.id : D.experimentId}</span>
          </div>
          <div className="row gap-8">
            <button className="btn btn--sm" onClick={() => onNavigate("ab", { experimentId: D.experimentId, view: "results" })}>
              <Icon name="flask" size={12}/> Open in A/B Splitter
            </button>
            <button className="btn btn--sm"><Icon name="book" size={12}/> Save section to KB</button>
            <button className="btn btn--sm"><Icon name="download" size={12}/> CSV</button>
          </div>
        </div>
        <div className="card__body">
          <div className="row gap-12 row--wrap">
            <div className="field" style={{minWidth:130}}>
              <div className="field__label">OS</div>
              <select className="field__select" value={filters.os} onChange={e => setFilters({...filters, os: e.target.value})}>
                <option>All</option><option>iOS</option><option>Android</option>
              </select>
            </div>
            <div className="field" style={{minWidth:170}}>
              <div className="field__label">Start date</div>
              <input className="field__input" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})}/>
            </div>
            <div className="field" style={{minWidth:170}}>
              <div className="field__label">End date</div>
              <input className="field__input" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})}/>
            </div>
            <div className="field" style={{minWidth:140}}>
              <div className="field__label">Versions</div>
              <input className="field__input" placeholder="11.4.1, 11.5.0" value={filters.versions} onChange={e => setFilters({...filters, versions: e.target.value})}/>
            </div>
            <div className="field" style={{flex:2, minWidth:280}}>
              <div className="field__label">Sources</div>
              <div className="filter-row__chips" style={{minHeight:32}}>
                {filters.sources.map(s => (
                  <Chip key={s} onRemove={() => setFilters({...filters, sources: filters.sources.filter(x=>x!==s)})}>{s}</Chip>
                ))}
                <button className="btn btn--sm btn--ghost"><Icon name="plus" size={10}/> add</button>
              </div>
            </div>
            <div className="field" style={{minWidth:80}}>
              <div className="field__label">Lifetime (d)</div>
              <input className="field__input" value={filters.lifetime} onChange={e => setFilters({...filters, lifetime: e.target.value})}/>
            </div>
            <div className="field" style={{minWidth:160}}>
              <div className="field__label">Countries</div>
              <div className="row gap-8">
                <label className="row gap-4 tiny"><input type="radio" name="cc" defaultChecked/> Include</label>
                <label className="row gap-4 tiny"><input type="radio" name="cc"/> Exclude</label>
              </div>
            </div>
            <div className="field" style={{minWidth:130}}>
              <div className="field__label">Control group</div>
              <select className="field__select" value={filters.control} onChange={e => setFilters({...filters, control: e.target.value})}>
                <option value="base">base</option>
              </select>
            </div>
            <div className="field" style={{minWidth:130}}>
              <div className="field__label">Test groups</div>
              <select className="field__select" value={filters.test[0]} onChange={e => setFilters({...filters, test: [e.target.value]})}>
                <option value="on">on</option>
              </select>
            </div>
            <div className="col" style={{justifyContent:"flex-end"}}>
              <div className="field__label">&nbsp;</div>
              <button className="btn btn--primary" onClick={() => { setComputing(true); setTimeout(() => setComputing(false), 600); }}>
                {computing ? "Computing…" : "Apply"}
              </button>
            </div>
          </div>
          <div className="muted tiny mt-12">For the cohort, <b>{filters.lifetime}</b> days of life are available. Metrics computed over {filters.lifetime} days.</div>
        </div>
      </div>

      {/* Section selector */}
      <div className="bi-dash-tabs" style={{marginTop:8}}>
        {[
          {id:"overview", label:"Groups"},
          {id:"tutorial", label:"Tutorial Funnel"},
          {id:"levels",   label:"Level Stats"},
          {id:"battles",  label:"Battles"},
          {id:"chests",   label:"Chests"},
          {id:"missions", label:"Daily Missions"},
          {id:"upgrades", label:"Upgrades"},
          {id:"tanks",    label:"Tanks"},
          {id:"economy",  label:"Soft & Hard"},
        ].map(t => (
          <button key={t.id} className={"bi-dash-tab" + (section === t.id ? " is-active" : "")} onClick={() => setSection(t.id)}>{t.label}</button>
        ))}
      </div>

      {section === "overview" && <ABA_Groups D={D}/>}
      {section === "tutorial" && <ABA_Tutorial D={D}/>}
      {section === "levels"   && <ABA_Levels D={D}/>}
      {section === "battles"  && <ABA_Battles D={D}/>}
      {section === "chests"   && <ABA_Chests D={D}/>}
      {section === "missions" && <ABA_Missions D={D}/>}
      {section === "upgrades" && <ABA_Upgrades D={D}/>}
      {section === "tanks"    && <ABA_Tanks D={D}/>}
      {section === "economy"  && <ABA_Economy D={D}/>}
    </div>
  );
};

const ABA_Groups = ({ D }) => (
  <div className="card">
    <div className="card__head"><div className="card__title">Test groups</div></div>
    <table className="dt">
      <thead><tr><th>Experiment</th><th>Group</th><th className="dt-num">Users</th><th>Status</th></tr></thead>
      <tbody>
        {D.groups.map((g,i) => (
          <tr key={i}><td className="dt-mono">{g.name}</td><td><b>{g.group}</b></td><td className="dt-num">{g.users.toLocaleString()}</td><td><Pill kind={g.status === "RUNNING" ? "info" : "ok"}>{g.status}</Pill></td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ABA_Tutorial = ({ D }) => (
  <>
    <div className="card">
      <div className="card__head"><div className="card__title">Tutorial funnel · % users reaching step</div></div>
      <div className="card__body">
        <BarChart
          seed="aba-tut"
          labels={D.tutorialFunnel.map(s => s.step.length > 9 ? s.step.slice(0, 9) + "…" : s.step)}
          series={[
            { label: "base", values: D.tutorialFunnel.map(s => s.base) },
            { label: "on",   values: D.tutorialFunnel.map(s => s.on) },
          ]}
          palette={["#6c91dc", "#43c08a"]}
          height={220}
        />
      </div>
    </div>
    <div className="card">
      <div className="card__head"><div className="card__title">Funnel data</div></div>
      <table className="dt">
        <thead><tr><th>step_name</th><th className="dt-num">base %</th><th className="dt-num">on %</th><th className="dt-num">Δ</th></tr></thead>
        <tbody>
          {D.tutorialFunnel.map((s,i) => (
            <tr key={i}>
              <td className="dt-mono">{s.step}</td>
              <td className="dt-num">{s.base.toFixed(2)}</td>
              <td className="dt-num">{s.on.toFixed(2)}</td>
              <td className="dt-num" style={{color: (s.on - s.base) < 0 ? "var(--status-crit)" : "var(--status-ok)", fontWeight:700}}>{(s.on - s.base).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const ABA_Levels = ({ D }) => {
  const [tab, setTab] = useState("funnels");
  return (
    <>
      <div className="card">
        <div className="card__head">
          <div className="card__title">Level statistics</div>
          <div className="row gap-4">
            <button className={"btn btn--sm " + (tab === "funnels" ? "btn--primary":"")} onClick={() => setTab("funnels")}>Funnels & WR</button>
            <button className={"btn btn--sm " + (tab === "dropoffs" ? "btn--primary":"")} onClick={() => setTab("dropoffs")}>Drop-offs</button>
            <button className={"btn btn--sm " + (tab === "time" ? "btn--primary":"")} onClick={() => setTab("time")}>Time to complete</button>
          </div>
        </div>
      </div>

      {tab === "funnels" && (
        <>
          <div className="card">
            <div className="card__head"><div className="card__title">Win-rate by level</div></div>
            <div className="card__body">
              <BarChart
                seed="aba-wr"
                labels={D.winrate.map(r => "L" + r.level)}
                series={[
                  { label:"base WR%", values: D.winrate.map(r => r.wr_b) },
                  { label:"on WR%",    values: D.winrate.map(r => r.wr_o) },
                ]}
                palette={["#6c91dc","#43c08a"]}
                height={220}
              />
            </div>
            <table className="dt">
              <thead><tr><th>Level</th><th className="dt-num">Finishes (base)</th><th className="dt-num">Wins (base)</th><th className="dt-num">WR base</th><th className="dt-num">Finishes (on)</th><th className="dt-num">Wins (on)</th><th className="dt-num">WR on</th></tr></thead>
              <tbody>
                {D.winrate.map((r,i) => (
                  <tr key={i}>
                    <td><b>L{r.level}</b></td>
                    <td className="dt-num">{r.finishes_b.toLocaleString()}</td>
                    <td className="dt-num">{r.wins_b.toLocaleString()}</td>
                    <td className="dt-num">{r.wr_b.toFixed(2)}%</td>
                    <td className="dt-num">{r.finishes_o.toLocaleString()}</td>
                    <td className="dt-num">{r.wins_o.toLocaleString()}</td>
                    <td className="dt-num" style={{color: r.wr_o > r.wr_b ? "var(--status-ok)" : "var(--status-crit)", fontWeight:700}}>{r.wr_o.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "dropoffs" && (
        <>
          {["betweenStarts","betweenFinishes","insideLevel","betweenLevels"].map(key => {
            const labels = {
              betweenStarts: "Drop-off between starts %",
              betweenFinishes: "Drop-off between finishes %",
              insideLevel: "Drop-off inside level (technical / rage-quit) %",
              betweenLevels: "Drop-off between levels (retention) %",
            };
            const data = D.dropoff[key];
            return (
              <div className="card" key={key}>
                <div className="card__head"><div className="card__title">{labels[key]}</div></div>
                <div className="card__body">
                  <BarChart
                    seed={"dr-"+key}
                    labels={data.map((_,i) => "L"+(i+1))}
                    series={[{label:"% drop", values: data.map(v => -v)}]}
                    palette={["#e07a3a"]}
                    height={180}
                  />
                  <details className="mt-12">
                    <summary style={{cursor:"pointer", fontWeight:700, color:"var(--brand)"}}>Explanation</summary>
                    <div className="muted tiny mt-8">Computed as (users at level N+1) / (users at level N) − 1. Higher absolute value = sharper drop-off. Anomalies can indicate balance issues, missing tutorial steps, or paywalls. Investigate spikes alongside crash logs and the previous version baseline.</div>
                  </details>
                </div>
              </div>
            );
          })}
        </>
      )}

      {tab === "time" && (
        <div className="card">
          <div className="card__head"><div className="card__title">Avg & median time per battle (s)</div></div>
          <div className="card__body">
            <LineChart
              seed="aba-time"
              series={[
                { label: "base avg",    values: Array.from({length: 30}, (_,i) => 130 + i*1.5 + (i % 5)*3) },
                { label: "base median", values: Array.from({length: 30}, (_,i) => 120 + i*1.5 + (i % 4)*2) },
                { label: "on avg",      values: Array.from({length: 30}, (_,i) => 128 + i*1.6 + (i % 5)*3) },
                { label: "on median",   values: Array.from({length: 30}, (_,i) => 118 + i*1.6 + (i % 4)*2) },
              ]}
              palette={["#6c91dc","#a4b8d9","#43c08a","#a3d7c0"]}
              height={240}
            />
          </div>
        </div>
      )}
    </>
  );
};

const ABA_Battles = ({ D }) => (
  <>
    <div className="card">
      <div className="card__head">
        <div className="card__title">Battles per DAU & win-rate by lifetime</div>
        <div className="row gap-4">
          <label className="row gap-4 tiny"><input type="radio" name="mt" defaultChecked/> all</label>
          <label className="row gap-4 tiny"><input type="radio" name="mt"/> vs_bot</label>
          <label className="row gap-4 tiny"><input type="radio" name="mt"/> pvp</label>
        </div>
      </div>
      <div className="card__body">
        <LineChart
          seed="aba-bat"
          series={[
            { label: "starts/DAU base", values: D.battles.map(b => b.sp_b) },
            { label: "starts/DAU on",   values: D.battles.map(b => b.sp_o) },
            { label: "WR base",         values: D.battles.map(b => b.wr_b / 10) },
            { label: "WR on",           values: D.battles.map(b => b.wr_o / 10) },
          ]}
          palette={["#6c91dc","#43c08a","#a4b8d9","#a3d7c0"]}
          height={220}
        />
      </div>
      <table className="dt">
        <thead><tr><th>lifetime</th><th className="dt-num">starts / DAU (base)</th><th className="dt-num">starts / DAU (on)</th><th className="dt-num">WR base</th><th className="dt-num">WR on</th></tr></thead>
        <tbody>
          {D.battles.map((b,i) => (
            <tr key={i}><td><b>D{b.lt}</b></td><td className="dt-num">{b.sp_b.toFixed(2)}</td><td className="dt-num" style={{color: b.sp_o < b.sp_b ? "var(--status-crit)" : "var(--status-ok)"}}>{b.sp_o.toFixed(2)}</td><td className="dt-num">{b.wr_b.toFixed(2)}%</td><td className="dt-num">{b.wr_o.toFixed(2)}%</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const ABA_Chests = ({ D }) => (
  <>
    <div className="card">
      <div className="card__head"><div className="card__title">% users who opened Nth free chest by lifetime</div></div>
      <div className="card__body">
        <LineChart
          seed="aba-chests"
          series={[
            { label: "base", values: D.chests.map(c => c.base) },
            { label: "on",   values: D.chests.map(c => c.on) },
          ]}
          palette={["#6c91dc","#43c08a"]}
          height={200}
        />
      </div>
      <table className="dt">
        <thead><tr><th>lifetime</th><th>chest</th><th className="dt-num">% base</th><th className="dt-num">% on</th></tr></thead>
        <tbody>
          {D.chests.map((c,i) => (
            <tr key={i}><td><b>D{c.lt}</b></td><td className="dt-mono">{c.ch}</td><td className="dt-num">{c.base.toFixed(2)}</td><td className="dt-num">{c.on.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="card">
      <div className="card__head"><div className="card__title">Chest opens per DAU by type</div></div>
      <table className="dt">
        <thead><tr><th>lifetime</th><th>chest</th><th className="dt-num">base</th><th className="dt-num">on</th></tr></thead>
        <tbody>
          {D.chestOpens.map((c,i) => (
            <tr key={i}><td><b>D{c.lt}</b></td><td className="dt-mono">{c.chest}</td><td className="dt-num">{c.base.toFixed(2)}</td><td className="dt-num">{c.on.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const ABA_Missions = ({ D }) => (
  <div className="card">
    <div className="card__head"><div className="card__title">Daily Missions · receive → complete conversion</div></div>
    <table className="dt">
      <thead><tr><th>quest_name</th><th className="dt-num">% received (base)</th><th className="dt-num">% received (on)</th><th className="dt-num">conv. complete base</th><th className="dt-num">conv. complete on</th></tr></thead>
      <tbody>
        {D.dailyMissions.map((q,i) => (
          <tr key={i}>
            <td className="dt-mono">{q.quest}</td>
            <td className="dt-num">{q.share_b.toFixed(2)}%</td>
            <td className="dt-num">{q.share_o.toFixed(2)}%</td>
            <td className="dt-num">{q.conv_b.toFixed(1)}%</td>
            <td className="dt-num" style={{color: q.conv_o < q.conv_b ? "var(--status-crit)" : "var(--status-ok)", fontWeight:700}}>{q.conv_o.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ABA_Upgrades = ({ D }) => (
  <div className="card">
    <div className="card__head"><div className="card__title">Upgrades per DAU by category</div></div>
    <div className="card__body">
      <BarChart
        seed="aba-upg"
        labels={D.upgrades.map(u => `D${u.lt} · ${u.cat}`)}
        series={[
          { label: "base", values: D.upgrades.map(u => u.base) },
          { label: "on",   values: D.upgrades.map(u => u.on)   },
        ]}
        palette={["#6c91dc","#43c08a"]}
        height={200}
      />
    </div>
    <table className="dt">
      <thead><tr><th>lifetime</th><th>category</th><th className="dt-num">base</th><th className="dt-num">on</th></tr></thead>
      <tbody>
        {D.upgrades.map((u,i) => <tr key={i}><td><b>D{u.lt}</b></td><td>{u.cat}</td><td className="dt-num">{u.base.toFixed(2)}</td><td className="dt-num">{u.on.toFixed(2)}</td></tr>)}
      </tbody>
    </table>
  </div>
);

const ABA_Tanks = ({ D }) => (
  <>
    <div className="card">
      <div className="card__head"><div className="card__title">Tanks purchased per battle (cumulative)</div></div>
      <div className="card__body">
        <LineChart
          seed="aba-tnk"
          series={[{ label: "avg_purchased", values: D.tanksPerBattle.map(t => t.avg_purchased) }]}
          palette={["#e07a3a"]}
          height={200}
        />
      </div>
    </div>
    <div className="card">
      <div className="card__head"><div className="card__title">Top tank by level</div></div>
      <table className="dt">
        <thead><tr><th>Level range</th><th>Top tank base</th><th>Top tank on</th><th>Change</th></tr></thead>
        <tbody>
          {D.topTankByLevel.map((r,i) => (
            <tr key={i}>
              <td><b>{r.range}</b></td>
              <td className="dt-mono">{r.base}</td>
              <td className="dt-mono">{r.on}</td>
              <td>{r.base === r.on ? <Pill kind="ok">no change</Pill> : <Pill kind="warn">shift</Pill>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const ABA_Economy = ({ D }) => (
  <>
    <div className="card">
      <div className="card__head"><div className="card__title">Soft currency balance · per battle</div></div>
      <div className="card__body">
        <LineChart
          seed="aba-soft"
          series={[
            { label: "base", values: D.softHardBalance.soft.map(s => s.base) },
            { label: "on",   values: D.softHardBalance.soft.map(s => s.on) },
          ]}
          palette={["#6c91dc","#43c08a"]}
          height={200}
        />
      </div>
    </div>
    <div className="card">
      <div className="card__head"><div className="card__title">Hard currency balance · per battle</div></div>
      <div className="card__body">
        <LineChart
          seed="aba-hard"
          series={[
            { label: "base", values: D.softHardBalance.hard.map(s => s.base) },
            { label: "on",   values: D.softHardBalance.hard.map(s => s.on) },
          ]}
          palette={["#6c91dc","#43c08a"]}
          height={200}
        />
      </div>
    </div>
    <div className="card">
      <div className="card__head"><div className="card__title">Hard currency spend mix</div></div>
      <table className="dt">
        <thead><tr><th>Item</th><th className="dt-num">buy conv % base</th><th className="dt-num">buy conv % on</th><th className="dt-num">cnt / user</th></tr></thead>
        <tbody>
          {D.hardSpend.map((s,i) => (
            <tr key={i}><td className="dt-mono">{s.item}</td><td className="dt-num">{s.buy_b.toFixed(2)}</td><td className="dt-num" style={{color: s.buy_o > s.buy_b ? "var(--status-ok)" : "var(--status-crit)"}}>{s.buy_o.toFixed(2)}</td><td className="dt-num">{s.cnt.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="card">
      <div className="card__head"><div className="card__title">Conversion into revive use</div></div>
      <table className="dt">
        <thead><tr><th>Level</th><th className="dt-num">revive for hard (base)</th><th className="dt-num">revive for hard (on)</th><th className="dt-num">free revive</th></tr></thead>
        <tbody>
          {D.reviveConv.map((r,i) => (
            <tr key={i}><td><b>{r.level}</b></td><td className="dt-num">{r.b.toFixed(2)}%</td><td className="dt-num">{r.o.toFixed(2)}%</td><td className="dt-num">{r.free.toFixed(2)}%</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// ====================================================================
// COHORT COMPARE REPORT
// ====================================================================
const CohortCompareReport = ({ project, addToast, onNavigate }) => {
  const D = AppData.cohortCompareData;
  const [section, setSection] = useState("retention");
  const [c1, setC1] = useState(D.cohorts.c1);
  const [c2, setC2] = useState(D.cohorts.c2);

  return (
    <div>
      {/* Filter block */}
      <div className="card">
        <div className="card__head">
          <div className="card__title"><Icon name="filter" size={16} color="#6d3aae"/> Cohort Compare</div>
          <div className="row gap-8">
            <button className="btn btn--sm" onClick={() => { const t = c1; setC1(c2); setC2(t); addToast("Cohorts swapped"); }}>⇄ Swap cohorts</button>
            <button className="btn btn--sm"><Icon name="save" size={12}/> Save as comparison</button>
          </div>
        </div>
        <div className="card__body">
          <div className="row gap-16" style={{alignItems:"flex-start"}}>
            <CohortParams title={`Cohort 1 · ${c1.name}`} cohort={c1} onChange={setC1}/>
            <CohortParams title={`Cohort 2 · ${c2.name}`} cohort={c2} onChange={setC2}/>
          </div>
          <div className="row gap-12 mt-12" style={{background:"var(--brand-tint)", padding:"10px 14px", borderRadius:6, fontSize:12.5}}>
            <div style={{flex:1}}>Cohort 1: {c1.daysAvailable} days available. Excluded: {c1.excluded.toLocaleString()} users (cheaters / AB groups / unmatched).</div>
            <div style={{flex:1}}>Cohort 2: {c2.daysAvailable} days available. Excluded: {c2.excluded.toLocaleString()} users.</div>
          </div>
        </div>
        <div className="card__body" style={{borderTop:"1px solid var(--line-soft)"}}>
          <div className="field__label" style={{marginBottom:6}}>Source distribution</div>
          <table className="dt">
            <thead><tr><th>source</th><th className="dt-num">installs 1</th><th className="dt-num">% 1</th><th className="dt-num">installs 2</th><th className="dt-num">% 2</th></tr></thead>
            <tbody>
              {D.sources.map((s,i) => (
                <tr key={i}><td className="dt-mono">{s.source}</td><td className="dt-num">{s.i1.toLocaleString()}</td><td className="dt-num">{s.p1.toFixed(2)}%</td><td className="dt-num">{s.i2.toLocaleString()}</td><td className="dt-num">{s.p2.toFixed(2)}%</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary card */}
      <div className="recommend-banner">
        <div className="recommend-banner__icon">2</div>
        <div>
          <div>Cohort 2 is better on <b>13 of 16</b> measured metrics</div>
          <div className="tiny" style={{fontWeight:600, opacity:0.85}}>Retention, LTV total, Inapps, and Ads all show statistically-significant uplifts.</div>
        </div>
      </div>

      <div className="bi-dash-tabs">
        {[
          {id:"retention", label:"Retention"},
          {id:"ltv",       label:"LTV Total"},
          {id:"funnel",    label:"Tech Funnel"},
          {id:"ads",       label:"Ads"},
          {id:"inapps",    label:"In-Apps"},
          {id:"subs",      label:"Subscriptions"},
          {id:"levels",    label:"Levels Funnel"},
        ].map(t => (
          <button key={t.id} className={"bi-dash-tab" + (section === t.id ? " is-active" : "")} onClick={() => setSection(t.id)}>{t.label}</button>
        ))}
      </div>

      {section === "retention" && <CC_Retention D={D}/>}
      {section === "ltv"       && <CC_LTV D={D}/>}
      {section === "funnel"    && <CC_Funnel D={D}/>}
      {section === "ads"       && <CC_Ads D={D}/>}
      {section === "inapps"    && <CC_Inapps D={D}/>}
      {section === "subs"      && <CC_Subs D={D}/>}
      {section === "levels"    && <CC_Levels D={D}/>}
    </div>
  );
};

const CohortParams = ({ title, cohort, onChange }) => (
  <div style={{flex:1, border:"1px solid var(--line)", borderRadius:6, padding:12, background:"var(--brand-tint)"}}>
    <div style={{fontWeight:800, color:"var(--accent-teal)", marginBottom:10}}>{title}</div>
    <div className="row gap-8 mb-8">
      <div className="field" style={{flex:1}}>
        <div className="field__label">OS</div>
        <select className="field__select"><option>All</option><option>iOS</option><option>Android</option></select>
      </div>
      <div className="field" style={{flex:1}}>
        <div className="field__label">Lifetime (d)</div>
        <input className="field__input" defaultValue={cohort.daysAvailable}/>
      </div>
    </div>
    <div className="row gap-8 mb-8">
      <div className="field" style={{flex:1}}>
        <div className="field__label">Start</div>
        <input className="field__input" defaultValue={cohort.startDate}/>
      </div>
      <div className="field" style={{flex:1}}>
        <div className="field__label">End</div>
        <input className="field__input" defaultValue={cohort.endDate}/>
      </div>
    </div>
    <div className="field mb-8">
      <div className="field__label">Versions</div>
      <input className="field__input" defaultValue={cohort.name}/>
    </div>
    <div className="row gap-8">
      <div className="field" style={{flex:1}}>
        <div className="field__label">Cheater filter</div>
        <div className="row gap-8 tiny">
          <label className="row gap-4"><input type="radio" name={"ch"+title} defaultChecked/> Yes</label>
          <label className="row gap-4"><input type="radio" name={"ch"+title}/> No <span className="muted">(slow)</span></label>
        </div>
      </div>
      <div className="field" style={{flex:1}}>
        <div className="field__label">Exclude AB groups</div>
        <input className="field__input" placeholder="ab_groups, comma"/>
      </div>
    </div>
  </div>
);

const sigBadge = (sig, dir = "win") => {
  if (sig === "win")  return <Pill kind="ok">Cohort 2 better</Pill>;
  if (sig === "lose") return <Pill kind="crit">Cohort 1 better</Pill>;
  return <Pill kind="draft">Not significant</Pill>;
};
const probBadge = (prob) => {
  if (prob >= 95) return <Pill kind="ok">Cohort 2 better</Pill>;
  if (prob < 50)  return <Pill kind="crit">Cohort 1 better</Pill>;
  return <Pill kind="draft">Not significant</Pill>;
};

const CC_Retention = ({ D }) => (
  <>
    <div className="card">
      <div className="card__head"><div className="card__title">Retention by lifetime</div></div>
      <div className="card__body">
        <LineChart
          seed="cc-ret"
          series={[
            { label: "cohort 1", values: D.retention.map(r => r.p1) },
            { label: "cohort 2", values: D.retention.map(r => r.p2) },
          ]}
          palette={["#a0a8b5","#2A6BE0"]}
          height={220}
        />
      </div>
      <table className="dt">
        <thead><tr><th>lifetime</th><th className="dt-num">cohort 1</th><th className="dt-num">cohort 2</th><th className="dt-num">P(2 &gt; 1) %</th><th className="dt-num">missed opportunity</th><th>Verdict</th></tr></thead>
        <tbody>
          {D.retention.map((r,i) => (
            <tr key={i}>
              <td><b>D{r.lt}</b></td>
              <td className="dt-num">{r.p1.toFixed(2)}% ({r.n1.toLocaleString()})</td>
              <td className="dt-num">{r.p2.toFixed(2)}% ({r.n2.toLocaleString()})</td>
              <td className="dt-num" style={{fontWeight:700, color: r.prob >= 95 ? "var(--status-ok)" : r.prob < 50 ? "var(--status-crit)" : "var(--ink-3)"}}>{r.prob.toFixed(2)}%</td>
              <td className="dt-num">{r.lost.toFixed(2)}%</td>
              <td>{probBadge(r.prob)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const CC_LTV = ({ D }) => (
  <div className="card">
    <div className="card__head"><div className="card__title">LTV Total</div></div>
    <div className="card__body">
      <LineChart seed="cc-ltv" series={[
        { label: "cohort 1", values: D.ltvTotal.map(r => r.v1) },
        { label: "cohort 2", values: D.ltvTotal.map(r => r.v2) },
      ]} palette={["#a0a8b5","#2A6BE0"]} height={220}/>
    </div>
    <table className="dt">
      <thead><tr><th>lifetime</th><th className="dt-num">cohort 1</th><th className="dt-num">cohort 2</th><th>Verdict</th></tr></thead>
      <tbody>
        {D.ltvTotal.map((r,i) => (
          <tr key={i}><td><b>D{r.lt}</b></td><td className="dt-num">${r.v1.toFixed(3)}</td><td className="dt-num">${r.v2.toFixed(3)}</td><td>{sigBadge(r.sig)}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CC_Funnel = ({ D }) => (
  <div className="card">
    <div className="card__head"><div className="card__title">Technical loading funnel</div></div>
    <table className="dt">
      <thead><tr><th>step</th><th className="dt-num">% installs c1</th><th className="dt-num">% installs c2</th><th className="dt-num">uniques c1</th></tr></thead>
      <tbody>
        {D.funnelLoad.map((s,i) => (
          <tr key={i}><td className="dt-mono">{s.step}</td><td className="dt-num">{s.p1.toFixed(2)}%</td><td className="dt-num" style={{color: s.p2 > s.p1 ? "var(--status-ok)" : "var(--status-crit)", fontWeight:700}}>{s.p2.toFixed(2)}%</td><td className="dt-num">{s.n1.toLocaleString()}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CC_Ads = ({ D }) => {
  const [adTab, setAdTab] = useState("ltv");
  return (
    <>
      <div className="card">
        <div className="card__head">
          <div className="card__title">Advertising</div>
          <div className="row gap-4">
            {[["ltv","LTV Ads"],["ecpm","eCPM"],["inter","Inter views"],["reward","Reward views"],["plc","Placements"],["av","Availability"]].map(([id,lab]) => (
              <button key={id} className={"btn btn--sm " + (adTab === id ? "btn--primary":"")} onClick={() => setAdTab(id)}>{lab}</button>
            ))}
          </div>
        </div>
      </div>

      {adTab === "ltv" && (
        <div className="card">
          <div className="card__head"><div className="card__title">LTV Ads</div></div>
          <div className="card__body">
            <LineChart seed="cc-ltvad" series={[
              { label:"c1", values: D.ads.ltvAds.map(r => r.v1) },
              { label:"c2", values: D.ads.ltvAds.map(r => r.v2) },
            ]} palette={["#a0a8b5","#2A6BE0"]} height={200}/>
          </div>
          <table className="dt">
            <thead><tr><th>lifetime</th><th className="dt-num">c1</th><th className="dt-num">c2</th><th>Verdict</th></tr></thead>
            <tbody>
              {D.ads.ltvAds.map((r,i) => <tr key={i}><td>D{r.lt}</td><td className="dt-num">${r.v1.toFixed(3)}</td><td className="dt-num">${r.v2.toFixed(3)}</td><td>{sigBadge(r.sig)}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {adTab === "ecpm" && (
        <div className="card">
          <div className="card__head"><div className="card__title">eCPM by format</div></div>
          <table className="dt">
            <thead><tr><th>ad_format</th><th className="dt-num">cohort 1</th><th className="dt-num">cohort 2</th></tr></thead>
            <tbody>
              {D.ads.ecpm.map((r,i) => <tr key={i}><td><b>{r.format}</b></td><td className="dt-num">${r.v1.toFixed(2)}</td><td className="dt-num">${r.v2.toFixed(2)}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {adTab === "inter" && (
        <div className="card">
          <div className="card__head"><div className="card__title">Interstitial views per install by lifetime</div></div>
          <table className="dt">
            <thead><tr><th>lifetime</th><th className="dt-num">c1</th><th className="dt-num">c2</th><th>Verdict</th></tr></thead>
            <tbody>{D.ads.interByLT.map((r,i) => <tr key={i}><td>D{r.lt}</td><td className="dt-num">{r.v1.toFixed(2)}</td><td className="dt-num">{r.v2.toFixed(2)}</td><td>{sigBadge(r.sig)}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {adTab === "reward" && (
        <div className="card">
          <div className="card__head"><div className="card__title">Rewarded views per install by lifetime</div></div>
          <table className="dt">
            <thead><tr><th>lifetime</th><th className="dt-num">c1</th><th className="dt-num">c2</th><th>Verdict</th></tr></thead>
            <tbody>{D.ads.rewardByLT.map((r,i) => <tr key={i}><td>D{r.lt}</td><td className="dt-num">{r.v1.toFixed(2)}</td><td className="dt-num">{r.v2.toFixed(2)}</td><td>{sigBadge(r.sig)}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {adTab === "plc" && (
        <div className="card">
          <div className="card__head"><div className="card__title">Placements</div></div>
          <table className="dt">
            <thead><tr><th>format</th><th>place</th><th className="dt-num">views/install c1</th><th className="dt-num">views/install c2</th><th className="dt-num">conv % c1</th></tr></thead>
            <tbody>
              {D.ads.placements.map((p,i) => <tr key={i}><td><b>{p.format}</b></td><td className="dt-mono">{p.place}</td><td className="dt-num">{p.vi1.toFixed(2)}</td><td className="dt-num">{p.vi2.toFixed(2)}</td><td className="dt-num">{p.conv.toFixed(2)}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {adTab === "av" && (
        <div className="card">
          <div className="card__head"><div className="card__title">Ad availability</div></div>
          <table className="dt">
            <thead><tr><th>cohort</th><th>format</th><th className="dt-num">% successful requests</th><th className="dt-num">% started shows</th><th className="dt-num">% viewed</th></tr></thead>
            <tbody>
              {D.ads.availability.map((a,i) => <tr key={i}><td><b>c{a.c}</b></td><td>{a.fmt}</td><td className="dt-num">{a.req.toFixed(2)}%</td><td className="dt-num">{a.started.toFixed(0)}%</td><td className="dt-num">{a.viewed.toFixed(2)}%</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const CC_Inapps = ({ D }) => (
  <>
    <div className="card">
      <div className="card__head"><div className="card__title">LTV in-apps</div></div>
      <table className="dt">
        <thead><tr><th>lifetime</th><th className="dt-num">c1</th><th className="dt-num">c2</th></tr></thead>
        <tbody>{D.inapps.ltvInapps.map((r,i) => <tr key={i}><td>D{r.lt}</td><td className="dt-num">${r.v1.toFixed(4)}</td><td className="dt-num" style={{color: r.v2 > r.v1 ? "var(--status-ok)" : "var(--status-crit)", fontWeight:700}}>${r.v2.toFixed(4)}</td></tr>)}</tbody>
      </table>
    </div>
    <div className="card">
      <div className="card__head"><div className="card__title">cNPU · cumulative paying users</div></div>
      <table className="dt">
        <thead><tr><th>lifetime</th><th className="dt-num">% c1</th><th className="dt-num">% c2</th><th className="dt-num">n c1</th><th className="dt-num">n c2</th></tr></thead>
        <tbody>{D.inapps.cnpu.map((r,i) => <tr key={i}><td>D{r.lt}</td><td className="dt-num">{r.p1.toFixed(3)}%</td><td className="dt-num">{r.p2.toFixed(3)}%</td><td className="dt-num">{r.n1}</td><td className="dt-num">{r.n2}</td></tr>)}</tbody>
      </table>
    </div>
    <div className="card">
      <div className="card__head"><div className="card__title">cARPPU</div></div>
      <table className="dt">
        <thead><tr><th>lifetime</th><th className="dt-num">cARPPU c1</th><th className="dt-num">cARPPU c2</th><th className="dt-num">cNPU c1</th><th className="dt-num">cNPU c2</th><th className="dt-num">cRev c1</th><th className="dt-num">cRev c2</th></tr></thead>
        <tbody>{D.inapps.carppu.map((r,i) => <tr key={i}><td>D{r.lt}</td><td className="dt-num">${r.a1.toFixed(2)}</td><td className="dt-num">${r.a2.toFixed(2)}</td><td className="dt-num">{r.n1}</td><td className="dt-num">{r.n2}</td><td className="dt-num">${r.r1.toFixed(2)}</td><td className="dt-num">${r.r2.toFixed(2)}</td></tr>)}</tbody>
      </table>
    </div>
    <div className="card">
      <div className="card__head"><div className="card__title">Purchases by inapp ID</div></div>
      <table className="dt">
        <thead><tr><th>content_id</th><th className="dt-num">conv % c1</th><th className="dt-num">conv % c2</th><th className="dt-num">revenue $ c1</th><th className="dt-num">revenue $ c2</th></tr></thead>
        <tbody>{D.inapps.purchases.map((p,i) => (
          <tr key={i}>
            <td className="dt-mono">{p.content}</td>
            <td className="dt-num">{(p.c1*100).toFixed(4)}%</td>
            <td className="dt-num" style={{color: p.c2 > p.c1 ? "var(--status-ok)" : "var(--status-crit)", fontWeight:700}}>{(p.c2*100).toFixed(4)}%</td>
            <td className="dt-num">${p.r1.toFixed(2)}</td>
            <td className="dt-num" style={{color: p.r2 > p.r1 ? "var(--status-ok)" : "var(--status-crit)", fontWeight:700}}>${p.r2.toFixed(2)}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </>
);

const CC_Subs = ({ D }) => (
  <>
    <div className="card">
      <div className="card__head"><div className="card__title">Trial conversion</div></div>
      <table className="dt">
        <thead><tr><th>cohort</th><th className="dt-num">opened trial</th><th className="dt-num">conv. to trial %</th><th className="dt-num">paid after</th><th className="dt-num">conv. to paid %</th></tr></thead>
        <tbody>{D.subs.trial.map((r,i) => <tr key={i}><td><b>c{r.c}</b></td><td className="dt-num">{r.opened}</td><td className="dt-num">{r.conv.toFixed(3)}%</td><td className="dt-num">{r.paid}</td><td className="dt-num">{r.payConv.toFixed(2)}%</td></tr>)}</tbody>
      </table>
    </div>
    <div className="card">
      <div className="card__head"><div className="card__title">Subscription payment · overall</div></div>
      <table className="dt">
        <thead><tr><th>cohort</th><th className="dt-num">paid</th><th className="dt-num">conv %</th></tr></thead>
        <tbody>{D.subs.overall.map((r,i) => <tr key={i}><td><b>c{r.c}</b></td><td className="dt-num">{r.paid}</td><td className="dt-num">{r.conv.toFixed(3)}%</td></tr>)}</tbody>
      </table>
    </div>
  </>
);

const CC_Levels = ({ D }) => (
  <div className="card">
    <div className="card__head"><div className="card__title">Main level funnel</div></div>
    <div className="card__body">
      <LineChart
        seed="cc-lf"
        series={[
          { label: "starts c1", values: D.levelFunnel.map(r => r.start_1) },
          { label: "starts c2", values: D.levelFunnel.map(r => r.start_2) },
          { label: "finishes c1", values: D.levelFunnel.map(r => r.finish_1) },
          { label: "finishes c2", values: D.levelFunnel.map(r => r.finish_2) },
        ]}
        palette={["#a0a8b5","#2A6BE0","#d2d6dd","#7eaef0"]}
        height={220}
      />
    </div>
    <table className="dt">
      <thead><tr><th>level</th><th className="dt-num">start c1</th><th className="dt-num">start c2</th><th className="dt-num">finish c1</th><th className="dt-num">finish c2</th><th className="dt-num">funnel start % c1</th><th className="dt-num">funnel start % c2</th></tr></thead>
      <tbody>{D.levelFunnel.map((r,i) => (
        <tr key={i}><td><b>L{r.level}</b></td><td className="dt-num">{r.start_1.toLocaleString()}</td><td className="dt-num">{r.start_2.toLocaleString()}</td><td className="dt-num">{r.finish_1.toLocaleString()}</td><td className="dt-num">{r.finish_2.toLocaleString()}</td><td className="dt-num">{r.fs1.toFixed(2)}%</td><td className="dt-num" style={{color: r.fs2 > r.fs1 ? "var(--status-ok)" : "var(--status-crit)", fontWeight:700}}>{r.fs2.toFixed(2)}%</td></tr>
      ))}</tbody>
    </table>
  </div>
);

// Expose to other files
Object.assign(window, { ABAnalysisReport, CohortCompareReport });
