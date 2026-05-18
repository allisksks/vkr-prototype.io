/* Shared UI components */

const {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Fragment
} = React;

// ============== Icons (tiny SVG inline) ==============
const Icon = ({
  name,
  size = 16,
  color = "currentColor",
  style
}) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style
  };
  switch (name) {
    case "chevron-down":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M6 9l6 6 6-6"
      }));
    case "chevron-up":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M18 15l-6-6-6 6"
      }));
    case "chevron-right":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M9 18l6-6-6-6"
      }));
    case "chevron-left":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M15 18l-6-6 6-6"
      }));
    case "search":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 21l-4-4"
      }));
    case "plus":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M12 5v14M5 12h14"
      }));
    case "x":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M18 6L6 18M6 6l12 12"
      }));
    case "edit":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      }));
    case "trash":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"
      }));
    case "filter":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("polygon", {
        points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
      }));
    case "download":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
      }));
    case "code":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("polyline", {
        points: "16 18 22 12 16 6"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "8 6 2 12 8 18"
      }));
    case "chart-bar":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("line", {
        x1: "12",
        y1: "20",
        x2: "12",
        y2: "10"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "18",
        y1: "20",
        x2: "18",
        y2: "4"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "6",
        y1: "20",
        x2: "6",
        y2: "16"
      }));
    case "chart-line":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("polyline", {
        points: "3 17 9 11 13 15 21 7"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "14 7 21 7 21 14"
      }));
    case "chart-pie":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M21.21 15.89A10 10 0 1 1 8 2.83"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M22 12A10 10 0 0 0 12 2v10z"
      }));
    case "table":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        y1: "9",
        x2: "21",
        y2: "9"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "9",
        y1: "3",
        x2: "9",
        y2: "21"
      }));
    case "calendar":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "4",
        width: "18",
        height: "18",
        rx: "2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "16",
        y1: "2",
        x2: "16",
        y2: "6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "8",
        y1: "2",
        x2: "8",
        y2: "6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        y1: "10",
        x2: "21",
        y2: "10"
      }));
    case "settings":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      }));
    case "play":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("polygon", {
        points: "5 3 19 12 5 21 5 3"
      }));
    case "alert":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        y1: "8",
        x2: "12",
        y2: "12"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        y1: "16",
        x2: "12.01",
        y2: "16"
      }));
    case "check":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("polyline", {
        points: "20 6 9 17 4 12"
      }));
    case "save":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "17 21 17 13 7 13 7 21"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "7 3 7 8 15 8"
      }));
    case "copy":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "9",
        y: "9",
        width: "13",
        height: "13",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      }));
    case "lightning":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("polygon", {
        points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      }));
    case "book":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
      }));
    case "flask":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M9 2v6L3 20a2 2 0 0 0 1.7 3h14.6A2 2 0 0 0 21 20L15 8V2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "9",
        y1: "2",
        x2: "15",
        y2: "2"
      }));
    case "tag":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "7",
        y1: "7",
        x2: "7.01",
        y2: "7"
      }));
    case "menu":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("line", {
        x1: "3",
        y1: "6",
        x2: "21",
        y2: "6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        y1: "12",
        x2: "21",
        y2: "12"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        y1: "18",
        x2: "21",
        y2: "18"
      }));
    case "external":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "15 3 21 3 21 9"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "10",
        y1: "14",
        x2: "21",
        y2: "3"
      }));
    case "eye":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }));
    case "home":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "9 22 9 12 15 12 15 22"
      }));
    case "clock":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "12 6 12 12 16 14"
      }));
    case "users":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "7",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M23 21v-2a4 4 0 0 0-3-3.87"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 3.13a4 4 0 0 1 0 7.75"
      }));
    default:
      return null;
  }
};

// ============== Pill (status) ==============
const Pill = ({
  kind = "ok",
  children
}) => /*#__PURE__*/React.createElement("span", {
  className: `pill pill--${kind}`
}, /*#__PURE__*/React.createElement("span", {
  className: "dot"
}), children);

