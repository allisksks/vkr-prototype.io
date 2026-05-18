/* BI screen — per-project dashboards + reports (AB Analysis, Cohort Compare) */

const BIScreen = ({
  project,
  onProjectChange,
  navPayload,
  setNavPayload,
  addToast,
  onNavigate
}) => {
  const activeProj = project || AppData.projectById("iron_shells");
  const projDashboards = AppData.dashboardsByProject[activeProj.id] || AppData.dashboardsByProject.iron_shells;

  // Active dashboard
  const [activeDashId, setActiveDashId] = useState(navPayload && navPayload.dashboardId || projDashboards[0].id);
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
    return AppData.blockBlueprints[pid] && AppData.blockBlueprints[pid][did] || [];
  };
  const blocks = getBlocks();
  const setBlocks = next => setBlocksByKey(prev => ({
    ...prev,
    [blocksKey]: typeof next === "function" ? next(getBlocks()) : next
  }));

  // editor pane state
  const [editingBlock, setEditingBlock] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);

  // navPayload handlers — block coming from EMS
  useEffect(() => {
    if (navPayload && navPayload.addBlock) {
      const {
        metric,
        eventName
      } = navPayload.addBlock;
      const newBlock = {
        id: "nb-" + Date.now(),
        title: `${metric.name} · from ${eventName}`,
        type: metric.unit === "%" ? "bar" : metric.unit === "$" ? "line" : "area",
        span: 6,
        metric: metric.name,
        sourceEvent: eventName,
        formula: metric.formula,
        isNew: true
      };
      setBlocks(prev => [newBlock, ...prev]);
      setNavPayload(null);
      addToast(`Added "${metric.name}" to ${dash.name}`);
    } else if (navPayload && navPayload.dashboardId) {
      setActiveDashId(navPayload.dashboardId);
      setNavPayload(null);
    }
  }, [navPayload]);
  const updateBlock = (id, changes) => setBlocks(prev => prev.map(b => b.id === id ? {
    ...b,
    ...changes
  } : b));
  const deleteBlock = id => setBlocks(prev => prev.filter(b => b.id !== id));

  // Sidebar
  const sidebarGroups = AppData.projectGroups.map(g => ({
    id: g.id,
    name: g.name,
    items: g.projects.map(p => ({
      id: "proj-" + p.id,
      name: p.name,
      active: activeProj.id === p.id
    }))
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "main main--sidebar"
  }, /*#__PURE__*/React.createElement(ProjectSidebar, {
    customGroups: sidebarGroups,
    activeItem: "proj-" + activeProj.id,
    onSelectItem: item => {
      if (item.id.startsWith("proj-")) {
        const p = AppData.projectById(item.id.replace("proj-", ""));
        onProjectChange(p);
        const newList = AppData.dashboardsByProject[p.id] || [];
        setActiveDashId(newList[0]?.id || "overview");
      }
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: editingBlock ? {
      paddingRight: 380
    } : {}
  }, /*#__PURE__*/React.createElement(PageTitle, {
    crumbs: ["BI", activeProj.name],
    title: dash.name + (dash.isReport ? "" : " (period)"),
    q: true,
    actions: [/*#__PURE__*/React.createElement("button", {
      key: "d",
      className: "btn",
      onClick: () => addToast("Download started")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14
    }), " Export"), /*#__PURE__*/React.createElement("button", {
      key: "sh",
      className: "btn",
      onClick: () => setShareModal(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "external",
      size: 14
    }), " Share"), /*#__PURE__*/React.createElement("button", {
      key: "sc",
      className: "btn",
      onClick: () => setScheduleModal(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 14
    }), " Schedule"), /*#__PURE__*/React.createElement("button", {
      key: "s",
      className: "btn"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "settings",
      size: 14
    })), !dash.isReport ? /*#__PURE__*/React.createElement("button", {
      key: "a",
      className: "btn btn--primary",
      onClick: () => {
        const id = "nb-" + Date.now();
        setBlocks(prev => [...prev, {
          id,
          title: "New block",
          type: "line",
          span: 4,
          metric: "DAU"
        }]);
        setEditingBlock(id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " Add block") : null]
  }), /*#__PURE__*/React.createElement("div", {
    className: "bi-dash-tabs"
  }, projDashboards.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.id,
    className: "bi-dash-tab" + (activeDashId === d.id ? " is-active" : "") + (d.isReport ? " is-report" : ""),
    onClick: () => setActiveDashId(d.id)
  }, d.isReport && /*#__PURE__*/React.createElement(Icon, {
    name: "filter",
    size: 11
  }), d.name))), dash.isReport && dash.reportType === "ab" && /*#__PURE__*/React.createElement(ABAnalysisReport, {
    project: activeProj,
    onNavigate: onNavigate
  }), dash.isReport && dash.reportType === "cohort" && /*#__PURE__*/React.createElement(CohortCompareReport, {
    project: activeProj,
    onNavigate: onNavigate,
    addToast: addToast
  }), !dash.isReport && /*#__PURE__*/React.createElement(DashboardBody, {
    project: activeProj,
    dash: dash,
    blocks: blocks,
    onEdit: setEditingBlock,
    onDelete: deleteBlock,
    onChangeSpan: (id, span) => updateBlock(id, {
      span
    }),
    onAddBlock: () => {
      const id = "nb-" + Date.now();
      setBlocks(prev => [...prev, {
        id,
        title: "New block",
        type: "line",
        span: 4,
        metric: "DAU"
      }]);
      setEditingBlock(id);
    },
    onTestSegment: segment => onNavigate("ab", {
      newDraft: {
        fromSegment: segment,
        hypothesis: `Targeted variant for "${segment.name}" segment.`,
        metric: {
          name: segment.metric || "Retention D7",
          unit: "%",
          formula: "—"
        },
        event: {
          name: "—",
          project: activeProj.id
        },
        trafficSplit: 50,
        duration: 14
      }
    })
  })), editingBlock && /*#__PURE__*/React.createElement(BlockEditorPanel, {
    block: blocks.find(b => b.id === editingBlock),
    project: activeProj,
    onClose: () => setEditingBlock(null),
    onSave: changes => {
      updateBlock(editingBlock, changes);
      setEditingBlock(null);
      addToast("Block saved");
    },
    onClone: () => {
      const orig = blocks.find(b => b.id === editingBlock);
      const id = "nb-" + Date.now();
      setBlocks(prev => [...prev, {
        ...orig,
        id,
        title: orig.title + " (copy)"
      }]);
      addToast("Block cloned");
    },
    onDelete: () => {
      deleteBlock(editingBlock);
      setEditingBlock(null);
      addToast("Block deleted");
    }
  }), shareModal && /*#__PURE__*/React.createElement(ShareModal, {
    onClose: () => setShareModal(false),
    addToast: addToast
  }), scheduleModal && /*#__PURE__*/React.createElement(ScheduleModal, {
    onClose: () => setScheduleModal(false),
    addToast: addToast
  }));
};

