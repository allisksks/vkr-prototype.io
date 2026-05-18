/* ============================================================
   GDC Analytics Ecosystem — mock data
   ============================================================ */
window.AppData = (function () {

  /* ----- 1. PROJECTS ----- */
  const projects = [
    { id: "iron_shells",  name: "Iron Shells",        genre: "Casual Tank Battler", dau: 2_400_000, platforms: ["iOS","Android"],     status: "warn", health: 79, color: "#e07a3a", glyph: "IS" },
    { id: "merge_magic",  name: "Bloom & Merge",      genre: "Merge Puzzle",         dau: 3_200_000, platforms: ["iOS","Android"],     status: "ok",   health: 92, color: "#d35bb6", glyph: "BM" },
    { id: "roguerift",    name: "Rogue Rift",         genre: "Roguelite Action",     dau:   890_000, platforms: ["iOS","Android","PC"],status: "warn", health: 71, color: "#8a55d8", glyph: "RR" },
    { id: "starforge",    name: "Starforge: Idle",    genre: "Idle / 4X",            dau: 1_100_000, platforms: ["iOS","Android"],     status: "ok",   health: 78, color: "#43c08a", glyph: "SF" },
    { id: "drift_kings",  name: "Drift Kings",        genre: "Hyper-Casual Racing",  dau: 1_800_000, platforms: ["iOS","Android"],     status: "ok",   health: 88, color: "#3aa0e0", glyph: "DK" },
    { id: "cryptokeep",   name: "Crypto Keep",        genre: "Tower Defense",        dau:   670_000, platforms: ["iOS","Android"],     status: "crit", health: 58, color: "#c93a3a", glyph: "CK" },
    { id: "sorcery_duel", name: "Sorcery Duel",       genre: "PvP Card Battler",     dau:   540_000, platforms: ["iOS","Android"],     status: "ok",   health: 81, color: "#6d3aae", glyph: "SD" },
    { id: "farm_valley",  name: "Farm Valley",        genre: "Simulation",           dau: 4_100_000, platforms: ["iOS","Android"],     status: "ok",   health: 90, color: "#7eb344", glyph: "FV" },
  ];

  const projectGroups = [
    { id: "midcore",  name: "1. Midcore / Mid-core",  projects: projects.filter(p => ["iron_shells","roguerift","sorcery_duel"].includes(p.id)) },
    { id: "casual",   name: "2. Casual / Puzzle",     projects: projects.filter(p => ["merge_magic","farm_valley","cryptokeep"].includes(p.id)) },
    { id: "hyper",    name: "3. Hyper-Casual / Idle", projects: projects.filter(p => ["drift_kings","starforge"].includes(p.id)) },
  ];
  // Attach groupName to each project
  for (const g of projectGroups) for (const p of g.projects) p.groupName = g.name;

  const allProjects = projects;
  const projectById = id => allProjects.find(p => p.id === id);

  /* ----- 2. GLOBAL EVENT PARAMETERS ----- */
  const globalParamSet = [
    { name: "user_id",       type: "string",    required: true,  desc: "Anonymous user identifier (UUID)" },
    { name: "device_id",     type: "string",    required: true,  desc: "Persistent device identifier" },
    { name: "session_id",    type: "string",    required: true,  desc: "Session identifier, rotates after 30m idle" },
    { name: "platform",      type: "enum",      required: true,  desc: "ios | android | pc" },
    { name: "app_version",   type: "string",    required: true,  desc: "Semantic build version" },
    { name: "country",       type: "string",    required: true,  desc: "ISO-3166 alpha-2" },
    { name: "install_date",  type: "timestamp", required: true,  desc: "Date of first install" },
    { name: "ts",            type: "timestamp", required: true,  desc: "Event timestamp (server-side)" },
    { name: "ab_buckets",    type: "string",    required: false, desc: "Comma-separated active A/B assignments" },
    { name: "source",        type: "enum",      required: true,  desc: "organic | facebook_int | applovin_int | mintegral_int | tiktokglobal_int | …" },
  ];

  /* ----- 3. EVENTS (per-project, flat) ----- */
  // helper to build event quickly
  const mkEvent = (id, project, name, status, eventsLast30m, baseline, condition, customParams, metrics, version=3, hash="abcdef12") => ({
    id, project, name, version, hash, status, lastCheck: "16:12",
    eventsLast30m, baseline, owner: "A. Volkova", updated: "2026-05-15",
    condition, customParams, metrics,
    versions: [
      { v: version,   date: "2026-05-15", author: "A. Volkova", note: "Added analytics parameter" },
      { v: version-1, date: "2026-04-02", author: "M. Sokolov", note: "Renamed parameter for clarity" },
      { v: version-2, date: "2026-02-19", author: "M. Sokolov", note: "Initial release-ready schema" },
    ].filter(v => v.v >= 1),
  });

  const events = [
    // === Iron Shells ===
    mkEvent("evt-is-1", "iron_shells", "match_start", "ok", 124_320, 121_400,
      "Fires when a battle match begins (PvE/PvP).",
      [
        { name: "match_type",   type: "enum", required: true, desc: "vs_bot | pvp | tournament" },
        { name: "tank_id",      type: "string", required: true, desc: "Selected tank identifier" },
        { name: "level_number", type: "int", required: true, desc: "Player level 1..50" },
        { name: "loadout_id",   type: "string", required: false, desc: "Saved loadout selection" },
      ],
      [
        { id: "m-mps", name: "Matches per DAU",      formula: "matches / DAU",                unit: "",  value: "6.4" },
        { id: "m-pvp", name: "PvP Share",            formula: "pvp / matches",                unit: "%", value: "38.2%" },
        { id: "m-d1",  name: "Match → D1 Retention", formula: "users(D1) / first_match_users",unit: "%", value: "32.1%" },
        { id: "m-tnk", name: "Avg Tank Level",       formula: "AVG(tank.level)",              unit: "",  value: "12.4" },
      ], 5, "ab12cd34"),
    mkEvent("evt-is-2", "iron_shells", "iap_purchase", "warn", 1_840, 2_310,
      "Fires after a successful in-app purchase.",
      [
        { name: "product_id", type: "string", required: true, desc: "Store SKU" },
        { name: "price_usd",  type: "float",  required: true, desc: "Net price in USD" },
        { name: "store",      type: "enum",   required: true, desc: "appstore | googleplay" },
        { name: "offer_id",   type: "string", required: false, desc: "Promo offer linked to purchase" },
      ],
      [
        { id: "m-arpu",  name: "ARPU",       formula: "rev / DAU",      unit: "$", value: "$0.091" },
        { id: "m-arppu", name: "ARPPU",      formula: "rev / DPU",      unit: "$", value: "$4.82" },
        { id: "m-cvr",   name: "Purchase CR",formula: "DPU / DAU",      unit: "%", value: "1.9%" },
      ]),
    mkEvent("evt-is-3", "iron_shells", "tutorial_step", "crit", 41, 8_120,
      "Fires when a tutorial step is shown during onboarding.",
      [
        { name: "step_name",  type: "string", required: true, desc: "Internal step id" },
        { name: "completed",  type: "bool",   required: true, desc: "Did the user complete it?" },
        { name: "skip_used",  type: "bool",   required: true, desc: "Was the skip button pressed?" },
      ],
      [
        { id: "m-tcr", name: "Tutorial Completion", formula: "completed_last/started", unit: "%", value: "79.9%" },
        { id: "m-fcs", name: "First-shot rate",     formula: "first_shot_step/start",  unit: "%", value: "79.7%" },
      ]),
    mkEvent("evt-is-4", "iron_shells", "tank_purchase", "ok", 3_120, 3_080,
      "Fires when a tank is bought with soft or hard currency.",
      [
        { name: "tank_id",   type: "string", required: true, desc: "tank_abrams | tank_helios | tank_frost | tank_atomic" },
        { name: "currency",  type: "enum",   required: true, desc: "soft | hard" },
        { name: "price",     type: "int",    required: true, desc: "Price in the chosen currency" },
        { name: "level_at",  type: "int",    required: true, desc: "Player level at purchase" },
      ],
      [
        { id: "m-tpr",  name: "Tanks per User",  formula: "purchases / DAU",      unit: "", value: "0.32" },
        { id: "m-top",  name: "Top Tank Mix",    formula: "share(top tank)",      unit: "%", value: "tank_helios 41%" },
      ]),
    mkEvent("evt-is-5", "iron_shells", "chest_open", "ok", 28_900, 28_140,
      "Fires when any chest is opened (free, epic, heroic, legendary).",
      [
        { name: "chest_name", type: "enum",   required: true, desc: "free_chest | epic_chest | heroic_chest | legendary_chest" },
        { name: "chest_number", type: "int",  required: true, desc: "Sequential chest counter per user" },
        { name: "reward_id",  type: "string", required: true, desc: "Identifier of the granted reward" },
      ],
      [
        { id: "m-co", name: "Chests / DAU",       formula: "opens / DAU", unit: "", value: "5.5" },
        { id: "m-c5", name: "% opened 5th chest", formula: "users(≥5)/DAU", unit: "%", value: "84.2%" },
      ]),

    // === Bloom & Merge ===
    mkEvent("evt-bm-1", "merge_magic", "merge_action", "ok", 412_300, 408_100,
      "Fires every time the player merges two items.",
      [
        { name: "chain_id",    type: "string", required: true, desc: "Merge chain identifier" },
        { name: "chain_depth", type: "int",    required: true, desc: "Resulting item tier (1–10)" },
        { name: "energy_left", type: "int",    required: true, desc: "Energy remaining after merge" },
      ],
      [
        { id: "m-mc", name: "Merges / Session", formula: "merges / sessions", unit: "", value: "84" },
        { id: "m-md", name: "Avg chain depth",  formula: "AVG(chain_depth)",  unit: "", value: "4.6" },
      ]),
    mkEvent("evt-bm-2", "merge_magic", "friend_visit", "ok", 18_200, 17_300,
      "Fires when a player visits a friend's garden.",
      [
        { name: "friend_id", type: "string", required: true, desc: "Friend identifier" },
        { name: "gift_sent", type: "bool",   required: true, desc: "Was a gift sent during the visit?" },
      ],
      [
        { id: "m-fv", name: "Visits / DAU", formula: "visits / DAU", unit: "", value: "0.21" },
        { id: "m-gs", name: "Gift Share",   formula: "gift_sent",    unit: "%", value: "61%" },
      ]),
    mkEvent("evt-bm-3", "merge_magic", "booster_use", "ok", 91_400, 90_200,
      "Fires when the player consumes a booster.",
      [
        { name: "booster_type", type: "enum", required: true, desc: "extra_moves | hammer | wand | clock_ice | shuffle" },
        { name: "source",       type: "enum", required: true, desc: "free | iap | reward" },
      ],
      [
        { id: "m-bu", name: "Boosters / DAU", formula: "uses / DAU", unit: "", value: "1.05" },
      ]),

    // === Rogue Rift ===
    mkEvent("evt-rr-1", "roguerift", "run_end", "warn", 7_400, 9_120,
      "Fires when a roguelite run ends (death, exit, or victory).",
      [
        { name: "run_length_sec",   type: "int",    required: true, desc: "Run duration in seconds" },
        { name: "floor_reached",    type: "int",    required: true, desc: "Deepest floor reached, 1..40" },
        { name: "cause_of_death",   type: "enum",   required: true, desc: "boss | mob | hazard | quit" },
        { name: "build_signature",  type: "string", required: true, desc: "Class+Weapon combo id" },
        { name: "gold_earned",      type: "int",    required: true, desc: "Total gold earned in run" },
      ],
      [
        { id: "m-rl", name: "Avg Run Length",      formula: "AVG(sec)/60",       unit: "min", value: "18.4" },
        { id: "m-fr", name: "Avg Floor Reached",   formula: "AVG(floor)",        unit: "",    value: "12.7" },
        { id: "m-bd", name: "Build Diversity",     formula: "unique builds",     unit: "",    value: "184" },
      ]),

    // === Starforge: Idle ===
    mkEvent("evt-sf-1", "starforge", "prestige", "ok", 28_100, 27_400,
      "Fires when the player prestiges (resets with bonuses).",
      [
        { name: "prestige_level", type: "int",   required: true, desc: "Sequential prestige number" },
        { name: "duration_min",   type: "int",   required: true, desc: "Minutes since last prestige" },
        { name: "stars_earned",   type: "int",   required: true, desc: "Stars granted on prestige" },
      ],
      [
        { id: "m-pr", name: "Prestiges / DAU",  formula: "prestiges / DAU", unit: "", value: "0.16" },
      ]),
    mkEvent("evt-sf-2", "starforge", "alliance_war", "ok", 4_200, 4_010,
      "Fires when a player participates in an alliance war battle.",
      [
        { name: "alliance_id", type: "string", required: true, desc: "Alliance UUID" },
        { name: "war_id",      type: "string", required: true, desc: "War event identifier" },
        { name: "result",      type: "enum",   required: true, desc: "win | loss | draw" },
      ],
      [
        { id: "m-aw", name: "Alliance Activity", formula: "active_allies/DAU", unit: "%", value: "11.8%" },
      ]),

    // === Drift Kings ===
    mkEvent("evt-dk-1", "drift_kings", "level_attempt", "ok", 218_400, 215_100,
      "Fires for each race attempt (start of a level).",
      [
        { name: "track_id", type: "string", required: true, desc: "Race track identifier" },
        { name: "result",   type: "enum",   required: true, desc: "win | loss | quit" },
        { name: "time_sec", type: "float",  required: true, desc: "Race time in seconds" },
      ],
      [
        { id: "m-att", name: "Attempts / Session", formula: "attempts/sessions", unit: "", value: "6.2" },
      ]),
    mkEvent("evt-dk-2", "drift_kings", "ad_impression", "ok", 84_120, 82_300,
      "Fires when an ad is rendered and visible.",
      [
        { name: "ad_network", type: "enum", required: true, desc: "applovin | unity | mintegral | adjoe | …" },
        { name: "placement",  type: "enum", required: true, desc: "rewarded | interstitial | banner" },
        { name: "screen",     type: "string", required: true, desc: "Originating screen id" },
        { name: "ecpm_est",   type: "float", required: false, desc: "Estimated eCPM at impression time" },
      ],
      [
        { id: "m-imp",  name: "Impressions / DAU",   formula: "imp / DAU",      unit: "", value: "7.3" },
        { id: "m-ecpm", name: "Effective eCPM",      formula: "rev / imp*1000", unit: "$", value: "$13.20" },
      ]),

    // === Crypto Keep ===
    mkEvent("evt-ck-1", "cryptokeep", "wave_fail", "crit", 6_900, 14_200,
      "Fires when the player fails to defend against a wave.",
      [
        { name: "wave_number", type: "int", required: true, desc: "Wave that was failed" },
        { name: "tower_count", type: "int", required: true, desc: "Active towers at fail" },
        { name: "mob_killed",  type: "int", required: true, desc: "Mobs killed in the wave" },
      ],
      [
        { id: "m-far", name: "Avg Farthest Wave", formula: "AVG(wave)", unit: "", value: "21.4" },
      ]),

    // === Sorcery Duel ===
    mkEvent("evt-sd-1", "sorcery_duel", "match_end", "ok", 18_400, 18_100,
      "Fires when a PvP card match ends.",
      [
        { name: "deck_id",     type: "string", required: true, desc: "Player's deck signature" },
        { name: "result",      type: "enum",   required: true, desc: "win | loss" },
        { name: "rank_tier",   type: "enum",   required: true, desc: "bronze | silver | gold | diamond | master" },
        { name: "mmr_delta",   type: "int",    required: true, desc: "Change in MMR" },
      ],
      [
        { id: "m-mt", name: "Avg Match Length", formula: "AVG(sec)", unit: "s", value: "182" },
        { id: "m-wr", name: "Win Rate Diamond", formula: "win/loss", unit: "%", value: "52.1%" },
      ]),

    // === Farm Valley ===
    mkEvent("evt-fv-1", "farm_valley", "harvest", "ok", 1_120_000, 1_080_000,
      "Fires when a crop is harvested.",
      [
        { name: "crop_id",  type: "string", required: true, desc: "Crop identifier (wheat, lavender, …)" },
        { name: "qty",      type: "int",    required: true, desc: "Number of units harvested" },
        { name: "is_event", type: "bool",   required: true, desc: "Was it an event-only crop?" },
      ],
      [
        { id: "m-hv", name: "Harvests / DAU", formula: "harvests / DAU", unit: "", value: "8.6" },
      ]),
    mkEvent("evt-fv-2", "farm_valley", "coop_action", "ok", 184_200, 180_100,
      "Fires for any co-op interaction (help, gift, visit).",
      [
        { name: "action",   type: "enum",   required: true, desc: "help | gift | visit | trade" },
        { name: "partner",  type: "string", required: true, desc: "Partner user_id" },
      ],
      [
        { id: "m-cop", name: "Co-op Actions / DAU", formula: "actions / DAU", unit: "", value: "2.4" },
      ]),
  ];

  /* ----- 4. ALERTS ----- */
  const alerts = [
    { id:"a1", level:"crit", project:"iron_shells",  event:"tutorial_step", reason:"frequency_drop", observed:41,   expected:8_120,  time:"16:11", note:"After v11.4.1 release" },
    { id:"a2", level:"crit", project:"cryptokeep",   event:"wave_fail",     reason:"frequency_drop", observed:6_900,expected:14_200, time:"15:48", note:"Possible difficulty regression" },
    { id:"a3", level:"warn", project:"iron_shells",  event:"iap_purchase",  reason:"frequency_drop", observed:1_840,expected:2_310,  time:"15:42", note:"Sale ended yesterday" },
    { id:"a4", level:"warn", project:"merge_magic",  event:"merge_action",  reason:"null_rate",      observed:"7.2%", expected:"<5%",  time:"15:30", note:"chain_id NULL bursts" },
    { id:"a5", level:"warn", project:"roguerift",    event:"run_end",       reason:"frequency_drop", observed:7_400, expected:9_120,  time:"14:55", note:"Build_signature partial null" },
    { id:"a6", level:"info", project:"drift_kings",  event:"level_attempt", reason:"new_baseline",   observed:218_400, expected:"—", time:"14:10", note:"Baseline auto-set after 48h" },
  ];

  /* ----- 5. DASHBOARDS — per-project blueprint ----- */
  // Each dashboard has: id, name, blocks: [{ title, type, span, metric, formula, sourceEvent? }]
  // type one of: line, area, bar, stacked, heatmap, table, funnel, number, sparkline-row
  const dashboardsByProject = {
    iron_shells: [
      { id: "overview",     name: "Overview" },
      { id: "ua",           name: "UA & Marketing" },
      { id: "monetization", name: "Monetization" },
      { id: "retention",    name: "Retention & Cohorts" },
      { id: "liveops",      name: "Live-Ops & Tournaments" },
      { id: "gameplay",     name: "Gameplay / Tank Meta" },
      { id: "ab_analysis",  name: "AB Analysis", isReport: true, reportType: "ab" },
      { id: "cohort_cmp",   name: "Cohort Compare", isReport: true, reportType: "cohort" },
      { id: "custom",       name: "My Custom Board" },
    ],
    merge_magic: [
      { id: "overview",     name: "Overview" },
      { id: "engagement",   name: "Engagement Loops" },
      { id: "social",       name: "Social & Co-op" },
      { id: "iap",          name: "IAP Bundles" },
      { id: "notifications",name: "Notifications" },
      { id: "seasonal",     name: "Seasonal Events" },
      { id: "ab_analysis",  name: "AB Analysis", isReport: true, reportType: "ab" },
      { id: "cohort_cmp",   name: "Cohort Compare", isReport: true, reportType: "cohort" },
    ],
    roguerift: [
      { id: "overview",  name: "Overview" },
      { id: "runs",      name: "Run Analytics" },
      { id: "builds",    name: "Build Diversity" },
      { id: "economy",   name: "Economy & Shop" },
      { id: "churn",     name: "Churn Prediction" },
      { id: "ab_analysis",  name: "AB Analysis", isReport: true, reportType: "ab" },
      { id: "cohort_cmp",   name: "Cohort Compare", isReport: true, reportType: "cohort" },
    ],
    starforge: [
      { id: "overview", name: "Overview" },
      { id: "session",  name: "Session Depth" },
      { id: "progression", name: "Progression" },
      { id: "alliance", name: "Alliance Activity" },
      { id: "economy",  name: "Resource Economy" },
      { id: "ab_analysis",  name: "AB Analysis", isReport: true, reportType: "ab" },
    ],
    drift_kings: [
      { id: "overview",   name: "Overview" },
      { id: "core_loop",  name: "Core Loop" },
      { id: "ad_money",   name: "Ad Monetization" },
      { id: "retention",  name: "Retention by Source" },
      { id: "tracks",     name: "Tracks & Times" },
      { id: "ab_analysis",  name: "AB Analysis", isReport: true, reportType: "ab" },
    ],
    cryptokeep: [
      { id: "overview", name: "Overview" },
      { id: "waves",    name: "Wave Analytics" },
      { id: "towers",   name: "Tower Meta" },
      { id: "iap",      name: "IAP" },
      { id: "seasonal", name: "Seasonal Events" },
      { id: "ab_analysis",  name: "AB Analysis", isReport: true, reportType: "ab" },
    ],
    sorcery_duel: [
      { id: "overview",  name: "Overview" },
      { id: "matches",   name: "Match Stats" },
      { id: "meta",      name: "Deck Meta" },
      { id: "compete",   name: "Competitive Integrity" },
      { id: "money",     name: "Monetization" },
      { id: "ab_analysis",  name: "AB Analysis", isReport: true, reportType: "ab" },
    ],
    farm_valley: [
      { id: "overview",     name: "Overview" },
      { id: "engagement",   name: "Engagement" },
      { id: "social",       name: "Social" },
      { id: "iap",          name: "IAP" },
      { id: "notifications",name: "Notifications" },
      { id: "ab_analysis",  name: "AB Analysis", isReport: true, reportType: "ab" },
      { id: "cohort_cmp",   name: "Cohort Compare", isReport: true, reportType: "cohort" },
    ],
  };

  /* ----- 6. PER-PROJECT DASHBOARD BLOCK BLUEPRINTS ----- */
  // Each entry maps dashboardId → array of blocks (genre-specific!)
  const blockBlueprints = {
    iron_shells: {
      overview: [
        { id: "iso-1", title: "DAU · last 30d",          type: "area",    span: 6, metric: "DAU"          },
        { id: "iso-2", title: "Retention D1 / D7 / D30", type: "heatmap", span: 6, metric: "Retention"    },
        { id: "iso-3", title: "Session length (median)", type: "bar",     span: 6, metric: "Session Length" },
        { id: "iso-4", title: "ARPDAU vs prev period",   type: "line",    span: 6, metric: "ARPDAU"       },
        { id: "iso-5", title: "Top countries",           type: "table",   span: 12, metric: "Geo"          },
      ],
      ua: [
        { id: "isu-1", title: "Install funnel",                   type: "funnel",  span: 6, metric: "Installs" },
        { id: "isu-2", title: "ROAS by channel",                  type: "bar",     span: 6, metric: "ROAS" },
        { id: "isu-3", title: "CPI trend (30d)",                  type: "line",    span: 6, metric: "CPI" },
        { id: "isu-4", title: "Installs by source",               type: "stacked", span: 6, metric: "Installs" },
      ],
      monetization: [
        { id: "ism-1", title: "Revenue mix (tank skins / BP / chests / revives)", type: "stacked", span: 8, metric: "Revenue" },
        { id: "ism-2", title: "Paying users %",   type: "line", span: 4, metric: "Paying %" },
        { id: "ism-3", title: "ARPU vs ARPPU",    type: "line", span: 6, metric: "ARPU" },
        { id: "ism-4", title: "Whale concentration (top 1%)", type: "bar", span: 6, metric: "Whale" },
      ],
      retention: [
        { id: "isr-1", title: "Cohort heatmap · weekly", type: "heatmap", span: 12, metric: "Retention" },
        { id: "isr-2", title: "LTV by cohort",           type: "line",    span: 8, metric: "LTV" },
        { id: "isr-3", title: "Churn risk distribution", type: "bar",     span: 4, metric: "Churn" },
      ],
      liveops: [
        { id: "isl-1", title: "Active tournaments (event participation)",  type: "table",  span: 12, metric: "Events" },
        { id: "isl-2", title: "Daily quest completion %", type: "bar",     span: 6, metric: "Quests" },
        { id: "isl-3", title: "Double-XP weekend lift",   type: "line",    span: 6, metric: "Lift" },
      ],
      gameplay: [
        { id: "isg-1", title: "Win-rate by level (1–50)", type: "line",   span: 8, metric: "Win Rate" },
        { id: "isg-2", title: "Drop-off between levels",  type: "bar",    span: 4, metric: "Drop-off" },
        { id: "isg-3", title: "Top tanks by level",       type: "table",  span: 12, metric: "Top Tanks" },
      ],
      custom: [],
    },
    merge_magic: {
      overview: [
        { id: "bmo-1", title: "DAU · last 30d",               type: "area",  span: 6, metric: "DAU" },
        { id: "bmo-2", title: "Sessions / DAU",               type: "line",  span: 6, metric: "Sessions" },
        { id: "bmo-3", title: "Merges per session",           type: "line",  span: 6, metric: "Merges" },
        { id: "bmo-4", title: "Avg chain depth",              type: "bar",   span: 6, metric: "Chain Depth" },
      ],
      engagement: [
        { id: "bme-1", title: "Merge cycles per session",     type: "bar",  span: 6, metric: "Merges" },
        { id: "bme-2", title: "Item chain depth distribution",type: "bar",  span: 6, metric: "Chain" },
        { id: "bme-3", title: "Energy regen waterfall",       type: "stacked", span: 12, metric: "Energy" },
      ],
      social: [
        { id: "bms-1", title: "Friend visits / DAU",          type: "line", span: 6, metric: "Visits" },
        { id: "bms-2", title: "Gifting frequency",            type: "bar",  span: 6, metric: "Gifts" },
        { id: "bms-3", title: "Co-op garden event",           type: "area", span: 12, metric: "Co-op" },
      ],
      iap: [
        { id: "bmi-1", title: "Booster packs sales",          type: "bar",  span: 8, metric: "Booster $" },
        { id: "bmi-2", title: "Extra moves IAP",              type: "line", span: 4, metric: "Extra Moves" },
        { id: "bmi-3", title: "Decoration bundles",           type: "stacked", span: 12, metric: "Bundles" },
      ],
      notifications: [
        { id: "bmn-1", title: "Push opt-in rate",             type: "line", span: 6, metric: "Opt-in" },
        { id: "bmn-2", title: "Re-engagement CTR by type",    type: "bar",  span: 6, metric: "CTR" },
      ],
      seasonal: [
        { id: "bmsa-1", title: "Holiday content participation", type: "area", span: 8, metric: "Participation" },
        { id: "bmsa-2", title: "LTE merge chain completion",   type: "funnel", span: 4, metric: "LTE Chain" },
      ],
    },
    roguerift: {
      overview: [
        { id: "rro-1", title: "DAU · last 30d",             type: "area", span: 6, metric: "DAU" },
        { id: "rro-2", title: "Run length distribution",    type: "bar",  span: 6, metric: "Run length" },
        { id: "rro-3", title: "Avg floor reached",          type: "line", span: 6, metric: "Floor" },
        { id: "rro-4", title: "Cause-of-death breakdown",   type: "stacked", span: 6, metric: "Death" },
      ],
      runs: [
        { id: "rrr-1", title: "Average run length",         type: "line", span: 6, metric: "Run length" },
        { id: "rrr-2", title: "Floor progression heatmap",  type: "heatmap", span: 6, metric: "Floors" },
        { id: "rrr-3", title: "Cause-of-death (pareto)",    type: "bar",  span: 12, metric: "Death" },
      ],
      builds: [
        { id: "rrb-1", title: "Class × Weapon popularity",  type: "heatmap", span: 8, metric: "Builds" },
        { id: "rrb-2", title: "OP build detector",          type: "table",   span: 4, metric: "OP" },
      ],
      economy: [
        { id: "rre-1", title: "Gold earned vs spent",       type: "line", span: 8, metric: "Gold" },
        { id: "rre-2", title: "Shop visit rate",            type: "line", span: 4, metric: "Visit %" },
        { id: "rre-3", title: "Reroll frequency",           type: "bar",  span: 12, metric: "Reroll" },
      ],
      churn: [
        { id: "rrc-1", title: "Churn warning score (last run < 3 floors)", type: "line", span: 12, metric: "Churn" },
        { id: "rrc-2", title: "Shop skip rate trend",        type: "line", span: 12, metric: "Skip" },
      ],
    },
    starforge: {
      overview: [
        { id: "sfo-1", title: "Taps per session",        type: "bar",  span: 6, metric: "Taps" },
        { id: "sfo-2", title: "Prestige count dist.",    type: "bar",  span: 6, metric: "Prestige" },
        { id: "sfo-3", title: "Resource balance",        type: "stacked", span: 12, metric: "Resources" },
      ],
      session: [
        { id: "sfs-1", title: "Taps per session", type: "line", span: 12, metric: "Taps" },
        { id: "sfs-2", title: "Session count D0/D1/D7", type: "bar", span: 12, metric: "Sessions" },
      ],
      progression: [
        { id: "sfp-1", title: "Fleet upgrade rate",   type: "line", span: 6, metric: "Upgrades" },
        { id: "sfp-2", title: "Research tree completion %", type: "bar", span: 6, metric: "Research" },
      ],
      alliance: [
        { id: "sfa-1", title: "Active alliances",     type: "line", span: 6, metric: "Alliances" },
        { id: "sfa-2", title: "War events outcomes",  type: "stacked", span: 6, metric: "Wars" },
      ],
      economy: [
        { id: "sfe-1", title: "Minerals / Energy / Dark Matter production", type: "stacked", span: 12, metric: "Resources" },
        { id: "sfe-2", title: "Inflation index",      type: "line", span: 12, metric: "Inflation" },
      ],
    },
    drift_kings: {
      overview: [
        { id: "dko-1", title: "Attempts per session",       type: "bar",  span: 6, metric: "Attempts" },
        { id: "dko-2", title: "First-session level funnel", type: "funnel", span: 6, metric: "Level" },
        { id: "dko-3", title: "Ad views / DAU",             type: "line", span: 6, metric: "Ads" },
        { id: "dko-4", title: "eCPM trend",                  type: "line", span: 6, metric: "eCPM" },
      ],
      core_loop: [
        { id: "dkc-1", title: "Attempts / session", type: "bar", span: 12, metric: "Attempts" },
        { id: "dkc-2", title: "First-session funnel", type: "funnel", span: 12, metric: "Funnel" },
      ],
      ad_money: [
        { id: "dka-1", title: "Inter views / DAU by placement", type: "bar", span: 6, metric: "Inter" },
        { id: "dka-2", title: "Reward views / DAU by placement", type: "bar", span: 6, metric: "Reward" },
        { id: "dka-3", title: "eCPM trend", type: "line", span: 12, metric: "eCPM" },
      ],
      retention: [
        { id: "dkr-1", title: "D1/D3/D7 by source (organic vs paid)", type: "line", span: 12, metric: "Retention" },
        { id: "dkr-2", title: "Session count D0",                    type: "bar",  span: 12, metric: "Sessions" },
      ],
      tracks: [
        { id: "dkt-1", title: "Completion rate by track difficulty", type: "bar", span: 6, metric: "CR" },
        { id: "dkt-2", title: "Fastest times (per track)",            type: "bar", span: 6, metric: "Time" },
      ],
    },
    cryptokeep: {
      overview: [
        { id: "cko-1", title: "Farthest wave dist.",   type: "bar",   span: 6, metric: "Wave" },
        { id: "cko-2", title: "Fail wave heatmap",      type: "heatmap", span: 6, metric: "Fail" },
        { id: "cko-3", title: "Tower meta share",       type: "stacked", span: 6, metric: "Towers" },
        { id: "cko-4", title: "DAU · 30d",              type: "area",  span: 6, metric: "DAU" },
      ],
      waves: [
        { id: "ckw-1", title: "Farthest wave reached", type: "bar", span: 12, metric: "Wave" },
        { id: "ckw-2", title: "Fail wave heatmap",     type: "heatmap", span: 12, metric: "Fail" },
      ],
      towers: [
        { id: "ckt-1", title: "Most-placed towers",   type: "bar", span: 6, metric: "Towers" },
        { id: "ckt-2", title: "Upgrade path popularity", type: "stacked", span: 6, metric: "Upgrades" },
      ],
      iap: [
        { id: "cki-1", title: "Gem packs", type: "bar", span: 6, metric: "Gems" },
        { id: "cki-2", title: "Speed-up bundles", type: "line", span: 6, metric: "Speed-ups" },
      ],
      seasonal: [
        { id: "cks-1", title: "Event participation %", type: "area", span: 12, metric: "Events" },
      ],
    },
    sorcery_duel: {
      overview: [
        { id: "sdo-1", title: "Avg match length",  type: "line", span: 6, metric: "Match" },
        { id: "sdo-2", title: "Spell usage dist.", type: "bar",  span: 6, metric: "Spells" },
        { id: "sdo-3", title: "Rank tier funnel",  type: "funnel", span: 6, metric: "Tier" },
        { id: "sdo-4", title: "Match → deck signature", type: "table", span: 6, metric: "Decks" },
      ],
      matches: [
        { id: "sdm-1", title: "Average match length", type: "line", span: 12, metric: "Length" },
        { id: "sdm-2", title: "Spell usage", type: "bar", span: 12, metric: "Spells" },
      ],
      meta: [
        { id: "sdM-1", title: "Top-10 decks by win rate", type: "table", span: 12, metric: "Decks" },
        { id: "sdM-2", title: "Card usage %", type: "bar", span: 12, metric: "Cards" },
      ],
      compete: [
        { id: "sdc-1", title: "MMR delta distribution", type: "bar", span: 6, metric: "MMR" },
        { id: "sdc-2", title: "Report volume / ban rate", type: "line", span: 6, metric: "Reports" },
      ],
      money: [
        { id: "sdn-1", title: "Card pack purchases", type: "bar", span: 6, metric: "Packs" },
        { id: "sdn-2", title: "Battle pass conversion", type: "line", span: 6, metric: "BP" },
      ],
    },
    farm_valley: {
      overview: [
        { id: "fvo-1", title: "Harvests / DAU", type: "line", span: 6, metric: "Harvests" },
        { id: "fvo-2", title: "Crop variety planted", type: "bar", span: 6, metric: "Crops" },
        { id: "fvo-3", title: "Active neighbors", type: "area", span: 6, metric: "Neighbors" },
        { id: "fvo-4", title: "Co-op participation %", type: "line", span: 6, metric: "Co-op" },
      ],
      engagement: [
        { id: "fve-1", title: "Harvest cycles", type: "line", span: 6, metric: "Cycles" },
        { id: "fve-2", title: "Crop variety", type: "bar", span: 6, metric: "Variety" },
        { id: "fve-3", title: "Active neighbors / DAU", type: "area", span: 12, metric: "Neighbors" },
      ],
      social: [
        { id: "fvs-1", title: "Visit frequency", type: "line", span: 6, metric: "Visits" },
        { id: "fvs-2", title: "Gift exchange volume", type: "bar", span: 6, metric: "Gifts" },
      ],
      iap: [
        { id: "fvi-1", title: "Expansion tiles", type: "bar", span: 6, metric: "Tiles" },
        { id: "fvi-2", title: "Decoration bundles", type: "line", span: 6, metric: "Decor" },
        { id: "fvi-3", title: "Energy refills", type: "bar", span: 12, metric: "Energy" },
      ],
      notifications: [
        { id: "fvn-1", title: "Opt-in rate", type: "line", span: 6, metric: "Opt-in" },
        { id: "fvn-2", title: "Re-engagement CTR by type", type: "bar", span: 6, metric: "CTR" },
      ],
    },
  };

  /* ----- 7. EXPERIMENTS ----- */
  const experiments = [
    {
      id: "ab-2026-041", title: "Iron Shells · Tank balance update (Helios buff)",
      project: "iron_shells",
      hypothesis: "Buffing tank_helios by +12% armor will lift D7 retention by ≥1.5pp without dropping PvP win-rate balance.",
      primaryMetric: "Retention D7", metricType: "binary",
      status: "Active", progress: 64, pValueOrPb: 0.91, lift: "+1.8pp",
      startedAt: "2026-05-04", endsAt: "2026-05-21",
      owner: "A. Volkova", trafficShare: 50,
      variants: [
        { id: "A", name: "base · current balance",  split: 0.5, users: 72_394, metric: "32.1%" },
        { id: "B", name: "on · Helios +12% armor",  split: 0.5, users: 72_312, metric: "33.9%" },
      ],
      secondary: [
        { name: "Match starts / DAU",  a: "6.32", b: "6.01", lift: "-4.9%",  sig: true,  bad: true },
        { name: "Win rate (overall)",  a: "67.1%", b: "65.5%", lift: "-1.6pp", sig: true,  bad: true },
        { name: "ARPDAU",              a: "$0.091", b: "$0.094", lift: "+3.3%", sig: false },
      ],
      inclusion: ["platform: iOS, Android", "cohort_date ≥ 2026-04-15", "country: ALL"],
      eventSource: "match_start",
      hasABAnalysis: true,
    },
    {
      id: "ab-2026-038", title: "Iron Shells · Starter pack $4.99 → $5.99",
      project: "iron_shells",
      hypothesis: "Raising the starter pack price by $1 will increase ARPU without lowering CR more than 10%.",
      primaryMetric: "ARPU D7", metricType: "continuous",
      status: "Completed", progress: 100, pValueOrPb: 0.97, lift: "+4.8%",
      startedAt: "2026-04-12", endsAt: "2026-04-28", decision: "Accepted",
      owner: "P. Orlov", trafficShare: 100,
      variants: [
        { id: "A", name: "Control: $4.99", split: 0.5, users: 41_220, metric: "$0.078" },
        { id: "B", name: "Test: $5.99",    split: 0.5, users: 41_810, metric: "$0.082" },
      ],
      secondary: [
        { name: "Purchase CR", a: "2.0%",  b: "1.7%", lift: "-15.0%", sig: true,  bad: true },
        { name: "ARPPU",       a: "$3.90", b: "$4.78", lift: "+22.6%", sig: true },
      ],
      inclusion: ["platform: iOS", "country: US, CA, GB, AU"],
    },
    {
      id: "ab-2026-035", title: "Bloom & Merge · Extra daily quest slot",
      project: "merge_magic",
      hypothesis: "Adding a fourth daily quest will lift D7 retention by ≥ 0.8pp.",
      primaryMetric: "Retention D7", metricType: "binary",
      status: "Completed", progress: 100, pValueOrPb: 0.62, lift: "+0.2pp",
      startedAt: "2026-03-20", endsAt: "2026-04-04", decision: "Rejected",
      owner: "M. Sokolov", trafficShare: 30,
      variants: [
        { id: "A", name: "Control: 3 quests", split: 0.5, users: 41_402, metric: "18.4%" },
        { id: "B", name: "Test: 4 quests",    split: 0.5, users: 41_311, metric: "18.6%" },
      ],
      secondary: [
        { name: "Daily Quest Completion", a: "62%", b: "57%", lift: "-5pp", sig: true, bad: true },
      ],
      inclusion: ["platform: iOS, Android"],
    },
    {
      id: "ab-2026-029", title: "Drift Kings · Reward ad placement A/B",
      project: "drift_kings",
      hypothesis: "Moving rewarded video to result screen will lift impressions/DAU by ≥10% with no retention hit.",
      primaryMetric: "Reward Imp / DAU", metricType: "continuous",
      status: "Draft", progress: 0, pValueOrPb: null, lift: null,
      owner: "P. Orlov", trafficShare: 50,
      variants: [
        { id: "A", name: "Control: pre-race button", split: 0.5, users: 0, metric: "—" },
        { id: "B", name: "Test: post-result CTA",    split: 0.5, users: 0, metric: "—" },
      ],
      secondary: [], inclusion: ["platform: ALL"],
    },
    {
      id: "ab-2026-024", title: "Rogue Rift · Shop reroll cost −20%",
      project: "roguerift",
      hypothesis: "Reducing reroll cost will increase shop visit rate, improving build diversity and run length.",
      primaryMetric: "Avg run length",
      metricType: "continuous",
      status: "Active", progress: 41, pValueOrPb: 0.74, lift: "+1.2 min",
      startedAt: "2026-05-08", endsAt: "2026-05-25", owner: "M. Sokolov",
      trafficShare: 50,
      variants: [
        { id: "A", name: "Control: 50g", split: 0.5, users: 9_120, metric: "18.4 m" },
        { id: "B", name: "Test: 40g",    split: 0.5, users: 9_088, metric: "19.6 m" },
      ],
      secondary: [
        { name: "Build diversity (unique builds)", a: "184", b: "201", lift: "+9.2%", sig: true },
      ],
      inclusion: ["platform: ALL"],
    },
    {
      id: "ab-2026-022", title: "Farm Valley · Push notification copy A/B",
      project: "farm_valley",
      hypothesis: "Personalised push (\"Your tomato is ready\") will improve CTR by ≥15% vs generic.",
      primaryMetric: "Push CTR", metricType: "binary",
      status: "Active", progress: 78, pValueOrPb: 0.96, lift: "+22.1%",
      startedAt: "2026-05-01", endsAt: "2026-05-19", owner: "I. Petrov",
      trafficShare: 100,
      variants: [
        { id: "A", name: "Generic: come back!",   split: 0.5, users: 410_201, metric: "3.2%" },
        { id: "B", name: "Crop name: tomato",     split: 0.5, users: 408_810, metric: "3.9%" },
      ],
      secondary: [
        { name: "D1 Retention", a: "41.0%", b: "42.4%", lift: "+1.4pp", sig: true },
      ],
      inclusion: ["platform: iOS, Android"],
    },
  ];

  /* ----- 8. KNOWLEDGE BASE ----- */
  const knowledge = [
    { id: "kb-001", type: "experiment", title: "Iron Shells · Starter pack uplift (4.99 → 5.99)", project: "iron_shells", author: "P. Orlov",     date: "2026-04-28", summary: "Raising price by $1 lifted ARPU by 4.8% (P(B>A)=0.97). Conversion dropped 15% but ARPPU jump dominated.",     tags: ["pricing","monetization","starter-pack","iOS"], decision: "Accepted", refId: "ab-2026-038", views: 142, linked: 4 },
    { id: "kb-002", type: "experiment", title: "Bloom & Merge · Extra daily quest slot",          project: "merge_magic",  author: "M. Sokolov",  date: "2026-04-04", summary: "Adding a 4th quest neither lifted retention (+0.2pp, not sig.) nor engagement. Quest completion fell 5pp.",     tags: ["liveops","retention","quests"], decision: "Rejected", refId: "ab-2026-035", views: 88, linked: 2 },
    { id: "kb-003", type: "research",   title: "Why new players churn in first 24h (Iron Shells)", project: "iron_shells", author: "A. Volkova",  date: "2026-03-15", summary: "Funnel analysis identified tutorial steps 3 and 7 as the two biggest drop-off points (24% + 18% loss).",        tags: ["onboarding","retention","funnel"], views: 211, linked: 6 },
    { id: "kb-004", type: "incident_report", title: "Iron Shells iOS 11.0 SDK regression postmortem", project: "iron_shells", author: "M. Sokolov", date: "2026-02-20", summary: "After 11.0 release iap_purchase events stopped firing for 11% of iOS users. EMS alert detected drop in 2h.",      tags: ["incident","ems","ios","postmortem"], views: 167, linked: 3 },
    { id: "kb-005", type: "experiment", title: "Iron Shells · Battle Pass progression ×1.2", project: "iron_shells", author: "P. Orlov", date: "2026-02-04", summary: "Faster BP progression lifted BP Engagement by 4.1pp; ARPU neutral.",     tags: ["battle-pass","progression","liveops"], decision: "Accepted", views: 121, linked: 5 },
    { id: "kb-006", type: "research",   title: "Cross-promo: Bloom & Merge ↔ Iron Shells funnel", project: "merge_magic", author: "I. Petrov", date: "2026-01-22", summary: "Cross-promo banner installs convert at 3.1%, IPM is 1.6× higher than paid Facebook traffic.",                tags: ["cross-promo","ua"], views: 94, linked: 2 },
    { id: "kb-007", type: "playbook",   title: "How to launch a Live-Ops event end-to-end",  project: null, author: "A. Volkova", date: "2026-01-10", summary: "Six-step playbook covering event design, EMS event creation, BI dashboards, and post-event analysis.",        tags: ["liveops","playbook","process"], views: 304, linked: 9 },
    { id: "kb-008", type: "decision_log", title: "Adopting Bayesian over frequentist for A/B framework", project: null, author: "Y. Sanochkin", date: "2025-12-05", summary: "Decision context: 60% of our tests have N<10k per arm. Bayesian gives interpretable P(B>A) at every checkpoint.", tags: ["statistics","ab","methodology"], views: 412, linked: 12 },
    { id: "kb-009", type: "metric_definition", title: "Metric: D7 Retention (official definition)", project: null, author: "A. Volkova", date: "2025-11-22", summary: "D7 = COUNT DISTINCT users with session_start on calendar-day (install_date + 7) / COUNT DISTINCT installers.", tags: ["definition","retention","metric"], views: 567, linked: 24 },
    { id: "kb-010", type: "research",   title: "Rogue Rift · Why floor 12 is a wall", project: "roguerift", author: "M. Sokolov", date: "2025-12-19", summary: "Cause-of-death analysis: 72% of attempts at floor 12 die to the Yellow Boss. Suggests power curve cliff.", tags: ["roguerift","balance","power-curve"], views: 88, linked: 3 },
  ];

  /* ----- 9. NOTIFICATIONS ----- */
  const notifications = [
    { id:"n1", kind:"alert",   text:"Iron Shells: DAU −12% vs baseline", project:"iron_shells", time:"5 min ago", icon:"alert" },
    { id:"n2", kind:"alert",   text:"Crypto Keep: wave_fail dropped 51% (release v3.4.0)", project:"cryptokeep", time:"38 min ago", icon:"alert" },
    { id:"n3", kind:"experiment", text:"AB-2026-041 reached P(B>A) ≥ 0.91 — review recommended", project:"iron_shells", time:"1 hour ago", icon:"flask" },
    { id:"n4", kind:"kb",      text:"New incident report: \"iOS 11.0 SDK regression\"", project:"iron_shells", time:"4 hours ago", icon:"book" },
    { id:"n5", kind:"report",  text:"Weekly Executive Summary is ready", project:null, time:"yesterday", icon:"download" },
  ];

  /* ----- 10. SAVED SEGMENTS ----- */
  const segments = [
    { id:"seg-1", name:"Whales (top 1% spenders, last 30d)", projectId:"iron_shells", users: 4_120,  rule: "lifetime_revenue >= 200 AND last_purchase_days <= 7" },
    { id:"seg-2", name:"D7-at-risk (skipped 2+ sessions)",    projectId:"iron_shells", users: 38_220, rule: "sessions_d3_d7 = 0 AND installed_within = 7" },
    { id:"seg-3", name:"Mintegral_int Android cohort",        projectId:"iron_shells", users: 12_104, rule: "source = mintegral_int AND platform = android" },
    { id:"seg-4", name:"Co-op active farmers",                 projectId:"farm_valley", users: 412_300, rule: "coop_actions_30d >= 50" },
  ];

  /* ----- 11. RECENT ACTIVITY ----- */
  const activity = [
    { time: "16:18", text: "AB-2026-041 (Iron Shells · Helios buff) reached P(B>A) = 0.91", icon: "flask",   tool:"ab" },
    { time: "16:11", text: "Iron Shells · tutorial_step alert · Critical · frequency drop", icon: "alert",   tool:"ems" },
    { time: "15:42", text: "Bloom & Merge · merge_action null-rate exceeded 7%",            icon: "alert",   tool:"ems" },
    { time: "15:21", text: "M. Sokolov saved \"Rogue Rift · Floor 12 wall\" to KB",          icon: "book",    tool:"kb"  },
    { time: "14:55", text: "Crypto Keep · v3.4.0 deployed, wave_fail dropped to 49%",       icon: "alert",   tool:"ems" },
    { time: "13:42", text: "P. Orlov added Revenue mix block to Iron Shells Monetization",  icon: "chart-line", tool:"bi" },
    { time: "11:08", text: "AB-2026-038 (Starter pack 4.99→5.99) closed · Accepted",        icon: "check",   tool:"ab" },
  ];

  /* ----- 12. AB ANALYSIS — Iron Shells Helios buff (huge table package) ----- */
  // Used by Block 1A — drill-down inside BI > AB Analysis.
  const abAnalysisData = {
    experimentId: "ab-2026-041",
    project: "iron_shells",
    title: "Iron Shells · Helios +12% armor",
    groups: [
      { name: "iron_shells_newbalance", group: "base", users: 72394, status: "RUNNING" },
      { name: "iron_shells_newbalance", group: "on",   users: 72312, status: "RUNNING" },
    ],
    tutorialFunnel: [
      { step: "match_start",              base: 79.94, on: 79.71 },
      { step: "first_tank_create",        base: 79.88, on: 79.65 },
      { step: "prepare",                  base: 79.87, on: 79.62 },
      { step: "second_tank_create",      base: 79.87, on: 79.60 },
      { step: "review_tanks_start",      base: 79.86, on: 79.58 },
      { step: "review_tanks_finish",     base: 79.75, on: 79.51 },
      { step: "aim_tutor_popup_open",    base: 79.74, on: 79.49 },
      { step: "aim_tutor_popup_close",   base: 79.59, on: 79.30 },
      { step: "first_shot",              base: 79.40, on: 79.10 },
      { step: "change_weapon",           base: 78.92, on: 78.61 },
      { step: "second_shot",             base: 78.80, on: 78.41 },
      { step: "move_tutor_popup_open",   base: 78.55, on: 78.18 },
      { step: "targeting",               base: 78.41, on: 78.09 },
      { step: "box_pick_up",             base: 78.20, on: 77.85 },
      { step: "second_choose_weapon",    base: 78.02, on: 77.71 },
      { step: "complete",                base: 77.91, on: 77.55 },
    ],
    winrate: [
      { level: 1,  finishes_b: 58258, wins_b: 56517, wr_b: 97.01, finishes_o: 58082, wins_o: 56250, wr_o: 96.85 },
      { level: 2,  finishes_b: 59662, wins_b: 52894, wr_b: 88.66, finishes_o: 58772, wins_o: 52330, wr_o: 89.04 },
      { level: 3,  finishes_b: 53122, wins_b: 46210, wr_b: 86.99, finishes_o: 53310, wins_o: 46512, wr_o: 87.25 },
      { level: 4,  finishes_b: 48902, wins_b: 41730, wr_b: 85.34, finishes_o: 49144, wins_o: 42018, wr_o: 85.50 },
      { level: 5,  finishes_b: 45110, wins_b: 38020, wr_b: 84.28, finishes_o: 45330, wins_o: 38245, wr_o: 84.36 },
      { level: 6,  finishes_b: 41202, wins_b: 33800, wr_b: 82.04, finishes_o: 41440, wins_o: 34110, wr_o: 82.31 },
      { level: 7,  finishes_b: 38001, wins_b: 30540, wr_b: 80.37, finishes_o: 38202, wins_o: 30730, wr_o: 80.44 },
      { level: 8,  finishes_b: 34112, wins_b: 26920, wr_b: 78.93, finishes_o: 34480, wins_o: 27240, wr_o: 79.00 },
      { level: 9,  finishes_b: 30820, wins_b: 23910, wr_b: 77.58, finishes_o: 30922, wins_o: 24010, wr_o: 77.65 },
      { level:10, finishes_b: 27110, wins_b: 20520, wr_b: 75.69, finishes_o: 27410, wins_o: 20771, wr_o: 75.77 },
    ],
    dropoff: { // by level
      betweenStarts:   [0, -8.4, -7.1, -5.9, -5.4, -5.2, -4.9, -4.7, -4.5, -4.4, -22.66],
      betweenFinishes: [0, -8.6, -7.4, -6.1, -5.6, -5.3, -5.0, -4.8, -4.6, -4.5, -22.10],
      insideLevel:     [-1.2, -1.4, -1.6, -1.9, -2.1, -2.3, -2.5, -2.7, -2.8, -2.9, -2.99],
      betweenLevels:   [0, -8.1, -7.0, -5.8, -5.4, -5.3, -5.0, -4.8, -4.6, -4.5, -21.26],
    },
    battles: [ // per lifetime day
      { lt: 0, sp_b: 6.32, sp_o: 6.01, wr_b: 77.53, wr_o: 77.20 },
      { lt: 1, sp_b: 9.78, sp_o: 9.05, wr_b: 67.12, wr_o: 67.20 },
      { lt: 2, sp_b: 10.91, sp_o: 10.40, wr_b: 64.18, wr_o: 64.06 },
      { lt: 3, sp_b: 11.20, sp_o: 10.62, wr_b: 62.41, wr_o: 62.55 },
      { lt: 4, sp_b: 11.50, sp_o: 10.94, wr_b: 60.93, wr_o: 61.04 },
      { lt: 5, sp_b: 11.86, sp_o: 11.30, wr_b: 59.41, wr_o: 59.46 },
      { lt: 6, sp_b: 12.10, sp_o: 11.50, wr_b: 58.40, wr_o: 58.42 },
      { lt: 7, sp_b: 12.30, sp_o: 11.70, wr_b: 57.48, wr_o: 57.50 },
      { lt: 8, sp_b: 12.50, sp_o: 11.90, wr_b: 56.70, wr_o: 56.71 },
      { lt: 9, sp_b: 12.71, sp_o: 12.05, wr_b: 56.10, wr_o: 56.10 },
    ],
    chests: [ // % users opened Nth free chest by lifetime
      { lt:0, ch:"chest-1", base:85.59, on:84.20 },
      { lt:0, ch:"chest-2", base:76.77, on:75.40 },
      { lt:0, ch:"chest-3", base:60.18, on:58.81 },
      { lt:0, ch:"chest-4", base:38.04, on:36.30 },
      { lt:0, ch:"chest-5", base:14.50, on:13.91 },
    ],
    chestOpens: [
      { lt:0, chest:"epic_chest",    base:0.21, on:0.21 },
      { lt:0, chest:"free_chest",    base:4.53, on:4.05 },
      { lt:0, chest:"heroic_chest",  base:0.73, on:0.54 },
      { lt:1, chest:"epic_chest",    base:0.32, on:0.30 },
      { lt:1, chest:"free_chest",    base:6.20, on:5.71 },
      { lt:1, chest:"heroic_chest",  base:0.94, on:0.72 },
    ],
    dailyMissions: [
      { quest:"buy_tanks",        share_b:50.88, share_o:49.62, conv_b: 32.1, conv_o: 31.4 },
      { quest:"damage_tanks",     share_b:50.16, share_o:50.11, conv_b: 47.2, conv_o: 46.8 },
      { quest:"earn_coins",       share_b:50.21, share_o:50.00, conv_b: 71.0, conv_o: 70.4 },
      { quest:"fires",            share_b:50.37, share_o:50.21, conv_b: 65.1, conv_o: 64.7 },
      { quest:"kill_tanks",       share_b:50.50, share_o:49.94, conv_b: 58.2, conv_o: 58.0 },
      { quest:"play_battles",     share_b:50.35, share_o:49.91, conv_b: 88.3, conv_o: 88.1 },
      { quest:"upgrade_something",share_b:50.37, share_o:49.78, conv_b: 41.4, conv_o: 39.9 },
      { quest:"win_tournaments",  share_b:50.50, share_o:50.29, conv_b: 18.2, conv_o: 17.8 },
    ],
    upgrades: [
      { lt:0, cat:"tank",  base:4.40, on:5.90 },
      { lt:1, cat:"tank",  base:7.33, on:7.22 },
      { lt:2, cat:"tank",  base:8.10, on:8.04 },
      { lt:0, cat:"weapon",base:2.00, on:2.59 },
      { lt:1, cat:"weapon",base:3.00, on:4.68 },
      { lt:2, cat:"weapon",base:3.60, on:5.10 },
    ],
    tanksPerBattle: Array.from({length: 30}, (_,i) => {
      const v = i < 3 ? [0.05,0.19,0.30][i] : Math.max(0.04, 0.30 - (i - 3) * 0.012 + (i % 4) * 0.005);
      return { battle: i + 1, avg_purchased: +v.toFixed(3) };
    }),
    topTankByLevel: [
      { range: "1–5",   base:"tank_abrams", on:"tank_abrams" },
      { range: "6",     base:"tank_helios", on:"tank_abrams" },
      { range: "7–8",   base:"tank_helios", on:"tank_frost"  },
      { range: "9–14",  base:"tank_helios", on:"tank_helios" },
      { range: "12+",   base:"tank_atomic", on:"tank_helios" },
      { range: "15+",   base:"tank_atomic", on:"tank_atomic" },
    ],
    softHardBalance: {
      soft: Array.from({length: 30}, (_,i) => ({ battle:i+1, base: 132 + i*100 + (i*i)*0.6, on: 125 + i*90 + (i*i)*0.8 })),
      hard: Array.from({length: 30}, (_,i) => ({ battle:i+1, base: i * 1.7, on: i * 1.4 + Math.sin(i)*0.5 })),
    },
    hardSpend: [
      { item:"revive",         buy_b:16.13, buy_o:16.03, cnt:2.35 },
      { item:"heroic_chest",   buy_b:5.53,  buy_o:6.43,  cnt:1.74 },
      { item:"legendary_chest",buy_b:2.44,  buy_o:2.86,  cnt:1.46 },
      { item:"epic_chest",     buy_b:2.07,  buy_o:2.34,  cnt:1.28 },
      { item:"dead_weight",    buy_b:0.78,  buy_o:0.45,  cnt:1.01 },
      { item:"big_shot",       buy_b:0.76,  buy_o:0.48,  cnt:1.02 },
    ],
    reviveConv: [
      { level:"all", b:17.02, o:17.41, free:14.08 },
      { level:1,     b:0,     o:0,     free:0 },
      { level:6,     b:4.36,  o:5.80,  free:7.20 },
      { level:10,    b:6.23,  o:6.92,  free:5.11 },
      { level:15,    b:11.28, o:11.80, free:12.09 },
      { level:29,    b:5.83,  o:6.22,  free:11.08 },
      { level:35,    b:10.51, o:10.56, free:14.20 },
    ],
  };

  /* ----- 13. COHORT COMPARE — Bloom & Merge v3.4.0 vs v3.5.0 ----- */
  const cohortCompareData = {
    project: "merge_magic",
    title: "Bloom & Merge · v3.4.0 vs v3.5.0",
    cohorts: {
      c1: { name:"v3.4.0", startDate:"2026-04-10", endDate:"2026-04-13", users: 11888, excluded: 874, daysAvailable: 9 },
      c2: { name:"v3.5.0", startDate:"2026-04-22", endDate:"2026-04-25", users: 11720, excluded: 281, daysAvailable: 9 },
    },
    sources: [
      { source:"apple_search_ads",     i1:782,   t1:11888, p1:6.58,  i2:729,   t2:11720, p2:6.22 },
      { source:"mintegral_int",         i1:3272,  t1:11888, p1:27.52, i2:3072,  t2:11720, p2:26.21 },
      { source:"organic",               i1:6843,  t1:11888, p1:57.56, i2:6177,  t2:11720, p2:52.70 },
      { source:"tiktokglobal_int",      i1:54,    t1:11888, p1:0.45,  i2:891,   t2:11720, p2:7.60 },
      { source:"ysonetworvq_int",       i1:937,   t1:11888, p1:7.88,  i2:851,   t2:11720, p2:7.26 },
    ],
    retention: [
      { lt:1, p1:30.48, n1:3623, p2:32.81, n2:3845, prob:99.99, lost:2.33 },
      { lt:2, p1:17.63, n1:2096, p2:18.58, n2:2178, prob:97.13, lost:0.96 },
      { lt:3, p1:13.15, n1:1563, p2:14.40, n2:1688, prob:99.72, lost:1.25 },
      { lt:4, p1:10.63, n1:1264, p2:11.46, n2:1343, prob:97.89, lost:0.83 },
      { lt:5, p1:9.44,  n1:1122, p2:10.21, n2:1197, prob:97.74, lost:0.78 },
      { lt:6, p1:8.86,  n1:1053, p2:9.38,  n2:1099, prob:91.71, lost:0.53 },
      { lt:7, p1:8.22,  n1:977,  p2:8.52,  n2:998,  prob:79.50, lost:0.34 },
      { lt:8, p1:6.12,  n1:727,  p2:5.85,  n2:686,  prob:19.77, lost:0.03 },
      { lt:9, p1:4.59,  n1:546,  p2:4.91,  n2:575,  prob:87.09, lost:0.33 },
    ],
    ltvTotal: [
      { lt:0, v1:0.112, v2:0.126, sig:"win" },
      { lt:1, v1:0.156, v2:0.170, sig:"win" },
      { lt:2, v1:0.175, v2:0.192, sig:"win" },
      { lt:3, v1:0.190, v2:0.211, sig:"win" },
      { lt:4, v1:0.198, v2:0.225, sig:"win" },
      { lt:5, v1:0.208, v2:0.239, sig:"win" },
      { lt:6, v1:0.216, v2:0.254, sig:"win" },
      { lt:7, v1:0.222, v2:0.268, sig:"win" },
      { lt:8, v1:0.228, v2:0.275, sig:"win" },
      { lt:9, v1:0.234, v2:0.282, sig:"win" },
    ],
    funnelLoad: [
      { step:"_firebase_config_init_finish", p1:99.90, p2:99.95, n1:11876 },
      { step:"step_appmetrica_loading",       p1:99.90, p2:99.96, n1:11876 },
      { step:"step_appsflyer_loading",        p1:99.83, p2:99.91, n1:11868 },
      { step:"step_facebook_loading",         p1:99.75, p2:99.90, n1:11858 },
      { step:"group_after_consent",           p1:99.18, p2:99.40, n1:11790 },
      { step:"step_game_services_loading",    p1:99.09, p2:99.28, n1:11780 },
      { step:"_firebase_config_fetched",      p1:97.27, p2:96.76, n1:11564 },
    ],
    ads: {
      ltvAds: [
        { lt:0, v1:0.097, v2:0.098, sig:"win" },
        { lt:1, v1:0.130, v2:0.133, sig:"win" },
        { lt:3, v1:0.150, v2:0.161, sig:"win" },
        { lt:5, v1:0.168, v2:0.181, sig:"win" },
        { lt:7, v1:0.176, v2:0.195, sig:"win" },
        { lt:9, v1:0.185, v2:0.203, sig:"win" },
      ],
      ecpm: [
        { format:"INTER",  v1:14.58, v2:14.91 },
        { format:"REWARD", v1:17.05, v2:15.22 },
      ],
      interByLT: [
        { lt:0, v1:4.55, v2:4.76, sig:"win" },
        { lt:1, v1:6.78, v2:7.32, sig:"win" },
        { lt:2, v1:7.90, v2:8.53, sig:"win" },
        { lt:5, v1:9.61, v2:10.42, sig:"win" },
        { lt:9, v1:11.08, v2:12.09, sig:"win" },
      ],
      rewardByLT: [
        { lt:0, v1:0.45, v2:0.47, sig:"none" },
        { lt:1, v1:0.74, v2:0.81, sig:"win" },
        { lt:5, v1:1.10, v2:1.30, sig:"win" },
        { lt:9, v1:1.35, v2:1.52, sig:"win" },
      ],
      placements: [
        { format:"REWARD", place:"revive_popup",         vi1:0.46, vi2:0.53, conv:11.67 },
        { format:"REWARD", place:"result_chest",         vi1:0.32, vi2:0.35, conv:8.08  },
        { format:"REWARD", place:"free_reward_chain_001",vi1:0.27, vi2:0.27, conv:6.58  },
        { format:"INTER",  place:"before_result",        vi1:6.16, vi2:6.88, conv:72.28 },
        { format:"INTER",  place:"play",                  vi1:3.05, vi2:3.25, conv:57.63 },
        { format:"INTER",  place:"chest_close",           vi1:1.13, vi2:1.10, conv:38.70 },
      ],
      availability: [
        { c:"1", fmt:"interstitial", req:73.58, started:100, viewed:96.25 },
        { c:"2", fmt:"interstitial", req:80.47, started:100, viewed:96.64 },
        { c:"1", fmt:"rewarded",     req:97.42, started:100, viewed:99.11 },
        { c:"2", fmt:"rewarded",     req:97.53, started:100, viewed:99.19 },
      ],
    },
    inapps: {
      ltvInapps: [
        { lt:0, v1:0.0152, v2:0.0263 },
        { lt:1, v1:0.0264, v2:0.0355 },
        { lt:3, v1:0.0327, v2:0.0494 },
        { lt:5, v1:0.0385, v2:0.0568 },
        { lt:7, v1:0.0414, v2:0.0651 },
        { lt:9, v1:0.0436, v2:0.0719 },
      ],
      cnpu: [
        { lt:0, p1:0.286, n1:34, p2:0.503, n2:59 },
        { lt:1, p1:0.437, n1:52, p2:0.589, n2:69 },
        { lt:3, p1:0.487, n1:58, p2:0.674, n2:79 },
        { lt:5, p1:0.521, n1:62, p2:0.717, n2:84 },
        { lt:7, p1:0.555, n1:66, p2:0.768, n2:90 },
      ],
      carppu: [
        { lt:0, a1:5.30, a2:5.23, n1:34, n2:59, r1:180.13, r2:308.30 },
        { lt:1, a1:6.05, a2:6.03, n1:52, n2:69, r1:314.38, r2:416.26 },
        { lt:3, a1:6.51, a2:6.81, n1:58, n2:79, r1:377.71, r2:538.36 },
        { lt:5, a1:7.02, a2:7.55, n1:62, n2:84, r1:435.55, r2:634.36 },
        { lt:7, a1:7.40, a2:8.21, n1:66, n2:90, r1:488.36, r2:739.13 },
        { lt:9, a1:7.74, a2:9.26, n1:67, n2:91, r1:518.83, r2:842.55 },
      ],
      purchases: [
        { content:"noads",                  c1:0.2355, c2:0.3498, r1:121.81, r2:176.10 },
        { content:"starterpack.1.1",        c1:0.0673, c2:0.0768, r1:17.37,  r2:21.37  },
        { content:"atomicupgradepacksale",  c1:0.0421, c2:0.0853, r1:11.39,  r2:22.18  },
        { content:"coins.s",                c1:0.0421, c2:0.0683, r1:11.34,  r2:32.80  },
        { content:"dubstep",                c1:0.0336, c2:0.0683, r1:16.64,  r2:33.53  },
        { content:"choice.offer.pay.1",     c1:0.0084, c2:0.0512, r1:9.99,   r2:65.25  },
      ],
    },
    subs: {
      trial: [
        { c:1, opened:55, conv:0.463, paid:9, payConv:16.36 },
        { c:2, opened:64, conv:0.546, paid:7, payConv:10.94 },
      ],
      overall: [
        { c:1, paid:9, conv:0.076 },
        { c:2, paid:9, conv:0.077 },
      ],
    },
    levelFunnel: Array.from({length: 12}, (_,i) => ({
      level: i + 1,
      start_1: Math.round(9735 - i * 600 + (i*i)*2),
      start_2: Math.round(9652 - i * 580 + (i*i)*2),
      finish_1: Math.round(9282 - i * 590 + (i*i)*2),
      finish_2: Math.round(9251 - i * 575 + (i*i)*2),
      fs1: +(81.89 - i*1.1 - (i>4?2:0)).toFixed(2),
      fs2: +(82.35 - i*1.05 - (i>4?2:0)).toFixed(2),
    })),
  };

  /* ----- 14. RETURN PUBLIC INTERFACE ----- */
  return {
    projects, allProjects, projectGroups, projectById,
    globalParamSet,
    events,
    alerts,
    notifications, segments, activity,
    dashboards: [].concat(...Object.entries(dashboardsByProject).map(([pid, list]) => list.map(d => ({...d, project: pid})))), // legacy flat list
    dashboardsByProject,
    blockBlueprints,
    experiments,
    knowledge,
    abAnalysisData,
    cohortCompareData,
  };
})();
