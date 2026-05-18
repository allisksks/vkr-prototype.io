function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* EMS screen — events registry, event detail (params + metrics + version diff), alerts feed */

const EMSScreen = ({
  project,
  onProjectChange,
  onNavigate,
  navPayload,
  setNavPayload,
  onAddBIBlock,
  onCreateAbFromMetric,
  addToast
}) => {
  // Filter events by current project, default to backpack-brawl when "All"
  const activeProj = project || AppData.projectById("iron_shells");
  const events = AppData.events.filter(e => e.project === activeProj.id);
  const [tab, setTab] = useState(navPayload && navPayload.tab || "registry"); // registry | alerts | versions | governance | params
  const [selectedId, setSelectedId] = useState(navPayload && navPayload.eventId || events[0] && events[0].id);
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
  return /*#__PURE__*/React.createElement("div", {
    className: "main main--sidebar"
  }, /*#__PURE__*/React.createElement(ProjectSidebar, {
    project: activeProj,
    onSelectProject: p => {
      onProjectChange(p);
      setSelectedId(null);
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement(PageTitle, {
    crumbs: ["EMS", activeProj.name],
    title: tab === "registry" ? "Event Registry" : tab === "alerts" ? "Alert Feed" : "Version History",
    q: true,
    actions: [/*#__PURE__*/React.createElement("button", {
      key: "r",
      className: "btn"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14
    }), " Export JSON Schema"), /*#__PURE__*/React.createElement("button", {
      key: "n",
      className: "btn btn--primary"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " Register Event")]
  }), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toolbar-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === "registry" ? "btn--primary" : ""),
    onClick: () => setTab("registry")
  }, "Registry"), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === "alerts" ? "btn--primary" : ""),
    onClick: () => setTab("alerts")
  }, "Alerts ", /*#__PURE__*/React.createElement("span", {
    className: "notif",
    style: {
      marginLeft: 6
    }
  }, AppData.alerts.filter(a => a.project === activeProj.id && a.level !== "info").length)), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === "versions" ? "btn--primary" : ""),
    onClick: () => setTab("versions")
  }, "Version History"), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === "governance" ? "btn--primary" : ""),
    onClick: () => setTab("governance")
  }, "Governance"), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === "params" ? "btn--primary" : ""),
    onClick: () => setTab("params")
  }, "Global Params"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 240
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    placeholder: "Search events\u2026",
    style: {
      paddingLeft: 32
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14,
    color: "#7a8794",
    style: {
      position: "absolute",
      left: 10,
      top: 9
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter",
    size: 14
  }), " Filter")), tab === "registry" && /*#__PURE__*/React.createElement(EventRegistry, {
    events: events,
    selected: selected,
    onSelect: id => setSelectedId(id),
    bulkSelected: bulkSelected,
    setBulkSelected: setBulkSelected,
    onShowImpact: e => setImpactModal(e),
    onAddBlockFromMetric: metric => {
      onAddBIBlock(metric, selected, activeProj);
      addToast(`Added "${metric.name}" to BI dashboard`);
    },
    onCreateAbFromMetric: metric => setAbModal({
      metric,
      event: selected
    }),
    onOpenDiff: (v1, v2) => setDiffModal({
      v1,
      v2,
      event: selected
    })
  }), tab === "alerts" && /*#__PURE__*/React.createElement(AlertsFeed, {
    project: activeProj,
    onSelectEvent: eid => {
      setSelectedId(eid);
      setTab("registry");
    }
  }), tab === "versions" && /*#__PURE__*/React.createElement(VersionHistory, {
    events: events,
    onOpenDiff: (eventId, v1, v2) => {
      const e = events.find(x => x.id === eventId);
      setDiffModal({
        v1,
        v2,
        event: e
      });
    }
  }), tab === "governance" && /*#__PURE__*/React.createElement(GovernanceTab, {
    events: events,
    onSelectEvent: eid => {
      setSelectedId(eid);
      setTab("registry");
    }
  }), tab === "params" && /*#__PURE__*/React.createElement(GlobalParamsLibrary, null))), diffModal && /*#__PURE__*/React.createElement(DiffModal, _extends({}, diffModal, {
    onClose: () => setDiffModal(null)
  })), abModal && /*#__PURE__*/React.createElement(ABMetricTemplateModal, _extends({}, abModal, {
    onClose: () => setAbModal(null),
    onSubmit: payload => {
      setAbModal(null);
      onCreateAbFromMetric(payload);
      addToast(`Draft experiment created from "${abModal.metric.name}"`);
    }
  })), impactModal && /*#__PURE__*/React.createElement(ImpactModal, {
    event: impactModal,
    onClose: () => setImpactModal(null)
  }));
};

