/* A/B Splitter — experiments list / designer / results */

const ABScreen = ({
  project,
  onProjectChange,
  navPayload,
  setNavPayload,
  addToast,
  onSaveToKB,
  onOpenBI
}) => {
  const activeProj = project || AppData.projectById("iron_shells");
  const [experiments, setExperiments] = useState(AppData.experiments);
  const [view, setView] = useState(navPayload && navPayload.view || "list"); // list | designer | results
  const [activeId, setActiveId] = useState(navPayload && navPayload.experimentId || null);
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
        variants: [{
          id: "A",
          name: "Control",
          split: 0.5,
          users: 0,
          metric: "—"
        }, {
          id: "B",
          name: "Test B",
          split: 0.5,
          users: 0,
          metric: "—"
        }],
        secondary: [],
        inclusion: ["platform: ALL", "cohort_date ≥ 2026-04-15"],
        eventSource: draft.event.name
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
  const list = experiments.filter(e => activeProj && e.project === activeProj.id && (filterStatus === "All" || e.status === filterStatus));
  return /*#__PURE__*/React.createElement("div", {
    className: "main main--sidebar"
  }, /*#__PURE__*/React.createElement(ProjectSidebar, {
    project: activeProj,
    onSelectProject: p => {
      onProjectChange(p);
      setView("list");
      setActiveId(null);
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement(PageTitle, {
    crumbs: ["A/B Splitter", activeProj.name],
    title: view === "list" ? "Experiments" : view === "designer" ? active ? active.title : "New experiment" : active ? active.title : "Results",
    q: true,
    actions: view === "list" ? [/*#__PURE__*/React.createElement("button", {
      key: "n",
      className: "btn btn--primary",
      onClick: () => {
        const id = "ab-" + Date.now();
        const newExp = {
          id,
          title: "New experiment",
          project: activeProj.id,
          hypothesis: "",
          primaryMetric: "Retention D1",
          metricType: "binary",
          status: "Draft",
          progress: 0,
          pValueOrPb: null,
          lift: null,
          owner: "A. Volkova",
          trafficShare: 50,
          variants: [{
            id: "A",
            name: "Control",
            split: 0.5,
            users: 0,
            metric: "—"
          }, {
            id: "B",
            name: "Test B",
            split: 0.5,
            users: 0,
            metric: "—"
          }],
          secondary: [],
          inclusion: ["platform: ALL"]
        };
        setExperiments(prev => [newExp, ...prev]);
        setActiveId(id);
        setView("designer");
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " New experiment")] : [/*#__PURE__*/React.createElement("button", {
      key: "b",
      className: "btn",
      onClick: () => setView("list")
    }, "\u2190 Back to list")]
  }), view === "list" && /*#__PURE__*/React.createElement(ExperimentList, {
    list: list,
    filterStatus: filterStatus,
    setFilterStatus: setFilterStatus,
    onOpen: e => {
      setActiveId(e.id);
      setView(e.status === "Draft" ? "designer" : "results");
    }
  }), view === "designer" && active && /*#__PURE__*/React.createElement(ExperimentDesigner, {
    experiment: active,
    onChange: changes => setExperiments(prev => prev.map(e => e.id === active.id ? {
      ...e,
      ...changes
    } : e)),
    onLaunch: () => {
      setExperiments(prev => prev.map(e => e.id === active.id ? {
        ...e,
        status: "Active",
        progress: 1,
        startedAt: "2026-05-18",
        endsAt: "2026-06-01"
      } : e));
      setView("results");
      addToast("Experiment launched");
    }
  }), view === "results" && active && /*#__PURE__*/React.createElement(ExperimentResults, {
    experiment: active,
    onSaveToKB: () => {
      onSaveToKB(active);
      addToast("Saved to Knowledge Base");
    },
    onOpenBI: () => onOpenBI(active),
    onClose: decision => {
      setExperiments(prev => prev.map(e => e.id === active.id ? {
        ...e,
        status: "Completed",
        decision,
        progress: 100
      } : e));
      addToast(`Experiment closed · ${decision}`);
    }
  })));
};

// ---- Experiment list (per project) ----
const ExperimentList = ({
  list,
  filterStatus,
  setFilterStatus,
  onOpen
}) => /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "toolbar-row"
}, ["All", "Draft", "Active", "Completed"].map(s => /*#__PURE__*/React.createElement("button", {
  key: s,
  className: "btn btn--sm " + (filterStatus === s ? "btn--primary" : ""),
  onClick: () => setFilterStatus(s)
}, s)), /*#__PURE__*/React.createElement("div", {
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
  placeholder: "Search experiments\u2026",
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
}))), list.length === 0 ? /*#__PURE__*/React.createElement("div", {
  className: "empty"
}, /*#__PURE__*/React.createElement("div", {
  className: "empty__face"
}, "\uD83E\uDDEA"), /*#__PURE__*/React.createElement("div", {
  className: "empty__title"
}, "No experiments in this project (with this filter)")) : /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Experiment"), /*#__PURE__*/React.createElement("th", null, "Primary metric"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
  style: {
    width: 200
  }
}, "Progress"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "P(B>A)"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "Lift"), /*#__PURE__*/React.createElement("th", null, "Decision"), /*#__PURE__*/React.createElement("th", null, "Owner"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, list.map(e => /*#__PURE__*/React.createElement("tr", {
  key: e.id,
  style: {
    cursor: "pointer"
  },
  onClick: () => onOpen(e)
}, /*#__PURE__*/React.createElement("td", {
  className: "dt-mono muted"
}, e.id), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, e.title), /*#__PURE__*/React.createElement("div", {
  className: "tiny muted"
}, e.hypothesis.slice(0, 80), e.hypothesis.length > 80 ? "…" : "")), /*#__PURE__*/React.createElement("td", null, e.primaryMetric, /*#__PURE__*/React.createElement("div", {
  className: "tiny muted"
}, e.metricType)), /*#__PURE__*/React.createElement("td", null, e.status === "Active" && /*#__PURE__*/React.createElement(Pill, {
  kind: "info"
}, "Active"), e.status === "Completed" && /*#__PURE__*/React.createElement(Pill, {
  kind: "ok"
}, "Completed"), e.status === "Draft" && /*#__PURE__*/React.createElement(Pill, {
  kind: "draft"
}, "Draft"), e.status === "Paused" && /*#__PURE__*/React.createElement(Pill, {
  kind: "warn"
}, "Paused")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
  className: "bar"
}, /*#__PURE__*/React.createElement("div", {
  className: "bar__fill " + (e.status === "Completed" ? "bar__fill--ok" : ""),
  style: {
    width: e.progress + "%"
  }
})), /*#__PURE__*/React.createElement("div", {
  className: "tiny muted",
  style: {
    marginTop: 2
  }
}, e.startedAt || "—", " \u2192 ", e.endsAt || "—")), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, e.pValueOrPb == null ? "—" : e.pValueOrPb.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    fontWeight: 700,
    color: !e.lift ? "var(--ink-3)" : e.lift.startsWith("-") ? "var(--status-crit)" : "var(--status-ok)"
  }
}, e.lift || "—"), /*#__PURE__*/React.createElement("td", null, e.decision === "Accepted" && /*#__PURE__*/React.createElement(Pill, {
  kind: "ok"
}, "Accepted"), e.decision === "Rejected" && /*#__PURE__*/React.createElement(Pill, {
  kind: "crit"
}, "Rejected"), !e.decision && /*#__PURE__*/React.createElement("span", {
  className: "muted"
}, "\u2014")), /*#__PURE__*/React.createElement("td", {
  className: "tiny"
}, e.owner), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Icon, {
  name: "chevron-right",
  size: 14,
  color: "var(--ink-3)"
})))))));

