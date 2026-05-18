/* Simple SVG charts to keep the prototype self-contained. */

// Generate deterministic-ish pseudo-random series from a seed string.
function seededSeries(seed, n, min, max) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const arr = [];
  for (let i = 0; i < n; i++) {
    h = (h * 9301 + 49297) % 233280;
    const r = h / 233280;
    arr.push(min + r * (max - min));
  }
  return arr;
}

// Smooth a series via simple moving avg
function smooth(arr, k = 3) {
  return arr.map((_, i) => {
    let s = 0, c = 0;
    for (let j = -k; j <= k; j++) {
      if (i + j >= 0 && i + j < arr.length) { s += arr[i + j]; c++; }
    }
    return s / c;
  });
}

// Build SVG path
function linePath(values, w, h, padX = 12, padY = 12) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const dx = (w - padX * 2) / (values.length - 1 || 1);
  const norm = v => h - padY - ((v - min) / (max - min || 1)) * (h - padY * 2);
  return values.map((v, i) => `${i === 0 ? "M" : "L"}${padX + i * dx},${norm(v).toFixed(1)}`).join(" ");
}
function areaPath(values, w, h, padX = 12, padY = 12) {
  const lp = linePath(values, w, h, padX, padY);
  const dx = (w - padX * 2) / (values.length - 1 || 1);
  const lastX = padX + (values.length - 1) * dx;
  return `${lp} L${lastX.toFixed(1)},${h - padY} L${padX},${h - padY} Z`;
}