// ============== Chip (filter) ==============
const Chip = ({
  kind = "pos",
  flag,
  children,
  onRemove
}) => /*#__PURE__*/React.createElement("span", {
  className: "chip" + (kind === "neg" ? " chip--neg" : kind === "blue" ? " chip--blue" : "")
}, flag && /*#__PURE__*/React.createElement("span", {
  className: "chip__flag",
  style: {
    background: flag
  }
}), children, onRemove && /*#__PURE__*/React.createElement("span", {
  className: "chip__x",
  onClick: onRemove
}, "\xD7"));

// ============== Filter row ==============
const FilterRow = ({
  label,
  checked = true,
  onToggle,
  children,
  placeholder,
  single
}) => /*#__PURE__*/React.createElement("div", {
  className: "filter-row"
}, /*#__PURE__*/React.createElement("div", {
  className: "filter-row__label"
}, /*#__PURE__*/React.createElement("span", {
  className: "filter-row__cb" + (checked ? " is-on" : ""),
  onClick: onToggle
}), /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("div", {
  className: "filter-row__pm"
}, /*#__PURE__*/React.createElement("button", {
  className: "pm-btn pm-btn--add"
}, /*#__PURE__*/React.createElement(Icon, {
  name: "plus",
  size: 12,
  color: "#fff"
})), /*#__PURE__*/React.createElement("button", {
  className: "pm-btn pm-btn--rm"
}, "\u2014")), /*#__PURE__*/React.createElement("div", {
  className: "filter-row__chips"
}, children, !children || Array.isArray(children) && children.length === 0 ? /*#__PURE__*/React.createElement("span", {
  className: "chip__placeholder"
}, placeholder || `choose ${label.toLowerCase()} …`) : /*#__PURE__*/React.createElement("span", {
  className: "chip__placeholder"
}, placeholder || `choose ${label.toLowerCase()} …`)));

// ============== Page header (breadcrumb-style) ==============
const PageTitle = ({
  crumbs = [],
  title,
  q,
  actions
}) => /*#__PURE__*/React.createElement("div", {
  className: "page__head"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "page__title"
}, crumbs.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
  key: i
}, /*#__PURE__*/React.createElement("span", {
  className: "crumb"
}, c), /*#__PURE__*/React.createElement("span", {
  className: "crumb-sep"
}, "/"))), /*#__PURE__*/React.createElement("span", null, title), q && /*#__PURE__*/React.createElement("span", {
  className: "q-icon",
  title: "Help"
}, "?"))), actions && /*#__PURE__*/React.createElement("div", {
  className: "row gap-8"
}, actions));

// ============== Modal ==============
const Modal = ({
  title,
  onClose,
  children,
  footer,
  size
}) => /*#__PURE__*/React.createElement("div", {
  className: "scrim",
  onClick: onClose
}, /*#__PURE__*/React.createElement("div", {
  className: "modal" + (size === "lg" ? " modal--lg" : size === "xl" ? " modal--xl" : ""),
  onClick: e => e.stopPropagation()
}, /*#__PURE__*/React.createElement("div", {
  className: "modal__head"
}, /*#__PURE__*/React.createElement("div", {
  className: "modal__title"
}, title), /*#__PURE__*/React.createElement("button", {
  className: "modal__close",
  onClick: onClose
}, "\xD7")), /*#__PURE__*/React.createElement("div", {
  className: "modal__body"
}, children), footer && /*#__PURE__*/React.createElement("div", {
  className: "modal__foot"
}, footer)));

