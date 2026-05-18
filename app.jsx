/* Main App — router, global state, cross-tool flows */

const App = () => {
  const [tool, setTool] = useState("hub");
  const [project, setProject] = useState(AppData.projectById("iron_shells"));
  const [navPayload, setNavPayload] = useState(null);
  const [kbItems, setKbItems] = useState(AppData.knowledge);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg }]);
  };

  const navigate = (t, payload = null) => {
    setTool(t);
    setNavPayload(payload);
    window.scrollTo({ top: 0 });
  };

  // EMS metric → BI block
  const handleAddBIBlock = (metric, event, proj) => {
    if (proj) setProject(proj);
    navigate("bi", { addBlock: { metric, eventName: event.name } });
  };

  // EMS metric → A/B template
  const handleCreateAbFromMetric = (payload) => {
    navigate("ab", { newDraft: payload });
  };

  // AB → KB save
  const handleSaveToKB = (exp) => {
    const newItem = {
      id: "kb-" + Date.now(),
      type: "experiment",
      title: exp.title,
      project: exp.project,
      author: exp.owner,
      date: new Date().toISOString().slice(0, 10),
      summary: `${exp.hypothesis} → ${exp.decision || "Completed"}. Lift ${exp.lift || "—"}; P(B>A)=${exp.pValueOrPb ? (exp.pValueOrPb*100).toFixed(0) + "%" : "—"}.`,
      tags: ["ab-test", exp.primaryMetric.toLowerCase().replace(/\s/g, "-")],
      decision: exp.decision,
      refId: exp.id,
    };
    setKbItems(prev => [newItem, ...prev]);
  };

  // AB → BI (view in BI)
  const handleOpenBI = (exp) => {
    const proj = AppData.projectById(exp.project);
    if (proj) setProject(proj);
    addToast(`Opened ${exp.title} in BI dashboard`);
    navigate("bi");
  };

  return (
    <div className="app">
      <Topbar
        currentTool={tool}
        project={project}
        onNavigate={(t) => navigate(t)}
        onProjectChange={(p) => { setProject(p); }}
      />

      {tool === "hub" && (
        <HubScreen project={project} onNavigate={navigate} onProjectChange={setProject}/>
      )}
      {tool === "ems" && (
        <EMSScreen
          project={project}
          onProjectChange={setProject}
          onNavigate={navigate}
          navPayload={navPayload}
          setNavPayload={setNavPayload}
          onAddBIBlock={handleAddBIBlock}
          onCreateAbFromMetric={handleCreateAbFromMetric}
          addToast={addToast}
        />
      )}
      {tool === "bi" && (
        <BIScreen
          project={project}
          onProjectChange={setProject}
          navPayload={navPayload}
          setNavPayload={setNavPayload}
          addToast={addToast}
          onNavigate={navigate}
        />
      )}
      {tool === "ab" && (
        <ABScreen
          project={project}
          onProjectChange={setProject}
          navPayload={navPayload}
          setNavPayload={setNavPayload}
          addToast={addToast}
          onSaveToKB={handleSaveToKB}
          onOpenBI={handleOpenBI}
        />
      )}
      {tool === "kb" && (
        <KBScreen
          kbItems={kbItems}
          navPayload={navPayload}
          setNavPayload={setNavPayload}
          onNavigate={navigate}
        />
      )}

      {toasts.map(t => (
        <Toast
          key={t.id}
          message={t.msg}
          onClose={() => setToasts(arr => arr.filter(x => x.id !== t.id))}
        />
      ))}

      <FAB onNavigate={navigate}/>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