// ---- Dashboard body (renders filter + blocks) ----
const DashboardBody = ({
  project,
  dash,
  blocks,
  onEdit,
  onDelete,
  onChangeSpan,
  onAddBlock,
  onTestSegment
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement(FilterRow, {
  label: "Project"
}, /*#__PURE__*/React.createElement(Chip, {
  onRemove: () => {}
}, project.name)), /*#__PURE__*/React.createElement(FilterRow, {
  label: "Platform"
}, /*#__PURE__*/React.createElement(Chip, {
  onRemove: () => {}
}, "android"), /*#__PURE__*/React.createElement(Chip, {
  onRemove: () => {}
}, "ios")), /*#__PURE__*/React.createElement(FilterRow, {
  label: "Country"
}, /*#__PURE__*/React.createElement(Chip, {
  flag: "#1e5fbc",
  onRemove: () => {}
}, "United States"), /*#__PURE__*/React.createElement(Chip, {
  flag: "#d4a017",
  onRemove: () => {}
}, "Germany"), /*#__PURE__*/React.createElement(Chip, {
  flag: "#7eb344",
  onRemove: () => {}
}, "Brazil")), /*#__PURE__*/React.createElement(FilterRow, {
  label: "Source"
}, /*#__PURE__*/React.createElement(Chip, {
  onRemove: () => {}
}, "organic"), /*#__PURE__*/React.createElement(Chip, {
  kind: "neg",
  onRemove: () => {}
}, "mintegral_int")), /*#__PURE__*/React.createElement("div", {
  className: "filter-row",
  style: {
    gridTemplateColumns: "130px auto 1fr"
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "filter-row__label"
}, /*#__PURE__*/React.createElement("span", {
  className: "filter-row__cb is-on"
}), /*#__PURE__*/React.createElement("select", {
  className: "field__select",
  defaultValue: "Day",
  style: {
    width: 110,
    height: 28,
    padding: "4px 28px 4px 10px"
  }
}, /*#__PURE__*/React.createElement("option", null, "Day"), /*#__PURE__*/React.createElement("option", null, "Week"), /*#__PURE__*/React.createElement("option", null, "Month"))), /*#__PURE__*/React.createElement("input", {
  className: "field__input",
  defaultValue: "16/04/2026 \u2014 15/05/2026",
  style: {
    width: 240
  }
}), /*#__PURE__*/React.createElement("div", {
  className: "row gap-8"
}, /*#__PURE__*/React.createElement("button", {
  className: "btn btn--primary"
}, "GO!"), /*#__PURE__*/React.createElement("button", {
  className: "btn"
}, "Cancel"), /*#__PURE__*/React.createElement("button", {
  className: "btn"
}, "Clear")))), /*#__PURE__*/React.createElement(SectionTitle, {
  q: true
}, dash.name), /*#__PURE__*/React.createElement("div", {
  className: "dash-grid"
}, blocks.map(b => /*#__PURE__*/React.createElement(DashBlock, {
  key: b.id,
  block: b,
  project: project,
  onEdit: () => onEdit(b.id),
  onDelete: () => onDelete(b.id),
  onChangeSpan: span => onChangeSpan(b.id, span),
  onTestSegment: onTestSegment
})), /*#__PURE__*/React.createElement("div", {
  className: "dash-block span-4",
  style: {
    border: "2px dashed var(--line)",
    boxShadow: "none",
    background: "transparent",
    display: "grid",
    placeItems: "center",
    color: "var(--ink-3)",
    fontWeight: 700,
    cursor: "pointer",
    minHeight: 160
  },
  onClick: onAddBlock
}, /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: "center"
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "plus",
  size: 32,
  color: "var(--ink-4)"
}), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 6
  }
}, "Add block")))));