// ============== Topbar ==============
const TOOLS = [{
  id: "ems",
  label: "EMS",
  full: "Event Marking Service",
  icon: "lightning",
  color: "#e07a3a",
  bg: "#fde7d5"
}, {
  id: "bi",
  label: "BI",
  full: "Business Intelligence",
  icon: "chart-line",
  color: "#2A6BE0",
  bg: "#d8e7fa"
}, {
  id: "ab",
  label: "A/B Splitter",
  full: "A/B Experiments",
  icon: "flask",
  color: "#6d3aae",
  bg: "#ece0fb"
}, {
  id: "kb",
  label: "KB",
  full: "Knowledge Base",
  icon: "book",
  color: "#1d8fb8",
  bg: "#cfeaf2"
}];
const Topbar = ({
  currentTool,
  project,
  onNavigate,
  onProjectChange
}) => {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const notifs = AppData.notifications || [];
  return /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar__brand",
    onClick: () => onNavigate("hub"),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar__brand-mark"
  }, "GDC"), /*#__PURE__*/React.createElement("span", null, "Analytics")), /*#__PURE__*/React.createElement("div", {
    className: "topbar__tabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: "topbar__tab" + (currentTool === "hub" ? " is-active" : ""),
    onClick: () => onNavigate("hub")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "home",
    size: 14
  }), " Home"), TOOLS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: "topbar__tab" + (currentTool === t.id ? " is-active" : ""),
    onClick: () => onNavigate(t.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 14
  }), " ", t.label))), /*#__PURE__*/React.createElement("div", {
    className: "topbar__spacer"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      alignSelf: "center",
      marginRight: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "topbar__icon-btn",
    onClick: () => setNotifOpen(o => !o),
    title: "Notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 18
  }), notifs.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -2,
      right: -2,
      background: "#e94646",
      color: "#fff",
      borderRadius: 10,
      fontSize: 9.5,
      fontWeight: 800,
      padding: "1px 5px"
    }
  }, notifs.length)), notifOpen && /*#__PURE__*/React.createElement("div", {
    className: "proj-dd",
    onClick: e => e.stopPropagation(),
    style: {
      width: 360,
      maxHeight: 460,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "proj-dd__head"
  }, "Notifications"), notifs.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: "proj-dd__item",
    style: {
      padding: "10px 14px",
      alignItems: "flex-start",
      flexDirection: "column",
      gap: 2
    },
    onClick: () => {
      setNotifOpen(false);
      if (n.kind === "alert") {
        onNavigate("ems");
      } else if (n.kind === "experiment") {
        onNavigate("ab");
      } else if (n.kind === "kb") {
        onNavigate("kb");
      } else if (n.kind === "report") {
        onNavigate("bi");
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon,
    size: 14,
    color: n.kind === "alert" ? "#e94646" : "var(--brand)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 700,
      fontSize: 12.5
    }
  }, n.text)), /*#__PURE__*/React.createElement("div", {
    className: "tiny muted",
    style: {
      paddingLeft: 22
    }
  }, n.time))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      borderTop: "1px solid var(--line-soft)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm btn--ghost"
  }, "Mark all as read")))), /*#__PURE__*/React.createElement("button", {
    className: "topbar__icon-btn",
    onClick: () => setHelpOpen(true),
    title: "Keyboard shortcuts",
    style: {
      alignSelf: "center",
      marginRight: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 14
    }
  }, "?")), /*#__PURE__*/React.createElement("div", {
    className: "topbar__project",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "topbar__project-name"
  }, project ? project.name : "All Projects"), /*#__PURE__*/React.createElement("div", {
    className: "topbar__project-meta"
  }, project ? project.groupName : "Portfolio view")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14
  }), open && /*#__PURE__*/React.createElement("div", {
    className: "proj-dd",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "proj-dd__head"
  }, "Switch Project"), /*#__PURE__*/React.createElement("div", {
    className: "proj-dd__group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proj-dd__group-name"
  }, "All"), /*#__PURE__*/React.createElement("div", {
    className: "proj-dd__item" + (!project ? " is-active" : ""),
    onClick: () => {
      onProjectChange(null);
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "proj-dd__item-icon"
  }), "Portfolio view")), AppData.projectGroups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "proj-dd__group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proj-dd__group-name"
  }, g.name), g.projects.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "proj-dd__item" + (project && project.id === p.id ? " is-active" : ""),
    onClick: () => {
      onProjectChange(p);
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "proj-dd__item-icon"
  }), p.name)))))), /*#__PURE__*/React.createElement("div", {
    className: "topbar__user",
    title: "A. Volkova"
  }, "AV"), helpOpen && /*#__PURE__*/React.createElement(Modal, {
    title: "Keyboard shortcuts",
    onClose: () => setHelpOpen(false),
    footer: /*#__PURE__*/React.createElement("button", {
      className: "btn btn--primary",
      onClick: () => setHelpOpen(false)
    }, "Got it")
  }, /*#__PURE__*/React.createElement("table", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("kbd", null, "G H")), /*#__PURE__*/React.createElement("td", null, "Go to Home / Hub")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("kbd", null, "G E")), /*#__PURE__*/React.createElement("td", null, "Go to EMS")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("kbd", null, "G B")), /*#__PURE__*/React.createElement("td", null, "Go to BI")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("kbd", null, "G A")), /*#__PURE__*/React.createElement("td", null, "Go to A/B Splitter")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("kbd", null, "G K")), /*#__PURE__*/React.createElement("td", null, "Go to Knowledge Base")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("kbd", null, "Cmd + K")), /*#__PURE__*/React.createElement("td", null, "Global search (coming soon)")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("kbd", null, "/")), /*#__PURE__*/React.createElement("td", null, "Focus current-screen search")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("kbd", null, "Esc")), /*#__PURE__*/React.createElement("td", null, "Close modal / side panel")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("kbd", null, "?")), /*#__PURE__*/React.createElement("td", null, "Open this help")))), /*#__PURE__*/React.createElement("div", {
    className: "muted tiny mt-12"
  }, "Shortcuts will be enabled in the next iteration. This panel previews the planned bindings.")));
};