// ---------------------- Event registry (table + detail panel) ----------------------
const EventRegistry = ({
  events,
  selected,
  onSelect,
  onAddBlockFromMetric,
  onCreateAbFromMetric,
  onOpenDiff,
  bulkSelected,
  setBulkSelected,
  onShowImpact
}) => {
  const allSelected = bulkSelected.length === events.length && events.length > 0;
  return /*#__PURE__*/React.createElement(React.Fragment, null, bulkSelected.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 16px",
      background: "#fef3d1",
      borderBottom: "1px solid var(--line-soft)",
      display: "flex",
      gap: 8,
      alignItems: "center",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("b", null, bulkSelected.length), " selected \xB7", /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), " Bulk validate"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 12
  }), " Export schema"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--danger"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 12
  }), " Archive"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    onClick: () => setBulkSelected([])
  }, "Clear")), /*#__PURE__*/React.createElement("div", {
    className: "split split--12"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRight: "1px solid var(--line-soft)"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 30
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: allSelected,
    onChange: () => setBulkSelected(allSelected ? [] : events.map(e => e.id))
  })), /*#__PURE__*/React.createElement("th", null, "event_name"), /*#__PURE__*/React.createElement("th", null, "ver"), /*#__PURE__*/React.createElement("th", null, "schema_hash"), /*#__PURE__*/React.createElement("th", null, "30m"), /*#__PURE__*/React.createElement("th", null, "status"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, events.map(e => /*#__PURE__*/React.createElement("tr", {
    key: e.id,
    className: (selected && selected.id === e.id ? "is-selected " : "") + (e.status === "crit" ? "row-crit" : e.status === "warn" ? "row-warn" : ""),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("td", {
    onClick: ev => ev.stopPropagation()
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: bulkSelected.includes(e.id),
    onChange: () => setBulkSelected(s => s.includes(e.id) ? s.filter(x => x !== e.id) : [...s, e.id])
  })), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono",
    onClick: () => onSelect(e.id)
  }, e.name), /*#__PURE__*/React.createElement("td", {
    onClick: () => onSelect(e.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "v", e.version)), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono muted",
    onClick: () => onSelect(e.id)
  }, e.hash), /*#__PURE__*/React.createElement("td", {
    className: "dt-num",
    onClick: () => onSelect(e.id)
  }, e.eventsLast30m.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    onClick: () => onSelect(e.id)
  }, e.status === "ok" && /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "OK"), e.status === "warn" && /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, "Warning"), e.status === "crit" && /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, "Critical")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    onClick: ev => {
      ev.stopPropagation();
      onShowImpact(e);
    },
    title: "Impact analysis"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "external",
    size: 12
  })))))))), /*#__PURE__*/React.createElement("div", null, selected ? /*#__PURE__*/React.createElement(EventDetail, {
    event: selected,
    onAddBlockFromMetric: onAddBlockFromMetric,
    onCreateAbFromMetric: onCreateAbFromMetric,
    onOpenDiff: onOpenDiff
  }) : /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty__face"
  }, "\uD83D\uDCC2"), /*#__PURE__*/React.createElement("div", {
    className: "empty__title"
  }, "Pick an event to inspect")))));
};

// ---------------------- Event detail ----------------------
const EventDetail = ({
  event,
  onAddBlockFromMetric,
  onCreateAbFromMetric,
  onOpenDiff
}) => {
  const [subtab, setSubtab] = useState("schema"); // schema | metrics | versions | alerts

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      borderBottom: "1px solid var(--line-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dt-mono",
    style: {
      fontSize: 17,
      fontWeight: 800,
      color: "var(--ink)"
    }
  }, event.name), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8 mt-8"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "v", event.version), /*#__PURE__*/React.createElement("span", {
    className: "tag tag--ghost"
  }, "hash ", /*#__PURE__*/React.createElement("b", {
    className: "dt-mono"
  }, event.hash)), /*#__PURE__*/React.createElement("span", {
    className: "tag tag--ghost"
  }, "owner ", event.owner), event.status === "ok" && /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "OK"), event.status === "warn" && /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, "Warning"), event.status === "crit" && /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, "Critical"))), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 14
  }), " Schema"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 14
  }), " New version"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-12 muted tiny"
  }, event.condition)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      padding: "0 18px",
      borderBottom: "1px solid var(--line-soft)",
      background: "var(--brand-tint)"
    }
  }, [{
    id: "schema",
    label: "Parameters"
  }, {
    id: "metrics",
    label: `Key metrics (${event.metrics.length})`
  }, {
    id: "versions",
    label: `Versions (${event.versions.length})`
  }, {
    id: "alerts",
    label: "Monitoring"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: "editor-tab",
    style: {
      padding: "10px 16px",
      color: subtab === t.id ? "var(--brand)" : "var(--ink-3)",
      borderBottom: subtab === t.id ? "2px solid var(--brand)" : "2px solid transparent"
    },
    onClick: () => setSubtab(t.id)
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px"
    }
  }, subtab === "schema" && /*#__PURE__*/React.createElement(SchemaTab, {
    event: event
  }), subtab === "metrics" && /*#__PURE__*/React.createElement(MetricsTab, {
    event: event,
    onAddBlockFromMetric: onAddBlockFromMetric,
    onCreateAbFromMetric: onCreateAbFromMetric
  }), subtab === "versions" && /*#__PURE__*/React.createElement(VersionsTab, {
    event: event,
    onOpenDiff: onOpenDiff
  }), subtab === "alerts" && /*#__PURE__*/React.createElement(MonitoringTab, {
    event: event
  }), /*#__PURE__*/React.createElement(HourlyEventsChart, {
    event: event
  })));
};