// ---- Designer ----
const ExperimentDesigner = ({
  experiment,
  onChange,
  onLaunch
}) => {
  const e = experiment;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "1. Hypothesis")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Hypothesis statement"), /*#__PURE__*/React.createElement("textarea", {
    className: "field__textarea",
    rows: 3,
    value: e.hypothesis,
    onChange: ev => onChange({
      hypothesis: ev.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "row gap-12 mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Title"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: e.title,
    onChange: ev => onChange({
      title: ev.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Owner"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: e.owner,
    onChange: ev => onChange({
      owner: ev.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Tags"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "liveops, retention",
    placeholder: "comma-separated"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "2. Primary metric")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Metric"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: e.primaryMetric,
    onChange: ev => onChange({
      primaryMetric: ev.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "Retention D1"), /*#__PURE__*/React.createElement("option", null, "Retention D7"), /*#__PURE__*/React.createElement("option", null, "ARPU D7"), /*#__PURE__*/React.createElement("option", null, "Tutorial Completion"), /*#__PURE__*/React.createElement("option", null, "Purchase CR"), /*#__PURE__*/React.createElement("option", null, "Banner CTR"), /*#__PURE__*/React.createElement("option", null, "Session Length")), e.eventSource && /*#__PURE__*/React.createElement("div", {
    className: "muted tiny mt-8"
  }, "Source event: ", /*#__PURE__*/React.createElement("span", {
    className: "dt-mono"
  }, e.eventSource))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Metric type"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: e.metricType,
    onChange: ev => onChange({
      metricType: ev.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "binary"
  }, "Binary \u2014 Bayesian Beta(1,1)"), /*#__PURE__*/React.createElement("option", {
    value: "continuous"
  }, "Continuous \u2014 Normal approx."))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Decision threshold"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "P(B>A) \u2265 0.95"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row gap-12 mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Minimum detectable effect"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "+1.5pp"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Expected baseline"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: e.metricType === "binary" ? "32%" : "$0.080"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Estimated duration"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "14 days @ current DAU",
    readOnly: true,
    style: {
      background: "var(--brand-tint)"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "3. Variants & traffic"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12
  }), " Add variant")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Description"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Traffic %"))), /*#__PURE__*/React.createElement("tbody", null, e.variants.map((v, i) => /*#__PURE__*/React.createElement("tr", {
    key: v.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, v.id)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: v.name
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: i === 0 ? "Holdout, original config" : "New configuration"
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: (v.split * 100).toFixed(0) + "%",
    style: {
      width: 90,
      textAlign: "right"
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card__body",
    style: {
      borderTop: "1px solid var(--line-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label",
    style: {
      marginBottom: 6
    }
  }, "Total traffic share"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "5",
    max: "100",
    defaultValue: e.trafficShare,
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: e.trafficShare + "%",
    style: {
      width: 80,
      textAlign: "right"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "muted tiny mt-8"
  }, "User assignment: ", /*#__PURE__*/React.createElement("span", {
    className: "dt-mono"
  }, "hash(user_id + experiment_id) mod 10000"), " \xB7 deterministic, sticky across sessions."))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "4. Inclusion criteria (JSONB)")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Platforms"), /*#__PURE__*/React.createElement("div", {
    className: "filter-row__chips"
  }, /*#__PURE__*/React.createElement(Chip, null, "iOS"), /*#__PURE__*/React.createElement(Chip, null, "Android"))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Countries"), /*#__PURE__*/React.createElement("div", {
    className: "filter-row__chips"
  }, /*#__PURE__*/React.createElement(Chip, {
    flag: "#1e5fbc"
  }, "US"), /*#__PURE__*/React.createElement(Chip, {
    flag: "#d4a017"
  }, "DE"), /*#__PURE__*/React.createElement(Chip, {
    flag: "#7eb344"
  }, "BR"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12
  }), " add"))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Min install date (cohort)"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    defaultValue: "2026-04-15"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Custom rule (SQL)"), /*#__PURE__*/React.createElement("input", {
    className: "field__input dt-mono",
    defaultValue: "app_version >= '11.4.0' AND user_segment != 'whale'"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "5. Pre-flight checks")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Sum of traffic_split = 1.0"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "\u2713 Passed"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Estimated power at MDE"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "82%"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Sample size per variant"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, "\u2265 14 200 users")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Overlapping active experiments"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, "1 overlap"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "EMS event ", e.eventSource ? /*#__PURE__*/React.createElement("span", {
    className: "dt-mono"
  }, e.eventSource) : "selected", " health"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "OK \xB7 v7")))))), /*#__PURE__*/React.createElement("div", {
    className: "row row--end gap-8 mt-16"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn"
  }, "Save draft"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--success btn--lg",
    onClick: onLaunch
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " Launch experiment")));
};

