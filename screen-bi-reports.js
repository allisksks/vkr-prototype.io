/* BI reports — AB Analysis (Block 1A) & Cohort Compare (Block 1B) */

// ====================================================================
// AB ANALYSIS REPORT
// ====================================================================
const ABAnalysisReport = ({
  project,
  onNavigate
}) => {
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
    test: ["on"]
  });
  const [computing, setComputing] = useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter",
    size: 16,
    color: "#6d3aae"
  }), "AB Analysis \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "dt-mono"
  }, exp ? exp.id : D.experimentId)), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm",
    onClick: () => onNavigate("ab", {
      experimentId: D.experimentId,
      view: "results"
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flask",
    size: 12
  }), " Open in A/B Splitter"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 12
  }), " Save section to KB"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 12
  }), " CSV"))), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-12 row--wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      minWidth: 130
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "OS"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: filters.os,
    onChange: e => setFilters({
      ...filters,
      os: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "All"), /*#__PURE__*/React.createElement("option", null, "iOS"), /*#__PURE__*/React.createElement("option", null, "Android"))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      minWidth: 170
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Start date"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: filters.startDate,
    onChange: e => setFilters({
      ...filters,
      startDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      minWidth: 170
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "End date"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: filters.endDate,
    onChange: e => setFilters({
      ...filters,
      endDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      minWidth: 140
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Versions"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    placeholder: "11.4.1, 11.5.0",
    value: filters.versions,
    onChange: e => setFilters({
      ...filters,
      versions: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      flex: 2,
      minWidth: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Sources"), /*#__PURE__*/React.createElement("div", {
    className: "filter-row__chips",
    style: {
      minHeight: 32
    }
  }, filters.sources.map(s => /*#__PURE__*/React.createElement(Chip, {
    key: s,
    onRemove: () => setFilters({
      ...filters,
      sources: filters.sources.filter(x => x !== s)
    })
  }, s)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 10
  }), " add"))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      minWidth: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Lifetime (d)"), /*#__PURE__*/React.createElement("input", {
    className: "field__input",
    value: filters.lifetime,
    onChange: e => setFilters({
      ...filters,
      lifetime: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      minWidth: 160
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Countries"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, /*#__PURE__*/React.createElement("label", {
    className: "row gap-4 tiny"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "cc",
    defaultChecked: true
  }), " Include"), /*#__PURE__*/React.createElement("label", {
    className: "row gap-4 tiny"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "cc"
  }), " Exclude"))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      minWidth: 130
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Control group"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: filters.control,
    onChange: e => setFilters({
      ...filters,
      control: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "base"
  }, "base"))), /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      minWidth: 130
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "Test groups"), /*#__PURE__*/React.createElement("select", {
    className: "field__select",
    value: filters.test[0],
    onChange: e => setFilters({
      ...filters,
      test: [e.target.value]
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "on"
  }, "on"))), /*#__PURE__*/React.createElement("div", {
    className: "col",
    style: {
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, "\xA0"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    onClick: () => {
      setComputing(true);
      setTimeout(() => setComputing(false), 600);
    }
  }, computing ? "Computing…" : "Apply"))), /*#__PURE__*/React.createElement("div", {
    className: "muted tiny mt-12"
  }, "For the cohort, ", /*#__PURE__*/React.createElement("b", null, filters.lifetime), " days of life are available. Metrics computed over ", filters.lifetime, " days."))), /*#__PURE__*/React.createElement("div", {
    className: "bi-dash-tabs",
    style: {
      marginTop: 8
    }
  }, [{
    id: "overview",
    label: "Groups"
  }, {
    id: "tutorial",
    label: "Tutorial Funnel"
  }, {
    id: "levels",
    label: "Level Stats"
  }, {
    id: "battles",
    label: "Battles"
  }, {
    id: "chests",
    label: "Chests"
  }, {
    id: "missions",
    label: "Daily Missions"
  }, {
    id: "upgrades",
    label: "Upgrades"
  }, {
    id: "tanks",
    label: "Tanks"
  }, {
    id: "economy",
    label: "Soft & Hard"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: "bi-dash-tab" + (section === t.id ? " is-active" : ""),
    onClick: () => setSection(t.id)
  }, t.label))), section === "overview" && /*#__PURE__*/React.createElement(ABA_Groups, {
    D: D
  }), section === "tutorial" && /*#__PURE__*/React.createElement(ABA_Tutorial, {
    D: D
  }), section === "levels" && /*#__PURE__*/React.createElement(ABA_Levels, {
    D: D
  }), section === "battles" && /*#__PURE__*/React.createElement(ABA_Battles, {
    D: D
  }), section === "chests" && /*#__PURE__*/React.createElement(ABA_Chests, {
    D: D
  }), section === "missions" && /*#__PURE__*/React.createElement(ABA_Missions, {
    D: D
  }), section === "upgrades" && /*#__PURE__*/React.createElement(ABA_Upgrades, {
    D: D
  }), section === "tanks" && /*#__PURE__*/React.createElement(ABA_Tanks, {
    D: D
  }), section === "economy" && /*#__PURE__*/React.createElement(ABA_Economy, {
    D: D
  }));
};
const ABA_Groups = ({
  D
}) => /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Test groups")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Experiment"), /*#__PURE__*/React.createElement("th", null, "Group"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "Users"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, D.groups.map((g, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, g.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, g.group)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, g.users.toLocaleString()), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Pill, {
  kind: g.status === "RUNNING" ? "info" : "ok"
}, g.status)))))));
const ABA_Tutorial = ({
  D
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Tutorial funnel \xB7 % users reaching step")), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(BarChart, {
  seed: "aba-tut",
  labels: D.tutorialFunnel.map(s => s.step.length > 9 ? s.step.slice(0, 9) + "…" : s.step),
  series: [{
    label: "base",
    values: D.tutorialFunnel.map(s => s.base)
  }, {
    label: "on",
    values: D.tutorialFunnel.map(s => s.on)
  }],
  palette: ["#6c91dc", "#43c08a"],
  height: 220
}))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Funnel data")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "step_name"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "base %"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "on %"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "\u0394"))), /*#__PURE__*/React.createElement("tbody", null, D.tutorialFunnel.map((s, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, s.step), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, s.base.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, s.on.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    color: s.on - s.base < 0 ? "var(--status-crit)" : "var(--status-ok)",
    fontWeight: 700
  }
}, (s.on - s.base).toFixed(2))))))));
const ABA_Levels = ({
  D
}) => {
  const [tab, setTab] = useState("funnels");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Level statistics"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm " + (tab === "funnels" ? "btn--primary" : ""),
    onClick: () => setTab("funnels")
  }, "Funnels & WR"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm " + (tab === "dropoffs" ? "btn--primary" : ""),
    onClick: () => setTab("dropoffs")
  }, "Drop-offs"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm " + (tab === "time" ? "btn--primary" : ""),
    onClick: () => setTab("time")
  }, "Time to complete")))), tab === "funnels" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Win-rate by level")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement(BarChart, {
    seed: "aba-wr",
    labels: D.winrate.map(r => "L" + r.level),
    series: [{
      label: "base WR%",
      values: D.winrate.map(r => r.wr_b)
    }, {
      label: "on WR%",
      values: D.winrate.map(r => r.wr_o)
    }],
    palette: ["#6c91dc", "#43c08a"],
    height: 220
  })), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Level"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Finishes (base)"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Wins (base)"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "WR base"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Finishes (on)"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "Wins (on)"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "WR on"))), /*#__PURE__*/React.createElement("tbody", null, D.winrate.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "L", r.level)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r.finishes_b.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r.wins_b.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r.wr_b.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r.finishes_o.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r.wins_o.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "dt-num",
    style: {
      color: r.wr_o > r.wr_b ? "var(--status-ok)" : "var(--status-crit)",
      fontWeight: 700
    }
  }, r.wr_o.toFixed(2), "%"))))))), tab === "dropoffs" && /*#__PURE__*/React.createElement(React.Fragment, null, ["betweenStarts", "betweenFinishes", "insideLevel", "betweenLevels"].map(key => {
    const labels = {
      betweenStarts: "Drop-off between starts %",
      betweenFinishes: "Drop-off between finishes %",
      insideLevel: "Drop-off inside level (technical / rage-quit) %",
      betweenLevels: "Drop-off between levels (retention) %"
    };
    const data = D.dropoff[key];
    return /*#__PURE__*/React.createElement("div", {
      className: "card",
      key: key
    }, /*#__PURE__*/React.createElement("div", {
      className: "card__head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card__title"
    }, labels[key])), /*#__PURE__*/React.createElement("div", {
      className: "card__body"
    }, /*#__PURE__*/React.createElement(BarChart, {
      seed: "dr-" + key,
      labels: data.map((_, i) => "L" + (i + 1)),
      series: [{
        label: "% drop",
        values: data.map(v => -v)
      }],
      palette: ["#e07a3a"],
      height: 180
    }), /*#__PURE__*/React.createElement("details", {
      className: "mt-12"
    }, /*#__PURE__*/React.createElement("summary", {
      style: {
        cursor: "pointer",
        fontWeight: 700,
        color: "var(--brand)"
      }
    }, "Explanation"), /*#__PURE__*/React.createElement("div", {
      className: "muted tiny mt-8"
    }, "Computed as (users at level N+1) / (users at level N) \u2212 1. Higher absolute value = sharper drop-off. Anomalies can indicate balance issues, missing tutorial steps, or paywalls. Investigate spikes alongside crash logs and the previous version baseline."))));
  })), tab === "time" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Avg & median time per battle (s)")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement(LineChart, {
    seed: "aba-time",
    series: [{
      label: "base avg",
      values: Array.from({
        length: 30
      }, (_, i) => 130 + i * 1.5 + i % 5 * 3)
    }, {
      label: "base median",
      values: Array.from({
        length: 30
      }, (_, i) => 120 + i * 1.5 + i % 4 * 2)
    }, {
      label: "on avg",
      values: Array.from({
        length: 30
      }, (_, i) => 128 + i * 1.6 + i % 5 * 3)
    }, {
      label: "on median",
      values: Array.from({
        length: 30
      }, (_, i) => 118 + i * 1.6 + i % 4 * 2)
    }],
    palette: ["#6c91dc", "#a4b8d9", "#43c08a", "#a3d7c0"],
    height: 240
  }))));
};
const ABA_Battles = ({
  D
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Battles per DAU & win-rate by lifetime"), /*#__PURE__*/React.createElement("div", {
  className: "row gap-4"
}, /*#__PURE__*/React.createElement("label", {
  className: "row gap-4 tiny"
}, /*#__PURE__*/React.createElement("input", {
  type: "radio",
  name: "mt",
  defaultChecked: true
}), " all"), /*#__PURE__*/React.createElement("label", {
  className: "row gap-4 tiny"
}, /*#__PURE__*/React.createElement("input", {
  type: "radio",
  name: "mt"
}), " vs_bot"), /*#__PURE__*/React.createElement("label", {
  className: "row gap-4 tiny"
}, /*#__PURE__*/React.createElement("input", {
  type: "radio",
  name: "mt"
}), " pvp"))), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(LineChart, {
  seed: "aba-bat",
  series: [{
    label: "starts/DAU base",
    values: D.battles.map(b => b.sp_b)
  }, {
    label: "starts/DAU on",
    values: D.battles.map(b => b.sp_o)
  }, {
    label: "WR base",
    values: D.battles.map(b => b.wr_b / 10)
  }, {
    label: "WR on",
    values: D.battles.map(b => b.wr_o / 10)
  }],
  palette: ["#6c91dc", "#43c08a", "#a4b8d9", "#a3d7c0"],
  height: 220
})), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "starts / DAU (base)"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "starts / DAU (on)"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "WR base"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "WR on"))), /*#__PURE__*/React.createElement("tbody", null, D.battles.map((b, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "D", b.lt)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, b.sp_b.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    color: b.sp_o < b.sp_b ? "var(--status-crit)" : "var(--status-ok)"
  }
}, b.sp_o.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, b.wr_b.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, b.wr_o.toFixed(2), "%")))))));
const ABA_Chests = ({
  D
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "% users who opened Nth free chest by lifetime")), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(LineChart, {
  seed: "aba-chests",
  series: [{
    label: "base",
    values: D.chests.map(c => c.base)
  }, {
    label: "on",
    values: D.chests.map(c => c.on)
  }],
  palette: ["#6c91dc", "#43c08a"],
  height: 200
})), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", null, "chest"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "% base"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "% on"))), /*#__PURE__*/React.createElement("tbody", null, D.chests.map((c, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "D", c.lt)), /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, c.ch), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, c.base.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, c.on.toFixed(2))))))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Chest opens per DAU by type")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", null, "chest"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "base"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "on"))), /*#__PURE__*/React.createElement("tbody", null, D.chestOpens.map((c, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "D", c.lt)), /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, c.chest), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, c.base.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, c.on.toFixed(2))))))));
const ABA_Missions = ({
  D
}) => /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Daily Missions \xB7 receive \u2192 complete conversion")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "quest_name"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "% received (base)"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "% received (on)"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "conv. complete base"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "conv. complete on"))), /*#__PURE__*/React.createElement("tbody", null, D.dailyMissions.map((q, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, q.quest), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, q.share_b.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, q.share_o.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, q.conv_b.toFixed(1), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    color: q.conv_o < q.conv_b ? "var(--status-crit)" : "var(--status-ok)",
    fontWeight: 700
  }
}, q.conv_o.toFixed(1), "%"))))));
const ABA_Upgrades = ({
  D
}) => /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Upgrades per DAU by category")), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(BarChart, {
  seed: "aba-upg",
  labels: D.upgrades.map(u => `D${u.lt} · ${u.cat}`),
  series: [{
    label: "base",
    values: D.upgrades.map(u => u.base)
  }, {
    label: "on",
    values: D.upgrades.map(u => u.on)
  }],
  palette: ["#6c91dc", "#43c08a"],
  height: 200
})), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", null, "category"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "base"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "on"))), /*#__PURE__*/React.createElement("tbody", null, D.upgrades.map((u, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "D", u.lt)), /*#__PURE__*/React.createElement("td", null, u.cat), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, u.base.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, u.on.toFixed(2)))))));
const ABA_Tanks = ({
  D
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Tanks purchased per battle (cumulative)")), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(LineChart, {
  seed: "aba-tnk",
  series: [{
    label: "avg_purchased",
    values: D.tanksPerBattle.map(t => t.avg_purchased)
  }],
  palette: ["#e07a3a"],
  height: 200
}))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Top tank by level")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Level range"), /*#__PURE__*/React.createElement("th", null, "Top tank base"), /*#__PURE__*/React.createElement("th", null, "Top tank on"), /*#__PURE__*/React.createElement("th", null, "Change"))), /*#__PURE__*/React.createElement("tbody", null, D.topTankByLevel.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, r.range)), /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, r.base), /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, r.on), /*#__PURE__*/React.createElement("td", null, r.base === r.on ? /*#__PURE__*/React.createElement(Pill, {
  kind: "ok"
}, "no change") : /*#__PURE__*/React.createElement(Pill, {
  kind: "warn"
}, "shift"))))))));
const ABA_Economy = ({
  D
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Soft currency balance \xB7 per battle")), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(LineChart, {
  seed: "aba-soft",
  series: [{
    label: "base",
    values: D.softHardBalance.soft.map(s => s.base)
  }, {
    label: "on",
    values: D.softHardBalance.soft.map(s => s.on)
  }],
  palette: ["#6c91dc", "#43c08a"],
  height: 200
}))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Hard currency balance \xB7 per battle")), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(LineChart, {
  seed: "aba-hard",
  series: [{
    label: "base",
    values: D.softHardBalance.hard.map(s => s.base)
  }, {
    label: "on",
    values: D.softHardBalance.hard.map(s => s.on)
  }],
  palette: ["#6c91dc", "#43c08a"],
  height: 200
}))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Hard currency spend mix")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Item"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "buy conv % base"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "buy conv % on"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cnt / user"))), /*#__PURE__*/React.createElement("tbody", null, D.hardSpend.map((s, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, s.item), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, s.buy_b.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    color: s.buy_o > s.buy_b ? "var(--status-ok)" : "var(--status-crit)"
  }
}, s.buy_o.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, s.cnt.toFixed(2))))))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Conversion into revive use")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Level"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "revive for hard (base)"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "revive for hard (on)"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "free revive"))), /*#__PURE__*/React.createElement("tbody", null, D.reviveConv.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, r.level)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.b.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.o.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.free.toFixed(2), "%")))))));