// ---- Dashboard block ----
const DashBlock = ({
  block,
  project,
  onEdit,
  onDelete,
  onChangeSpan,
  onTestSegment
}) => /*#__PURE__*/React.createElement("div", {
  className: `dash-block span-${block.span || 6}`,
  style: block.isNew ? {
    borderColor: "var(--brand)",
    boxShadow: "0 0 0 2px rgba(42,107,224,0.15)"
  } : {}
}, /*#__PURE__*/React.createElement("div", {
  className: "dash-block__head"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "dash-block__title"
}, block.title), block.sourceEvent && /*#__PURE__*/React.createElement("div", {
  className: "tiny muted",
  style: {
    marginTop: 2
  }
}, "from ", /*#__PURE__*/React.createElement("span", {
  className: "dt-mono"
}, block.sourceEvent), " \xB7 ", /*#__PURE__*/React.createElement("span", {
  className: "dt-mono"
}, block.formula))), /*#__PURE__*/React.createElement("div", {
  className: "dash-block__actions"
}, /*#__PURE__*/React.createElement("button", {
  className: "dash-block__act-btn",
  title: "Test on segment",
  onClick: () => onTestSegment({
    name: block.title + " users",
    metric: block.metric
  })
}, /*#__PURE__*/React.createElement(Icon, {
  name: "flask",
  size: 14
})), /*#__PURE__*/React.createElement("button", {
  className: "dash-block__act-btn",
  title: "Span -",
  onClick: () => onChangeSpan(Math.max(3, (block.span || 6) - 3))
}, "\u2014"), /*#__PURE__*/React.createElement("button", {
  className: "dash-block__act-btn",
  title: "Span +",
  onClick: () => onChangeSpan(Math.min(12, (block.span || 6) + 3))
}, "+"), /*#__PURE__*/React.createElement("button", {
  className: "dash-block__act-btn",
  title: "Edit",
  onClick: onEdit
}, /*#__PURE__*/React.createElement(Icon, {
  name: "edit",
  size: 14
})), /*#__PURE__*/React.createElement("button", {
  className: "dash-block__act-btn",
  title: "Delete",
  onClick: onDelete
}, /*#__PURE__*/React.createElement(Icon, {
  name: "trash",
  size: 14
})))), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minHeight: 0
  }
}, renderBlockBody(block, project)));
function renderBlockBody(block, project) {
  const seed = (project ? project.id : "global") + ":" + block.id + ":" + block.metric;
  switch (block.type) {
    case "line":
      return /*#__PURE__*/React.createElement(LineChart, {
        seed: seed,
        height: 180,
        series: [{
          label: block.metric,
          values: smoothBI(seededSeries(seed, 28, 60, 140))
        }, {
          label: "prev",
          values: smoothBI(seededSeries(seed + "prev", 28, 50, 130))
        }]
      });
    case "area":
      return /*#__PURE__*/React.createElement(AreaChart, {
        seed: seed,
        height: 180
      });
    case "bar":
      return /*#__PURE__*/React.createElement(BarChart, {
        seed: seed,
        height: 180,
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        series: [{
          label: block.metric,
          values: seededSeries(seed, 7, 30, 100)
        }, {
          label: "prev wk",
          values: seededSeries(seed + "p", 7, 25, 90)
        }],
        palette: ["#2A6BE0", "#a0a8b5"]
      });
    case "stacked":
      return /*#__PURE__*/React.createElement(StackedArea, {
        seed: seed,
        height: 180
      });
    case "heatmap":
      return /*#__PURE__*/React.createElement(Heatmap, {
        seed: seed,
        rows: 6,
        cols: 20,
        height: 180,
        rowLabels: ["W19", "W20", "W21", "W22", "W23", "W24"],
        colLabels: ["D1", "", "D5", "", "D10", "", "D15", "", "D20", "", "D25", "", "D30"]
      });
    case "funnel":
      return /*#__PURE__*/React.createElement(Funnel, {
        steps: [{
          label: "Step 1",
          value: 10000
        }, {
          label: "Step 2",
          value: 7620
        }, {
          label: "Step 3",
          value: 5840
        }, {
          label: "Step 4",
          value: 1900
        }]
      });
    case "table":
      return /*#__PURE__*/React.createElement("table", {
        className: "dt",
        style: {
          fontSize: 12
        }
      }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Item"), /*#__PURE__*/React.createElement("th", {
        className: "dt-num"
      }, "Users"), /*#__PURE__*/React.createElement("th", {
        className: "dt-num"
      }, "Metric"), /*#__PURE__*/React.createElement("th", {
        className: "dt-num"
      }, "\u0394"))), /*#__PURE__*/React.createElement("tbody", null, [["United States", "48 120", "$0.092", "+3.4%"], ["Brazil", "21 410", "$0.041", "+1.2%"], ["Germany", "18 220", "$0.118", "-0.4%"], ["Mexico", "17 980", "$0.038", "+2.1%"], ["United Kingdom", "14 880", "$0.097", "+0.8%"]].map((r, i) => /*#__PURE__*/React.createElement("tr", {
        key: i
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, r[0])), /*#__PURE__*/React.createElement("td", {
        className: "dt-num"
      }, r[1]), /*#__PURE__*/React.createElement("td", {
        className: "dt-num"
      }, r[2]), /*#__PURE__*/React.createElement("td", {
        className: "dt-num",
        style: {
          color: r[3].startsWith("-") ? "var(--status-crit)" : "var(--status-ok)",
          fontWeight: 700
        }
      }, r[3])))));
    case "number":
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "grid",
          placeItems: "center",
          height: "100%"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 36,
          fontWeight: 800,
          color: "var(--accent-teal)"
        }
      }, (seededSeries(seed, 1, 100, 9000)[0] | 0).toLocaleString()), /*#__PURE__*/React.createElement("div", {
        className: "muted tiny",
        style: {
          textTransform: "uppercase",
          letterSpacing: 0.4,
          fontWeight: 700
        }
      }, block.metric));
    default:
      return /*#__PURE__*/React.createElement("div", {
        className: "empty",
        style: {
          padding: 20
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "muted"
      }, "No data preview"));
  }
}
function smoothBI(arr, k = 1) {
  return arr.map((_, i) => {
    let s = 0,
      c = 0;
    for (let j = -k; j <= k; j++) {
      if (i + j >= 0 && i + j < arr.length) {
        s += arr[i + j];
        c++;
      }
    }
    return s / c;
  });
}

