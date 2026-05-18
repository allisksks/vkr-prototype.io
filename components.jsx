/* Shared UI components */

const { useState, useEffect, useRef, useMemo, useCallback, Fragment } = React;

// ============== Icons (tiny SVG inline) ==============
const Icon = ({ name, size = 16, color = "currentColor", style }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", style };
  switch (name) {
    case "chevron-down": return <svg {...props}><path d="M6 9l6 6 6-6"/></svg>;
    case "chevron-up":   return <svg {...props}><path d="M18 15l-6-6-6 6"/></svg>;
    case "chevron-right":return <svg {...props}><path d="M9 18l6-6-6-6"/></svg>;
    case "chevron-left": return <svg {...props}><path d="M15 18l-6-6 6-6"/></svg>;
    case "search":       return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>;
    case "plus":         return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "x":            return <svg {...props}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case "edit":         return <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case "trash":        return <svg {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>;
    case "filter":       return <svg {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
    case "download":     return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
    case "code":         return <svg {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
    case "chart-bar":    return <svg {...props}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>;
    case "chart-line":   return <svg {...props}><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>;
    case "chart-pie":    return <svg {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
    case "table":        return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>;
    case "calendar":     return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "settings":     return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "play":         return <svg {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
    case "alert":        return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    case "check":        return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case "save":         return <svg {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
    case "copy":         return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case "lightning":    return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "book":         return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
    case "flask":        return <svg {...props}><path d="M9 2v6L3 20a2 2 0 0 0 1.7 3h14.6A2 2 0 0 0 21 20L15 8V2"/><line x1="9" y1="2" x2="15" y2="2"/></svg>;
    case "tag":          return <svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case "menu":         return <svg {...props}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case "external":     return <svg {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
    case "eye":          return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "home":         return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "clock":        return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case "users":        return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    default: return null;
  }
};

// ============== Pill (status) ==============
const Pill = ({ kind="ok", children }) => (
  <span className={`pill pill--${kind}`}><span className="dot"></span>{children}</span>
);

// ============== Chip (filter) ==============
const Chip = ({ kind="pos", flag, children, onRemove }) => (
  <span className={"chip" + (kind === "neg" ? " chip--neg" : kind === "blue" ? " chip--blue" : "")}>
    {flag && <span className="chip__flag" style={{background: flag}}></span>}
    {children}
    {onRemove && <span className="chip__x" onClick={onRemove}>×</span>}
  </span>
);

// ============== Filter row ==============
const FilterRow = ({ label, checked=true, onToggle, children, placeholder, single }) => (
  <div className="filter-row">
    <div className="filter-row__label">
      <span className={"filter-row__cb" + (checked ? " is-on" : "")} onClick={onToggle}></span>
      <span>{label}</span>
    </div>
    <div className="filter-row__pm">
      <button className="pm-btn pm-btn--add"><Icon name="plus" size={12} color="#fff"/></button>
      <button className="pm-btn pm-btn--rm">—</button>
    </div>
    <div className="filter-row__chips">
      {children}
      {!children || (Array.isArray(children) && children.length === 0)
        ? <span className="chip__placeholder">{placeholder || `choose ${label.toLowerCase()} …`}</span>
        : <span className="chip__placeholder">{placeholder || `choose ${label.toLowerCase()} …`}</span>
      }
    </div>
  </div>
);

// ============== Page header (breadcrumb-style) ==============
const PageTitle = ({ crumbs = [], title, q, actions }) => (
  <div className="page__head">
    <div>
      <div className="page__title">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span className="crumb">{c}</span>
            <span className="crumb-sep">/</span>
          </React.Fragment>
        ))}
        <span>{title}</span>
        {q && <span className="q-icon" title="Help">?</span>}
      </div>
    </div>
    {actions && <div className="row gap-8">{actions}</div>}
  </div>
);

// ============== Modal ==============
const Modal = ({ title, onClose, children, footer, size }) => (
  <div className="scrim" onClick={onClose}>
    <div className={"modal" + (size === "lg" ? " modal--lg" : size === "xl" ? " modal--xl" : "")} onClick={e => e.stopPropagation()}>
      <div className="modal__head">
        <div className="modal__title">{title}</div>
        <button className="modal__close" onClick={onClose}>×</button>
      </div>
      <div className="modal__body">{children}</div>
      {footer && <div className="modal__foot">{footer}</div>}
    </div>
  </div>
);

// ============== Topbar ==============
const TOOLS = [
  { id: "ems",  label: "EMS",         full: "Event Marking Service", icon: "lightning", color: "#e07a3a", bg: "#fde7d5" },
  { id: "bi",   label: "BI",          full: "Business Intelligence", icon: "chart-line", color: "#2A6BE0", bg: "#d8e7fa" },
  { id: "ab",   label: "A/B Splitter",full: "A/B Experiments",       icon: "flask",     color: "#6d3aae", bg: "#ece0fb" },
  { id: "kb",   label: "KB",          full: "Knowledge Base",        icon: "book",      color: "#1d8fb8", bg: "#cfeaf2" },
];

const Topbar = ({ currentTool, project, onNavigate, onProjectChange }) => {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const notifs = AppData.notifications || [];
  return (
    <div className="topbar">
      <div className="topbar__brand" onClick={() => onNavigate("hub")} style={{cursor:"pointer"}}>
        <div className="topbar__brand-mark">GDC</div>
        <span>Analytics</span>
      </div>
      <div className="topbar__tabs">
        <button className={"topbar__tab" + (currentTool === "hub" ? " is-active" : "")} onClick={() => onNavigate("hub")}>
          <Icon name="home" size={14}/> Home
        </button>
        {TOOLS.map(t => (
          <button
            key={t.id}
            className={"topbar__tab" + (currentTool === t.id ? " is-active" : "")}
            onClick={() => onNavigate(t.id)}
          >
            <Icon name={t.icon} size={14}/> {t.label}
          </button>
        ))}
      </div>
      <div className="topbar__spacer"></div>

      {/* Notifications */}
      <div style={{position:"relative", alignSelf:"center", marginRight: 8}}>
        <button
          className="topbar__icon-btn"
          onClick={() => setNotifOpen(o => !o)}
          title="Notifications"
        >
          <Icon name="alert" size={18}/>
          {notifs.length > 0 && (
            <span style={{
              position:"absolute", top:-2, right:-2,
              background: "#e94646", color:"#fff", borderRadius: 10,
              fontSize: 9.5, fontWeight: 800, padding: "1px 5px",
            }}>{notifs.length}</span>
          )}
        </button>
        {notifOpen && (
          <div className="proj-dd" onClick={e => e.stopPropagation()} style={{width: 360, maxHeight: 460, overflowY:"auto"}}>
            <div className="proj-dd__head">Notifications</div>
            {notifs.map(n => (
              <div key={n.id}
                className="proj-dd__item"
                style={{padding:"10px 14px", alignItems:"flex-start", flexDirection:"column", gap:2}}
                onClick={() => {
                  setNotifOpen(false);
                  if (n.kind === "alert") { onNavigate("ems"); }
                  else if (n.kind === "experiment") { onNavigate("ab"); }
                  else if (n.kind === "kb") { onNavigate("kb"); }
                  else if (n.kind === "report") { onNavigate("bi"); }
                }}
              >
                <div style={{display:"flex", gap:8, alignItems:"center", width:"100%"}}>
                  <Icon name={n.icon} size={14} color={n.kind === "alert" ? "#e94646" : "var(--brand)"}/>
                  <span style={{flex:1, fontWeight:700, fontSize:12.5}}>{n.text}</span>
                </div>
                <div className="tiny muted" style={{paddingLeft: 22}}>{n.time}</div>
              </div>
            ))}
            <div style={{padding:"10px 14px", borderTop:"1px solid var(--line-soft)", textAlign:"center"}}>
              <button className="btn btn--sm btn--ghost">Mark all as read</button>
            </div>
          </div>
        )}
      </div>

      {/* Help */}
      <button
        className="topbar__icon-btn"
        onClick={() => setHelpOpen(true)}
        title="Keyboard shortcuts"
        style={{alignSelf:"center", marginRight: 8}}
      >
        <span style={{fontWeight: 800, fontSize: 14}}>?</span>
      </button>

      <div className="topbar__project" onClick={() => setOpen(o => !o)}>
        <div>
          <div className="topbar__project-name">{project ? project.name : "All Projects"}</div>
          <div className="topbar__project-meta">{project ? project.groupName : "Portfolio view"}</div>
        </div>
        <Icon name="chevron-down" size={14}/>
        {open && (
          <div className="proj-dd" onClick={e => e.stopPropagation()}>
            <div className="proj-dd__head">Switch Project</div>
            <div className="proj-dd__group">
              <div className="proj-dd__group-name">All</div>
              <div
                className={"proj-dd__item" + (!project ? " is-active" : "")}
                onClick={() => { onProjectChange(null); setOpen(false); }}
              >
                <span className="proj-dd__item-icon"></span>
                Portfolio view
              </div>
            </div>
            {AppData.projectGroups.map(g => (
              <div key={g.id} className="proj-dd__group">
                <div className="proj-dd__group-name">{g.name}</div>
                {g.projects.map(p => (
                  <div
                    key={p.id}
                    className={"proj-dd__item" + (project && project.id === p.id ? " is-active" : "")}
                    onClick={() => { onProjectChange(p); setOpen(false); }}
                  >
                    <span className="proj-dd__item-icon"></span>
                    {p.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="topbar__user" title="A. Volkova">AV</div>

      {helpOpen && (
        <Modal title="Keyboard shortcuts" onClose={() => setHelpOpen(false)}
          footer={<button className="btn btn--primary" onClick={() => setHelpOpen(false)}>Got it</button>}>
          <table className="dt">
            <tbody>
              <tr><td><kbd>G H</kbd></td><td>Go to Home / Hub</td></tr>
              <tr><td><kbd>G E</kbd></td><td>Go to EMS</td></tr>
              <tr><td><kbd>G B</kbd></td><td>Go to BI</td></tr>
              <tr><td><kbd>G A</kbd></td><td>Go to A/B Splitter</td></tr>
              <tr><td><kbd>G K</kbd></td><td>Go to Knowledge Base</td></tr>
              <tr><td><kbd>Cmd + K</kbd></td><td>Global search (coming soon)</td></tr>
              <tr><td><kbd>/</kbd></td><td>Focus current-screen search</td></tr>
              <tr><td><kbd>Esc</kbd></td><td>Close modal / side panel</td></tr>
              <tr><td><kbd>?</kbd></td><td>Open this help</td></tr>
            </tbody>
          </table>
          <div className="muted tiny mt-12">Shortcuts will be enabled in the next iteration. This panel previews the planned bindings.</div>
        </Modal>
      )}
    </div>
  );
};

// Floating action button (FAB) — quick create
const FAB = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && (
        <div style={{
          position:"fixed", bottom: 92, right: 28,
          background: "#fff", borderRadius: 10, boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--line)",
          padding: 6, zIndex: 49, display:"flex", flexDirection:"column",
          minWidth: 220,
          animation: "modalIn 0.18s ease",
        }}>
          {[
            { label: "New event", desc: "Open EMS · register schema",      ic: "lightning", color: "#e07a3a", tool: "ems", payload: { tab: "registry", newEvent: true } },
            { label: "New experiment", desc: "Open A/B · designer step 1", ic: "flask", color: "#6d3aae", tool: "ab", payload: { newDraft: { hypothesis: "", metric: { name: "Retention D7", unit: "%" }, event: { name: "—", project: "iron_shells" }, trafficSplit: 50, duration: 14 }}},
            { label: "New KB entry", desc: "Open KB · create form",        ic: "book", color: "#1d8fb8", tool: "kb", payload: { view: "new" } },
            { label: "New dashboard", desc: "Open BI · blank canvas",      ic: "chart-line", color: "#2A6BE0", tool: "bi", payload: { dashboardId: "custom" } },
          ].map((item, i) => (
            <button key={i}
              onClick={() => { setOpen(false); onNavigate(item.tool, item.payload); }}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"10px 12px", border:"none", background:"none",
                borderRadius: 6, textAlign:"left", cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--brand-tint)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{width:32, height:32, borderRadius:8, background: item.color+"22", color: item.color, display:"grid", placeItems:"center"}}>
                <Icon name={item.ic} size={16}/>
              </div>
              <div>
                <div style={{fontWeight:700, fontSize:13.5}}>{item.label}</div>
                <div className="tiny muted">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position:"fixed", bottom: 28, right: 28,
          width: 56, height: 56, borderRadius: 28,
          background: "var(--brand)", color: "#fff",
          border: "none", boxShadow: "var(--shadow-lg)",
          zIndex: 50, fontSize: 24, fontWeight: 600,
          cursor: "pointer", transform: open ? "rotate(45deg)" : "none",
          transition: "transform 0.15s ease, background 0.15s",
          display: "grid", placeItems: "center",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--brand-strong)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--brand)"}
        title="Quick create"
      >
        <Icon name="plus" size={24} color="#fff"/>
      </button>
    </>
  );
};
Object.assign(window, { FAB });

// ============== Project Sidebar (BI/EMS style) ==============
const ProjectSidebar = ({ project, onSelectProject, items = [], activeItem, onSelectItem, customGroups }) => {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (k) => setCollapsed(c => ({ ...c, [k]: !c[k] }));

  return (
    <aside className="sidebar">
      <div className="sidebar__head">
        <button className="sidebar__head-btn">
          <Icon name="plus" size={12}/> New Folder
        </button>
        <div className="row gap-4">
          <button className="sidebar__icon-btn" title="Refresh">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
          <button className="sidebar__icon-btn" title="Layout">
            <Icon name="menu" size={14}/>
          </button>
          <button className="sidebar__icon-btn"><Icon name="chevron-left" size={14}/></button>
        </div>
      </div>
      <div className="sidebar__list">
        {customGroups
          ? customGroups.map(group => (
              <div key={group.id} className="sidebar__group">
                <div className="sidebar__group-head" onClick={() => toggle(group.id)}>
                  <span className="sidebar__caret">{collapsed[group.id] ? "▶" : "▼"}</span>
                  <span className="sidebar__folder-icon"></span>
                  <span>{group.name}</span>
                </div>
                {!collapsed[group.id] && (
                  <div className="sidebar__items">
                    {group.items.map(item => (
                      <div
                        key={item.id}
                        className={"sidebar__item" + (activeItem === item.id ? " is-active" : "")}
                        onClick={() => onSelectItem && onSelectItem(item)}
                      >
                        <span className="sidebar__folder-icon"></span>
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          : AppData.projectGroups.map(g => (
              <div key={g.id} className="sidebar__group">
                <div className="sidebar__group-head" onClick={() => toggle(g.id)}>
                  <span className="sidebar__caret">{collapsed[g.id] ? "▶" : "▼"}</span>
                  <span className="sidebar__folder-icon"></span>
                  <span>{g.name}</span>
                </div>
                {!collapsed[g.id] && (
                  <div className="sidebar__items">
                    {g.projects.map(p => (
                      <div
                        key={p.id}
                        className={"sidebar__item" + (project && project.id === p.id ? " is-active" : "")}
                        onClick={() => onSelectProject && onSelectProject(p)}
                      >
                        <span className="sidebar__folder-icon"></span>
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
      </div>
    </aside>
  );
};

// ============== Param Row ==============
const ParamRow = ({ param }) => (
  <div className="param-row">
    <div className="param-row__name">{param.name}</div>
    <div className={`param-row__type t-${param.type}`}>{param.type}</div>
    <div className="param-row__req">{param.required ? "required" : ""}</div>
    <div className="param-row__desc">{param.desc}</div>
  </div>
);

// ============== Metric tile ==============
const MetricTile = ({ label, value, delta, deltaDir, onClick, action }) => (
  <div className="metric-tile" onClick={onClick} style={{cursor: onClick ? "pointer" : "default"}}>
    <div className="metric-tile__label">{label}</div>
    <div className="metric-tile__val">{value}</div>
    {delta && (
      <div className={`metric-tile__delta ${deltaDir || "up"}`}>
        {deltaDir === "down" ? "↓" : "↑"} {delta}
      </div>
    )}
    {action && <div style={{marginTop:8}}>{action}</div>}
  </div>
);

// ============== Section title ==============
const SectionTitle = ({ children, q }) => (
  <div className="section-title">
    {children}
    {q && <span className="q-icon">?</span>}
  </div>
);

// Toast/notification
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      background: "var(--ink)", color: "#fff",
      padding: "12px 18px", borderRadius: 8,
      fontWeight: 700, fontSize: 13,
      boxShadow: "var(--shadow-lg)",
      zIndex: 300,
      display:"flex", alignItems:"center", gap:8,
      animation: "modalIn 0.18s ease",
    }}>
      <Icon name="check" size={16} color="#5fc16d"/>
      {message}
    </div>
  );
};

// expose
Object.assign(window, { Icon, Pill, Chip, FilterRow, PageTitle, Modal, Topbar, ProjectSidebar, ParamRow, MetricTile, SectionTitle, Toast, TOOLS });