// Floating action button (FAB) — quick create
const FAB = ({
  onNavigate
}) => {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 92,
      right: 28,
      background: "#fff",
      borderRadius: 10,
      boxShadow: "var(--shadow-lg)",
      border: "1px solid var(--line)",
      padding: 6,
      zIndex: 49,
      display: "flex",
      flexDirection: "column",
      minWidth: 220,
      animation: "modalIn 0.18s ease"
    }
  }, [{
    label: "New event",
    desc: "Open EMS · register schema",
    ic: "lightning",
    color: "#e07a3a",
    tool: "ems",
    payload: {
      tab: "registry",
      newEvent: true
    }
  }, {
    label: "New experiment",
    desc: "Open A/B · designer step 1",
    ic: "flask",
    color: "#6d3aae",
    tool: "ab",
    payload: {
      newDraft: {
        hypothesis: "",
        metric: {
          name: "Retention D7",
          unit: "%"
        },
        event: {
          name: "—",
          project: "iron_shells"
        },
        trafficSplit: 50,
        duration: 14
      }
    }
  }, {
    label: "New KB entry",
    desc: "Open KB · create form",
    ic: "book",
    color: "#1d8fb8",
    tool: "kb",
    payload: {
      view: "new"
    }
  }, {
    label: "New dashboard",
    desc: "Open BI · blank canvas",
    ic: "chart-line",
    color: "#2A6BE0",
    tool: "bi",
    payload: {
      dashboardId: "custom"
    }
  }].map((item, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => {
      setOpen(false);
      onNavigate(item.tool, item.payload);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      border: "none",
      background: "none",
      borderRadius: 6,
      textAlign: "left",
      cursor: "pointer"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--brand-tint)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: item.color + "22",
      color: item.color,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: item.ic,
    size: 16
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, item.label), /*#__PURE__*/React.createElement("div", {
    className: "tiny muted"
  }, item.desc))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      position: "fixed",
      bottom: 28,
      right: 28,
      width: 56,
      height: 56,
      borderRadius: 28,
      background: "var(--brand)",
      color: "#fff",
      border: "none",
      boxShadow: "var(--shadow-lg)",
      zIndex: 50,
      fontSize: 24,
      fontWeight: 600,
      cursor: "pointer",
      transform: open ? "rotate(45deg)" : "none",
      transition: "transform 0.15s ease, background 0.15s",
      display: "grid",
      placeItems: "center"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--brand-strong)",
    onMouseLeave: e => e.currentTarget.style.background = "var(--brand)",
    title: "Quick create"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 24,
    color: "#fff"
  })));
};
Object.assign(window, {
  FAB
});