// =========== Line chart ===========
const LineChart = ({ seed = "default", series, height = 220, palette }) => {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const r = () => ref.current && setW(ref.current.clientWidth);
    r();
    const ro = new ResizeObserver(r);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const COLORS = palette || ["#2A6BE0", "#43c08a", "#f5a623", "#e94646", "#8a55d8", "#1d8fb8"];
  const sList = series && series.length
    ? series
    : ["Total Installs","Organic Share","DAU","ARPU"].map((label, i) => ({
        label,
        values: smooth(seededSeries(seed + label, 24, 30 + i*15, 100 + i*40)),
      }));

  const h = height;
  const padX = 28, padY = 24;
  const allVals = sList.flatMap(s => s.values);
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);

  const yTicks = 4;
  const labels = Array.from({length: 8}, (_, i) => {
    const d = new Date(2026, 4, 16);
    d.setDate(d.getDate() + Math.floor((24 / 7) * i));
    return `${("0"+(d.getMonth()+1)).slice(-2)}-${("0"+d.getDate()).slice(-2)}`;
  });

  return (
    <div ref={ref} style={{width:"100%"}}>
      <svg width={w} height={h} style={{overflow:"visible"}}>
        {/* y grid */}
        {Array.from({length: yTicks + 1}, (_, i) => {
          const y = padY + (i / yTicks) * (h - padY * 2);
          const val = max - (i / yTicks) * (max - min);
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={w - padX/2} y2={y} stroke="#eceff4" strokeWidth="1"/>
              <text x={padX - 6} y={y + 3} fontSize="10" fill="#7a8794" textAnchor="end">{Math.round(val)}</text>
            </g>
          );
        })}
        {/* lines */}
        {sList.map((s, idx) => {
          const sm = smooth(s.values, 1);
          return (
            <g key={idx}>
              <path d={linePath(sm, w, h, padX, padY)} stroke={COLORS[idx % COLORS.length]} fill="none" strokeWidth="2" strokeLinecap="round"/>
              {sm.map((v, i) => {
                const dx = (w - padX * 2) / (sm.length - 1 || 1);
                const x = padX + i * dx;
                const y = h - padY - ((v - min) / (max - min || 1)) * (h - padY * 2);
                return <circle key={i} cx={x} cy={y} r={2.2} fill="#fff" stroke={COLORS[idx % COLORS.length]} strokeWidth="1.5"/>;
              })}
            </g>
          );
        })}
        {/* x labels */}
        {labels.map((lab, i) => {
          const x = padX + (i / (labels.length - 1)) * (w - padX * 2);
          return <text key={i} x={x} y={h - 6} fontSize="10" fill="#7a8794" textAnchor="middle">{lab}</text>;
        })}
      </svg>
      <div className="legend">
        {sList.map((s, idx) => (
          <div key={idx} className="legend__item">
            <span className="legend__sw" style={{background: COLORS[idx % COLORS.length]}}></span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========== Bar chart ===========
const BarChart = ({ seed = "bar", series, labels, height = 220, palette }) => {
  const ref = useRef(null);
  const [w, setW] = useState(500);
  useEffect(() => {
    const r = () => ref.current && setW(ref.current.clientWidth);
    r();
    const ro = new ResizeObserver(r);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const COLORS = palette || ["#2A6BE0","#43c08a","#e07a3a"];
  const labs = labels || ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const sList = series || [{ label: "Sessions", values: seededSeries(seed, labs.length, 50, 200) }];
  const h = height;
  const padX = 28, padY = 24;
  const allVals = sList.flatMap(s => s.values);
  const max = Math.max(...allVals);
  const groupW = (w - padX * 2) / labs.length;
  const barW = Math.min(28, (groupW - 6) / sList.length);

  return (
    <div ref={ref} style={{width:"100%"}}>
      <svg width={w} height={h}>
        {/* y grid */}
        {Array.from({length: 5}, (_, i) => {
          const y = padY + (i / 4) * (h - padY * 2);
          const val = max * (1 - i / 4);
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={w - 4} y2={y} stroke="#eceff4"/>
              <text x={padX - 6} y={y + 3} fontSize="10" fill="#7a8794" textAnchor="end">{Math.round(val)}</text>
            </g>
          );
        })}
        {labs.map((lab, i) => {
          const cx = padX + i * groupW + groupW / 2;
          return (
            <g key={i}>
              {sList.map((s, j) => {
                const v = s.values[i];
                const bh = (v / max) * (h - padY * 2);
                const x = cx - (sList.length * barW) / 2 + j * barW + 1;
                return (
                  <rect key={j} x={x} y={h - padY - bh} width={barW - 2} height={bh}
                        fill={COLORS[j % COLORS.length]} rx="2"/>
                );
              })}
              <text x={cx} y={h - 6} fontSize="10" fill="#7a8794" textAnchor="middle">{lab}</text>
            </g>
          );
        })}
      </svg>
      <div className="legend">
        {sList.map((s, j) => (
          <div key={j} className="legend__item">
            <span className="legend__sw" style={{background: COLORS[j % COLORS.length], height: 8, borderRadius:2}}></span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========== Area chart ===========
const AreaChart = ({ seed = "area", height = 220, fill = "rgba(42,107,224,0.18)", stroke = "#2A6BE0", series }) => {
  const ref = useRef(null);
  const [w, setW] = useState(500);
  useEffect(() => {
    const r = () => ref.current && setW(ref.current.clientWidth);
    r();
    const ro = new ResizeObserver(r);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const sList = series || [{ label: "DAU", values: smooth(seededSeries(seed, 28, 60, 160)) }];
  const h = height;
  return (
    <div ref={ref} style={{width:"100%"}}>
      <svg width={w} height={h}>
        {sList.map((s, idx) => (
          <g key={idx}>
            <path d={areaPath(s.values, w, h, 24, 20)} fill={fill}/>
            <path d={linePath(s.values, w, h, 24, 20)} stroke={stroke} fill="none" strokeWidth="2"/>
          </g>
        ))}
      </svg>
    </div>
  );
};

// =========== Sparkline ===========
const Sparkline = ({ values, color = "#2A6BE0", width = 100, height = 28 }) => {
  if (!values || !values.length) values = seededSeries("sp", 20, 30, 80);
  const min = Math.min(...values), max = Math.max(...values);
  const dx = width / (values.length - 1);
  const path = values.map((v,i) => `${i?"L":"M"}${i*dx},${height - 2 - ((v-min)/(max-min||1))*(height-4)}`).join(" ");
  return <svg width={width} height={height}><path d={path} stroke={color} fill="none" strokeWidth="1.6"/></svg>;
};

// =========== Heatmap ===========
const Heatmap = ({ rows = 8, cols = 30, seed = "hm", height = 280, rowLabels, colLabels }) => {
  const ref = useRef(null);
  const [w, setW] = useState(500);
  useEffect(() => {
    const r = () => ref.current && setW(ref.current.clientWidth);
    r();
    const ro = new ResizeObserver(r);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const padL = 60, padT = 22, padR = 8, padB = 18;
  const cellW = (w - padL - padR) / cols;
  const cellH = (height - padT - padB) / rows;
  const data = useMemo(() => {
    const out = [];
    for (let r = 0; r < rows; r++) {
      const series = seededSeries(seed + r, cols, 0, 1);
      // Make retention-like: drop with time
      out.push(series.map((v, c) => Math.max(0.02, Math.min(1, (1 - c / cols) * (0.6 + 0.4 * v) + (r === 3 ? -0.1 : 0)))));
    }
    return out;
  }, [seed, rows, cols]);

  const color = v => {
    // green→yellow→light
    if (v > 0.6) return `rgba(67,192,138, ${0.45 + v*0.5})`;
    if (v > 0.3) return `rgba(245,166,35, ${0.35 + v*0.5})`;
    return `rgba(180,200,220, ${0.15 + v*0.4})`;
  };

  return (
    <div ref={ref} style={{width:"100%"}}>
      <svg width={w} height={height}>
        {data.map((row, r) => row.map((v, c) => (
          <rect key={`${r}-${c}`} x={padL + c * cellW + 1} y={padT + r * cellH + 1}
                width={cellW - 2} height={cellH - 2}
                fill={color(v)} rx="2"/>
        )))}
        {rowLabels && rowLabels.map((lab, r) => (
          <text key={r} x={padL - 6} y={padT + r * cellH + cellH/2 + 3}
                fontSize="11" fill="#4a5764" textAnchor="end" fontWeight="600">{lab}</text>
        ))}
        {colLabels && colLabels.map((lab, c) => (
          <text key={c} x={padL + c * cellW + cellW/2} y={padT - 6}
                fontSize="10" fill="#7a8794" textAnchor="middle">{lab}</text>
        ))}
      </svg>
    </div>
  );
};

// =========== Funnel ===========
const Funnel = ({ steps }) => {
  const max = Math.max(...steps.map(s => s.value));
  return (
    <div style={{display:"flex", flexDirection:"column", gap:6, padding: "8px 0"}}>
      {steps.map((s, i) => (
        <div key={i} style={{display:"grid", gridTemplateColumns:"180px 1fr 80px 70px", alignItems:"center", gap:12}}>
          <div style={{fontSize:13, fontWeight:600}}>{s.label}</div>
          <div className="bar" style={{height:18}}>
            <div className="bar__fill" style={{width: `${(s.value/max)*100}%`, background: i === 0 ? "#2A6BE0" : i === steps.length-1 ? "#e07a3a" : "#6c91dc"}}></div>
          </div>
          <div className="dt-num" style={{fontWeight:700}}>{s.value.toLocaleString()}</div>
          <div className="dt-num muted">{i > 0 ? `${Math.round((s.value/steps[0].value)*100)}%` : "100%"}</div>
        </div>
      ))}
    </div>
  );
};

// =========== Stacked area chart for AB monitoring ===========
const StackedArea = ({ seed = "stk", height = 220, palette }) => {
  const ref = useRef(null);
  const [w, setW] = useState(500);
  useEffect(() => {
    const r = () => ref.current && setW(ref.current.clientWidth);
    r();
    const ro = new ResizeObserver(r);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const COLORS = palette || ["#f4b98c","#43c08a","#e07a7a"];
  const layers = [
    seededSeries(seed+"1", 24, 30, 80),
    seededSeries(seed+"2", 24, 20, 70),
    seededSeries(seed+"3", 24, 10, 50),
  ];
  const totals = layers[0].map((_,i) => layers[0][i] + layers[1][i] + layers[2][i]);
  const max = Math.max(...totals);
  const h = height;
  const padX = 28, padY = 18;
  const dx = (w - padX*2)/(layers[0].length - 1);
  const stacks = [0, 0, 0].map(() => Array(layers[0].length).fill(0));
  for (let i = 0; i < layers[0].length; i++) {
    stacks[0][i] = layers[0][i];
    stacks[1][i] = stacks[0][i] + layers[1][i];
    stacks[2][i] = stacks[1][i] + layers[2][i];
  }
  const norm = v => h - padY - (v / max) * (h - padY*2);
  function areaBetween(top, bot) {
    let p = "";
    for (let i = 0; i < top.length; i++) p += `${i?"L":"M"}${padX + i*dx},${norm(top[i]).toFixed(1)} `;
    for (let i = bot.length - 1; i >= 0; i--) p += `L${padX + i*dx},${norm(bot[i]).toFixed(1)} `;
    return p + "Z";
  }
  const zero = stacks[0].map(()=>0);
  return (
    <div ref={ref} style={{width:"100%"}}>
      <svg width={w} height={h}>
        <path d={areaBetween(stacks[0], zero)} fill={COLORS[0]} opacity="0.75"/>
        <path d={areaBetween(stacks[1], stacks[0])} fill={COLORS[1]} opacity="0.7"/>
        <path d={areaBetween(stacks[2], stacks[1])} fill={COLORS[2]} opacity="0.7"/>
      </svg>
    </div>
  );
};

// =========== Beta distribution curve for AB ===========
const PosteriorChart = ({ aMean = 0.32, aSd = 0.02, bMean = 0.34, bSd = 0.02, height = 200 }) => {
  const ref = useRef(null);
  const [w, setW] = useState(500);
  useEffect(() => {
    const r = () => ref.current && setW(ref.current.clientWidth);
    r();
    const ro = new ResizeObserver(r);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const N = 80;
  const xmin = Math.min(aMean, bMean) - 4 * Math.max(aSd, bSd);
  const xmax = Math.max(aMean, bMean) + 4 * Math.max(aSd, bSd);
  const pdf = (x, m, s) => Math.exp(-0.5 * ((x - m)/s)**2) / (s * Math.sqrt(2*Math.PI));
  const xs = Array.from({length: N}, (_,i) => xmin + (i/(N-1))*(xmax-xmin));
  const ay = xs.map(x => pdf(x, aMean, aSd));
  const by = xs.map(x => pdf(x, bMean, bSd));
  const max = Math.max(...ay, ...by);
  const padX = 20, padY = 16;
  const norm = (v) => height - padY - (v/max)*(height - padY*2);
  const pathFor = (ys) => xs.map((x, i) => `${i?"L":"M"}${padX + (i/(N-1))*(w - padX*2)},${norm(ys[i]).toFixed(1)}`).join(" ");
  const areaFor = (ys) => `${pathFor(ys)} L${padX + (w - padX*2)},${height - padY} L${padX},${height - padY} Z`;
  return (
    <div ref={ref} style={{width:"100%"}}>
      <svg width={w} height={height}>
        <path d={areaFor(ay)} fill="rgba(108,145,220,0.25)"/>
        <path d={areaFor(by)} fill="rgba(67,192,138,0.3)"/>
        <path d={pathFor(ay)} stroke="#6c91dc" strokeWidth="2" fill="none"/>
        <path d={pathFor(by)} stroke="#43c08a" strokeWidth="2" fill="none"/>
      </svg>
      <div className="legend">
        <div className="legend__item"><span className="legend__sw" style={{background:"#6c91dc"}}></span><span>Posterior A</span></div>
        <div className="legend__item"><span className="legend__sw" style={{background:"#43c08a"}}></span><span>Posterior B</span></div>
      </div>
    </div>
  );
};

Object.assign(window, { LineChart, BarChart, AreaChart, Heatmap, Sparkline, Funnel, StackedArea, PosteriorChart, seededSeries });
