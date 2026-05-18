const kbTypeStyle = type => {
  const map = {
    experiment: {
      bg: "#ece0fb",
      color: "#6d3aae"
    },
    research: {
      bg: "#cfeaf2",
      color: "#1d8fb8"
    },
    case: {
      bg: "#fde7d5",
      color: "#b5470d"
    },
    incident_report: {
      bg: "#fbe2e2",
      color: "#c1393c"
    },
    playbook: {
      bg: "#d8e7fa",
      color: "#1f4ea0"
    },
    decision_log: {
      bg: "#fcecc7",
      color: "#8b6510"
    },
    metric_definition: {
      bg: "#dff3d2",
      color: "#2a7d34"
    }
  };
  return map[type] || map.experiment;
};
const kbTypeLabel = type => ({
  experiment: "EXPERIMENT",
  research: "RESEARCH",
  case: "CASE",
  incident_report: "INCIDENT",
  playbook: "PLAYBOOK",
  decision_log: "DECISION",
  metric_definition: "METRIC"
})[type] || type.toUpperCase();
const KBScreen = ({
  navPayload,
  setNavPayload,
  kbItems,
  onNavigate
}) => {
  const [view, setView] = useState(navPayload && navPayload.view || "list");
  const [activeId, setActiveId] = useState(navPayload && navPayload.itemId || null);
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
  const filtered = kbItems.filter(i => typeFilter === "all" || i.type === typeFilter).filter(i => !tagFilter || (i.tags || []).includes(tagFilter)).filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q) || (i.tags || []).some(t => t.includes(q));
  });

  // Sort
  const [sort, setSort] = useState("date_desc");
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "date_desc") return a.date < b.date ? 1 : -1;
    if (sort === "date_asc") return a.date < b.date ? -1 : 1;
    if (sort === "views") return (b.views || 0) - (a.views || 0);
    if (sort === "linked") return (b.linked || 0) - (a.linked || 0);
    return 0;
  });
  const allTags = Array.from(new Set(kbItems.flatMap(i => i.tags || []))).sort();
  const active = kbItems.find(i => i.id === activeId);
  return /*#__PURE__*/React.createElement("div", {
    className: "main main--sidebar"
  }, /*#__PURE__*/React.createElement(ProjectSidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement(PageTitle, {
    crumbs: ["Knowledge Base"],
    title: view === "detail" && active ? active.title : "Institutional Memory",
    q: true,
    actions: view === "detail" ? [/*#__PURE__*/React.createElement("button", {
      key: "b",
      className: "btn",
      onClick: () => setView("list")
    }, "\u2190 Back to list")] : [/*#__PURE__*/React.createElement("button", {
      key: "n",
      className: "btn"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " New research"), /*#__PURE__*/React.createElement("button", {
      key: "e",
      className: "btn btn--primary"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14
    }), " Export")]
  }), view === "list" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toolbar-row",
    style: {
      padding: "14px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    placeholder: "Search hypotheses, decisions, tags\u2026",
    value: search,
    onChange: e => setSearch(e.target.value),
    style: {
      paddingLeft: 32,
      height: 36
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14,
    color: "#7a8794",
    style: {
      position: "absolute",
      left: 10,
      top: 11
    }
  })), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: sort,
    onChange: e => setSort(e.target.value),
    style: {
      width: 180,
      height: 36
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "date_desc"
  }, "Newest first"), /*#__PURE__*/React.createElement("option", {
    value: "date_asc"
  }, "Oldest first"), /*#__PURE__*/React.createElement("option", {
    value: "views"
  }, "Most viewed"), /*#__PURE__*/React.createElement("option", {
    value: "linked"
  }, "Most linked")), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, [{
    id: "all",
    label: "All",
    c: kbItems.length
  }, {
    id: "experiment",
    label: "A/B tests",
    c: kbItems.filter(i => i.type === "experiment").length
  }, {
    id: "research",
    label: "Research",
    c: kbItems.filter(i => i.type === "research").length
  }, {
    id: "incident_report",
    label: "Incidents",
    c: kbItems.filter(i => i.type === "incident_report").length
  }, {
    id: "playbook",
    label: "Playbooks",
    c: kbItems.filter(i => i.type === "playbook").length
  }, {
    id: "decision_log",
    label: "Decisions",
    c: kbItems.filter(i => i.type === "decision_log").length
  }, {
    id: "metric_definition",
    label: "Metric defs",
    c: kbItems.filter(i => i.type === "metric_definition").length
  }].map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    className: "btn btn--sm " + (typeFilter === f.id ? "btn--primary" : ""),
    onClick: () => setTypeFilter(f.id)
  }, f.label, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, "(", f.c, ")"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 18px 14px 18px",
      borderBottom: "1px solid var(--line-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-4 row--wrap",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted tiny",
    style: {
      marginRight: 6,
      fontWeight: 700
    }
  }, "TAGS:"), /*#__PURE__*/React.createElement("span", {
    className: "tag" + (!tagFilter ? "" : " tag--ghost"),
    style: {
      cursor: "pointer"
    },
    onClick: () => setTagFilter(null)
  }, "all"), allTags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "tag" + (tagFilter === t ? "" : " tag--ghost"),
    style: {
      cursor: "pointer"
    },
    onClick: () => setTagFilter(t === tagFilter ? null : t)
  }, "#", t))))), /*#__PURE__*/React.createElement("div", {
    className: "dash-grid mt-12",
    style: {
      gridTemplateColumns: "repeat(3, 1fr)"
    }
  }, sorted.map(item => {
    const proj = AppData.projectById(item.project);
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      className: "kb-card",
      onClick: () => {
        setActiveId(item.id);
        setView("detail");
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "row gap-8",
      style: {
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "kb-card__type",
      style: {
        background: kbTypeStyle(item.type).bg,
        color: kbTypeStyle(item.type).color
      }
    }, kbTypeLabel(item.type)), item.decision === "Accepted" && /*#__PURE__*/React.createElement(Pill, {
      kind: "ok"
    }, "Accepted"), item.decision === "Rejected" && /*#__PURE__*/React.createElement(Pill, {
      kind: "crit"
    }, "Rejected"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "muted tiny"
    }, item.date)), /*#__PURE__*/React.createElement("h3", {
      className: "kb-card__title"
    }, item.title), /*#__PURE__*/React.createElement("div", {
      className: "kb-card__desc"
    }, item.summary), /*#__PURE__*/React.createElement("div", {
      className: "kb-card__foot"
    }, /*#__PURE__*/React.createElement("span", null, proj ? proj.name : "—"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, item.author), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "tag-list"
    }, (item.tags || []).slice(0, 3).map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "tag tag--ghost"
    }, "#", t)))));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty",
    style: {
      gridColumn: "span 3"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty__face"
  }, "\uD83D\uDD0E"), /*#__PURE__*/React.createElement("div", {
    className: "empty__title"
  }, "No results match your search")))), view === "detail" && active && /*#__PURE__*/React.createElement(KBDetail, {
    item: active,
    allItems: kbItems,
    onOpen: id => setActiveId(id),
    onNavigate: onNavigate
  })));
};
const KBDetail = ({
  item,
  allItems,
  onOpen,
  onNavigate
}) => {
  const related = allItems.filter(i => i.id !== item.id).filter(i => (i.tags || []).some(t => (item.tags || []).includes(t))).slice(0, 4);
  const proj = AppData.projectById(item.project);
  return /*#__PURE__*/React.createElement("div", {
    className: "split split--21"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-8 mb-12"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kb-card__type",
    style: {
      background: kbTypeStyle(item.type).bg,
      color: kbTypeStyle(item.type).color
    }
  }, kbTypeLabel(item.type)), item.decision === "Accepted" && /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "Accepted"), item.decision === "Rejected" && /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, "Rejected"), /*#__PURE__*/React.createElement("span", {
    className: "muted tiny"
  }, item.date, " \xB7 by ", item.author)), /*#__PURE__*/React.createElement("div", {
    className: "muted tiny",
    style: {
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.4
    }
  }, "Summary"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      marginTop: 6,
      color: "var(--ink-2)"
    }
  }, item.summary))), item.type === "experiment" && item.refId && (() => {
    const exp = AppData.experiments.find(e => e.id === item.refId);
    if (!exp) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card__head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card__title"
    }, "Experiment results"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--sm btn--ghost",
      onClick: () => onNavigate("ab", {
        experimentId: exp.id,
        view: "results"
      })
    }, "Open in A/B Splitter \u2192")), /*#__PURE__*/React.createElement("div", {
      className: "card__body"
    }, /*#__PURE__*/React.createElement("dl", {
      className: "kv mb-12"
    }, /*#__PURE__*/React.createElement("dt", null, "Hypothesis"), /*#__PURE__*/React.createElement("dd", null, exp.hypothesis), /*#__PURE__*/React.createElement("dt", null, "Primary metric"), /*#__PURE__*/React.createElement("dd", null, exp.primaryMetric), /*#__PURE__*/React.createElement("dt", null, "P(B>A)"), /*#__PURE__*/React.createElement("dd", null, exp.pValueOrPb != null ? (exp.pValueOrPb * 100).toFixed(0) + "%" : "—"), /*#__PURE__*/React.createElement("dt", null, "Lift"), /*#__PURE__*/React.createElement("dd", {
      style: {
        color: exp.lift && exp.lift.startsWith("-") ? "var(--status-crit)" : "var(--status-ok)",
        fontWeight: 700
      }
    }, exp.lift), /*#__PURE__*/React.createElement("dt", null, "Owner / Decision"), /*#__PURE__*/React.createElement("dd", null, exp.owner, " \xB7 ", /*#__PURE__*/React.createElement("b", null, exp.decision || "—"))), /*#__PURE__*/React.createElement("table", {
      className: "dt"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Variant"), /*#__PURE__*/React.createElement("th", {
      className: "dt-num"
    }, "Users"), /*#__PURE__*/React.createElement("th", {
      className: "dt-num"
    }, exp.primaryMetric))), /*#__PURE__*/React.createElement("tbody", null, exp.variants.map(v => /*#__PURE__*/React.createElement("tr", {
      key: v.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, v.id), " ", v.name), /*#__PURE__*/React.createElement("td", {
      className: "dt-num"
    }, v.users.toLocaleString()), /*#__PURE__*/React.createElement("td", {
      className: "dt-num"
    }, v.metric)))))));
  })(), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Decision & rationale")), /*#__PURE__*/React.createElement("div", {
    className: "card__body",
    style: {
      lineHeight: 1.6,
      fontSize: 13.5,
      color: "var(--ink-2)"
    }
  }, item.type === "experiment" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "Decision: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: item.decision === "Accepted" ? "var(--status-ok)" : "var(--status-crit)"
    }
  }, item.decision || "—")), /*#__PURE__*/React.createElement("p", null, "The variant produced a measurable shift on the primary metric. The guardrails were reviewed and considered acceptable; the configuration was shipped to 100% of users in the following release.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "Key findings of this ", item.type, ". The analysis was driven by a Product Owner request and synthesises data across ", proj ? proj.name : "the portfolio", "."), /*#__PURE__*/React.createElement("p", null, "The structured outputs feed back into the GQM tree for the corresponding strategic goal, and inform the experiment pipeline going forward.")))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Comments \xB7 2"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    title: "Helpful"
  }, "\uD83D\uDC4D 14"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    title: "Brilliant idea"
  }, "\uD83D\uDCA1 6"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost",
    title: "Questions"
  }, "\u2753 2"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(KBComment, {
    author: "A. Volkova",
    when: "2 days ago",
    text: "Cross-checked the guardrails \u2014 purchase CR drop is within the historical band. Greenlit."
  }), /*#__PURE__*/React.createElement(KBComment, {
    author: "P. Orlov",
    when: "yesterday",
    text: "Tagged for future BP / starter pack price tests."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: "1px solid var(--line-soft)"
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "field__textarea",
    placeholder: "Leave a comment\u2026",
    rows: 2
  }), /*#__PURE__*/React.createElement("div", {
    className: "row row--end mt-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary btn--sm"
  }, "Post comment")))))), /*#__PURE__*/React.createElement("div", {
    className: "col gap-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Metadata")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("dl", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("dt", null, "Project"), /*#__PURE__*/React.createElement("dd", null, proj ? proj.name : "—"), /*#__PURE__*/React.createElement("dt", null, "Author"), /*#__PURE__*/React.createElement("dd", null, item.author), /*#__PURE__*/React.createElement("dt", null, "Date"), /*#__PURE__*/React.createElement("dd", null, item.date), /*#__PURE__*/React.createElement("dt", null, "Type"), /*#__PURE__*/React.createElement("dd", null, kbTypeLabel(item.type)), item.decision && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "Decision"), /*#__PURE__*/React.createElement("dd", null, item.decision)), item.refId && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "Linked AB"), /*#__PURE__*/React.createElement("dd", {
    className: "dt-mono"
  }, item.refId)), item.views && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "Views (30d)"), /*#__PURE__*/React.createElement("dd", null, item.views)), item.linked && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "Backlinks"), /*#__PURE__*/React.createElement("dd", null, item.linked, " pages"))), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "col gap-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 12
  }), " Export to .docx"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chart-line",
    size: 12
  }), " Embed in BI dashboard"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 12
  }), " Copy permalink")))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Tags")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tag-list"
  }, (item.tags || []).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "tag"
  }, "#", t)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12
  }), " add tag")))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Related")), /*#__PURE__*/React.createElement("div", null, related.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted tiny"
  }, "No related items")), related.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    style: {
      padding: "10px 14px",
      borderBottom: "1px solid var(--line-soft)",
      cursor: "pointer"
    },
    onClick: () => onOpen(r.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "tiny muted",
    style: {
      marginTop: 2
    }
  }, r.type, " \xB7 ", r.date)))))));
};
const KBComment = ({
  author,
  when,
  text
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "12px 14px",
    borderBottom: "1px solid var(--line-soft)",
    display: "flex",
    gap: 10,
    alignItems: "flex-start"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "var(--brand-light)",
    color: "var(--brand)",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    fontSize: 12,
    flexShrink: 0
  }
}, author.split(" ").map(s => s[0]).join("")), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "row gap-8",
  style: {
    alignItems: "baseline"
  }
}, /*#__PURE__*/React.createElement("b", {
  style: {
    fontSize: 13
  }
}, author), /*#__PURE__*/React.createElement("span", {
  className: "muted tiny"
}, when)), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13,
    color: "var(--ink-2)",
    marginTop: 2
  }
}, text)));
window.KBScreen = KBScreen;