// ============== Project Sidebar (BI/EMS style) ==============
const ProjectSidebar = ({
  project,
  onSelectProject,
  items = [],
  activeItem,
  onSelectItem,
  customGroups
}) => {
  const [collapsed, setCollapsed] = useState({});
  const toggle = k => setCollapsed(c => ({
    ...c,
    [k]: !c[k]
  }));
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar__head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sidebar__head-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12
  }), " New Folder"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sidebar__icon-btn",
    title: "Refresh"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M23 4v6h-6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1 20v-6h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "sidebar__icon-btn",
    title: "Layout"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "menu",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    className: "sidebar__icon-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 14
  })))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar__list"
  }, customGroups ? customGroups.map(group => /*#__PURE__*/React.createElement("div", {
    key: group.id,
    className: "sidebar__group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar__group-head",
    onClick: () => toggle(group.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sidebar__caret"
  }, collapsed[group.id] ? "▶" : "▼"), /*#__PURE__*/React.createElement("span", {
    className: "sidebar__folder-icon"
  }), /*#__PURE__*/React.createElement("span", null, group.name)), !collapsed[group.id] && /*#__PURE__*/React.createElement("div", {
    className: "sidebar__items"
  }, group.items.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    className: "sidebar__item" + (activeItem === item.id ? " is-active" : ""),
    onClick: () => onSelectItem && onSelectItem(item)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sidebar__folder-icon"
  }), item.name))))) : AppData.projectGroups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "sidebar__group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar__group-head",
    onClick: () => toggle(g.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sidebar__caret"
  }, collapsed[g.id] ? "▶" : "▼"), /*#__PURE__*/React.createElement("span", {
    className: "sidebar__folder-icon"
  }), /*#__PURE__*/React.createElement("span", null, g.name)), !collapsed[g.id] && /*#__PURE__*/React.createElement("div", {
    className: "sidebar__items"
  }, g.projects.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "sidebar__item" + (project && project.id === p.id ? " is-active" : ""),
    onClick: () => onSelectProject && onSelectProject(p)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sidebar__folder-icon"
  }), p.name)))))));
};

// ============== Param Row ==============
const ParamRow = ({
  param
}) => /*#__PURE__*/React.createElement("div", {
  className: "param-row"
}, /*#__PURE__*/React.createElement("div", {
  className: "param-row__name"
}, param.name), /*#__PURE__*/React.createElement("div", {
  className: `param-row__type t-${param.type}`
}, param.type), /*#__PURE__*/React.createElement("div", {
  className: "param-row__req"
}, param.required ? "required" : ""), /*#__PURE__*/React.createElement("div", {
  className: "param-row__desc"
}, param.desc));

// ============== Metric tile ==============
const MetricTile = ({
  label,
  value,
  delta,
  deltaDir,
  onClick,
  action
}) => /*#__PURE__*/React.createElement("div", {
  className: "metric-tile",
  onClick: onClick,
  style: {
    cursor: onClick ? "pointer" : "default"
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "metric-tile__label"
}, label), /*#__PURE__*/React.createElement("div", {
  className: "metric-tile__val"
}, value), delta && /*#__PURE__*/React.createElement("div", {
  className: `metric-tile__delta ${deltaDir || "up"}`
}, deltaDir === "down" ? "↓" : "↑", " ", delta), action && /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 8
  }
}, action));

// ============== Section title ==============
const SectionTitle = ({
  children,
  q
}) => /*#__PURE__*/React.createElement("div", {
  className: "section-title"
}, children, q && /*#__PURE__*/React.createElement("span", {
  className: "q-icon"
}, "?"));

// Toast/notification
const Toast = ({
  message,
  onClose
}) => {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 24,
      right: 24,
      background: "var(--ink)",
      color: "#fff",
      padding: "12px 18px",
      borderRadius: 8,
      fontWeight: 700,
      fontSize: 13,
      boxShadow: "var(--shadow-lg)",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      gap: 8,
      animation: "modalIn 0.18s ease"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16,
    color: "#5fc16d"
  }), message);
};

// expose
Object.assign(window, {
  Icon,
  Pill,
  Chip,
  FilterRow,
  PageTitle,
  Modal,
  Topbar,
  ProjectSidebar,
  ParamRow,
  MetricTile,
  SectionTitle,
  Toast,
  TOOLS
});