// ====================================================================
// COHORT COMPARE REPORT
// ====================================================================
const CohortCompareReport = ({
  project,
  addToast,
  onNavigate
}) => {
  const D = AppData.cohortCompareData;
  const [section, setSection] = useState("retention");
  const [c1, setC1] = useState(D.cohorts.c1);
  const [c2, setC2] = useState(D.cohorts.c2);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter",
    size: 16,
    color: "#6d3aae"
  }), " Cohort Compare"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm",
    onClick: () => {
      const t = c1;
      setC1(c2);
      setC2(t);
      addToast("Cohorts swapped");
    }
  }, "\u21C4 Swap cohorts"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "save",
    size: 12
  }), " Save as comparison"))), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-16",
    style: {
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(CohortParams, {
    title: `Cohort 1 · ${c1.name}`,
    cohort: c1,
    onChange: setC1
  }), /*#__PURE__*/React.createElement(CohortParams, {
    title: `Cohort 2 · ${c2.name}`,
    cohort: c2,
    onChange: setC2
  })), /*#__PURE__*/React.createElement("div", {
    className: "row gap-12 mt-12",
    style: {
      background: "var(--brand-tint)",
      padding: "10px 14px",
      borderRadius: 6,
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, "Cohort 1: ", c1.daysAvailable, " days available. Excluded: ", c1.excluded.toLocaleString(), " users (cheaters / AB groups / unmatched)."), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, "Cohort 2: ", c2.daysAvailable, " days available. Excluded: ", c2.excluded.toLocaleString(), " users."))), /*#__PURE__*/React.createElement("div", {
    className: "card__body",
    style: {
      borderTop: "1px solid var(--line-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label",
    style: {
      marginBottom: 6
    }
  }, "Source distribution"), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "source"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "installs 1"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "% 1"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "installs 2"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "% 2"))), /*#__PURE__*/React.createElement("tbody", null, D.sources.map((s, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, s.source), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.i1.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.p1.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.i2.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, s.p2.toFixed(2), "%"))))))), /*#__PURE__*/React.createElement("div", {
    className: "recommend-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "recommend-banner__icon"
  }, "2"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Cohort 2 is better on ", /*#__PURE__*/React.createElement("b", null, "13 of 16"), " measured metrics"), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      fontWeight: 600,
      opacity: 0.85
    }
  }, "Retention, LTV total, Inapps, and Ads all show statistically-significant uplifts."))), /*#__PURE__*/React.createElement("div", {
    className: "bi-dash-tabs"
  }, [{
    id: "retention",
    label: "Retention"
  }, {
    id: "ltv",
    label: "LTV Total"
  }, {
    id: "funnel",
    label: "Tech Funnel"
  }, {
    id: "ads",
    label: "Ads"
  }, {
    id: "inapps",
    label: "In-Apps"
  }, {
    id: "subs",
    label: "Subscriptions"
  }, {
    id: "levels",
    label: "Levels Funnel"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: "bi-dash-tab" + (section === t.id ? " is-active" : ""),
    onClick: () => setSection(t.id)
  }, t.label))), section === "retention" && /*#__PURE__*/React.createElement(CC_Retention, {
    D: D
  }), section === "ltv" && /*#__PURE__*/React.createElement(CC_LTV, {
    D: D
  }), section === "funnel" && /*#__PURE__*/React.createElement(CC_Funnel, {
    D: D
  }), section === "ads" && /*#__PURE__*/React.createElement(CC_Ads, {
    D: D
  }), section === "inapps" && /*#__PURE__*/React.createElement(CC_Inapps, {
    D: D
  }), section === "subs" && /*#__PURE__*/React.createElement(CC_Subs, {
    D: D
  }), section === "levels" && /*#__PURE__*/React.createElement(CC_Levels, {
    D: D
  }));
};
const CohortParams = ({
  title,
  cohort,
  onChange
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    border: "1px solid var(--line)",
    borderRadius: 6,
    padding: 12,
    background: "var(--brand-tint)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontWeight: 800,
    color: "var(--accent-teal)",
    marginBottom: 10
  }
}, title), /*#__PURE__*/React.createElement("div", {
  className: "row gap-8 mb-8"
}, /*#__PURE__*/React.createElement("div", {
  className: "field",
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "OS"), /*#__PURE__*/React.createElement("select", {
  className: "field__select"
}, /*#__PURE__*/React.createElement("option", null, "All"), /*#__PURE__*/React.createElement("option", null, "iOS"), /*#__PURE__*/React.createElement("option", null, "Android"))), /*#__PURE__*/React.createElement("div", {
  className: "field",
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Lifetime (d)"), /*#__PURE__*/React.createElement("input", {
  className: "field__input",
  defaultValue: cohort.daysAvailable
}))), /*#__PURE__*/React.createElement("div", {
  className: "row gap-8 mb-8"
}, /*#__PURE__*/React.createElement("div", {
  className: "field",
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Start"), /*#__PURE__*/React.createElement("input", {
  className: "field__input",
  defaultValue: cohort.startDate
})), /*#__PURE__*/React.createElement("div", {
  className: "field",
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "End"), /*#__PURE__*/React.createElement("input", {
  className: "field__input",
  defaultValue: cohort.endDate
}))), /*#__PURE__*/React.createElement("div", {
  className: "field mb-8"
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Versions"), /*#__PURE__*/React.createElement("input", {
  className: "field__input",
  defaultValue: cohort.name
})), /*#__PURE__*/React.createElement("div", {
  className: "row gap-8"
}, /*#__PURE__*/React.createElement("div", {
  className: "field",
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Cheater filter"), /*#__PURE__*/React.createElement("div", {
  className: "row gap-8 tiny"
}, /*#__PURE__*/React.createElement("label", {
  className: "row gap-4"
}, /*#__PURE__*/React.createElement("input", {
  type: "radio",
  name: "ch" + title,
  defaultChecked: true
}), " Yes"), /*#__PURE__*/React.createElement("label", {
  className: "row gap-4"
}, /*#__PURE__*/React.createElement("input", {
  type: "radio",
  name: "ch" + title
}), " No ", /*#__PURE__*/React.createElement("span", {
  className: "muted"
}, "(slow)")))), /*#__PURE__*/React.createElement("div", {
  className: "field",
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "field__label"
}, "Exclude AB groups"), /*#__PURE__*/React.createElement("input", {
  className: "field__input",
  placeholder: "ab_groups, comma"
}))));
const sigBadge = (sig, dir = "win") => {
  if (sig === "win") return /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "Cohort 2 better");
  if (sig === "lose") return /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, "Cohort 1 better");
  return /*#__PURE__*/React.createElement(Pill, {
    kind: "draft"
  }, "Not significant");
};
const probBadge = prob => {
  if (prob >= 95) return /*#__PURE__*/React.createElement(Pill, {
    kind: "ok"
  }, "Cohort 2 better");
  if (prob < 50) return /*#__PURE__*/React.createElement(Pill, {
    kind: "crit"
  }, "Cohort 1 better");
  return /*#__PURE__*/React.createElement(Pill, {
    kind: "draft"
  }, "Not significant");
};
const CC_Retention = ({
  D
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Retention by lifetime")), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(LineChart, {
  seed: "cc-ret",
  series: [{
    label: "cohort 1",
    values: D.retention.map(r => r.p1)
  }, {
    label: "cohort 2",
    values: D.retention.map(r => r.p2)
  }],
  palette: ["#a0a8b5", "#2A6BE0"],
  height: 220
})), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cohort 1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cohort 2"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "P(2 > 1) %"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "missed opportunity"), /*#__PURE__*/React.createElement("th", null, "Verdict"))), /*#__PURE__*/React.createElement("tbody", null, D.retention.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "D", r.lt)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.p1.toFixed(2), "% (", r.n1.toLocaleString(), ")"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.p2.toFixed(2), "% (", r.n2.toLocaleString(), ")"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    fontWeight: 700,
    color: r.prob >= 95 ? "var(--status-ok)" : r.prob < 50 ? "var(--status-crit)" : "var(--ink-3)"
  }
}, r.prob.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.lost.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", null, probBadge(r.prob))))))));
const CC_LTV = ({
  D
}) => /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "LTV Total")), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(LineChart, {
  seed: "cc-ltv",
  series: [{
    label: "cohort 1",
    values: D.ltvTotal.map(r => r.v1)
  }, {
    label: "cohort 2",
    values: D.ltvTotal.map(r => r.v2)
  }],
  palette: ["#a0a8b5", "#2A6BE0"],
  height: 220
})), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cohort 1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cohort 2"), /*#__PURE__*/React.createElement("th", null, "Verdict"))), /*#__PURE__*/React.createElement("tbody", null, D.ltvTotal.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "D", r.lt)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, "$", r.v1.toFixed(3)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, "$", r.v2.toFixed(3)), /*#__PURE__*/React.createElement("td", null, sigBadge(r.sig)))))));
const CC_Funnel = ({
  D
}) => /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Technical loading funnel")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "step"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "% installs c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "% installs c2"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "uniques c1"))), /*#__PURE__*/React.createElement("tbody", null, D.funnelLoad.map((s, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, s.step), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, s.p1.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    color: s.p2 > s.p1 ? "var(--status-ok)" : "var(--status-crit)",
    fontWeight: 700
  }
}, s.p2.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, s.n1.toLocaleString()))))));
const CC_Ads = ({
  D
}) => {
  const [adTab, setAdTab] = useState("ltv");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Advertising"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, [["ltv", "LTV Ads"], ["ecpm", "eCPM"], ["inter", "Inter views"], ["reward", "Reward views"], ["plc", "Placements"], ["av", "Availability"]].map(([id, lab]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: "btn btn--sm " + (adTab === id ? "btn--primary" : ""),
    onClick: () => setAdTab(id)
  }, lab))))), adTab === "ltv" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "LTV Ads")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement(LineChart, {
    seed: "cc-ltvad",
    series: [{
      label: "c1",
      values: D.ads.ltvAds.map(r => r.v1)
    }, {
      label: "c2",
      values: D.ads.ltvAds.map(r => r.v2)
    }],
    palette: ["#a0a8b5", "#2A6BE0"],
    height: 200
  })), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "c1"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "c2"), /*#__PURE__*/React.createElement("th", null, "Verdict"))), /*#__PURE__*/React.createElement("tbody", null, D.ads.ltvAds.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, "D", r.lt), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, "$", r.v1.toFixed(3)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, "$", r.v2.toFixed(3)), /*#__PURE__*/React.createElement("td", null, sigBadge(r.sig))))))), adTab === "ecpm" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "eCPM by format")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ad_format"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "cohort 1"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "cohort 2"))), /*#__PURE__*/React.createElement("tbody", null, D.ads.ecpm.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, r.format)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, "$", r.v1.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, "$", r.v2.toFixed(2))))))), adTab === "inter" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Interstitial views per install by lifetime")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "c1"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "c2"), /*#__PURE__*/React.createElement("th", null, "Verdict"))), /*#__PURE__*/React.createElement("tbody", null, D.ads.interByLT.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, "D", r.lt), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r.v1.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r.v2.toFixed(2)), /*#__PURE__*/React.createElement("td", null, sigBadge(r.sig))))))), adTab === "reward" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Rewarded views per install by lifetime")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "c1"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "c2"), /*#__PURE__*/React.createElement("th", null, "Verdict"))), /*#__PURE__*/React.createElement("tbody", null, D.ads.rewardByLT.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, "D", r.lt), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r.v1.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, r.v2.toFixed(2)), /*#__PURE__*/React.createElement("td", null, sigBadge(r.sig))))))), adTab === "plc" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Placements")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "format"), /*#__PURE__*/React.createElement("th", null, "place"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "views/install c1"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "views/install c2"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "conv % c1"))), /*#__PURE__*/React.createElement("tbody", null, D.ads.placements.map((p, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, p.format)), /*#__PURE__*/React.createElement("td", {
    className: "dt-mono"
  }, p.place), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, p.vi1.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, p.vi2.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, p.conv.toFixed(2))))))), adTab === "av" && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "Ad availability")), /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "cohort"), /*#__PURE__*/React.createElement("th", null, "format"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "% successful requests"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "% started shows"), /*#__PURE__*/React.createElement("th", {
    className: "dt-num"
  }, "% viewed"))), /*#__PURE__*/React.createElement("tbody", null, D.ads.availability.map((a, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "c", a.c)), /*#__PURE__*/React.createElement("td", null, a.fmt), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, a.req.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, a.started.toFixed(0), "%"), /*#__PURE__*/React.createElement("td", {
    className: "dt-num"
  }, a.viewed.toFixed(2), "%")))))));
};
const CC_Inapps = ({
  D
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "LTV in-apps")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "c2"))), /*#__PURE__*/React.createElement("tbody", null, D.inapps.ltvInapps.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, "D", r.lt), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, "$", r.v1.toFixed(4)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    color: r.v2 > r.v1 ? "var(--status-ok)" : "var(--status-crit)",
    fontWeight: 700
  }
}, "$", r.v2.toFixed(4))))))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "cNPU \xB7 cumulative paying users")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "% c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "% c2"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "n c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "n c2"))), /*#__PURE__*/React.createElement("tbody", null, D.inapps.cnpu.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, "D", r.lt), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.p1.toFixed(3), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.p2.toFixed(3), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.n1), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.n2)))))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "cARPPU")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "lifetime"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cARPPU c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cARPPU c2"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cNPU c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cNPU c2"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cRev c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "cRev c2"))), /*#__PURE__*/React.createElement("tbody", null, D.inapps.carppu.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, "D", r.lt), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, "$", r.a1.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, "$", r.a2.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.n1), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.n2), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, "$", r.r1.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, "$", r.r2.toFixed(2))))))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Purchases by inapp ID")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "content_id"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "conv % c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "conv % c2"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "revenue $ c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "revenue $ c2"))), /*#__PURE__*/React.createElement("tbody", null, D.inapps.purchases.map((p, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", {
  className: "dt-mono"
}, p.content), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, (p.c1 * 100).toFixed(4), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    color: p.c2 > p.c1 ? "var(--status-ok)" : "var(--status-crit)",
    fontWeight: 700
  }
}, (p.c2 * 100).toFixed(4), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, "$", p.r1.toFixed(2)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    color: p.r2 > p.r1 ? "var(--status-ok)" : "var(--status-crit)",
    fontWeight: 700
  }
}, "$", p.r2.toFixed(2))))))));
const CC_Subs = ({
  D
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Trial conversion")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "cohort"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "opened trial"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "conv. to trial %"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "paid after"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "conv. to paid %"))), /*#__PURE__*/React.createElement("tbody", null, D.subs.trial.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "c", r.c)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.opened), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.conv.toFixed(3), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.paid), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.payConv.toFixed(2), "%")))))), /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Subscription payment \xB7 overall")), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "cohort"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "paid"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "conv %"))), /*#__PURE__*/React.createElement("tbody", null, D.subs.overall.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "c", r.c)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.paid), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.conv.toFixed(3), "%")))))));
const CC_Levels = ({
  D
}) => /*#__PURE__*/React.createElement("div", {
  className: "card"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "card__title"
}, "Main level funnel")), /*#__PURE__*/React.createElement("div", {
  className: "card__body"
}, /*#__PURE__*/React.createElement(LineChart, {
  seed: "cc-lf",
  series: [{
    label: "starts c1",
    values: D.levelFunnel.map(r => r.start_1)
  }, {
    label: "starts c2",
    values: D.levelFunnel.map(r => r.start_2)
  }, {
    label: "finishes c1",
    values: D.levelFunnel.map(r => r.finish_1)
  }, {
    label: "finishes c2",
    values: D.levelFunnel.map(r => r.finish_2)
  }],
  palette: ["#a0a8b5", "#2A6BE0", "#d2d6dd", "#7eaef0"],
  height: 220
})), /*#__PURE__*/React.createElement("table", {
  className: "dt"
}, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "level"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "start c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "start c2"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "finish c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "finish c2"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "funnel start % c1"), /*#__PURE__*/React.createElement("th", {
  className: "dt-num"
}, "funnel start % c2"))), /*#__PURE__*/React.createElement("tbody", null, D.levelFunnel.map((r, i) => /*#__PURE__*/React.createElement("tr", {
  key: i
}, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "L", r.level)), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.start_1.toLocaleString()), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.start_2.toLocaleString()), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.finish_1.toLocaleString()), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.finish_2.toLocaleString()), /*#__PURE__*/React.createElement("td", {
  className: "dt-num"
}, r.fs1.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
  className: "dt-num",
  style: {
    color: r.fs2 > r.fs1 ? "var(--status-ok)" : "var(--status-crit)",
    fontWeight: 700
  }
}, r.fs2.toFixed(2), "%"))))));

// Expose to other files
Object.assign(window, {
  ABAnalysisReport,
  CohortCompareReport
});