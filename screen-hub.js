/* Hub / Home screen — entry point with portfolio + 4 tools + activity */

const HubScreen = ({
  project,
  onNavigate,
  onProjectChange
}) => {
  const projects = project ? [project] : AppData.allProjects;
  const portfolioStats = {
    projects: AppData.allProjects.length,
    events: AppData.events.length,
    dashboards: AppData.dashboards.length,
    activeAB: AppData.experiments.filter(e => e.status === "Active").length,
    completedAB: AppData.experiments.filter(e => e.status === "Completed").length,
    kbItems: AppData.knowledge.length
  };
  const alertCount = AppData.alerts.filter(a => a.level === "crit" || a.level === "warn").length;
  return /*#__PURE__*/React.createElement("div", {
    className: "hub"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hub__hero"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "hub__hero-title"
  }, "Welcome back, Alisa. ", /*#__PURE__*/React.createElement("br", null), "Your ", /*#__PURE__*/React.createElement("em", null, "analytics ecosystem"), " is ready."), /*#__PURE__*/React.createElement("div", {
    className: "hub__hero-sub"
  }, "One workspace for events, dashboards, experiments and institutional knowledge across all GDC products. ", project ? "Showing data for " : "Showing portfolio view — ", /*#__PURE__*/React.createElement("b", null, project ? project.name : `${portfolioStats.projects} active projects`), ".")), /*#__PURE__*/React.createElement("div", {
    className: "hub__hero-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hub__stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hub__stat-val"
  }, portfolioStats.projects), /*#__PURE__*/React.createElement("div", {
    className: "hub__stat-label"
  }, "Projects")), /*#__PURE__*/React.createElement("div", {
    className: "hub__stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hub__stat-val"
  }, portfolioStats.events), /*#__PURE__*/React.createElement("div", {
    className: "hub__stat-label"
  }, "Events tracked")), /*#__PURE__*/React.createElement("div", {
    className: "hub__stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hub__stat-val",
    style: {
      color: "#43c08a"
    }
  }, portfolioStats.activeAB), /*#__PURE__*/React.createElement("div", {
    className: "hub__stat-label"
  }, "Active A/B")), /*#__PURE__*/React.createElement("div", {
    className: "hub__stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hub__stat-val",
    style: {
      color: alertCount ? "#e94646" : "#22c55e"
    }
  }, alertCount), /*#__PURE__*/React.createElement("div", {
    className: "hub__stat-label"
  }, "Open alerts")))), /*#__PURE__*/React.createElement("div", {
    className: "hub__grid"
  }, /*#__PURE__*/React.createElement(ToolCard, {
    tool: TOOLS[0],
    title: "Event Marking Service",
    desc: "Central registry of game events with auto-versioning, pre-release validation and statistical alerting. Spot bad markup in 2\u20134 hours instead of 2 days.",
    stats: [{
      val: portfolioStats.events,
      label: "Events"
    }, {
      val: AppData.alerts.filter(a => a.level === "crit").length,
      label: "Critical",
      red: true
    }, {
      val: "v7",
      label: "Latest version"
    }],
    onClick: () => onNavigate("ems")
  }), /*#__PURE__*/React.createElement(ToolCard, {
    tool: TOOLS[1],
    title: "Business Intelligence",
    desc: "Self-service dashboards for cohort analysis, retention, monetisation and version comparison \u2014 with raw SQL & visual editor fallback for analysts.",
    stats: [{
      val: portfolioStats.dashboards,
      label: "Dashboards"
    }, {
      val: "4h",
      label: "Avg TTI"
    }, {
      val: "120+",
      label: "Saved queries"
    }],
    onClick: () => onNavigate("bi")
  }), /*#__PURE__*/React.createElement(ToolCard, {
    tool: TOOLS[2],
    title: "A/B Splitter",
    desc: "Bayesian experimentation: deterministic user bucketing, hourly P(B>A) recalculation, automatic recommendation when threshold is reached.",
    stats: [{
      val: portfolioStats.activeAB,
      label: "Active",
      green: true
    }, {
      val: portfolioStats.completedAB,
      label: "Completed (90d)"
    }, {
      val: "0.95",
      label: "Decision threshold"
    }],
    onClick: () => onNavigate("ab")
  }), /*#__PURE__*/React.createElement(ToolCard, {
    tool: TOOLS[3],
    title: "Knowledge Base",
    desc: "Institutional memory of A/B-tests, research and incident postmortems \u2014 auto-populated from completed experiments and searchable across all projects.",
    stats: [{
      val: portfolioStats.kbItems,
      label: "Items"
    }, {
      val: AppData.knowledge.filter(k => k.type === "experiment").length,
      label: "Experiments"
    }, {
      val: AppData.knowledge.filter(k => k.type === "research").length,
      label: "Research"
    }],
    onClick: () => onNavigate("kb")
  })), /*#__PURE__*/React.createElement("div", {
    className: "hub__grid mt-16",
    style: {
      gridTemplateColumns: "2fr 1fr"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 16
  }), " Portfolio snapshot"), /*#__PURE__*/React.createElement("span", {
    className: "muted tiny"
  }, "Health score = 0.4\xB7D7 + 0.4\xB7ARPDAU + 0.2\xB7DAU-trend")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Project"), /*#__PURE__*/React.createElement("th", null, "Genre"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "DAU"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "D7"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "ARPDAU"), /*#__PURE__*/React.createElement("th", null, "Trend"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 120
    }
  }, "Health"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, projects.slice(0, 8).map((p, i) => /*#__PURE__*/React.createElement("tr", {
    key: p.id,
    style: {
      cursor: "pointer"
    },
    onClick: () => {
      onProjectChange(p);
      onNavigate("bi");
    }
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, p.name), /*#__PURE__*/React.createElement("div", {
    className: "tiny muted"
  }, p.platforms.join(", "))), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, p.genre), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, p.dau >= 1_000_000 ? (p.dau / 1_000_000).toFixed(1) + "M" : (p.dau / 1000).toFixed(0) + "K"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, (15 + i * 3.1 % 17).toFixed(1), "%"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, "$", (0.04 + i * 0.013 % 0.09).toFixed(3)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Sparkline, {
    values: seededSeries(p.id, 14, 30, 80),
    color: p.color,
    width: 70
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar",
    style: {
      flex: 1,
      height: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar__fill " + (p.health > 80 ? "bar__fill--ok" : p.health > 65 ? "bar__fill--warn" : "bar__fill--crit"),
    style: {
      width: p.health + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "dt-num tiny",
    style: {
      fontWeight: 800,
      width: 24,
      textAlign: "right"
    }
  }, p.health))), /*#__PURE__*/React.createElement("td", null, p.status === "ok" && /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "Healthy"), p.status === "warn" && /*#__PURE__*/React.createElement(Pill, {
    kind: "warn"
  }, "Watch"), p.status === "crit" && /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, "Critical"))))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 16
  }), " Active alerts"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => onNavigate("ems", {
      tab: "alerts"
    })
  }, "Open EMS \u2192")), /*#__PURE__*/React.createElement("div", null, AppData.alerts.slice(0, 5).map(a => {
    const proj = AppData.projectById(a.project);
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      style: {
        padding: "10px 14px",
        borderBottom: "1px solid var(--line-soft)",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        cursor: "pointer"
      },
      onClick: () => {
        onProjectChange(proj);
        onNavigate("ems", {
          tab: "alerts"
        });
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        alignSelf: "stretch",
        background: a.level === "crit" ? "#e94646" : a.level === "warn" ? "#f5a623" : "#4aa8d8",
        borderRadius: 2
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "dt-mono"
    }, a.event), " \xB7 ", a.reason.replace("_", " ")), /*#__PURE__*/React.createElement("div", {
      className: "tiny muted",
      style: {
        marginTop: 2
      }
    }, proj && proj.name, " \xB7 obs ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink)"
      }
    }, a.observed), " vs base ", /*#__PURE__*/React.createElement("b", null, a.expected), " \xB7 ", a.time)));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card mt-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 16
  }), " Recent activity"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm"
  }, "View all")), /*#__PURE__*/React.createElement("div", null, AppData.activity.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "10px 16px",
      borderBottom: i < AppData.activity.length - 1 ? "1px solid var(--line-soft)" : "none",
      display: "grid",
      gridTemplateColumns: "70px 24px 1fr",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      cursor: "pointer"
    },
    onClick: () => onNavigate(a.tool)
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted tiny"
  }, a.time), /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 14,
    color: "var(--ink-3)"
  }), /*#__PURE__*/React.createElement("span", null, a.text))))));
};
const ToolCard = ({
  tool,
  title,
  desc,
  stats,
  onClick
}) => /*#__PURE__*/React.createElement("div", {
  className: "tool-card",
  style: {
    "--tool-color": tool.color,
    "--tool-bg": tool.bg
  },
  onClick: onClick
}, /*#__PURE__*/React.createElement("div", {
  className: "tool-card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "tool-card__icon"
}, /*#__PURE__*/React.createElement(Icon, {
  name: tool.icon,
  size: 22,
  color: tool.color
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "tool-card__sub"
}, tool.label), /*#__PURE__*/React.createElement("h3", {
  className: "tool-card__name"
}, title)), /*#__PURE__*/React.createElement(Icon, {
  name: "chevron-right",
  size: 20,
  color: "var(--ink-4)"
})), /*#__PURE__*/React.createElement("div", {
  className: "tool-card__desc"
}, desc), /*#__PURE__*/React.createElement("div", {
  className: "tool-card__stats"
}, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
  key: i,
  className: "tool-card__stat"
}, /*#__PURE__*/React.createElement("b", {
  style: {
    color: s.red ? "var(--status-crit)" : s.green ? "var(--status-ok)" : "var(--ink)"
  }
}, s.val), /*#__PURE__*/React.createElement("span", null, s.label)))));
window.HubScreen = HubScreen;