// ---- Results ----
const ExperimentResults = ({
  experiment,
  onSaveToKB,
  onOpenBI,
  onClose
}) => {
  const e = experiment;
  const [closeMode, setCloseMode] = useState(null);
  const [statMethod, setStatMethod] = useState("bayesian"); // bayesian | frequentist | sequential
  const [showSegments, setShowSegments] = useState(false);
  const aMetric = e.variants[0].metric;
  const bMetric = e.variants[1] ? e.variants[1].metric : "—";
  const totalUsers = e.variants.reduce((s, v) => s + v.users, 0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row row--between",
    style: {
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted tiny",
    style: {
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      marginBottom: 4
    }
  }, "Hypothesis"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: "var(--ink)"
    }
  }, e.hypothesis), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8 mt-12"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, e.primaryMetric), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, e.metricType), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "Owner ", e.owner), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, e.startedAt, " \u2192 ", e.endsAt), e.status === "Active" && /*#__PURE__*/React.createElement(Pill, {
    kind: "info"
  }, "Active"), e.status === "Completed" && /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "Completed"))), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: onOpenBI
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chart-line",
    size: 14
  }), " View in BI"), e.status === "Completed" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 14
  }), " Create follow-up"), /*#__PURE__*/React.createElement("button", {
    className: "btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " Rollout plan")), e.status === "Completed" ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    onClick: onSaveToKB
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 14
  }), " Save to KB") : /*#__PURE__*/React.createElement("button", {
    className: "btn btn--danger",
    onClick: () => setCloseMode("open")
  }, "Close experiment"))))), e.status === "Active" && e.pValueOrPb >= 0.9 && /*#__PURE__*/React.createElement("div", {
    className: "recommend-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "recommend-banner__icon"
  }, "!"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Recommended action: ", /*#__PURE__*/React.createElement("b", null, e.lift && e.lift.startsWith("-") ? "Reject" : "Accept variant B")), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      fontWeight: 600,
      opacity: 0.85
    }
  }, "P(B>A) reached ", (e.pValueOrPb * 100).toFixed(1), "% \u2014 above 95% threshold"))), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid"
  }, /*#__PURE__*/React.createElement(MetricTile, {
    label: "Users assigned",
    value: totalUsers.toLocaleString()
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Primary metric (A)",
    value: aMetric
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Primary metric (B)",
    value: bMetric
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Lift",
    value: e.lift || "—",
    delta: e.pValueOrPb == null ? "n/a" : `P(B>A)=${(e.pValueOrPb * 100).toFixed(0)}%`,
    deltaDir: e.lift && e.lift.startsWith("-") ? "down" : "up"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Sample power",
    value: "82%"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "Days running",
    value: e.startedAt ? Math.max(1, Math.round((new Date("2026-05-18") - new Date(e.startedAt)) / 86400000)) + "d" : "—"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card mt-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Statistical analysis"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm " + (statMethod === "bayesian" ? "btn--primary" : ""),
    onClick: () => setStatMethod("bayesian")
  }, "Bayesian"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm " + (statMethod === "frequentist" ? "btn--primary" : ""),
    onClick: () => setStatMethod("frequentist")
  }, "Frequentist"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm " + (statMethod === "sequential" ? "btn--primary" : ""),
    onClick: () => setStatMethod("sequential")
  }, "Sequential"))), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, statMethod === "bayesian" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PosteriorChart, {
    aMean: parseFloat(String(aMetric).replace(/[^\d.-]/g, "")) / (String(aMetric).includes("%") ? 100 : String(aMetric).includes("$") ? 1 : 100) || 0.32,
    bMean: parseFloat(String(bMetric).replace(/[^\d.-]/g, "")) / (String(bMetric).includes("%") ? 100 : String(bMetric).includes("$") ? 1 : 100) || 0.34,
    aSd: 0.012,
    bSd: 0.012
  }), /*#__PURE__*/React.createElement("div", {
    className: "muted tiny mt-8"
  }, "Beta(1,1) prior \xB7 Numerical integration over 1000 points on [0.001, 0.999]. P(B>A) recalculated hourly.")), statMethod === "frequentist" && /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Test"), /*#__PURE__*/React.createElement("td", null, "Two-sample two-tailed z-test")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "p-value"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, /*#__PURE__*/React.createElement("b", null, e.pValueOrPb ? (1 - e.pValueOrPb).toFixed(4) : "—"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "95% confidence interval (lift)"), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, "[", e.lift && e.lift.startsWith("+") ? "+0.4pp" : "-0.2pp", ", ", e.lift && e.lift.startsWith("+") ? "+3.2pp" : "+0.8pp", "]")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Effect size (Cohen's h)"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, "0.038")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Statistical power"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, "82%")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Verdict"), /*#__PURE__*/React.createElement("td", null, e.pValueOrPb >= 0.95 ? /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "Reject H\u2080 at \u03B1=0.05") : /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, "Insufficient evidence"))))), statMethod === "sequential" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row gap-12",
    style: {
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-tile",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-tile__label"
  }, "Always-valid p-value"), /*#__PURE__*/React.createElement("div", {
    className: "metric-tile__val"
  }, "0.041")), /*#__PURE__*/React.createElement("div", {
    className: "metric-tile",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-tile__label"
  }, "Optional stopping safe"), /*#__PURE__*/React.createElement("div", {
    className: "metric-tile__val",
    style: {
      color: "var(--status-ok)"
    }
  }, "Yes")), /*#__PURE__*/React.createElement("div", {
    className: "metric-tile",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-tile__label"
  }, "Spending function"), /*#__PURE__*/React.createElement("div", {
    className: "metric-tile__val",
    style: {
      fontSize: 14
    }
  }, "O'Brien-Fleming"))), /*#__PURE__*/React.createElement("div", {
    className: "muted tiny mt-8"
  }, "Sequential test allows you to peek at results before the planned sample size without inflating type-I error.")))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Segment breakdown"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    onClick: () => setShowSegments(s => !s)
  }, showSegments ? "Hide" : "Show breakdown")), showSegments && /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Segment"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Users (A)"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Users (B)"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, e.primaryMetric, " (A)"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, e.primaryMetric, " (B)"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Lift"), /*#__PURE__*/React.createElement("th", null, "Sig?"))), /*#__PURE__*/React.createElement("tbody", null, [{
    name: "iOS · US",
    uA: 12_311,
    uB: 12_280,
    mA: "31.1%",
    mB: "33.7%",
    lift: "+2.6pp",
    sig: true
  }, {
    name: "iOS · ROW",
    uA: 9_104,
    uB: 9_092,
    mA: "30.8%",
    mB: "32.5%",
    lift: "+1.7pp",
    sig: false
  }, {
    name: "Android · US",
    uA: 18_421,
    uB: 18_410,
    mA: "33.0%",
    mB: "34.4%",
    lift: "+1.4pp",
    sig: true
  }, {
    name: "Android · ROW",
    uA: 32_558,
    uB: 32_530,
    mA: "32.4%",
    mB: "33.9%",
    lift: "+1.5pp",
    sig: true
  }, {
    name: "Mintegral_int",
    uA: 4_220,
    uB: 4_180,
    mA: "28.1%",
    mB: "27.0%",
    lift: "-1.1pp",
    sig: false,
    bad: true
  }, {
    name: "Organic users",
    uA: 28_440,
    uB: 28_500,
    mA: "34.2%",
    mB: "36.1%",
    lift: "+1.9pp",
    sig: true
  }].map((s, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: s.bad ? "row-warn" : ""
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, s.name)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.uA.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.uB.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.mA), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.mB), /*#__PURE__*/React.createElement("td", {
    className: "dt-num",
    style: {
      color: s.lift.startsWith("-") ? "var(--status-crit)" : "var(--status-ok)",
      fontWeight: 700
    }
  }, s.lift), /*#__PURE__*/React.createElement("td", null, s.sig ? s.bad ? /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, "guardrail") : /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "Yes") : /*#__PURE__*/React.createElement(Pill, {
    kind: "draft"
  }, "No"))))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Variants")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Traffic"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Users"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, e.primaryMetric), /*#__PURE__*/React.createElement("th", null, "\u0394 vs A"))), /*#__PURE__*/React.createElement("tbody", null, e.variants.map((v, i) => /*#__PURE__*/React.createElement("tr", {
    key: v.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, v.id)), /*#__PURE__*/React.createElement("td", null, v.name), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, (v.split * 100).toFixed(0), "%"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, v.users.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, /*#__PURE__*/React.createElement("b", null, v.metric)), /*#__PURE__*/React.createElement("td", null, i === 0 ? /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "baseline") : /*#__PURE__*/React.createElement("span", {
    style: {
      color: e.lift && !e.lift.startsWith("-") ? "var(--status-ok)" : "var(--status-crit)",
      fontWeight: 700
    }
  }, e.lift || "—"))))))), e.secondary && e.secondary.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Secondary metrics & guardrails")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Metric"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "A"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "B"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Lift"), /*#__PURE__*/React.createElement("th", null, "Significant?"))), /*#__PURE__*/React.createElement("tbody", null, e.secondary.map((s, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: s.bad ? "row-warn" : ""
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, s.name)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.a), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.b), /*#__PURE__*/React.createElement("td", {
    className: "dt-num",
    style: {
      color: s.lift.startsWith("-") ? "var(--status-crit)" : "var(--status-ok)",
      fontWeight: 700
    }
  }, s.lift), /*#__PURE__*/React.createElement("td", null, s.sig ? s.bad ? /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, "Guardrail breach") : /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "Yes") : /*#__PURE__*/React.createElement(Pill, {
    kind: "draft"
  }, "No"))))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Inclusion criteria")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      lineHeight: 1.8
    }
  }, e.inclusion.map((c, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "dt-mono",
    style: {
      fontSize: 12.5
    }
  }, c))))), closeMode && /*#__PURE__*/React.createElement(Modal, {
    title: "Close experiment",
    onClose: () => setCloseMode(null),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => setCloseMode(null)
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-12"
  }, "You're about to mark ", /*#__PURE__*/React.createElement("b", null, e.title), " as Completed. The Knowledge Base record will be generated automatically."), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Decision"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    defaultValue: "Accepted",
    id: "ab-decision"
  }, /*#__PURE__*/React.createElement("option", null, "Accepted"), /*#__PURE__*/React.createElement("option", null, "Rejected"), /*#__PURE__*/React.createElement("option", null, "Inconclusive"))), /*#__PURE__*/React.createElement("div", {
    className: "field mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Decision rationale"), /*#__PURE__*/React.createElement("textarea", {
    className: "field__textarea",
    rows: 4,
    defaultValue: `Based on P(B>A)=${e.pValueOrPb ? (e.pValueOrPb * 100).toFixed(0) : "—"}% and observed lift ${e.lift}, ...`
  })), /*#__PURE__*/React.createElement("div", {
    className: "row row--end gap-8 mt-12"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    onClick: () => {
      const dec = document.getElementById("ab-decision").value;
      setCloseMode(null);
      onClose(dec);
    }
  }, "Confirm close"))));
};
window.ABScreen = ABScreen;