// ---- Parameters tab ----
const SchemaTab = ({
  event
}) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12,
    fontWeight: 800,
    color: "var(--ink-3)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    padding: "4px 12px 8px"
  }
}, "Global parameters (inherited from all events) \xB7 ", AppData.globalParamSet.length), /*#__PURE__*/React.createElement("div", {
  style: {
    border: "1px solid var(--line-soft)",
    borderRadius: 6,
    overflow: "hidden"
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "param-row",
  style: {
    background: "var(--bg)",
    fontSize: 11.5,
    fontWeight: 800,
    color: "var(--ink-3)",
    textTransform: "uppercase",
    letterSpacing: 0.3
  }
}, /*#__PURE__*/React.createElement("div", null, "Name"), /*#__PURE__*/React.createElement("div", null, "Type"), /*#__PURE__*/React.createElement("div", null, "Req"), /*#__PURE__*/React.createElement("div", null, "Description")), AppData.globalParamSet.map(p => /*#__PURE__*/React.createElement(ParamRow, {
  key: p.name,
  param: p
}))), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12,
    fontWeight: 800,
    color: "var(--accent-teal)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    padding: "16px 12px 8px"
  }
}, "Custom parameters of ", /*#__PURE__*/React.createElement("span", {
  className: "dt-mono"
}, event.name), " \xB7 ", event.customParams.length), /*#__PURE__*/React.createElement("div", {
  style: {
    border: "1px solid var(--line-soft)",
    borderRadius: 6,
    overflow: "hidden"
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "param-row",
  style: {
    background: "var(--bg)",
    fontSize: 11.5,
    fontWeight: 800,
    color: "var(--ink-3)",
    textTransform: "uppercase",
    letterSpacing: 0.3
  }
}, /*#__PURE__*/React.createElement("div", null, "Name"), /*#__PURE__*/React.createElement("div", null, "Type"), /*#__PURE__*/React.createElement("div", null, "Req"), /*#__PURE__*/React.createElement("div", null, "Description")), event.customParams.map(p => /*#__PURE__*/React.createElement(ParamRow, {
  key: p.name,
  param: p
}))), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 18
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "row gap-8 mb-8"
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontWeight: 800,
    fontSize: 13,
    color: "var(--ink-2)"
  }
}, "JSON Schema (Draft-07)"), /*#__PURE__*/React.createElement("button", {
  className: "btn btn--sm"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "download",
  size: 12
}), " Export"), /*#__PURE__*/React.createElement("button", {
  className: "btn btn--sm"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "copy",
  size: 12
}), " Copy")), /*#__PURE__*/React.createElement("pre", {
  className: "code-block"
}, `{
  `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#79b8ff"
  }
}, "\"$schema\""), `: `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#b9e08c"
  }
}, "\"https://json-schema.org/draft-07/schema#\""), `,
  `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#79b8ff"
  }
}, "\"title\""), `: `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#b9e08c"
  }
}, "\"$", event.name, "\""), `,
  `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#79b8ff"
  }
}, "\"$comment\""), `: `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#b9e08c"
  }
}, "\"$", event.condition.replace(/"/g, '\\"'), "\""), `,
  `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#79b8ff"
  }
}, "\"type\""), `: `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#b9e08c"
  }
}, "\"object\""), `,
  `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#79b8ff"
  }
}, "\"required\""), `: [${event.customParams.filter(p => p.required).map(p => `"${p.name}"`).join(", ")}],
  `, /*#__PURE__*/React.createElement("span", {
  style: {
    color: "#79b8ff"
  }
}, "\"properties\""), `: {
${event.customParams.map(p => `    "${p.name}": { "type": "${p.type === "int" || p.type === "float" ? "number" : p.type === "ts" ? "string" : p.type === "enum" ? "string" : p.type}" }`).join(",\n")}
  }
}`)));

// ---- Metrics tab ----
const MetricsTab = ({
  event,
  onAddBlockFromMetric,
  onCreateAbFromMetric
}) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "row gap-8 mb-12",
  style: {
    color: "var(--ink-2)",
    fontSize: 13
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "lightning",
  size: 14,
  color: "#e07a3a"
}), /*#__PURE__*/React.createElement("span", null, "The following metrics can be built from ", /*#__PURE__*/React.createElement("b", {
  className: "dt-mono"
}, event.name), " events. Click any metric to push it into a BI dashboard or set it up as a primary metric for an A/B test.")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Metric"), /*#__PURE__*/React.createElement("th", null, "Formula"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "Current"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, event.metrics.map(m => /*#__PURE__*/React.createElement("tr", {
  key: m.id
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, m.name)), /*#__PURE__*/React.createElement("td", {
  className: "dt-mono muted"
}, m.formula), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, /*#__PURE__*/React.createElement("b", null, m.value)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
  className: "row gap-8"
}, /*#__PURE__*/React.createElement("button", {
  className: "btn btn--sm btn--primary",
  onClick: () => onAddBlockFromMetric(m)
}, /*#__PURE__*/React.createElement(Icon, {
  name: "chart-line",
  size: 12
}), " Add to BI"), /*#__PURE__*/React.createElement("button", {
  className: "btn btn--sm",
  onClick: () => onCreateAbFromMetric(m)
}, /*#__PURE__*/React.createElement(Icon, {
  name: "flask",
  size: 12
}), " A/B template"), /*#__PURE__*/React.createElement("button", {
  className: "btn btn--sm btn--ghost"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "code",
  size: 12
}), " SQL"))))))));

// ---- Versions tab ----
const VersionsTab = ({
  event,
  onOpenDiff
}) => {
  const [v1, setV1] = useState(event.versions[Math.min(1, event.versions.length - 1)].v);
  const [v2, setV2] = useState(event.versions[0].v);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row gap-8 mb-12"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, "Compare"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: v1,
    onChange: e => setV1(+e.target.value),
    style: {
      width: 120
    }
  }, event.versions.map(v => /*#__PURE__*/React.createElement("option", {
    key: v.v,
    value: v.v
  }, "v", v.v))), /*#__PURE__*/React.createElement("span", null, "\u2192"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: v2,
    onChange: e => setV2(+e.target.value),
    style: {
      width: 120
    }
  }, event.versions.map(v => /*#__PURE__*/React.createElement("option", {
    key: v.v,
    value: v.v
  }, "v", v.v))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary btn--sm",
    onClick: () => onOpenDiff(v1, v2)
  }, "Open full diff")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Version"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Author"), /*#__PURE__*/React.createElement("th", null, "Change"), /*#__PURE__*/React.createElement("th", null, "State"))), /*#__PURE__*/React.createElement("tbody", null, event.versions.map((v, i) => /*#__PURE__*/React.createElement("tr", {
    key: v.v
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "v", v.v)), /*#__PURE__*/React.createElement("td", null, v.date), /*#__PURE__*/React.createElement("td", null, v.author), /*#__PURE__*/React.createElement("td", null, v.note), /*#__PURE__*/React.createElement("td", null, i === 0 ? /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "active") : /*#__PURE__*/React.createElement(Pill, {
    kind: "draft"
  }, "archived")))))));
};

// ---- Monitoring tab ----
const MonitoringTab = ({
  event
}) => {
  const ratio = event.eventsLast30m / event.baseline;
  const cls = ratio < 0.5 ? "crit" : ratio < 0.9 || ratio > 1.5 ? "warn" : "ok";
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "metric-grid"
  }, /*#__PURE__*/React.createElement(MetricTile, {
    label: "Events last 30m",
    value: event.eventsLast30m.toLocaleString()
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Baseline",
    value: event.baseline.toLocaleString()
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Ratio vs baseline",
    value: (ratio * 100).toFixed(1) + "%",
    delta: cls === "ok" ? "healthy" : cls === "warn" ? "watch" : "critical",
    deltaDir: cls === "ok" ? "up" : "down"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Last check",
    value: event.lastCheck
  })), /*#__PURE__*/React.createElement("div", {
    className: "card mt-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Frequency \xB7 last 48h"), /*#__PURE__*/React.createElement("span", {
    className: "muted tiny"
  }, "baseline shown as dashed line")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement(LineChart, {
    seed: `mon-${event.id}`,
    series: [{
      label: "observed",
      values: seededSeries(event.id + "obs", 48, event.baseline * (cls === "crit" ? 0.05 : cls === "warn" ? 0.7 : 0.85), event.baseline * 1.15)
    }, {
      label: "baseline",
      values: Array(48).fill(event.baseline)
    }],
    palette: ["#2A6BE0", "#a0a8b5"],
    height: 220
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card mt-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Alert rules"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12
  }), " New rule")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Rule"), /*#__PURE__*/React.createElement("th", null, "Condition"), /*#__PURE__*/React.createElement("th", null, "Channel"), /*#__PURE__*/React.createElement("th", null, "State"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Frequency drop"), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, "count < baseline \xD7 0.5 \u2192 critical"), /*#__PURE__*/React.createElement("td", null, "Slack #data-alerts + email"), /*#__PURE__*/React.createElement("td", null, cls === "crit" ? /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, "firing") : /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "ok"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Frequency dip"), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, "count \u2208 [base\xD70.5, base\xD70.9) \u2192 warning"), /*#__PURE__*/React.createElement("td", null, "Slack #data-alerts"), /*#__PURE__*/React.createElement("td", null, cls === "warn" ? /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, "firing") : /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "ok"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Null rate"), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, "NULL(any required) > 5%"), /*#__PURE__*/React.createElement("td", null, "Slack #data-alerts"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "ok")))))));
};

// ---------------------- Alerts feed ----------------------
const AlertsFeed = ({
  project,
  onSelectEvent
}) => {
  const list = AppData.alerts.filter(a => a.project === project.id);
  if (!list.length) return /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty__face"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", {
    className: "empty__title"
  }, "No alerts in this project."));
  return /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Level"), /*#__PURE__*/React.createElement("th", null, "Event"), /*#__PURE__*/React.createElement("th", null, "Reason"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Observed"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Expected"), /*#__PURE__*/React.createElement("th", null, "Time"), /*#__PURE__*/React.createElement("th", null, "Note"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, list.map(a => {
    const ev = AppData.events.find(e => e.name === a.event && e.project === a.project);
    return /*#__PURE__*/React.createElement("tr", {
      key: a.id,
      className: a.level === "crit" ? "row-crit" : a.level === "warn" ? "row-warn" : ""
    }, /*#__PURE__*/React.createElement("td", null, a.level === "crit" ? /*#__PURE__*/React.createElement(Pill, {
      kind: "crit"
    }, "critical") : a.level === "warn" ? /*#__PURE__*/React.createElement(Pill, {
      kind: "warn"
    }, "warning") : /*#__PURE__*/React.createElement(Pill, {
      kind: "info"
    }, "info")), /*#__PURE__*/React.createElement("td", {
      className: "dt-mono"
    }, a.event), /*#__PURE__*/React.createElement("td", null, a.reason.replace("_", " ")), /*#__PURE__*/React.createElement("td", {
      className: "dt-num"
    }, a.observed), /*#__PURE__*/React.createElement("td", {
      className: "dt-num"
    }, a.expected), /*#__PURE__*/React.createElement("td", null, a.time), /*#__PURE__*/React.createElement("td", {
      className: "muted"
    }, a.note), /*#__PURE__*/React.createElement("td", null, ev && /*#__PURE__*/React.createElement("button", {
      className: "btn btn--sm btn--ghost",
      onClick: () => onSelectEvent(ev.id)
    }, "Inspect \u2192")));
  })));
};

// ---------------------- Version history (all events) ----------------------
const VersionHistory = ({
  events,
  onOpenDiff
}) => /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Event"), /*#__PURE__*/React.createElement("th", null, "Version"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Author"), /*#__PURE__*/React.createElement("th", null, "Change"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, events.flatMap(e => e.versions.map(v => ({
  ...v,
  e
}))).sort((a, b) => a.date < b.date ? 1 : -1).map((v, i) => /*#__PURE__*/React.createElement("tr", {
  key: v.e.id + v.v
}, /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, v.e.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "v", v.v)), /*#__PURE__*/React.createElement("td", null, v.date), /*#__PURE__*/React.createElement("td", null, v.author), /*#__PURE__*/React.createElement("td", null, v.note), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
  className: "btn btn--sm btn--ghost",
  onClick: () => onOpenDiff(v.e.id, Math.max(1, v.v - 1), v.v)
}, "Diff \u2192"))))));

// ---------------------- Diff modal ----------------------
const DiffModal = ({
  event,
  v1,
  v2,
  onClose
}) => {
  // fake diff content
  const sameParams = event.customParams.slice(0, 2);
  const added = event.customParams.slice(-1);
  const modified = event.customParams.slice(2, 3);
  return /*#__PURE__*/React.createElement(Modal, {
    title: `${event.name} — diff v${v1} → v${v2}`,
    onClose: onClose,
    size: "lg",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: onClose
    }, "Close"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14
    }), " Download diff JSON"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-8 mb-12"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "#e8f5dd",
      color: "#2a7d34"
    }
  }, "+ ", added.length, " added"), /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "#fbe2e2",
      color: "#c1393c"
    }
  }, "\u2212 0 removed"), /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "#fcecc7",
      color: "#8b6510"
    }
  }, "~ ", modified.length, " modified"), /*#__PURE__*/React.createElement("span", {
    className: "muted tiny"
  }, event.versions.find(v => v.v === v2)?.note)), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--line-soft)",
      borderRadius: 6,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "diff-line same"
  }, "  \"type\": \"object\","), /*#__PURE__*/React.createElement("div", {
    className: "diff-line same"
  }, "  \"required\": ["), sameParams.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    className: "diff-line same"
  }, "    \"", p.name, "\",")), added.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    className: "diff-line add"
  }, "+   \"", p.name, "\",")), /*#__PURE__*/React.createElement("div", {
    className: "diff-line same"
  }, "  ],"), /*#__PURE__*/React.createElement("div", {
    className: "diff-line same"
  }, "  \"properties\": {"), sameParams.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name + "_p",
    className: "diff-line same"
  }, "    \"", p.name, "\": { \"type\": \"", p.type, "\" },")), modified.map(p => /*#__PURE__*/React.createElement(Fragment, {
    key: p.name + "_m"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diff-line mod"
  }, "-   \"", p.name, "\": { \"type\": \"string\" },"), /*#__PURE__*/React.createElement("div", {
    className: "diff-line mod"
  }, "+   \"", p.name, "\": { \"type\": \"", p.type, "\" },"))), added.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name + "_a",
    className: "diff-line add"
  }, "+   \"", p.name, "\": { \"type\": \"", p.type, "\", \"required\": ", String(p.required), " },")), /*#__PURE__*/React.createElement("div", {
    className: "diff-line same"
  }, "  }"), /*#__PURE__*/React.createElement("div", {
    className: "diff-line same"
  }, "}")));
};

// ---------------------- AB Metric template modal (EMS → AB) ----------------------
const ABMetricTemplateModal = ({
  metric,
  event,
  onClose,
  onSubmit
}) => {
  const [hypothesis, setHypothesis] = useState(`Changing the in-game configuration related to "${event.name}" will improve ${metric.name} by ≥ 1pp vs baseline.`);
  const [effect, setEffect] = useState(metric.name === "ARPU" ? "+5%" : "+1.5pp");
  const [trafficSplit, setTrafficSplit] = useState(50);
  const [duration, setDuration] = useState(14);
  return /*#__PURE__*/React.createElement(Modal, {
    title: `A/B Test from "${metric.name}"`,
    onClose: onClose,
    size: "lg",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary",
      onClick: () => onSubmit({
        hypothesis,
        metric,
        event,
        effect,
        trafficSplit,
        duration
      })
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "flask",
      size: 14
    }), " Create draft experiment"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-8 mb-12",
    style: {
      background: "var(--brand-tint)",
      padding: "10px 14px",
      borderRadius: 6,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lightning",
    size: 16,
    color: "#e07a3a"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Template pre-fill:"), " linking event ", /*#__PURE__*/React.createElement("span", {
    className: "dt-mono"
  }, event.name), " \xB7 primary metric ", /*#__PURE__*/React.createElement("b", null, metric.name), " (", metric.formula, "). The splitter will deterministically bucket users by ", /*#__PURE__*/React.createElement("span", {
    className: "dt-mono"
  }, "hash(user_id + experiment_id)"), ".")), /*#__PURE__*/React.createElement("div", {
    className: "col gap-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Hypothesis"), /*#__PURE__*/React.createElement("textarea", {
    className: "field__textarea",
    rows: 3,
    value: hypothesis,
    onChange: e => setHypothesis(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "row gap-12",
    style: {
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Primary metric"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: metric.name,
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Metric type"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    defaultValue: metric.unit === "$" ? "continuous" : "binary"
  }, /*#__PURE__*/React.createElement("option", {
    value: "binary"
  }, "Binary (Bayesian Beta)"), /*#__PURE__*/React.createElement("option", {
    value: "continuous"
  }, "Continuous (Normal approx.)"))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Min. detectable effect"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: effect,
    onChange: e => setEffect(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row gap-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Variants"), /*#__PURE__*/React.createElement("div", {
    className: "col gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "Control"
  })), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "50%",
    style: {
      width: 90
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "Test B"
  })), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "50%",
    style: {
      width: 90
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    style: {
      alignSelf: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12
  }), " Add variant"))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Traffic share"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: trafficSplit + "%",
    onChange: e => setTrafficSplit(parseInt(e.target.value) || 0)
  }), /*#__PURE__*/React.createElement("div", {
    className: "field__label",
    style: {
      marginTop: 10
    }
  }, "Expected duration (days)"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: duration,
    onChange: e => setDuration(parseInt(e.target.value) || 0)
  }), /*#__PURE__*/React.createElement("div", {
    className: "muted tiny mt-8"
  }, "Calculated from MDE, current DAU and traffic share. Threshold P(B>A) \u2265 0.95."))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Inclusion criteria (JSONB)"), /*#__PURE__*/React.createElement("textarea", {
    className: "field__textarea",
    rows: 3,
    defaultValue: `{
  "platform": ["ios", "android"],
  "country": "ALL",
  "cohort_date_min": "2026-04-15"
}`
  }))));
};
window.EMSScreen = EMSScreen;

// ---------------------- Impact Analysis modal ----------------------
const ImpactModal = ({
  event,
  onClose
}) => {
  // Pretend: count usages
  const usedDashboards = AppData.dashboards.filter(d => d.project === event.project).slice(0, 3);
  const usedExperiments = AppData.experiments.filter(e => e.eventSource === event.name || e.project === event.project).slice(0, 2);
  return /*#__PURE__*/React.createElement(Modal, {
    title: `Impact analysis · ${event.name}`,
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary",
      onClick: onClose
    }, "Close")
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted tiny mb-12",
    style: {
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.3
    }
  }, "Downstream dependencies \u2014 confirm impact before changing the schema or deprecating."), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Used in BI dashboards \xB7 ", usedDashboards.length)), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Dashboard"), /*#__PURE__*/React.createElement("th", null, "Project"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Blocks"))), /*#__PURE__*/React.createElement("tbody", null, usedDashboards.map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, d.name)), /*#__PURE__*/React.createElement("td", null, AppData.projectById(d.project)?.name), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, 1 + Math.abs(d.id.length % 3))))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "A/B experiments referencing this event \xB7 ", usedExperiments.length)), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Experiment"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Users"))), /*#__PURE__*/React.createElement("tbody", null, usedExperiments.map(e => /*#__PURE__*/React.createElement("tr", {
    key: e.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, e.title)), /*#__PURE__*/React.createElement("td", null, e.status), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, e.variants.reduce((s, v) => s + v.users, 0).toLocaleString())))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Downstream events triggered after")), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18
    }
  }, /*#__PURE__*/React.createElement("li", {
    className: "dt-mono"
  }, "level_complete"), /*#__PURE__*/React.createElement("li", {
    className: "dt-mono"
  }, "iap_purchase"), /*#__PURE__*/React.createElement("li", {
    className: "dt-mono"
  }, "chest_open"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      background: "#fef3d1",
      borderRadius: 6,
      fontSize: 13,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("b", null, "Recommendation:"), " deprecating ", /*#__PURE__*/React.createElement("span", {
    className: "dt-mono"
  }, event.name), " would impact ", /*#__PURE__*/React.createElement("b", null, usedDashboards.length), " dashboards and ", /*#__PURE__*/React.createElement("b", null, usedExperiments.length), " A/B tests. Coordinate with the teams listed above before scheduling sunset."));
};

// ---------------------- Governance Tab ----------------------
const GovernanceTab = ({
  events,
  onSelectEvent
}) => {
  const totalEvents = events.length;
  const withDesc = events.filter(e => e.condition && e.condition.length > 20).length;
  const withOwner = events.filter(e => e.owner).length;
  const stale = events.filter(e => e.updated < "2026-03-01");
  const orphans = events.filter(e => !e.metrics || e.metrics.length === 0);
  const violations = events.filter(e => /[A-Z]/.test(e.name));
  const score = Math.round(withDesc / totalEvents * 50 + withOwner / totalEvents * 30 + (1 - stale.length / totalEvents) * 20);
  const Stat = ({
    label,
    value,
    total,
    color
  }) => /*#__PURE__*/React.createElement("div", {
    className: "metric-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-tile__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "metric-tile__val",
    style: {
      color
    }
  }, value, total ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-3)",
      fontSize: 14
    }
  }, " / ", total) : null), /*#__PURE__*/React.createElement("div", {
    className: "bar",
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar__fill " + (color === "var(--status-ok)" ? "bar__fill--ok" : color === "var(--status-warn)" ? "bar__fill--warn" : "bar__fill--crit"),
    style: {
      width: (total ? value / total * 100 : value) + "%"
    }
  })));
  return /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-grid mb-12"
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Coverage score",
    value: score,
    total: 100,
    color: score > 80 ? "var(--status-ok)" : score > 60 ? "var(--status-warn)" : "var(--status-crit)"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Events with description",
    value: withDesc,
    total: totalEvents,
    color: "var(--status-ok)"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Events with owner",
    value: withOwner,
    total: totalEvents,
    color: "var(--status-ok)"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Stale (>90 days)",
    value: stale.length,
    total: totalEvents,
    color: "var(--status-warn)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Action items")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Issue"), /*#__PURE__*/React.createElement("th", null, "Event"), /*#__PURE__*/React.createElement("th", null, "Severity"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, stale.map(e => /*#__PURE__*/React.createElement("tr", {
    key: "s-" + e.id
  }, /*#__PURE__*/React.createElement("td", null, "Stale schema \u2014 no updates in 90+ days"), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, e.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, "warning")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    onClick: () => onSelectEvent(e.id)
  }, "Inspect \u2192")))), orphans.map(e => /*#__PURE__*/React.createElement("tr", {
    key: "o-" + e.id
  }, /*#__PURE__*/React.createElement("td", null, "Orphan \u2014 no BI metrics defined"), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, e.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
    kind: "info"
  }, "info")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    onClick: () => onSelectEvent(e.id)
  }, "Inspect \u2192")))), violations.map(e => /*#__PURE__*/React.createElement("tr", {
    key: "v-" + e.id
  }, /*#__PURE__*/React.createElement("td", null, "Naming convention \u2014 uppercase letters in event_name"), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, e.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, "warning")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    onClick: () => onSelectEvent(e.id)
  }, "Inspect \u2192")))), stale.length === 0 && orphans.length === 0 && violations.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 4
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty",
    style: {
      padding: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty__face"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", {
    className: "empty__title"
  }, "No governance issues. Nice."))))))));
};

// ---------------------- Hourly events chart (always at bottom of event card) ----------------------
const HourlyEventsChart = ({
  event
}) => {
  // 24-hour bar chart. Each bar = events received from DB in that hour.
  // Status logic: critical if < 50% baseline, warning if 50–90% or > 150%, ok if in range.
  // Two special states:
  //   - "not implemented": when status === "crit" AND most hours near zero (e.g. tutorial_step regression)
  //   - "ok with gap": one or two hours dipped
  const hourBaseline = event.baseline / 48; // 30m baseline → ~half of hourly
  const hourlyBase = hourBaseline * 2;

  // Deterministic per-event hourly values
  const hash = event.id.split("").reduce((h, c) => h * 31 + c.charCodeAt(0) | 0, 0);
  function rnd(i) {
    let x = Math.abs(Math.sin(hash + i * 17.31)) * 1000;
    return x - Math.floor(x);
  }
  const hours = Array.from({
    length: 24
  }, (_, i) => {
    let v;
    if (event.status === "crit" && event.eventsLast30m / event.baseline < 0.1) {
      // event broken — almost no data in last 6-8 hours, normal before
      const sinceRelease = i >= 17 ? 0.0 : 0.85 + (rnd(i) - 0.5) * 0.25;
      v = hourlyBase * sinceRelease;
    } else if (event.status === "warn") {
      // dipped for last few hours
      const dip = i >= 19 ? 0.55 + rnd(i) * 0.2 : 0.95 + (rnd(i) - 0.5) * 0.2;
      v = hourlyBase * dip;
    } else {
      // healthy with small day/night curve
      const dayCurve = 0.85 + 0.3 * Math.sin(i / 24 * Math.PI * 2 - Math.PI / 3);
      v = hourlyBase * dayCurve * (0.92 + rnd(i) * 0.15);
    }
    const ratio = v / hourlyBase;
    const status = ratio < 0.5 ? "crit" : ratio < 0.9 || ratio > 1.5 ? "warn" : "ok";
    return {
      hour: i,
      value: v,
      ratio,
      status
    };
  });
  const max = Math.max(...hours.map(h => h.value), hourlyBase * 1.4);
  const critHours = hours.filter(h => h.status === "crit").length;
  const warnHours = hours.filter(h => h.status === "warn").length;
  const totalDay = hours.reduce((s, h) => s + h.value, 0);
  const expectedDay = hourlyBase * 24;
  const notImplemented = event.status === "crit" && event.eventsLast30m / event.baseline < 0.05;

  // Active alerts derived from same condition
  const activeAlerts = AppData.alerts.filter(a => a.event === event.name && a.project === event.project);
  return /*#__PURE__*/React.createElement("div", {
    className: "card mt-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 16,
    color: notImplemented ? "var(--status-crit)" : critHours > 0 ? "var(--status-crit)" : warnHours > 0 ? "var(--status-warn)" : "var(--status-ok)"
  }), "Events received \xB7 last 24 hours"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, notImplemented && /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, "Event not firing"), !notImplemented && critHours > 0 && /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, critHours, " critical hours"), !notImplemented && critHours === 0 && warnHours > 0 && /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, warnHours, " dips"), !notImplemented && critHours === 0 && warnHours === 0 && /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "Healthy"), /*#__PURE__*/React.createElement("span", {
    className: "muted tiny"
  }, "baseline \u2248 ", Math.round(hourlyBase).toLocaleString(), "/h"))), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement(HourlyBars, {
    hours: hours,
    max: max,
    baseline: hourlyBase
  }), /*#__PURE__*/React.createElement("div", {
    className: "row gap-16 mt-12",
    style: {
      justifyContent: "center",
      fontSize: 11.5,
      fontWeight: 700,
      color: "var(--ink-3)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 8,
      background: "#43c08a",
      borderRadius: 2,
      display: "inline-block"
    }
  }), " OK (\u2265 90% baseline)"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 8,
      background: "#f5a623",
      borderRadius: 2,
      display: "inline-block"
    }
  }), " Warning (50\u201390%)"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 8,
      background: "#e94646",
      borderRadius: 2,
      display: "inline-block"
    }
  }), " Critical (< 50%)"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      borderTop: "1.5px dashed #4a5764",
      display: "inline-block"
    }
  }), " baseline")), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid mt-16"
  }, /*#__PURE__*/React.createElement(MetricTile, {
    label: "Last hour",
    value: Math.round(hours[hours.length - 1].value).toLocaleString(),
    delta: `${(hours[hours.length - 1].ratio * 100).toFixed(0)}% of baseline`,
    deltaDir: hours[hours.length - 1].status === "ok" ? "up" : "down"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "24h total",
    value: Math.round(totalDay).toLocaleString(),
    delta: `${(totalDay / expectedDay * 100).toFixed(0)}% of expected`,
    deltaDir: totalDay > expectedDay * 0.9 ? "up" : "down"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Gaps detected",
    value: `${critHours + warnHours} of 24`,
    delta: notImplemented ? "event missing" : critHours > 0 ? "critical dips" : warnHours > 0 ? "minor dips" : "no gaps",
    deltaDir: critHours > 0 || notImplemented ? "down" : "up"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Active alerts",
    value: activeAlerts.length,
    delta: activeAlerts.length ? activeAlerts[0].reason.replace("_", " ") : "none",
    deltaDir: activeAlerts.length ? "down" : "up"
  })), (notImplemented || critHours > 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "10px 14px",
      background: notImplemented ? "#fbe2e2" : "#fef0e2",
      border: notImplemented ? "1px solid #f1bdbd" : "1px solid #f1cda1",
      borderRadius: 6,
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 18,
    color: notImplemented ? "var(--status-crit)" : "var(--status-warn)",
    style: {
      flexShrink: 0,
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      color: notImplemented ? "var(--status-crit)" : "var(--ink)"
    }
  }, notImplemented ? `Event "${event.name}" is not firing or not implemented` : `${critHours} hour${critHours > 1 ? "s" : ""} with frequency < 50% of baseline`), /*#__PURE__*/React.createElement("div", {
    className: "tiny muted",
    style: {
      marginTop: 3
    }
  }, notImplemented ? "Last 6+ hours show near-zero traffic for this event. Most likely cause: SDK not initialised on the new build, missing implementation call, or wrong event_name. Check the latest release build." : `EMS alert rule "frequency_drop < baseline × 0.5" triggered. Critical alerts have been sent to the analyst and CTO via Slack #data-alerts.`), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4 mt-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "external",
    size: 12
  }), " Open in alert feed"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), " Acknowledge"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "code",
    size: 12
  }), " SDK debug"))))));
};