// ---- Block editor side panel ----
const BlockEditorPanel = ({
  block,
  project,
  onClose,
  onSave,
  onClone,
  onDelete
}) => {
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
  return /*#__PURE__*/React.createElement("aside", {
    className: "bi-side-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bi-side-panel__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal__title"
  }, "Edit block"), /*#__PURE__*/React.createElement("button", {
    className: "modal__close",
    onClick: onClose
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "bi-side-panel__tabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: "editor-tab" + (tab === "viz" ? " is-active" : ""),
    onClick: () => setTab("viz")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chart-line",
    size: 12
  }), " Visualization"), /*#__PURE__*/React.createElement("button", {
    className: "editor-tab" + (tab === "sql" ? " is-active" : ""),
    onClick: () => setTab("sql")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "code",
    size: 12
  }), " SQL"), /*#__PURE__*/React.createElement("button", {
    className: "editor-tab" + (tab === "format" ? " is-active" : ""),
    onClick: () => setTab("format")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 12
  }), " Format")), /*#__PURE__*/React.createElement("div", {
    className: "bi-side-panel__body"
  }, tab === "viz" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Title"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: title,
    onChange: e => setTitle(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Metric"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: metric,
    onChange: e => setMetric(e.target.value)
  }, ["DAU", "MAU", "ARPU", "ARPDAU", "ARPPU", "Revenue", "Installs", "Retention D1", "Retention D7", "Retention D30", "LTV", "CPI", "Sessions", "Session Length", "CR", "Match starts", "Win Rate", "Run length", "Floor reached", "Harvests", "Merges", "Chain Depth"].map(m => /*#__PURE__*/React.createElement("option", {
    key: m,
    value: m
  }, m)))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Visualization"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 6
    }
  }, [{
    t: "line",
    label: "Line",
    ic: "chart-line"
  }, {
    t: "area",
    label: "Area",
    ic: "chart-line"
  }, {
    t: "bar",
    label: "Bar",
    ic: "chart-bar"
  }, {
    t: "stacked",
    label: "Stack",
    ic: "chart-bar"
  }, {
    t: "heatmap",
    label: "Heat",
    ic: "table"
  }, {
    t: "funnel",
    label: "Funnel",
    ic: "filter"
  }, {
    t: "table",
    label: "Table",
    ic: "table"
  }, {
    t: "number",
    label: "Number",
    ic: "chart-pie"
  }].map(v => /*#__PURE__*/React.createElement("button", {
    key: v.t,
    className: "btn btn--sm " + (type === v.t ? "btn--primary" : ""),
    onClick: () => setType(v.t),
    style: {
      flexDirection: "column",
      height: 46,
      gap: 2,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: v.ic,
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, v.label))))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Width (cols)"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, [3, 4, 6, 8, 12].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: "btn btn--sm " + (span === s ? "btn--primary" : ""),
    onClick: () => setSpan(s),
    style: {
      minWidth: 36
    }
  }, s)))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Breakdown"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: breakdown,
    onChange: e => setBreakdown(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "none"
  }, "No breakdown"), /*#__PURE__*/React.createElement("option", {
    value: "platform"
  }, "Platform"), /*#__PURE__*/React.createElement("option", {
    value: "country"
  }, "Country"), /*#__PURE__*/React.createElement("option", {
    value: "acquisition_channel"
  }, "Acquisition channel"), /*#__PURE__*/React.createElement("option", {
    value: "user_segment"
  }, "User segment (whale / dolphin / minnow / non-payer)"))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Aggregation"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: period,
    onChange: e => setPeriod(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "hourly"
  }, "Hourly"), /*#__PURE__*/React.createElement("option", {
    value: "daily"
  }, "Daily"), /*#__PURE__*/React.createElement("option", {
    value: "weekly"
  }, "Weekly"), /*#__PURE__*/React.createElement("option", {
    value: "monthly"
  }, "Monthly"))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Smoothing (moving avg)"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: smoothing,
    onChange: e => setSmoothing(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "off"
  }, "Off"), /*#__PURE__*/React.createElement("option", {
    value: "7d"
  }, "7-day"), /*#__PURE__*/React.createElement("option", {
    value: "14d"
  }, "14-day"), /*#__PURE__*/React.createElement("option", {
    value: "30d"
  }, "30-day"))), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm",
    onClick: onClone
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 12
  }), " Clone"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 12
  }), " CSV"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "external",
    size: 12
  }), " Pin to Hub")), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: "var(--ink-3)",
      textTransform: "uppercase",
      letterSpacing: 0.4,
      marginBottom: 8
    }
  }, "Preview"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      padding: 10,
      borderRadius: 6,
      border: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      marginBottom: 6
    }
  }, title), renderBlockBody({
    ...block,
    type,
    metric
  }, project))), tab === "sql" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row gap-8 mb-12"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--success btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 12
  }), " Run"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "save",
    size: 12
  }), " Save"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 12
  }), " Copy")), /*#__PURE__*/React.createElement("textarea", {
    className: "sql-input",
    value: sql,
    onChange: e => setSql(e.target.value),
    rows: 14
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label",
    style: {
      marginBottom: 6
    }
  }, "Result preview \xB7 5 of 28"), /*#__PURE__*/React.createElement("table", {
    className: "dt",
    style: {
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "date"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "value"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "prev"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "\u0394%"))), /*#__PURE__*/React.createElement("tbody", null, [["2026-05-15", "148,220", "135,011", "+9.8%"], ["2026-05-14", "144,108", "132,002", "+9.2%"], ["2026-05-13", "142,331", "130,544", "+9.0%"], ["2026-05-12", "140,109", "129,210", "+8.4%"], ["2026-05-11", "139,202", "128,300", "+8.5%"]].map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, r[0]), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r[1]), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r[2]), /*#__PURE__*/React.createElement("td", {
    className: "dt-num",
    style: {
      color: "#2a7d34",
      fontWeight: 700
    }
  }, r[3]))))))), tab === "format" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Color palette"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: palette,
    onChange: e => setPalette(e.target.value)
  }, /*#__PURE__*/React.createElement("option", null, "Default"), /*#__PURE__*/React.createElement("option", null, "Revenue"), /*#__PURE__*/React.createElement("option", null, "Danger"), /*#__PURE__*/React.createElement("option", null, "Cool"), /*#__PURE__*/React.createElement("option", null, "Monochrome"))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Number format"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    defaultValue: "auto"
  }, /*#__PURE__*/React.createElement("option", {
    value: "auto"
  }, "Auto"), /*#__PURE__*/React.createElement("option", {
    value: "thousands"
  }, "Thousands separator"), /*#__PURE__*/React.createElement("option", {
    value: "millions"
  }, "Millions (1.2M)"), /*#__PURE__*/React.createElement("option", {
    value: "percent"
  }, "Percentage"), /*#__PURE__*/React.createElement("option", {
    value: "currency"
  }, "Currency ($)"))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Conditional formatting"), /*#__PURE__*/React.createElement("div", {
    className: "muted tiny"
  }, "Add rule:"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4 mt-8"
  }, /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("option", null, "value"), /*#__PURE__*/React.createElement("option", null, "delta")), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    style: {
      width: 60
    }
  }, /*#__PURE__*/React.createElement("option", null, ">"), /*#__PURE__*/React.createElement("option", null, "<"), /*#__PURE__*/React.createElement("option", null, "=")), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "0.95",
    style: {
      width: 90
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, "+ Add"))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Comparisons"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    defaultValue: "prev_period"
  }, /*#__PURE__*/React.createElement("option", {
    value: "prev_period"
  }, "Previous period"), /*#__PURE__*/React.createElement("option", {
    value: "prev_year"
  }, "Previous year"), /*#__PURE__*/React.createElement("option", {
    value: "none"
  }, "No comparison"))))), /*#__PURE__*/React.createElement("div", {
    className: "bi-side-panel__foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--danger btn--sm",
    onClick: onDelete
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 12
  }), " Delete"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    onClick: () => onSave({
      title,
      type,
      metric,
      span
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "save",
    size: 14
  }), " Save")));
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
const ShareModal = ({
  onClose,
  addToast
}) => /*#__PURE__*/React.createElement(Modal, {
  title: "Share dashboard",
  onClose: onClose,
  footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: onClose
  }, "Close"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    onClick: () => {
      addToast("Link copied to clipboard");
      onClose();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 14
  }), " Copy link"))
}, /*#__PURE__*/React.createElement("div", {
  className: "field"
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Share link"), /*#__PURE__*/React.createElement("input", {
  className: "field__input dt-mono",
  readOnly: true,
  value: "https://gdc.analytics/d/iron_shells/overview?v=2026-05-15"
})), /*#__PURE__*/React.createElement("div", {
  className: "field mt-12"
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Access"), /*#__PURE__*/React.createElement("select", {
  className: "field__select",
  defaultValue: "team"
}, /*#__PURE__*/React.createElement("option", {
  value: "team"
}, "My team (12 members)"), /*#__PURE__*/React.createElement("option", {
  value: "org"
}, "Whole organisation"), /*#__PURE__*/React.createElement("option", {
  value: "link"
}, "Anyone with the link"), /*#__PURE__*/React.createElement("option", {
  value: "private"
}, "Only me"))), /*#__PURE__*/React.createElement("div", {
  className: "field mt-12"
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Slack channel (optional)"), /*#__PURE__*/React.createElement("input", {
  className: "field__input",
  defaultValue: "#bi-iron-shells"
})));
const ScheduleModal = ({
  onClose,
  addToast
}) => /*#__PURE__*/React.createElement(Modal, {
  title: "Schedule report",
  onClose: onClose,
  footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    onClick: () => {
      addToast("Report scheduled — first delivery Monday 9am");
      onClose();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Schedule"))
}, /*#__PURE__*/React.createElement("div", {
  className: "row gap-12"
}, /*#__PURE__*/React.createElement("div", {
  className: "field",
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Frequency"), /*#__PURE__*/React.createElement("select", {
  className: "field__select",
  defaultValue: "weekly"
}, /*#__PURE__*/React.createElement("option", null, "Daily"), /*#__PURE__*/React.createElement("option", null, "Weekly"), /*#__PURE__*/React.createElement("option", null, "Monthly"), /*#__PURE__*/React.createElement("option", null, "Quarterly"))), /*#__PURE__*/React.createElement("div", {
  className: "field",
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Day & time"), /*#__PURE__*/React.createElement("input", {
  className: "field__input",
  defaultValue: "Monday, 09:00 UTC"
}))), /*#__PURE__*/React.createElement("div", {
  className: "field mt-12"
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Recipients"), /*#__PURE__*/React.createElement("div", {
  className: "filter-row__chips"
}, /*#__PURE__*/React.createElement(Chip, {
  kind: "blue"
}, "a.volkova@gdc.io"), /*#__PURE__*/React.createElement(Chip, {
  kind: "blue"
}, "p.orlov@gdc.io"), /*#__PURE__*/React.createElement(Chip, {
  kind: "blue"
}, "ceo@gdc.io"), /*#__PURE__*/React.createElement("button", {
  className: "btn btn--sm btn--ghost"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "plus",
  size: 12
}), " add"))), /*#__PURE__*/React.createElement("div", {
  className: "field mt-12"
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Format"), /*#__PURE__*/React.createElement("div", {
  className: "row gap-8"
}, /*#__PURE__*/React.createElement("label", {
  className: "row gap-4"
}, /*#__PURE__*/React.createElement("input", {
  type: "radio",
  name: "fmt",
  defaultChecked: true
}), " PDF"), /*#__PURE__*/React.createElement("label", {
  className: "row gap-4"
}, /*#__PURE__*/React.createElement("input", {
  type: "radio",
  name: "fmt"
}), " CSV"), /*#__PURE__*/React.createElement("label", {
  className: "row gap-4"
}, /*#__PURE__*/React.createElement("input", {
  type: "radio",
  name: "fmt"
}), " Slack message"))));
window.BIScreen = BIScreen;