// Small SVG bar component for the hourly chart
const HourlyBars = ({
  hours,
  max,
  baseline
}) => {
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
  const padX = 28,
    padTop = 16,
    padBot = 28;
  const gap = 2;
  const barW = (w - padX * 2 - gap * 23) / 24;
  const norm = v => h - padBot - v / max * (h - padTop - padBot);
  const baseY = norm(baseline);
  const baseColor = {
    ok: "#43c08a",
    warn: "#f5a623",
    crit: "#e94646"
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h
  }, [0, 0.5, 1, 1.5].map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: padX,
    y1: norm(baseline * t),
    x2: w - 4,
    y2: norm(baseline * t),
    stroke: "#eceff4"
  }), /*#__PURE__*/React.createElement("text", {
    x: padX - 6,
    y: norm(baseline * t) + 3,
    fontSize: "10",
    fill: "#7a8794",
    textAnchor: "end"
  }, Math.round(baseline * t).toLocaleString()))), hours.map((hr, i) => {
    const x = padX + i * (barW + gap);
    const y = norm(hr.value);
    const bh = h - padBot - y;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: x,
      y: y,
      width: barW,
      height: Math.max(2, bh),
      fill: baseColor[hr.status],
      rx: "2"
    }, /*#__PURE__*/React.createElement("title", null, `${String(hr.hour).padStart(2, '0')}:00 — ${Math.round(hr.value).toLocaleString()} events (${(hr.ratio * 100).toFixed(0)}% of baseline)`)), hr.status === "crit" && /*#__PURE__*/React.createElement("text", {
      x: x + barW / 2,
      y: y - 4,
      fontSize: "11",
      textAnchor: "middle",
      fill: "#e94646",
      fontWeight: "800"
    }, "!"));
  }), /*#__PURE__*/React.createElement("line", {
    x1: padX,
    y1: baseY,
    x2: w - 4,
    y2: baseY,
    stroke: "#4a5764",
    strokeWidth: "1.5",
    strokeDasharray: "4 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: w - 8,
    y: baseY - 4,
    fontSize: "10",
    fill: "#4a5764",
    textAnchor: "end",
    fontWeight: "700"
  }, "baseline"), hours.map((hr, i) => i % 3 === 0 && /*#__PURE__*/React.createElement("text", {
    key: "x-" + i,
    x: padX + i * (barW + gap) + barW / 2,
    y: h - 8,
    fontSize: "10",
    fill: "#7a8794",
    textAnchor: "middle"
  }, String(hr.hour).padStart(2, '0'), ":00"))));
};
const GlobalParamsLibrary = () => {
  const params = AppData.globalParamSet.map(p => ({
    ...p,
    usedIn: AppData.events.filter(e => true).length
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-8 mb-12"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      maxWidth: 300
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    placeholder: "Search global params\u2026",
    style: {
      paddingLeft: 32
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14,
    color: "#7a8794",
    style: {
      position: "absolute",
      left: 10,
      top: 9
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " Add global param")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--line-soft)",
      borderRadius: 6,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "param-row",
    style: {
      background: "var(--bg)",
      fontSize: 11.5,
      fontWeight: 800,
      color: "var(--ink-3)",
      textTransform: "uppercase",
      letterSpacing: 0.3,
      gridTemplateColumns: "200px 100px 70px 70px 1fr 100px"
    }
  }, /*#__PURE__*/React.createElement("div", null, "Name"), /*#__PURE__*/React.createElement("div", null, "Type"), /*#__PURE__*/React.createElement("div", null, "Req"), /*#__PURE__*/React.createElement("div", null, "Used in"), /*#__PURE__*/React.createElement("div", null, "Description"), /*#__PURE__*/React.createElement("div", null)), params.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    className: "param-row",
    style: {
      gridTemplateColumns: "200px 100px 70px 70px 1fr 100px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "param-row__name"
  }, p.name), /*#__PURE__*/React.createElement("div", {
    className: `param-row__type t-${p.type}`
  }, p.type), /*#__PURE__*/React.createElement("div", {
    className: "param-row__req"
  }, p.required ? "required" : ""), /*#__PURE__*/React.createElement("div", {
    className: "dt-num"
  }, /*#__PURE__*/React.createElement("b", null, p.usedIn)), /*#__PURE__*/React.createElement("div", {
    className: "param-row__desc"
  }, p.desc), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost"
  }, "edit"))))));
};