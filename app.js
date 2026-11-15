// Dancing with the SARs: style-free data (web/data/<scene>/manifest.json) + a theme (web/themes/<name>.json).
// Add a place: `uv run sars new <id> --bbox W S E N`, then `sars fetch` and `sars build` (see README.md). Add a look: drop a new theme JSON and list it in THEMES.
// Layer kinds understood here (all described by the manifest, nothing site-specific in this file):
//   hachures-static  relief strokes            {dark}
//   hachures-time    motion strokes that grow  {rate_cm_yr, sigma_cm_yr, snr, segments, trust, dark, t[]}
//   cells            block grid: {columns, cells, cell_km, modes[{key, label, ramp|categorical, time?}], series?, dates?}
//   polygons         GeoJSON areas/lines/points with a theme style ("change", "fault", ...)
//   card             a panel card (quake estimate with a confidence flag)
//   rhythm           partitura: {dates, rows[{name, lon, lat, r_km, series_cm, rate_cm_yr, sigma_cm_yr, still}]}
const THEMES = ["engraving", "night", "scroll"];
const STR = {
  uk: { scene: "Місце", theme: "Стиль", trust: "Довіра", trust_fade: "слабкі штрихи бліді", trust_strong: "лише надійні",
        trust_all: "усі, без довіри", off: "вимк.", radar_only: "лише радар", tied: "прив'язано до GNSS",
        strong: "надійний штрих (сигнал ≥ 3σ)", weak: "слабкий (1–3σ)", hidden: "шум (< 1σ) не малюється",
        stroke: "кожне кільце штрихів = {b} см опускання", pairs: "пар", loading: "Завантажую дані…",
        rate_cm_yr: "швидкість, см/рік", sigma_cm_yr: "похибка σ, см/рік", segments: "шматків ланцюжка", cum_cm: "зсув, см",
        cluster: "тип ритму", mean_rel_coh: "середня відн. когерентність", los_cm: "радар, см", model_cm: "модель, см",
        residual_cm: "залишок, см", deepest: "найглибше", type: "тип", strike: "простягання", dip: "нахил", rake: "кут ковзання",
        Mw: "магнітуда Mw", length_km: "довжина, км", width_km: "ширина, км", slip_m: "зсув по розлому, м",
        centroid_depth_km: "глибина центру, км", confident: "ВПЕВНЕНИЙ", not_confident: "НЕ ВПЕВНЕНИЙ",
        conf_line: "згода пропозицій {c} (поріг {t})", runs: "{a} з {n} запусків погоджуються з показаним",
        ref: "Порівняння (не використовується в оцінці)", resid: "відносний залишок", largest: "найбільша пляма",
        false_alarm: "та сама міра до події", blocks: "блоків", event: "подія", km2: "км²", cell_series: "крива точки",
        type_curve: "середня крива типу", click: "Клікни на клітинку, щоб побачити її криву",
        sec_title: "Розріз", km: "км", sec_first: "Клікни на карті першу точку розрізу (A).",
        sec_second: "Тепер клікни другу точку (B).", sec_empty: "На цій лінії немає надійних даних.",
        sec_zero: "рівень землі {d}", sec_note: "Вертикаль перебільшена приблизно в {x} разів, тому будиночки нахилені набагато сильніше, ніж насправді. Смуга: ±2σ.",
        sec_steep: "Найкрутіший прогин уздовж лінії: 1 : {n} (на {k} км від A).",
        sec_redraw: "Свій розріз: дві точки кліком на карті.",
        sec_tab_cut: "Розріз", sec_tab_scan: "Сканер", sec_tab_block: "Блок-діаграма", sec_scan: "зсув лінії, км",
        blk_n: "північ", blk_w: "захід", blk_e: "схід",
        blk_note: "Кожна лінія — профіль землі вздовж напрямку A→B; ряди йдуть один за одним углиб. Чим глибше, тим червоніша й товща лінія. Вертикаль сильно перебільшена; жирна темна лінія — там, де стоїть сканер.",
        blk_back: "позаду", sec_rot: "повернути лінію A–B на 90°",
        dir8: "північ,північний схід,схід,південний схід,південь,південний захід,захід,північний захід",
        ew_e: "сх. д.", ew_w: "зх. д.", ns_n: "пн. ш.", ns_s: "пд. ш.", asl: "{h} м над рівнем моря", sinks: "опускається ≈{v} см/рік",
        frame_sub: "опускання землі за радаром NISAR · {a}–{b}",
        cm: "см", cm_yr: "см/рік", lg_wedge: "клин: товстий кінець вище, тонкий вказує, куди земля опускається більше",
        lg_wedge_drop: "крапля: тонкий хвіст вище, товста голівка там, куди земля опускається більше",
        lg_solid: "суцільний: сигнал надійний (≥ 3σ)", lg_dashed: "пунктир: сигнал слабкий (1–3σ)",
        lg_dense: "густі штрихи: земля прогинається найкрутіше", lg_contour: "лінії глибини кожні {s} см від першої дати", lg_tint_down: "опустилась від першої дати: темніше = глибше",
        lg_tint_up: "піднялась від першої дати: темніше = вище",
        headline: "Де ми певні, що тоне найшвидше: <b>{r} ± {s} см/рік</b> (щонайменше {b}). 1% площі опускається швидше за {p} см/рік",
        lg_up: "синій: земля піднімається",
        score_note: "клин = опускання району за 12 днів · угорі найшвидші, внизу нерухомі",
        score_still: "тиша", score_ref: "еталон, 0", score_sound: "звук", score_play: "програти рік",
        more: "Детальніше ▸", less: "Сховати деталі ◂", alpha: "У роботі (альфа)", alpha_t: "Чернетки таблиць: дані й тексти ще не перевірені", notes: "Нотатки до розрахунку",
        score_sound_t: "кожен дзвін — ще 2 см опускання: що швидше район сідає, то частіше дзвонить; нерухомі мовчать",
        lg_change: "радар втратив відбиток між двома прольотами (сніг, вода, обвал)", lg_change_event: "пляма, що лишається: селевий потік",
        story_intro: "таблиця", story_what: "що змінилось", story_why: "чому", story_sure: "наскільки певні",
        story_next: "що ще може NISAR", story_listen: "послухати", story_back: "Назад", story_next_btn: "Далі",
        story_explore: "досліджувати мапу самому ✕", story_open: "Читати таблицю ▸",
        contents: "☰ Зміст", glossary: "Слова, вжиті в атласі", next_plate: "Наступна таблиця", the_end: "Кінець атласу: до змісту" },
  en: { scene: "Place", theme: "Style", trust: "Trust", trust_fade: "weak strokes faded", trust_strong: "reliable only",
        trust_all: "all, no trust", off: "off", radar_only: "radar only", tied: "tied to GNSS",
        strong: "reliable stroke (signal ≥ 3σ)", weak: "weak (1–3σ)", hidden: "noise (< 1σ) not drawn",
        stroke: "each ring of strokes = {b} cm of sinking", pairs: "pairs", loading: "Loading data…",
        rate_cm_yr: "rate, cm/yr", sigma_cm_yr: "error σ, cm/yr", segments: "chain pieces", cum_cm: "displacement, cm",
        cluster: "rhythm type", mean_rel_coh: "mean rel. coherence", los_cm: "radar, cm", model_cm: "model, cm",
        residual_cm: "residual, cm", deepest: "deepest", type: "type", strike: "strike", dip: "dip", rake: "rake",
        Mw: "magnitude Mw", length_km: "length, km", width_km: "width, km", slip_m: "fault slip, m",
        centroid_depth_km: "centroid depth, km", confident: "CONFIDENT", not_confident: "NOT CONFIDENT",
        conf_line: "proposal agreement {c} (threshold {t})", runs: "{a} of {n} runs agree with the one shown",
        ref: "Comparison (not used by the estimate)", resid: "relative residual", largest: "largest patch",
        false_alarm: "same measure before the event", blocks: "blocks", event: "event", km2: "km²", cell_series: "cell curve",
        type_curve: "type mean curve", click: "Click a cell to see its curve",
        sec_title: "Cross-section", km: "km", sec_first: "Click the first point of the cut on the map (A).",
        sec_second: "Now click the second point (B).", sec_empty: "No reliable data along this line.",
        sec_zero: "ground level on {d}", sec_note: "Vertical exaggeration about {x}×, so the little houses tilt far more than in reality. Band: ±2σ.",
        sec_steep: "Steepest bend along the line: 1 : {n} ({k} km from A).",
        sec_redraw: "Your own cut: click two points on the map.",
        sec_tab_cut: "Cut", sec_tab_scan: "Scanner", sec_tab_block: "Block diagram", sec_scan: "move the line, km",
        blk_n: "north", blk_w: "west", blk_e: "east",
        blk_note: "Each line is a ground profile along A→B; rows are stacked into the distance. The deeper, the redder and thicker. Vertical strongly exaggerated; the bold dark line is where the scanner is.",
        blk_back: "at the back", sec_rot: "turn the A–B line by 90°",
        dir8: "north,north-east,east,south-east,south,south-west,west,north-west",
        ew_e: "E", ew_w: "W", ns_n: "N", ns_s: "S", asl: "{h} m above sea level", sinks: "sinking ≈{v} cm/yr",
        frame_sub: "ground sinking seen by the NISAR radar · {a}–{b}",
        cm: "cm", cm_yr: "cm/yr", lg_wedge: "wedge: thick end is higher, thin end points to where the ground sinks more",
        lg_wedge_drop: "drop: thin tail is higher, the thick head sits where the ground sinks more",
        lg_solid: "solid: reliable signal (≥ 3σ)", lg_dashed: "dashed: weak signal (1–3σ)",
        lg_dense: "dense strokes: the ground bends most steeply", lg_contour: "depth lines every {s} cm since the first date", lg_tint_down: "sunk since the first date: darker = deeper",
        lg_tint_up: "risen since the first date: darker = higher",
        headline: "Where we are sure it sinks fastest: <b>{r} ± {s} cm/yr</b> (at least {b}). 1% of the area sinks faster than {p} cm/yr",
        lg_up: "blue: the ground rises",
        score_note: "wedge = how far the district went down in 12 days · fastest on top, still at the bottom",
        score_still: "still", score_ref: "reference, 0", score_sound: "sound", score_play: "play the year",
        more: "Tell me more ▸", less: "Hide the details ◂", alpha: "Work in progress (alpha)", alpha_t: "Draft plates: data and words not yet checked", notes: "Notes on the build",
        score_sound_t: "each chime = 2 more cm of sinking: the faster a district sinks, the more often it chimes; still ground stays silent",
        lg_change: "the radar lost the ground's fingerprint between two passes (snow, water, a slide)", lg_change_event: "the patch that stays: the debris flow",
        story_intro: "plate", story_what: "what changed", story_why: "why", story_sure: "how sure",
        story_next: "what else NISAR can do", story_listen: "listen", story_back: "Back", story_next_btn: "Next",
        story_explore: "explore the map yourself ✕", story_open: "Read the plate ▸",
        contents: "☰ Contents", glossary: "Words used in the atlas", next_plate: "Next plate", the_end: "End of the atlas: back to the contents" },
};
const q = new URLSearchParams(location.search);
const lang = q.get("lang") || "en";                       // ?lang=uk for the Ukrainian interface
const T = (k) => (STR[lang] || STR.en)[k] ?? k;
const label = (l) => (l == null ? "" : typeof l === "string" ? l : l[lang] ?? l.en ?? Object.values(l)[0]);
const $ = (id) => document.getElementById(id);
const getJSON = (u) => fetch(u, { cache: "no-cache" }).then((r) => { if (!r.ok) throw new Error(u + " " + r.status); return r.json(); });
const DAY = 86400000;

const state = { scene: null, theme: null, man: null, data: {}, visible: {}, mode: {}, day: 0, maxDay: 1, playing: false,
                trust: "fade", point: null, section: null, pending: null, secBase: null, scanKm: 0, secMode: "cut", open: {},
                sound: q.get("sound") === "1", scoreHover: null, scorePin: null, bells: {},
                storyData: null, storyOn: false, page: 0, marks: [] };
let map, overlay;
window.SAR = { get map() { return map; }, get overlay() { return overlay; }, get state() { return state; },   // console debugging
               page: (i) => applyPage(i, true) };

// ---------------------------------------------------------------- helpers
function ramp(stops, v) {
  if (v == null || !isFinite(v)) return [0, 0, 0, 0];
  if (v <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [x1, c1] = stops[i], [x0, c0] = stops[i - 1];
    if (v <= x1) { const t = (v - x0) / (x1 - x0); return c0.map((c, j) => c + t * (c1[j] - c)); }
  }
  return stops[stops.length - 1][1];
}
const rgba = (c) => `rgba(${c[0]},${c[1]},${c[2]},${(c[3] ?? 255) / 255})`;
const layersOf = (kind) => (state.man ? state.man.layers.filter((l) => l.kind === kind) : []);
const modeOf = (lay) => (state.data[lay.id]?.modes || []).find((m) => m.key === state.mode[lay.id]);
const dayOf = (s) => (new Date(s + "T00:00:00Z") - new Date(state.man.dates[0] + "T00:00:00Z")) / DAY;

function seriesIndex(d) {          // index of the last series date at or before the slider
  if (!d.dates) return -1;
  let k = 0;
  for (let i = 0; i < d.dates.length; i++) if (dayOf(d.dates[i]) <= state.day + 0.5) k = i;
  return k;
}

function cellValue(d, m, c) {
  if (m.time) return c[d.columns.indexOf(m.series || d.series)]?.[seriesIndex(d)];   // a mode may name its own series
  return c[d.columns.indexOf(m.key)];
}

function needsTime() {
  return layersOf("hachures-time").some((l) => state.visible[l.id]) || !!scoreLayer() ||
         layersOf("polygons").some((l) => state.visible[l.id] && l.time) ||
         layersOf("cells").some((l) => state.visible[l.id] && modeOf(l)?.time);
}

function applyThemeCSS(th) {
  const r = document.documentElement.style;
  r.setProperty("--paper", th.paper); r.setProperty("--ink", th.ink); r.setProperty("--muted", th.muted);
  r.setProperty("--panel-bg", th.panel.bg); r.setProperty("--panel-border", th.panel.border); r.setProperty("--font", th.font);
  r.setProperty("--font-body", th.font_body || th.font);          // running text: a plainer face than the display one
}

function mapStyle(th) {
  const st = { version: 8, sources: {}, layers: [{ id: "bg", type: "background", paint: { "background-color": th.paper } }] };
  if (th.basemap) {        // optional raster basemap: {"tiles": [...], "attribution": "...", "opacity": 0.5}
    st.sources.base = { type: "raster", tiles: th.basemap.tiles, tileSize: 256, attribution: th.basemap.attribution || "" };
    st.layers.push({ id: "base", type: "raster", source: "base", paint: { "raster-opacity": th.basemap.opacity ?? 1 } });
  }
  return st;
}

// ---------------------------------------------------------------- deck layers
const _wedgeCache = new WeakMap();
// taper "top": thick at the high end (Swiss wedge hachures); "bottom": thick at the low end, like a drop running into the basin.
// Theme key velocity.taper, overridden by ?taper=top|bottom for side-by-side comparisons.
function taperBottom(th) { return (q.get("taper") || th.velocity?.taper || "top") === "bottom"; }

function wedgePieces(d, trust, bottom = false) {
  const key = `${trust}|${bottom}`, cache = _wedgeCache.get(d) || {};
  if (cache[key]) return cache[key];
  const TOP = [1.35, 1.0, 0.72, 0.5, 0.34, 0.22], out = [], TAPER = bottom ? [...TOP].reverse() : TOP;
  for (const f of d.features) {
    const p = f.properties, q = f.geometry.coordinates, t = p.t, n = q.length;
    if (trust === "strong" && p.trust !== "strong") continue;
    if (trust !== "all" && p.trust === "below") continue;
    const C = Math.min(TAPER.length, Math.max(1, n - 1));
    const weak = trust !== "all" && p.trust !== "strong";
    for (let c = 0; c < C; c++) {
      if (weak && c % 2 === 1) continue;                                  // dashes
      const i0 = Math.floor(c * (n - 1) / C), i1 = Math.max(i0 + 1, Math.floor((c + 1) * (n - 1) / C));
      out.push({ path: q.slice(i0, i1 + 1), t: t.slice(i0, i1 + 1), dark: p.dark, trust: p.trust, up: p.sense === "up",
                 k: TAPER[Math.round(c * (TAPER.length - 1) / Math.max(1, C - 1))] });
    }
  }
  cache[key] = out; _wedgeCache.set(d, cache);
  return out;
}

function textLayer(id, data, th, o) {
  const chars = o.chars === "auto" ? "auto" :                 // deck collects the glyphs from the data itself
    "0123456789+-−±.,/ смcmрікyrСМABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return new deck.TextLayer({ id, data, getPosition: (x) => x.p, getText: (x) => x.s, getAngle: (x) => x.a,
    getSize: (o.size || 11) + (th.label_bump ?? 0), sizeUnits: "pixels", getColor: o.color || [0, 0, 0, 255], fontFamily: th.label_font || th.font,
    fontWeight: (o.italic ? "italic " : "") + (o.bold ? "bold" : th.label_weight || "normal"), getPixelOffset: o.offset || [0, 0],
    characterSet: chars, fontSettings: { sdf: true, buffer: 10, radius: 16 }, outlineWidth: o.halo || o.bold ? (th.label_halo ?? 7) : 0,
    outlineColor: [...(th.paper_rgb || [255, 255, 255]), 255], billboard: true });
}

// context lines (old lake, cracks, city): style by name from theme.lines; points carry names -> labels
const _pathCache = new WeakMap();
// Trees get a level from a coarse-to-fine grid (level 0 = one tree per big cell); zoomed out only the coarse levels show,
// so the wood sign keeps the same airy spacing on screen at any scale.
const _treeLevels = new WeakMap();
// zoom_fade [z0, z1, min]: a layer at `min` strength zoomed out (<= z0), full strength from z1 in
function zoomFade(f) {
  if (!f || !map) return 1;
  const t = Math.min(1, Math.max(0, (map.getZoom() - f[0]) / (f[1] - f[0])));
  return f[2] + (1 - f[2]) * t;
}
// labels: greedy screen-space placement, bigger rank first; a name that would touch a placed one is left out (redone on zoom)
function declutter(pts, s) {
  const boxes = [], keep = new Set();
  for (const x of [...pts].sort((a, b) => b.r - a.r)) {
    const caps = s.caps_rank && x.r >= s.caps_rank, size = caps ? (s.caps_size || 13) : (s.label_size || 11) + (x.r - 1) * 2;
    const c = map.project(x.p), w = [...x.s].length * size * (caps ? 0.62 : 0.42) / 2 + 4, h = size * 0.7 + 2;
    const b = [c.x - w, c.y - h, c.x + w, c.y + h];
    if (boxes.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1])) continue;
    boxes.push(b); keep.add(x);
  }
  for (let i = pts.length - 1; i >= 0; i--) if (!keep.has(pts[i])) pts.splice(i, 1);
}
function airyTrees(trees, gapPx) {
  const K = 6;
  let lv = _treeLevels.get(trees[0]) && trees.map((f) => _treeLevels.get(f));
  if (!lv) {
    const lat = trees[0].geometry.coordinates[1], kx = Math.cos(lat * Math.PI / 180);
    lv = new Array(trees.length).fill(K);
    const hash = (i) => ((i * 2654435761) >>> 0) % 100003;
    for (let k = 0; k < K; k++) {
      const step = 0.0045 * 2 ** (K - 1 - k), best = new Map();          // ~500 m at the finest level
      trees.forEach((f, i) => {
        const [x, y] = f.geometry.coordinates, key = `${Math.floor(x * kx / step)},${Math.floor(y / step)}`;
        const b = best.get(key);
        if (b == null || hash(i) < hash(b)) best.set(key, i);
      });
      for (const i of best.values()) lv[i] = Math.min(lv[i], k);
    }
    trees.forEach((f, i) => _treeLevels.set(f, lv[i]));
  }
  const lat = map.getCenter().lat, mpp = 40075016 * Math.cos(lat * Math.PI / 180) / (512 * 2 ** map.getZoom());
  const needDeg = gapPx * mpp / 111000;
  let show = 0;
  for (let k = 0; k <= K; k++) if (0.0045 * 2 ** (K - 1 - k) >= needDeg) show = k;
  return trees.filter((f, i) => lv[i] <= show);
}
const TREE_ICON = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">` +
  `<path d="M16 3 C8 3 4 10 6 16 C3 19 5 26 11 26 C13 29 19 29 21 26 C27 26 29 19 26 16 C28 10 24 3 16 3 Z" fill="none" stroke="#000" stroke-width="2.6"/>` +
  `<path d="M16 26 L16 38" stroke="#000" stroke-width="3"/></svg>`);
function linesLayers(lay, d, th) {
  const s = (th.lines || {})[lay.style] || { color: [0, 0, 0], alpha: 200, width: 1 };
  let paths = _pathCache.get(d);
  if (!paths) {
    paths = [];
    for (const f of d.features) {
      const g = f.geometry, k = f.properties.k ?? 0;
      if (g.type === "LineString") paths.push({ path: g.coordinates, k });
      else if (g.type === "MultiLineString") g.coordinates.forEach((c) => paths.push({ path: c, k }));
    }
    _pathCache.set(d, paths);
  }
  const out = [];
  // town blocks (old town-plan sign): filled polygons, darker where denser (property d), streets stay paper
  const polys = d.features.filter((f) => f.geometry.type === "Polygon");
  if (polys.length) {
    out.push(new deck.SolidPolygonLayer({ id: lay.id + "-fill", data: polys, getPolygon: (f) => f.geometry.coordinates,
      getFillColor: (f) => [...s.color, Math.round((s.fill_alpha ?? 80) * (s.dense ? 1 - s.dense + s.dense * (f.properties.d ?? 1) : 1))],
      updateTriggers: { getFillColor: th.name } }));
    if (s.width) out.push(new deck.PathLayer({ id: lay.id + "-edge", data: polys.flatMap((f) => f.geometry.coordinates),
      getPath: (r) => r, widthUnits: "pixels", getWidth: s.width, getColor: [...s.color, s.alpha], jointRounded: false,
      updateTriggers: { getColor: th.name } }));
    return out;
  }
  const ext = s.dash && deck.PathStyleExtension ? { extensions: [new deck.PathStyleExtension({ dash: true })],
    getDashArray: s.dash, dashJustified: true } : {};
  if (s.casing) out.push(new deck.PathLayer({ id: lay.id + "-casing", data: paths, getPath: (x) => x.path, widthUnits: "pixels",
    getWidth: s.width + 2 * s.casing, getColor: [...(th.paper_rgb || [255, 255, 255]), 255], capRounded: true, jointRounded: true }));
  out.push(new deck.PathLayer({ id: lay.id, data: paths, getPath: (x) => x.path, widthUnits: "pixels", capRounded: !s.dash,
    jointRounded: true, getWidth: (x) => s.width * (s.fade ? 1 - 0.45 * x.k : 1),
    getColor: (x) => [...s.color, Math.round(s.alpha * (s.fade ? 1 - 0.75 * x.k : 1))],
    updateTriggers: { getColor: th.name, getWidth: th.name }, ...ext }));
  // "zebra": the old railway sign, a dark band with paper-coloured dashes inside
  if (s.zebra && deck.PathStyleExtension) out.push(new deck.PathLayer({ id: lay.id + "-zebra", data: paths, getPath: (x) => x.path,
    widthUnits: "pixels", getWidth: Math.max(1, s.width - 2), getColor: [...(th.paper_rgb || [255, 255, 255]), 255],
    extensions: [new deck.PathStyleExtension({ dash: true })], getDashArray: s.zebra, dashJustified: false,
    capRounded: false, jointRounded: true }));
  // little trees (old-map wood sign): one vector icon, tinted by the theme (mask)
  let trees = d.features.filter((f) => f.geometry.type === "Point" && f.properties.tree != null);
  if (s.airy && trees.length && map) trees = airyTrees(trees, (s.size || 10) * s.airy);
  if (trees.length) out.push(new deck.IconLayer({ id: lay.id + "-trees", data: trees, getPosition: (f) => f.geometry.coordinates,
    getIcon: () => ({ url: TREE_ICON, width: 32, height: 40, anchorY: 38, mask: true }), sizeUnits: "pixels",
    getSize: (f) => (s.size || 10) * (0.8 + 0.4 * f.properties.tree), getColor: [...s.color, s.alpha],
    updateTriggers: { getColor: th.name, getSize: th.name },
    // zoomed out, trees that would touch are dropped (a stable pseudo-random pick), so woods stay airy at every scale
  }));
  const dots = d.features.filter((f) => f.geometry.type === "Point" && f.properties.dot);
  if (dots.length) out.push(new deck.ScatterplotLayer({ id: lay.id + "-dots", data: dots, getPosition: (f) => f.geometry.coordinates,
    radiusUnits: "pixels", getRadius: s.dot || 2.5, filled: true, getFillColor: [...(th.paper_rgb || [255, 255, 255]), 255],
    stroked: true, getLineColor: [...s.color, s.alpha], lineWidthUnits: "pixels", getLineWidth: 1.3,
    updateTriggers: { getFillColor: th.name, getLineColor: th.name } }));
  const letter = (t, r) => {
    let x = s.caps_rank && r >= s.caps_rank ? t.toLocaleUpperCase() : t;
    if (s.spaced) x = x.split(" ").map((w) => [...w].join("\u2009")).join("\u2002\u2002");
    return x;
  };
  const small = s.min_rank && map && map.getZoom() < s.min_rank[0] ? s.min_rank[1] : 0;   // villages only when zoomed in
  const pts = d.features.filter((f) => f.geometry.type === "Point" && f.properties.name && (f.properties.rank ?? 1) >= small)
    .map((f) => ({ p: f.geometry.coordinates, s: letter(f.properties.name, f.properties.rank ?? 1), a: 0, r: f.properties.rank ?? 1 }));
  if (pts.length && s.collide && map) declutter(pts, s);
  if (pts.length) {
    const lc = s.label_color || s.color;
    for (const r of [...new Set(pts.map((x) => x.r))]) {
      out.push(textLayer(`${lay.id}-lab-${r}`, pts.filter((x) => x.r === r), th,
        { size: s.caps_rank && r >= s.caps_rank ? (s.caps_size || 13) : (s.label_size || 11) + (r - 1) * 2,
          color: [...lc, r >= 2 ? 255 : 225], halo: true, chars: "auto",
          bold: s.label_bold && r >= 3, italic: s.italic && !(s.caps_rank && r >= s.caps_rank) }));
    }
  }
  return out;
}

// ---------------------------------------------------------------- change, pair by pair
// Patches where the radar lost its fingerprint between two passes (time = index of the pair's second date). The engraving is
// scraped off inside them (paper over the hachures) and the bare ground is stippled like scree on an old map. Patches of the
// current pair show; the event's patches stay on afterwards as a scar.
const _gravel = new WeakMap();
function gravel(f, sp) {            // dots ~sp metres apart with a fixed jitter, inside the polygon (holes respected): scanlines
  let pts = _gravel.get(f);
  if (pts) return pts;
  pts = [];
  const g = f.geometry, polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  const rnd = (a) => { const t = Math.sin(a) * 43758.5453; return t - Math.floor(t); };
  for (const rings of polys) {
    let s0 = Infinity, n0 = -Infinity;
    for (const [, y] of rings[0]) { s0 = Math.min(s0, y); n0 = Math.max(n0, y); }
    const dy = sp / 110574, dx = sp / (111320 * Math.cos((s0 + n0) / 2 * Math.PI / 180));
    for (let y = s0 + dy / 2, row = 0; y < n0; y += dy, row++) {
      const xs = [];
      for (const r of rings) for (let k = 0; k < r.length - 1; k++) {
        const [x1, y1] = r[k], [x2, y2] = r[k + 1];
        if ((y1 <= y) !== (y2 <= y)) xs.push(x1 + (y - y1) * (x2 - x1) / (y2 - y1));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.ceil(xs[k] / dx + (row % 2) * 0.5) * dx - (row % 2) * 0.5 * dx; x < xs[k + 1]; x += dx) {
          const h = rnd(x * 7919.3 + y * 104729.7);
          if (h < 0.18) continue;                              // a few gaps: scree, not a screen
          pts.push([x + (rnd(h * 911) - 0.5) * dx * 0.8, y + (rnd(h * 577) - 0.5) * dy * 0.8, rnd(h * 313)]);
        }
      }
    }
  }
  _gravel.set(f, pts);
  return pts;
}

const _soft = new WeakMap();
function softened(f) {               // the radar pixels make a staircase; an engraver would draw a soft edge
  let g = _soft.get(f);
  if (g) return g;
  const cut = (r) => {
    for (let n = 0; n < 2; n++) {
      const o = [];
      for (let k = 0; k < r.length - 1; k++) {
        const [a, b] = [r[k], r[k + 1]];
        o.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
      }
      o.push(o[0]); r = o;
    }
    return r;
  };
  const G = f.geometry;
  g = { type: "Feature", properties: f.properties,
        geometry: { type: G.type, coordinates: G.type === "Polygon" ? G.coordinates.map(cut) : G.type === "MultiPolygon" ? G.coordinates.map((p) => p.map(cut)) : G.coordinates } };
  _soft.set(f, g);
  return g;
}

function changeLayers(lay, d, th) {
  const s = (th.polygons || {})[lay.style] || {}, di = dateIndex(), key = lay.time;
  const feats = d.features.filter((f) => f.properties[key] === di || (f.properties.event && f.properties[key] <= di)).map(softened);
  if (!feats.length) return [];
  const ev = (f) => !!f.properties.event, paper = [...(th.paper_rgb || [255, 255, 255]), 210];
  const dots = [];
  for (const f of feats) for (const q of gravel(f, s.spacing_m || 45)) dots.push([q[0], q[1], q[2], ev(f)]);
  return [
    new deck.GeoJsonLayer({ id: `${lay.id}-erase-${di}`, data: feats, filled: true, stroked: false, getFillColor: s.erase || paper }),
    new deck.ScatterplotLayer({ id: `${lay.id}-gravel-${di}`, data: dots, getPosition: (q) => [q[0], q[1]], radiusUnits: "meters",
      getRadius: (q) => (s.dot_m || 7) * (0.6 + 0.8 * q[2]), radiusMinPixels: 0.45, radiusMaxPixels: 3.2,
      getFillColor: (q) => (q[3] ? s.dot_event || [140, 46, 30, 230] : s.dot || [110, 98, 82, 200]) }),
    new deck.GeoJsonLayer({ id: `${lay.id}-edge-${di}`, data: feats, filled: false, stroked: true, lineWidthUnits: "pixels",
      getLineColor: (f) => (ev(f) ? s.line_event || [110, 36, 24, 255] : s.line || [110, 98, 82, 150]),
      getLineWidth: (f) => (ev(f) ? s.width_event || 1.4 : s.width || 0.6) }),
  ];
}

function dateIndex() {
  let k = 0;
  state.man.dates.forEach((s, i) => { if (dayOf(s) <= state.day + 0.5) k = i; });
  return k;
}

// Engraved tint. The blocks are read as one smooth field (bilinear between block centres) and a family of long
// parallel strokes at 45° is laid over it, as an engraver lays a tone: stroke k only shows where the strength passes
// its own threshold (van der Corput order, so the strokes that show are always evenly spread). Weak ground stays bare
// paper, strong ground is densely hatched; the edge of a patch is smooth, never a staircase of blocks. Diverging ramps
// keep their sign colour; categories take the nearest block's class.
const _hatchCache = new WeakMap();
const vdc = (k) => { let v = 0, b = 0.5; while (k) { if (k & 1) v += b; k >>= 1; b /= 2; } return v; };
function hatchGrid(d) {
  if (d._grid) return d._grid;
  // blocks sit on a metric grid (UTM), so their centres are only nearly regular in lon/lat: index them by the block size
  const lons = d.cells.map((c) => c[0]), lats = d.cells.map((c) => c[1]), mid = (Math.min(...lats) + Math.max(...lats)) / 2;
  const dy = d.cell_km / 111.32, dx = dy / Math.cos(mid * Math.PI / 180);
  const g = { x0: Math.min(...lons), y0: Math.min(...lats), dx, dy, at: new Map() };
  g.nx = Math.round((Math.max(...lons) - g.x0) / g.dx); g.ny = Math.round((Math.max(...lats) - g.y0) / g.dy);
  if (!(g.nx < 2000 && g.ny < 2000)) { g.nx = g.ny = 0; g.at.clear(); return (d._grid = g); }   // not a block grid: draw nothing
  for (const c of d.cells) g.at.set(Math.round((c[0] - g.x0) / g.dx) + "," + Math.round((c[1] - g.y0) / g.dy), c);
  return (d._grid = g);
}
// a smooth wash of tone from the block values: bilinear between block centres, drawn once per date into a bitmap
const _tintCache = new WeakMap();
function tintBitmap(d, key, valueOf, colorOf) {
  if (!colorOf) return tintBitmapRGBA(d, key, valueOf);
  let byKey = _tintCache.get(d);
  if (!byKey) { byKey = new Map(); _tintCache.set(d, byKey); }
  if (byKey.has(key)) return byKey.get(key);
  const g = hatchGrid(d);
  if (!g.nx) return null;
  const W = g.nx + 1, H = g.ny + 1, val = new Float32Array(W * H).fill(NaN);
  for (const [k, c] of g.at) { const [i, j] = k.split(",").map(Number), x = valueOf(c); if (x != null && isFinite(x)) val[j * W + i] = x; }
  const up = Math.max(2, Math.min(10, Math.floor(720 / Math.max(W, H)))), cw = W * up, ch = H * up;
  const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d"), im = ctx.createImageData(cw, ch), px = im.data;
  const at = (i, j) => (i < 0 || j < 0 || i >= W || j >= H ? NaN : val[j * W + i]);
  for (let py = 0; py < ch; py++) {
    const v = H - 0.5 - (py + 0.5) / up, j = Math.floor(v), fv = v - j;
    for (let qx = 0; qx < cw; qx++) {
      const u = (qx + 0.5) / up - 0.5, i = Math.floor(u), fu = u - i;
      let sum = 0, w = 0, x, wt;
      x = at(i, j); wt = (1 - fu) * (1 - fv); if (x === x) { sum += x * wt; w += wt; }
      x = at(i + 1, j); wt = fu * (1 - fv); if (x === x) { sum += x * wt; w += wt; }
      x = at(i, j + 1); wt = (1 - fu) * fv; if (x === x) { sum += x * wt; w += wt; }
      x = at(i + 1, j + 1); wt = fu * fv; if (x === x) { sum += x * wt; w += wt; }
      if (w < 0.35) continue;                                   // the wash ends half a block past the last block
      const k = colorOf(sum / w);
      if (!k || !(k[3] > 0)) continue;
      const o = (py * cw + qx) * 4; px[o] = k[0]; px[o + 1] = k[1]; px[o + 2] = k[2]; px[o + 3] = k[3];
    }
  }
  ctx.putImageData(im, 0, 0);
  const out = { img: cv, bounds: [g.x0 - 0.5 * g.dx, g.y0 - 0.5 * g.dy, g.x0 + (g.nx + 0.5) * g.dx, g.y0 + (g.ny + 0.5) * g.dy] };
  if (byKey.size > 12) byKey.clear();
  byKey.set(key, out);
  return out;
}

function tintBitmapRGBA(d, key, rgbaOf) {             // rgbaOf(cell) -> [r, g, b, a]; channels blended bilinearly
  let byKey = _tintCache.get(d);
  if (!byKey) { byKey = new Map(); _tintCache.set(d, byKey); }
  if (byKey.has(key)) return byKey.get(key);
  const g = hatchGrid(d);
  if (!g.nx) return null;
  const W = g.nx + 1, H = g.ny + 1, val = new Float32Array(W * H * 4).fill(NaN);
  for (const [k, c] of g.at) { const [i, j] = k.split(",").map(Number), x = rgbaOf(c); if (x) for (let q = 0; q < 4; q++) val[(j * W + i) * 4 + q] = x[q] ?? 255; }
  const up = Math.max(2, Math.min(12, Math.floor(720 / Math.max(W, H)))), cw = W * up, ch = H * up;
  const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d"), im = ctx.createImageData(cw, ch), px = im.data;
  for (let py = 0; py < ch; py++) {
    const v = H - 0.5 - (py + 0.5) / up, j = Math.floor(v), fv = v - j;
    for (let qx = 0; qx < cw; qx++) {
      const u = (qx + 0.5) / up - 0.5, i = Math.floor(u), fu = u - i, acc = [0, 0, 0, 0];
      let w = 0;
      for (const [di, dj, wt] of [[0, 0, (1 - fu) * (1 - fv)], [1, 0, fu * (1 - fv)], [0, 1, (1 - fu) * fv], [1, 1, fu * fv]]) {
        const ii = i + di, jj = j + dj;
        if (ii < 0 || jj < 0 || ii >= W || jj >= H || wt <= 0) continue;
        const o = (jj * W + ii) * 4;
        if (val[o] !== val[o]) continue;
        for (let q = 0; q < 4; q++) acc[q] += val[o + q] * wt;
        w += wt;
      }
      if (w < 0.35) continue;
      const o = (py * cw + qx) * 4;
      px[o] = acc[0] / w; px[o + 1] = acc[1] / w; px[o + 2] = acc[2] / w; px[o + 3] = acc[3] / w * Math.min(1, w / 0.6);
    }
  }
  ctx.putImageData(im, 0, 0);
  const out = { img: cv, bounds: [g.x0 - 0.5 * g.dx, g.y0 - 0.5 * g.dy, g.x0 + (g.nx + 0.5) * g.dx, g.y0 + (g.ny + 0.5) * g.dy] };
  if (byKey.size > 12) byKey.clear();
  byKey.set(key, out);
  return out;
}

// how far the ground has moved since the first date, as layer tints: one tone per band, darker = further; down in
// umber, up in slate (two hues apart in lightness too, so they part for colour-blind readers as well)
function depthTint(th) {
  const man = state.man, T0 = th.tint;
  if (!T0 || !layersOf("hachures-time").some((l) => state.visible[l.id])) return null;
  const gl = man.layers.find((l) => l.kind === "cells" && state.data[l.id]?.series === "cum_cm" && state.data[l.id].columns);
  if (!gl) return null;
  const d = state.data[gl.id], ci = d.columns.indexOf("cum_cm"), k = seriesIndex(d), step = tintStep(th);
  if (ci < 0 || k < 0) return null;
  if (d._depthMax == null) {                                    // the darkest band at the deepest 1 % of the last date, not one stray block
    const last = d.cells.map((c) => Math.abs(c[ci]?.at(-1)) || 0).sort((x, y) => x - y);
    d._depthMax = Math.max(step, last[Math.floor(last.length * 0.99)] || 0);
  }
  const K = Math.max(1, Math.round(d._depthMax / step)), [a0, a1] = T0.alpha || [60, 170];
  const tone = (pair, b) => { const t = b / Math.max(K, 4);         // few bands stay mid-tone, so the strokes still show on them
    return [...pair[0].map((x, i) => Math.round(x + (pair[1][i] - x) * t)), Math.round(a0 + (a1 - a0) * t)]; };
  const cache = {};
  const colorOf = (x) => { const b = Math.min(K, Math.floor(Math.abs(x) / step)); if (b < 1) return null;
    const key = (x < 0 ? -b : b); return cache[key] || (cache[key] = tone(x < 0 ? T0.down : T0.up, b)); };
  const bm = tintBitmap(d, ["depth", th.name, k, step].join("|"), (c) => c[ci]?.[k], colorOf);
  return bm && new deck.BitmapLayer({ id: "depth-tint-" + k, image: bm.img, bounds: bm.bounds,
    textureParameters: { [10240]: 9729, [10241]: 9729 } });
}
const tintStep = (th) => state.man?.tint_step ?? th.tint?.step ?? 10;

function hatchCells(d, m, color, th, tkey) {
  const key = [th.name, m.key, tkey].join("|");
  let byKey = _hatchCache.get(d);
  if (!byKey) { byKey = new Map(); _hatchCache.set(d, byKey); }
  if (byKey.has(key)) return byKey.get(key);
  const g = hatchGrid(d), H = th.hatch || {}, per = H.max ?? 6, aMin = H.min ?? 0.3, wBase = H.w ?? 0.85;
  const pal = m.categorical ? (th.categorical[m.categorical] || []) : (th.ramps[m.ramp] || []).map((x) => x[1]);
  const amax = Math.max(1, ...pal.map((c) => c[3] ?? 255));
  const ink = (th.ink.match(/[0-9a-f]{2}/gi) || ["00", "00", "00"]).map((h) => parseInt(h, 16)), inkMix = H.ink ?? 0.3;   // pale ramp colours vanish on paper
  const cell = (i, j) => g.at.get(i + "," + j);
  const sample = (u, v) => {                                  // u, v in block units -> [r, g, b, strength 0..1] or null
    if (m.categorical) { const c = cell(Math.round(u), Math.round(v)); if (!c) return null; const k = color(c); return [k[0], k[1], k[2], Math.min(1, (k[3] ?? 0) / amax)]; }
    const i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j;
    let s = 0, w = 0;
    for (const [di, dj, wt] of [[0, 0, (1 - fu) * (1 - fv)], [1, 0, fu * (1 - fv)], [0, 1, (1 - fu) * fv], [1, 1, fu * fv]]) {
      const c = cell(i + di, j + dj), x = c && cellValue(d, m, c);
      if (x != null && isFinite(x) && wt > 0) { s += x * wt; w += wt; }
    }
    if (w < 0.35) return null;                                // the field ends half a block past the last block
    const k = ramp(th.ramps[m.ramp], s / w);
    return [k[0], k[1], k[2], Math.min(1, (k[3] ?? 0) / amax)];
  };
  const out = [], ds = 0.2, ks = Math.ceil((g.nx + g.ny + 2) * per);
  for (let k = 0; k <= ks; k++) {                             // stroke k: u - v = c
    const c = -g.ny - 1 + k / per, need = aMin + (1 - aMin) * vdc(k % 64) * 0.999;
    let run = null, col = null;
    const flush = () => { if (run && run.length > 1) out.push({ p: run, c: [...col.map((x, i) => Math.round(x * (1 - inkMix) + ink[i] * inkMix)), 240], w: wBase }); run = null; };
    for (let u = Math.max(-0.5, c - 0.5); u <= Math.min(g.nx + 0.5, g.ny + 0.5 + c); u += ds) {
      const v = u - c, smp = sample(u, v), on = smp && smp[3] >= need;
      const same = on && col && smp[0] === col[0] && smp[1] === col[1] && smp[2] === col[2];
      if (!on) { flush(); continue; }
      const pt = [g.x0 + u * g.dx, g.y0 + v * g.dy];
      if (run && (m.categorical ? same : true)) { run.push(pt); col = smp.slice(0, 3); }
      else { flush(); run = [pt]; col = smp.slice(0, 3); }
    }
    flush();
  }
  if (byKey.size > 40) byKey.clear();
  byKey.set(key, out);
  return out;
}

function buildLayers() {
  const th = state.theme, man = state.man, L = [];
  if (!man) return L;
  const order = { cells: 0, "hachures-static": 1, lines: 1.2, contours: 1.5, polygons: 2, "hachures-time": 3, card: 4 };   // cells under strokes
  const zOf = (l) => l.z ?? order[l.kind] ?? 2;
  const story = man.layers.some((l) => state.visible[l.id] && (l.kind === "hachures-time" || l.kind === "cells"));
  const quiet = story ? th.quiet ?? 0.5 : 1;
  const tint = depthTint(th);
  if (tint) L.push(tint);
  for (const lay of [...man.layers].sort((a, b) => zOf(a) - zOf(b))) {
    if (!state.visible[lay.id]) continue;
    const d = state.data[lay.id];
    if (!d) continue;
    const from = L.length;
    if (lay.kind === "hachures-static") {
      const c = th.terrain;
      L.push(new deck.PathLayer({ id: lay.id, data: d.features, widthUnits: "pixels", capRounded: true,
        getPath: (f) => f.geometry.coordinates, getColor: [...c.color, c.alpha],
        getWidth: (f) => c.w_min + (c.w_max - c.w_min) * f.properties.dark,
        updateTriggers: { getColor: th.name, getWidth: th.name } }));
    } else if (lay.kind === "hachures-time") {
      // wedge strokes: each stroke (oriented high -> low by the engine) is cut into pieces that thin out downhill;
      // weak strokes keep every other piece, so they read as dashed ("not sure"), not as a bad print
      const c = th.velocity, pieces = wedgePieces(d, state.trust, taperBottom(th));
      L.push(new deck.TripsLayer({ id: lay.id, data: pieces, widthUnits: "pixels", capRounded: false, jointRounded: true,
        getPath: (p) => p.path, getTimestamps: (p) => p.t,
        getColor: (p) => [...(p.up ? c.color_up || c.color : c.color), p.trust === "strong" || state.trust === "all" ? 255 : c.alpha.weak_dashed ?? 210],
        getWidth: (p) => (c.w_min + (c.w_max - c.w_min) * p.dark) * p.k,
        currentTime: state.day + 0.01, trailLength: 1e6, fadeTrail: false,
        updateTriggers: { getColor: [th.name, state.trust], getWidth: [th.name, taperBottom(th)] } }));
      const h = man.stats.velocity?.headline;
      if (h && h.lon != null) {
        L.push(new deck.ScatterplotLayer({ id: "headline-dot", data: [h], getPosition: (x) => [x.lon, x.lat],
          radiusUnits: "pixels", getRadius: 4, filled: true, stroked: true, getFillColor: [...th.paper_rgb || [255, 255, 255], 255],
          getLineColor: [...c.color, 255], lineWidthUnits: "pixels", getLineWidth: 2 }));
        L.push(textLayer("headline-text", [{ p: [h.lon, h.lat], s: `${h.rate_cm_yr} ± ${h.sigma_cm_yr} ${T("cm_yr")}`, a: 0 }],
          th, { size: 13, offset: [0, -16], color: [...c.color, 255], bold: true }));
      }
    } else if (lay.kind === "contours") {
      const c = th.contours || { color: [0, 0, 0], alpha: 140, w: 0.5, w_major: 1, label_size: 11 };
      const di = dateIndex(), stepC = th.tint && tint ? tintStep(th) : 0;
      const lines = d.features.filter((f) => f.properties.d === di && (!stepC || Math.abs(f.properties.level_cm) % stepC === 0));
      L.push(new deck.PathLayer({ id: lay.id + "-" + di, data: lines, widthUnits: "pixels",
        getPath: (f) => f.geometry.coordinates, getColor: [...c.color, c.alpha],
        getWidth: (f) => (f.properties.major || stepC ? c.w_major : c.w) }));
      const labels = lines.filter((f) => (f.properties.major || stepC) && f.geometry.coordinates.length >= 12).map((f) => {
        const q = f.geometry.coordinates, m = Math.floor(q.length / 2), a = q[m - 2], b = q[m + 2];
        let ang = Math.atan2(b[1] - a[1], (b[0] - a[0]) * Math.cos(q[m][1] * Math.PI / 180)) * 180 / Math.PI;
        if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
        return { p: q[m], s: `${f.properties.level_cm > 0 ? "+" : "−"}${Math.abs(f.properties.level_cm)} ${T("cm")}`, a: ang };
      });
      L.push(textLayer(lay.id + "-lab-" + di, labels, th, { size: c.label_size, color: [...c.color, 255], halo: true }));
    } else if (lay.kind === "cells") {
      const m = modeOf(lay);
      if (!m) continue;
      const half = d.cell_km / 2 / 111.32;
      const color = m.categorical ? ((c) => (th.categorical[m.categorical] || [])[cellValue(d, m, c)] || [0, 0, 0, 0])
                                  : ((c) => ramp(th.ramps[m.ramp], cellValue(d, m, c)));
      const tkey = m.time ? seriesIndex(d) : 0;
      if (th.cells_as === "squares") {
        L.push(new deck.PolygonLayer({ id: lay.id + "-" + m.key, data: d.cells, stroked: false, pickable: false,
          getPolygon: (c) => { const k = half / Math.cos(c[1] * Math.PI / 180);
            return [[c[0] - k, c[1] - half], [c[0] + k, c[1] - half], [c[0] + k, c[1] + half], [c[0] - k, c[1] + half]]; },
          getFillColor: color, updateTriggers: { getFillColor: [th.name, m.key, tkey] } }));
      } else if (th.cells_as === "tint") {
        const bm = m.categorical ? tintBitmap(d, [th.name, m.key, tkey, "rgba"].join("|"), (c) => { const k = color(c); return k && k[3] > 0 ? k : [k[0], k[1], k[2], 0]; }, null)
                                 : tintBitmap(d, [th.name, m.key, tkey].join("|"), (c) => cellValue(d, m, c), (x) => ramp(th.ramps[m.ramp], x));
        if (bm) L.push(new deck.BitmapLayer({ id: lay.id + "-" + m.key + "-t" + tkey, image: bm.img, bounds: bm.bounds, opacity: th.tint?.cells_opacity ?? 1,
          textureParameters: { [10240]: 9729, [10241]: 9729 } }));
        else L.push(new deck.PathLayer({ id: lay.id + "-" + m.key + "-h", data: hatchCells(d, m, color, th, tkey),
          widthUnits: "pixels", capRounded: true, getPath: (h) => h.p, getColor: (h) => h.c, getWidth: (h) => h.w,
          updateTriggers: { getColor: [th.name, m.key, tkey] } }));
      } else if (th.cells_as !== "dots") {
        L.push(new deck.PathLayer({ id: lay.id + "-" + m.key + "-h", data: hatchCells(d, m, color, th, tkey),
          widthUnits: "pixels", capRounded: true, getPath: (h) => h.p, getColor: (h) => h.c, getWidth: (h) => h.w,
          updateTriggers: { getColor: [th.name, m.key, tkey] } }));
      } else {
        // stipple, the engraver's way to lay a tone: one dot per block, its size carries the strength (the ramp's own
        // alpha), the ink stays solid; weak or neutral blocks leave the paper bare instead of a pale square
        const pal = m.categorical ? (th.categorical[m.categorical] || []) : (th.ramps[m.ramp] || []).map((x) => x[1]);
        const amax = Math.max(1, ...pal.map((c) => c[3] ?? 255)), rMax = d.cell_km * 1000 / 2 * 0.96;
        L.push(new deck.ScatterplotLayer({ id: lay.id + "-" + m.key, data: d.cells, pickable: false, radiusUnits: "meters",
          getPosition: (c) => [c[0], c[1]],
          getRadius: (c) => { const a = (color(c)[3] ?? 0) / amax; return a <= 0.05 ? 0 : rMax * Math.min(1, a); },
          getFillColor: (c) => { const k = color(c), a = Math.min(1, (k[3] ?? 0) / amax);
            return [k[0], k[1], k[2], Math.round((th.cells_alpha ?? 220) * (0.45 + 0.55 * a))]; },
          updateTriggers: { getFillColor: [th.name, m.key, tkey], getRadius: [th.name, m.key, tkey] } }));
      }
    } else if (lay.kind === "image") {
      // a white+alpha raster (town blocks) tinted with the theme ink; crisp cells up close, a tone when zoomed out
      const s = (th.lines || {})[lay.style] || { color: [0, 0, 0], alpha: 120 };
      L.push(new deck.BitmapLayer({ id: lay.id, image: d.img, bounds: lay.bounds, tintColor: s.color,
        opacity: (s.alpha ?? 120) / 255 * zoomFade(s.zoom_fade), textureParameters: { [10240]: 9728, [10241]: 9729 } }));   // crisp cells up close; no mipmaps here, so plain linear
    } else if (lay.kind === "lines") {
      L.push(...linesLayers(lay, d, th));
    } else if (lay.kind === "polygons" && lay.time) {
      L.push(...changeLayers(lay, d, th));
    } else if (lay.kind === "polygons") {
      const s = (th.polygons || {})[lay.style] || { fill: [0, 0, 0, 40], line: [0, 0, 0, 255], width: 1 };
      L.push(new deck.GeoJsonLayer({ id: lay.id, data: d, filled: true, stroked: true, pointType: "circle",
        lineWidthUnits: "pixels", pointRadiusUnits: "pixels", getPointRadius: 5,
        getFillColor: (f) => (f.geometry.type === "Point" ? s.point || s.line : s.fill),
        getLineColor: s.line,
        getLineWidth: (f) => (f.properties.part === "top_edge" ? s.edge_width || s.width * 2 : s.width),
        updateTriggers: { getFillColor: th.name, getLineColor: th.name, getLineWidth: th.name } }));
    }
    if (quiet < 1 && ["hachures-static", "lines", "image"].includes(lay.kind) && !lay.loud) {
      for (let i = from; i < L.length; i++) if (!(L[i] instanceof deck.TextLayer)) L[i] = L[i].clone({ opacity: (L[i].props.opacity ?? 1) * quiet });
    }
  }
  if (layersOf("surface").some((l) => state.visible[l.id])) {
    if (state.section) L.push(...sectionMapLayers(th));
    if (state.pending) L.push(pendingLayer(th));
  }
  const gn = (man.anchor?.gnss || []).filter((g) => g.lon != null);
  if (gn.length && layersOf("hachures-time").some((l) => state.visible[l.id])) {
    const gc = th.contours?.color || [0, 0, 0];
    L.push(new deck.ScatterplotLayer({ id: "gnss", data: gn, getPosition: (g) => [g.lon, g.lat], radiusUnits: "pixels",
      getRadius: 4, filled: true, getFillColor: [...(th.paper_rgb || [255, 255, 255]), 255], stroked: true,
      getLineColor: [...gc, 255], lineWidthUnits: "pixels", getLineWidth: 1.5 }));
    L.push(textLayer("gnss-lab", gn.map((g) => ({ p: [g.lon, g.lat], s: `${g.station} GPS`, a: 0 })), th,
      { size: 11, offset: [0, 14], color: [...gc, 255], halo: true, chars: "auto" }));
  }
  L.push(...scoreMapLayers(th));
  if (state.point) {
    L.push(new deck.ScatterplotLayer({ id: "point", data: [state.point.cell], getPosition: (c) => [c[0], c[1]],
      radiusUnits: "pixels", getRadius: 6, stroked: true, filled: false, lineWidthUnits: "pixels", getLineWidth: 2,
      getLineColor: [...th.velocity.color, 255] }));
  }
  return [...L.filter((l) => !(l instanceof deck.TextLayer)), ...L.filter((l) => l instanceof deck.TextLayer)];   // words on top
}

function redraw() { overlay && overlay.setProps({ layers: buildLayers() }); }

// ---------------------------------------------------------------- panel
function renderCard() {
  const lay = layersOf("card")[0], el = $("card");
  if (!lay || !state.data[lay.id]) { el.classList.add("hidden"); return; }
  const c = state.data[lay.id], e = c.estimate;
  const rows = Object.entries(e).map(([k, v]) => `<tr><td>${T(k)}</td><td>${v}${["strike", "dip", "rake"].includes(k) ? "°" : ""}</td></tr>`).join("");
  let ref = "";
  if (c.reference) {
    const r = c.reference;
    ref = `<div class="small" style="margin-top:6px">${T("ref")}: ${r.source} Mw ${r.Mw}, ${T("strike")} ${r.plane[0]}°,
      ${T("dip")} ${r.plane[1]}°, ${T("rake")} ${r.plane[2]}° · Δ${T("strike")} ${r.d_strike}°, Δ${T("dip")} ${r.d_dip}°</div>`;
  }
  const sp = c.spread ? `<div class="small">${T("runs").replace("{a}", c.spread.runs_agreeing).replace("{n}", c.spread.runs)} ·
      ${T("dip")} ${c.spread.dip[0]}–${c.spread.dip[1]}°,
      Mw ${c.spread.Mw[0]}–${c.spread.Mw[1]}</div>` : "";
  el.innerHTML = `<h2>${c.event}${c.date ? " · " + c.date : ""}</h2>
    <div class="flag ${c.confident ? "" : "no"}">${c.confident ? T("confident") : T("not_confident")}</div>
    <div class="small">${T("conf_line").replace("{c}", c.confidence).replace("{t}", c.threshold)} · ${T("resid")} ${c.relative_residual}</div>
    ${sp}<table>${rows}</table>${ref}<div class="small" style="margin-top:6px">${c.method}</div>`;
  el.classList.remove("hidden");
}

function renderLayerControls() {
  const box = $("layers"); box.innerHTML = "";
  const groups = new Set();
  for (const lay of state.man.layers.filter((l) => l.kind !== "card" && l.kind !== "elevation")) {
    if (lay.group) {                                    // a group (e.g. "city") is one switch for all its layers
      if (groups.has(lay.group)) continue;
      groups.add(lay.group);
      const members = state.man.layers.filter((l) => l.group === lay.group);
      const open = state.open[lay.group];
      const lab = document.createElement("label");
      lab.innerHTML = `<span><a href="#" class="twisty">${open ? "▾" : "▸"}</a> ${label(lay.group_label || lay.group)}</span>`;
      lab.querySelector(".twisty").onclick = (e) => { e.preventDefault(); state.open[lay.group] = !open; renderLayerControls(); };
      const cb = document.createElement("input"); cb.type = "checkbox";
      const on = members.filter((l) => state.visible[l.id]).length;
      cb.checked = on > 0; cb.indeterminate = on > 0 && on < members.length;
      cb.onchange = () => { members.forEach((l) => { state.visible[l.id] = cb.checked; }); renderLayerControls(); renderLegend(); redraw(); };
      lab.appendChild(cb); box.appendChild(lab);
      if (open) for (const m of members) {
        const sl = document.createElement("label"); sl.className = "sub";
        sl.innerHTML = `<span>${label(m.label)}</span>`;
        const sc = document.createElement("input"); sc.type = "checkbox"; sc.checked = !!state.visible[m.id];
        sc.onchange = () => { state.visible[m.id] = sc.checked; renderLayerControls(); renderLegend(); redraw(); };
        sl.appendChild(sc); box.appendChild(sl);
      }
      continue;
    }
    const lab = document.createElement("label");
    lab.innerHTML = `<span>${label(lay.label)}</span>`;
    const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = state.visible[lay.id];
    cb.onchange = () => { state.visible[lay.id] = cb.checked; renderLegend(); syncTimebox(); renderSection(); renderScore(); redraw(); };
    lab.appendChild(cb); box.appendChild(lab);
    const d = state.data[lay.id];
    if (lay.kind === "cells" && d?.modes?.length) {
      const row = document.createElement("div"); row.className = "row sub";
      const sel = document.createElement("select");
      sel.add(new Option(T("off"), ""));
      d.modes.forEach((m) => sel.add(new Option(label(m.label), m.key)));
      sel.value = state.mode[lay.id] || "";
      sel.onchange = () => { state.mode[lay.id] = sel.value; renderLegend(); syncTimebox(); redraw(); };
      row.appendChild(document.createElement("span")); row.appendChild(sel); box.appendChild(row);
    }
  }
}

function renderLegend() {
  const th = state.theme, man = state.man, out = [];
  if (layersOf("hachures-time").some((l) => state.visible[l.id])) {
    const c = th.velocity, st = man.stats.velocity || {}, col = rgba([...c.color, 255]);
    const flip = taperBottom(th) ? ` transform="translate(34,0) scale(-1,1)"` : "";
    const wedge = (dashed) => `<svg width="34" height="10" viewBox="0 0 34 10"><g${flip}>` +
      (dashed ? `<polygon points="1,2.5 11,3.4 11,6.6 1,7.5" fill="${col}"/><polygon points="19,4 27,4.5 27,5.5 19,6" fill="${col}"/>`
              : `<polygon points="1,2 33,4.6 33,5.4 1,8" fill="${col}"/>`) + `</g></svg>`;
    const h = st.headline;
    if (h && h.rate_cm_yr != null) out.push(`<div style="margin-bottom:6px">${T("headline").replace("{r}", h.rate_cm_yr)
      .replace("{s}", h.sigma_cm_yr).replace("{b}", h.at_least_cm_yr).replace("{p}", h.p1_cm_yr)}</div>`);
    out.push(`<div class="legend-item">${wedge(false)}<span>${T(taperBottom(th) ? "lg_wedge_drop" : "lg_wedge")}</span></div>
      <div class="legend-item">${wedge(false)}<span>${T("lg_solid")}</span></div>
      <div class="legend-item">${wedge(true)}<span>${T("lg_dashed")}</span></div>
      <div class="legend-item"><span class="swatch" style="border-top:1px dotted ${th.muted}"></span>${T("hidden")}</div>
      <div class="small">${T("lg_dense")} · ${T("stroke").replace("{b}", st.band_cm ?? "?")}</div>`);
  }
  const tintOn = th.tint && layersOf("hachures-time").some((l) => state.visible[l.id]) &&
    man.layers.some((l) => l.kind === "cells" && state.data[l.id]?.series === "cum_cm");
  if (tintOn) {
    const bands = (pair) => [0, 1, 2, 3].map((b) => { const t = b / 3, a = th.tint.alpha || [60, 170];
      return `<span style="display:inline-block;width:9px;height:10px;background:${rgba([...pair[0].map((x, i) => x + (pair[1][i] - x) * t), a[0] + (a[1] - a[0]) * t])}"></span>`; }).join("");
    out.push(`<div class="legend-item"><span style="display:inline-flex;margin-right:6px">${bands(th.tint.down)}</span>${T("lg_tint_down")}</div>` +
      `<div class="legend-item"><span style="display:inline-flex;margin-right:6px">${bands(th.tint.up)}</span>${T("lg_tint_up")}</div>`);
  }
  for (const lay of layersOf("contours")) {
    if (!state.visible[lay.id]) continue;
    const c = th.contours || { color: [0, 0, 0], alpha: 140 };
    out.push(`<div class="legend-item"><span class="swatch" style="border-top:1px solid ${rgba([...c.color, c.alpha])}"></span>${T("lg_contour").replace("{s}", tintOn ? tintStep(th) : lay.step_cm ?? 5)}</div>`);
  }
  for (const lay of layersOf("cells")) {
    const m = modeOf(lay);
    if (!state.visible[lay.id] || !m) continue;
    const d = state.data[lay.id];
    if (m.categorical) {
      const cols = th.categorical[m.categorical] || [];
      out.push(`<div class="small">${label(lay.label)}: ${label(m.label)}</div>` + cols.map((c, i) =>
        `<div class="legend-item"><span class="box" style="background:${rgba(c)}"></span>${m.names?.[i] ? label(m.names[i]) : `${T("type")} ${i + 1}`}` +
        (d.cluster_sizes ? ` · ${d.cluster_sizes[i]} ${T("blocks")}` : "") + `</div>`).join(""));
    } else {
      const stops = th.ramps[m.ramp] || [];
      const lo = stops[0][0], hi = stops.at(-1)[0];
      const grad = stops.map(([v, c]) => `${rgba(c)} ${((v - lo) / (hi - lo) * 100).toFixed(0)}%`).join(",");
      out.push(`<div class="small">${label(lay.label)}: ${label(m.label)}</div>
        <div class="ramp" style="background:linear-gradient(90deg,${grad})"></div>
        <div class="ramp-labels"><span>${lo}</span><span>${hi}</span></div>`);
    }
  }
  for (const lay of layersOf("polygons")) {
    if (!state.visible[lay.id]) continue;
    const s = (th.polygons || {})[lay.style] || {};
    if (lay.time) {
      const sw = (dot, line) => `<svg width="34" height="12"><rect x="1" y="1" width="32" height="10" rx="4" fill="${rgba(s.erase || [255, 255, 255, 200])}" stroke="${rgba(line)}" stroke-width="0.8"/>` +
        [[5, 4], [9, 8], [13, 5], [17, 8], [21, 4], [25, 7], [29, 5], [7, 6], [19, 6], [27, 9]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" fill="${rgba(dot)}"/>`).join("") + `</svg>`;
      out.push(`<div class="legend-item">${sw(s.dot || [110, 98, 82, 200], s.line || [110, 98, 82, 150])}<span>${T("lg_change")}</span></div>` +
        `<div class="legend-item">${sw(s.dot_event || [140, 46, 30, 230], s.line_event || [110, 36, 24, 255])}<span>${T("lg_change_event")}</span></div>`);
      continue;
    }
    out.push(`<div class="legend-item"><span class="box" style="background:${rgba(s.fill || [0, 0, 0, 40])};border-color:${rgba(s.line || [0, 0, 0])}"></span>${label(lay.label)}</div>`);
  }
  const attrib = new Set();
  for (const lay of [...layersOf("image"), ...layersOf("lines")]) {
    if (!state.visible[lay.id]) continue;
    const s = (th.lines || {})[lay.style] || { color: [0, 0, 0], alpha: 200, width: 1 };
    if (s.legend === false) continue;
    const dash = s.dash ? `stroke-dasharray="${s.dash.join(",")}"` : "";
    const paperC = th.paper;
    const sw = s.fade ? `<svg width="34" height="10"><line x1="0" y1="2" x2="34" y2="2" stroke="${rgba([...s.color, s.alpha])}" stroke-width="${s.width}"/>` +
      `<line x1="0" y1="6" x2="34" y2="6" stroke="${rgba([...s.color, s.alpha * 0.6])}" stroke-width="${s.width * 0.8}"/>` +
      `<line x1="0" y1="9.5" x2="34" y2="9.5" stroke="${rgba([...s.color, s.alpha * 0.35])}" stroke-width="${s.width * 0.6}"/></svg>`
      : s.size ? `<svg width="34" height="12" viewBox="0 0 34 12"><g transform="translate(13,0) scale(0.3)"><image href="${TREE_ICON}" width="32" height="40"/></g></svg>`
      : s.blocks ? `<svg width="34" height="10">` + [[0, 0, 9, 4], [11, 0, 7, 4], [20, 0, 14, 4], [0, 6, 5, 4], [7, 6, 13, 4], [22, 6, 12, 4]]
          .map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${rgba([...s.color, s.alpha])}"/>`).join("") + `</svg>`
      : s.hatch ? `<svg width="34" height="10"><rect x="0.5" y="0.5" width="33" height="9" fill="none" stroke="${rgba([...s.color, s.alpha])}" stroke-width="0.4"/>` +
          [0, 6, 12, 18, 24, 30].map((x) => `<line x1="${x}" y1="10" x2="${x + 9}" y2="0" stroke="${rgba([...s.color, Math.min(255, s.alpha * 2)])}" stroke-width="${s.width}"/>`).join("") + `</svg>`
      : s.dot ? `<svg width="34" height="10"><circle cx="17" cy="5" r="${s.dot}" fill="${paperC}" stroke="${rgba([...s.color, s.alpha])}" stroke-width="1.3"/></svg>`
      : s.zebra ? `<svg width="34" height="10"><line x1="0" y1="5" x2="34" y2="5" stroke="${rgba([...s.color, s.alpha])}" stroke-width="${s.width}"/>` +
          `<line x1="0" y1="5" x2="34" y2="5" stroke="${paperC}" stroke-width="${Math.max(1, s.width - 2)}" stroke-dasharray="${s.zebra.join(",")}"/></svg>`
      : `<svg width="34" height="10"><line x1="0" y1="5" x2="34" y2="5" stroke="${rgba([...s.color, s.alpha])}" stroke-width="${Math.min(s.width, 4)}" ${dash}/></svg>`;
    out.push(`<div class="legend-item">${sw}<span>${label(lay.label)}</span></div>` +
      (lay.note ? `<div class="small">${label(lay.note)}</div>` : ""));
    if (lay.attribution) attrib.add(lay.attribution);
  }
  if (attrib.size) out.push(`<div class="small">${[...attrib].join(" · ")}</div>`);
  if (layersOf("cells").some((l) => state.data[l.id]?.series)) out.push(`<div class="small">${T("click")}</div>`);
  $("legend").innerHTML = out.join("");
}

function renderStats() {
  if (q.get("debug") !== "1") { $("stats").innerHTML = ""; return; }      // build numbers are for the team, not the reader
  const man = state.man, st = man.stats || {}, parts = [];
  if (st.velocity) parts.push(`strokes ${st.velocity.strokes} · ` +
    Object.entries(st.velocity.trust || {}).map(([k, v]) => `${k} ${v}`).join(", "));
  if (st.fields) parts.push(`${st.fields.cells} ${T("blocks")}`);
  if (st.footprint) parts.push(`${T("event")} ${st.footprint.event_date} · ${T("largest")} ${st.footprint.largest_km2} ${T("km2")} · ` +
    `${T("false_alarm")}: ` + st.footprint.false_alarm_check.map((c) => `${c.largest_km2} ${T("km2")}`).join(", "));
  parts.push(`engine v${man.engine_version}`);
  $("stats").innerHTML = parts.join(" · ") + (man.notes?.length ? `<details><summary>${T("notes")}</summary>${man.notes.join("<br>")}</details>` : "");
}

function renderPanel() {
  const man = state.man;
  $("title").textContent = label(man.title);
  const span = man.dates.length ? ` · ${man.dates[0]} → ${man.dates.at(-1)} · ${man.n_pairs} ${T("pairs")}` : "";
  $("subtitle").textContent = (man.subtitle || "") + span;
  const a = $("anchor"), gn = (man.anchor.gnss || []).filter((g) => g.nisar_cm_yr != null);
  const chk = gn.map((g) => `${g.station}: NISAR ${g.nisar_cm_yr.toFixed(1)} / GNSS ${g.rate_cm_yr.toFixed(1)} cm/yr`).join("; ");
  a.className = "badge " + (man.anchor.type === "radar-only" ? "radar" : "tied");
  a.textContent = (man.anchor.type === "radar-only" ? T("radar_only") : T("tied")) + (chk ? ` · ${chk}` : "");
  renderCard(); renderLayerControls(); renderLegend(); renderStats(); syncTimebox(); renderSection(); renderScore();
  $("point").classList.add("hidden");
}

function syncTimebox() {
  const on = needsTime() && state.man.dates.length > 1;
  $("timebox").classList.toggle("hidden", !on);
  $("trustbox").classList.toggle("hidden", !layersOf("hachures-time").length);
}

// ---------------------------------------------------------------- click: the curve of one cell
function sparkline(d, series, extra, unit) {
  const th = state.theme, W = 260, H = 80;
  const days = d.dates.map(dayOf), all = [...series, ...(extra || [])].filter((v) => v != null && isFinite(v));
  const zero = unit === "cm";
  const lo = Math.min(...all, ...(zero ? [0] : [])), hi = Math.max(...all, ...(zero ? [0] : []));
  const span = Math.max(1, days.at(-1) - days[0]);
  const X = (t) => 4 + (W - 8) * (t - days[0]) / span, Y = (v) => 6 + (H - 12) * (hi - v) / (hi - lo || 1);
  const line = (vals) => vals.map((v, i) => (v != null && isFinite(v) ? `${X(days[i]).toFixed(1)},${Y(v).toFixed(1)}` : null)).filter(Boolean).join(" ");
  const col = `rgb(${th.velocity.color.join(",")})`;
  return `<svg viewBox="0 0 ${W} ${H}">` + (zero ? `<line x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}" stroke="${th.muted}" stroke-width="0.5"/>` : "") +
    (extra ? `<polyline fill="none" stroke="${th.muted}" stroke-width="1.2" stroke-dasharray="3,2" points="${line(extra)}"/>` : "") +
    `<polyline fill="none" stroke="${col}" stroke-width="1.6" points="${line(series)}"/>
    <line id="tcur" data-x0="${days[0]}" data-span="${span}" x1="${X(state.day)}" x2="${X(state.day)}" y1="0" y2="${H}" stroke="${th.muted}" stroke-dasharray="2,2"/></svg>`;
}

function showPoint(p) {
  const { lay, cell } = p, d = state.data[lay.id], el = $("point");
  const vals = d.columns.map((k, i) => [k, cell[i]]).filter(([k, v]) => !["lon", "lat"].includes(k) && k !== d.series);
  const fmt = (k, v) => (k === "cluster" ? `${T("type")} ${v + 1}` : k === "segments" ? v : typeof v === "number" ? v.toFixed(2).replace(/\.?0+$/, "") : v);
  let html = `<div class="small">${label(lay.label)} · ${cell[1].toFixed(4)}, ${cell[0].toFixed(4)}</div>` +
    vals.map(([k, v]) => `<div class="row"><span>${T(k)}</span><b>${v == null ? "?" : fmt(k, v)}</b></div>`).join("");
  if (d.series) {
    const s = cell[d.columns.indexOf(d.series)];
    const ci = d.columns.indexOf("cluster"), extra = ci >= 0 && d.cluster_curves ? d.cluster_curves[cell[ci]] : null;
    html += sparkline(d, s, extra, d.series_unit) +
      `<div class="small">${T("cell_series")} (${d.series_unit})${extra ? ` · - - ${T("type_curve")}` : ""} · ${d.dates[0]} → ${d.dates.at(-1)}</div>`;
  }
  el.innerHTML = html; el.classList.remove("hidden");
}

function nearestCell(lon, lat) {
  const k = Math.cos(lat * Math.PI / 180);
  const cands = layersOf("cells").filter((l) => state.visible[l.id]);
  cands.sort((a, b) => (modeOf(b) ? 1 : 0) - (modeOf(a) ? 1 : 0));     // coloured layers first
  for (const lay of cands) {
    const d = state.data[lay.id]; let best = null, bd = Infinity;
    for (const c of d.cells) { const dd = ((c[0] - lon) * k) ** 2 + (c[1] - lat) ** 2; if (dd < bd) { bd = dd; best = c; } }
    if (Math.sqrt(bd) * 111.32 <= d.cell_km) return { lay, cell: best };
  }
  return null;
}

// ---------------------------------------------------------------- cross-section ("розріз")
// The surface layer is the same smoothed field the strokes are drawn from, so the cut agrees with the map.
function surfaceData() { const l = layersOf("surface")[0]; return l ? state.data[l.id] : null; }

function sampleSurface(S, frame, lon, lat) {
  const fx = (lon - S.lon0) / S.dlon, fy = (lat - S.lat0) / S.dlat;
  const c0 = Math.floor(fx), r0 = Math.floor(fy);
  if (c0 < 0 || r0 < 0 || c0 >= S.nx - 1 || r0 >= S.ny - 1) return null;
  const tx = fx - c0, ty = fy - r0, at = (r, c) => frame[r * S.nx + c];
  const v = [at(r0, c0), at(r0, c0 + 1), at(r0 + 1, c0), at(r0 + 1, c0 + 1)];
  const w = [(1 - tx) * (1 - ty), tx * (1 - ty), (1 - tx) * ty, tx * ty];
  let sw = 0, sv = 0;
  v.forEach((x, i) => { if (x != null) { sw += w[i]; sv += w[i] * x; } });
  return sw >= 0.5 ? sv / sw : null;                    // need most of the neighbourhood, else a gap
}

function kmBetween(a, b) {
  const k = Math.cos((a[1] + b[1]) / 2 * Math.PI / 180);
  return Math.hypot((b[0] - a[0]) * 111.32 * k, (b[1] - a[1]) * 111.32);
}

function sectionMapLayers(th) {
  const c = th.contours?.color || [0, 0, 0], [a, b] = state.section;
  return [new deck.PathLayer({ id: "section-line", data: [[a, b]], getPath: (x) => x, widthUnits: "pixels", getWidth: 1.8,
            getColor: [...c, 230] }),
          new deck.ScatterplotLayer({ id: "section-ends", data: [a, b], getPosition: (x) => x, radiusUnits: "pixels", getRadius: 3.5,
            getFillColor: [...c, 255] }),
          textLayer("section-ab", [{ p: a, s: "A", a: 0 }, { p: b, s: "B", a: 0 }], th,
            { size: 15, offset: [0, -15], color: [...c, 255], bold: true })];
}

function pendingLayer(th) {
  const c = th.contours?.color || [0, 0, 0];
  return new deck.ScatterplotLayer({ id: "section-pending", data: [state.pending], getPosition: (x) => x, radiusUnits: "pixels",
    getRadius: 4, getFillColor: [...c, 255] });
}

function pathD(xs, vals, X, Y) {
  let d = "", pen = false;
  vals.forEach((v, k) => { if (v == null) { pen = false; return; } d += `${pen ? "L" : "M"}${X(xs[k]).toFixed(1)},${Y(v).toFixed(1)}`; pen = true; });
  return d;
}

function runs(vals, ok) {          // index runs where ok(k) holds
  const out = []; let seg = [];
  vals.forEach((_, k) => { if (ok(k)) seg.push(k); else { if (seg.length > 1) out.push(seg); seg = []; } });
  if (seg.length > 1) out.push(seg);
  return out;
}

// ---- scanner: the cut slides along its normal; block diagram: stacked W-E profiles, back = north
function scanFrame(base) {          // unit normal (left of A->B) in km, and km->degree factors
  const [A, B] = base, kx = 111.32 * Math.cos((A[1] + B[1]) / 2 * Math.PI / 180), ky = 111.32;
  const dx = (B[0] - A[0]) * kx, dy = (B[1] - A[1]) * ky, L = Math.hypot(dx, dy) || 1;
  return { nx: -dy / L, ny: dx / L, kx, ky };
}

function applyScan() {
  if (!state.secBase) return;
  const f = scanFrame(state.secBase), km = state.scanKm;
  state.section = state.secBase.map((P) => [P[0] + f.nx * km / f.kx, P[1] + f.ny * km / f.ky]);
}

function scanRange(S) {
  const f = scanFrame(state.secBase), A = state.secBase[0];
  const lon1 = S.lon0 + (S.nx - 1) * S.dlon, lat1 = S.lat0 + (S.ny - 1) * S.dlat;
  const d = [[S.lon0, S.lat0], [lon1, S.lat0], [S.lon0, lat1], [lon1, lat1]]
    .map(([x, y]) => (x - A[0]) * f.kx * f.nx + (y - A[1]) * f.ky * f.ny);
  return [Math.floor(Math.min(...d)), Math.ceil(Math.max(...d))];
}

function sectionSkeleton(box) {
  if (box.dataset.ready === lang) return;
  box.innerHTML = `<div class="sec-tabs">${["cut", "scan", "block"].map((m) =>
      `<button data-m="${m}">${T("sec_tab_" + m)}</button>`).join("")}<button data-rot="1" title="${T("sec_rot")}">↻ 90°</button></div>
    <div id="sec-body"></div>
    <div id="sec-scan" class="row"><span class="small">${T("sec_scan")}</span><input id="sec-scan-r" type="range" step="0.2"></div>`;
  box.querySelectorAll(".sec-tabs button[data-m]").forEach((b) => {
    b.onclick = () => { state.secMode = b.dataset.m; renderSection(); redraw(); };
  });
  box.querySelector(".sec-tabs button[data-rot]").onclick = () => {
    if (!state.secBase) return;
    const [A, B] = state.secBase, f = scanFrame(state.secBase), m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const rot = (P) => { const x = (P[0] - m[0]) * f.kx, y = (P[1] - m[1]) * f.ky; return [m[0] - y / f.kx, m[1] + x / f.ky]; };
    state.secBase = [rot(A), rot(B)]; state.scanKm = 0; applyScan(); renderSection(); redraw();
  };
  $("sec-scan-r").oninput = (e) => { state.scanKm = +e.target.value; applyScan(); renderSection(); redraw(); };
  box.dataset.ready = lang;
}

function renderSection() {
  const box = $("section"), S = surfaceData(), on = layersOf("surface").some((l) => state.visible[l.id]);
  if (!S || !on) { box.classList.add("hidden"); return; }
  sectionSkeleton(box);
  box.classList.remove("hidden");
  box.querySelectorAll(".sec-tabs button[data-m]").forEach((b) => b.classList.toggle("on", b.dataset.m === state.secMode));
  const sc = $("sec-scan"), body = $("sec-body");
  sc.style.display = state.secMode !== "cut" && state.secBase ? "" : "none";
  if (state.secBase) {
    const [lo, hi] = scanRange(S), r = $("sec-scan-r");
    r.min = lo; r.max = hi; if (document.activeElement !== r) r.value = state.scanKm;
  }
  if (state.secMode === "block") { renderBlock(S, body); return; }
  renderCut(S, body);
}

function compass(ex, ny) {           // a direction in km (east, north) -> one of 8 names
  const k = Math.round(((Math.atan2(ex, ny) * 180 / Math.PI + 360) % 360) / 45) % 8;
  return T("dir8").split(",")[k];
}

function renderBlock(S, body) {
  const th = state.theme, di = dateIndex(), W = 560, H = 300, ml = 14, mr = 14, mt = 22, mb = 26;
  const rows = 34, cols = 170, shear = 70;                           // px the back row is shifted right (oblique view)
  const lon1 = S.lon0 + (S.nx - 1) * S.dlon, lat1 = S.lat0 + (S.ny - 1) * S.dlat;
  const base0 = state.secBase || [[Math.min(S.lon0, lon1), (S.lat0 + lat1) / 2], [Math.max(S.lon0, lon1), (S.lat0 + lat1) / 2]];
  const F = scanFrame(base0), A0 = base0[0], ux = F.ny, uy = -F.nx;            // u = along A->B, n = its left normal (km)
  const corners = [[S.lon0, S.lat0], [lon1, S.lat0], [S.lon0, lat1], [lon1, lat1]]
    .map(([x, y]) => [(x - A0[0]) * F.kx, (y - A0[1]) * F.ky]);
  const sAx = corners.map(([x, y]) => x * ux + y * uy), tAx = corners.map(([x, y]) => x * F.nx + y * F.ny);
  const s0 = Math.min(...sAx), s1 = Math.max(...sAx), t0 = Math.min(...tAx), t1 = Math.max(...tAx);
  const at = (sk, tk) => [A0[0] + (sk * ux + tk * F.nx) / F.kx, A0[1] + (sk * uy + tk * F.ny) / F.ky];
  const fin = S.frames[S.frames.length - 1];
  let deepest = 0;
  for (const v of fin) if (v != null && v < deepest) deepest = v;
  const gap = (H - mt - mb - 60) / (rows - 1), pxPerCm = 4 * gap / Math.max(1, -deepest / 10);   // fixed by the last date
  const Wd = W - ml - mr - shear;
  const ink = rgba([...th.velocity.color, 255]), line = th.ink, paper = th.paper;
  const hiRow = state.secBase ? Math.round((t1 - state.scanKm) / (t1 - t0) * (rows - 1)) : -1;      // the scanner's row
  let svg = "";
  for (let r = 0; r < rows; r++) {                                       // back (north) to front (south)
    const tk = t1 - (t1 - t0) * r / (rows - 1), base = mt + 30 + r * gap, off = shear * (1 - r / (rows - 1));
    // no data (outside the drawn bowl) = a thin grey line at zero: the sheet stays whole, but it does not claim "stable"
    const raw = [], has = [], pts = [];
    for (let c = 0; c < cols; c++) {
      const P = at(s0 + (s1 - s0) * c / (cols - 1), tk), v = sampleSurface(S, S.frames[di], P[0], P[1]);
      raw.push(v ?? 0); has.push(v != null);
    }
    for (let c = 0; c < cols; c++) {                                     // soften the step where data starts (5-sample mean)
      let a = 0, n = 0;
      for (let j = Math.max(0, c - 2); j <= Math.min(cols - 1, c + 2); j++) { a += raw[j]; n++; }
      pts.push([ml + off + Wd * c / (cols - 1), base - a / n / 10 * pxPerCm]);
    }
    const hl = r === hiRow, D = (ks) => ks.map((k, i) => `${i ? "L" : "M"}${pts[k][0].toFixed(1)},${pts[k][1].toFixed(1)}`).join("");
    const all = D(pts.map((_, k) => k));
    svg += `<path d="${all} L${pts.at(-1)[0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z" fill="${paper}" stroke="none"/>` +
           `<path d="${all}" fill="none" stroke="${th.muted}" stroke-width="0.4" stroke-opacity="0.6"/>`;
    // depth by colour and weight, like the strokes on the map: ink at zero -> motion colour at the deepest
    const vc = th.velocity.color, ic = th.contours?.color || [0, 0, 0];
    for (const seg of runs(has, (k) => has[k])) {
      if (hl) { svg += `<path d="${D(seg)}" fill="none" stroke="${th.ink}" stroke-width="2.4"/>`; continue; }
      for (let i = 0; i < seg.length - 1; i++) {
        const k = seg[i], t = Math.min(1, Math.max(0, raw[k] / deepest));
        const col = ic.map((c, j) => Math.round(c + (vc[j] - c) * t));
        svg += `<line x1="${pts[k][0].toFixed(1)}" y1="${pts[k][1].toFixed(1)}" x2="${pts[k + 1][0].toFixed(1)}" y2="${pts[k + 1][1].toFixed(1)}" ` +
               `stroke="${rgba([...col, 255])}" stroke-width="${(0.6 + 1.3 * t).toFixed(2)}" stroke-linecap="round"/>`;
      }
    }
  }
  body.innerHTML = `<div class="sec-head"><b>${T("sec_tab_block")}</b><span>${S.dates[di]}</span></div>
  <svg viewBox="0 0 ${W} ${H}" width="100%" style="background:${paper}">${svg}
    <text x="${W - mr}" y="${mt}" font-size="11" text-anchor="end" fill="${th.muted}">${T("blk_back")}: ${compass(F.nx, F.ny)} ↑</text>
    <text x="${ml}" y="${H - 6}" font-size="11" fill="${th.muted}">A (${compass(-ux, -uy)}) ← → B (${compass(ux, uy)})</text>
  </svg>
  <div class="small">${T("blk_note")}</div><div class="small">${T("sec_redraw")}</div>`;
}

function renderCut(S, body) {
  if (!state.section) { body.innerHTML = `<div class="small">${state.pending ? T("sec_second") : T("sec_first")}</div>`; return; }
  const th = state.theme, [A, B] = state.section, total = kmBetween(A, B), N = 240;
  const di = dateIndex(), years = (dayOf(S.dates[di]) - dayOf(S.dates[0])) / 365.25;
  const fanIdx = S.dates.map((_, i) => i).filter((i) => i > 0 && i < di && i % 3 === 0);
  const xs = [], cur = [], sig = [], fin = [], fan = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N, lon = A[0] + t * (B[0] - A[0]), lat = A[1] + t * (B[1] - A[1]);
    xs.push(t * total);
    const v = sampleSurface(S, S.frames[di], lon, lat);
    cur.push(v == null ? null : v / 10);
    const sg = sampleSurface(S, S.sigma_mm_yr, lon, lat);
    sig.push(sg == null || v == null ? null : 2 * sg / 10 * years);
    const f = sampleSurface(S, S.frames[S.frames.length - 1], lon, lat);
    fin.push(f == null ? null : f / 10);
    fan.push(fanIdx.map((i) => { const x = sampleSurface(S, S.frames[i], lon, lat); return x == null ? null : x / 10; }));
  }
  const okv = fin.filter((v) => v != null);
  if (!okv.length) { body.innerHTML = `<div class="small">${T("sec_empty")}</div>`; return; }
  // axes are fixed by the final date, so the picture does not jump while playing
  const W = 560, H = 230, ml = 40, mr = 12, mt = 16, mb = 30;
  // scanner: one fixed scale for the whole area, so profiles at different places can be compared while sliding
  let gl = Math.min(...okv, 0), gh = Math.max(...okv, 0);
  if (state.secMode === "scan") {
    if (S._ext == null) { let a = 0, b = 0; for (const v of S.frames[S.frames.length - 1]) if (v != null) { a = Math.min(a, v); b = Math.max(b, v); } S._ext = [a / 10, b / 10]; }
    [gl, gh] = [Math.min(gl, S._ext[0]), Math.max(gh, S._ext[1])];
  }
  const lo = gl - 4, hi = gh + 6;
  const X = (km) => ml + (W - ml - mr) * km / total, Y = (cm) => mt + (H - mt - mb) * (hi - cm) / (hi - lo);
  const exag = Math.round(((H - mt - mb) / ((hi - lo) / 100)) / ((W - ml - mr) / (total * 1000)) / 100) * 100;
  const ink = rgba([...th.velocity.color, 255]), lineCol = th.contours?.color || [0, 0, 0];
  const grey = rgba([...lineCol, 120]), muted = th.muted;
  const ground = runs(cur, (k) => cur[k] != null).map((seg) =>
    `<path d="M${X(xs[seg[0]]).toFixed(1)},${Y(lo)} ` + seg.map((k) => `L${X(xs[k]).toFixed(1)},${Y(cur[k]).toFixed(1)}`).join(" ") +
    ` L${X(xs[seg.at(-1)]).toFixed(1)},${Y(lo)} Z" fill="url(#hatch)"/>`).join("");
  const band = runs(cur, (k) => cur[k] != null && sig[k] != null).map((seg) =>
    `<path d="M` + seg.map((k) => `${X(xs[k]).toFixed(1)},${Y(cur[k] + sig[k]).toFixed(1)}`).join(" L") + " L" +
    seg.slice().reverse().map((k) => `${X(xs[k]).toFixed(1)},${Y(cur[k] - sig[k]).toFixed(1)}`).join(" L") +
    ` Z" fill="${rgba([...th.velocity.color, 50])}"/>`).join("");
  // houses standing on the profile, tilted by the (exaggerated) local slope
  let houses = "";
  const every = Math.max(3, Math.round(N * 2.5 / total));
  for (let k = every; k < N - 2; k += every) {
    if (cur[k - 2] == null || cur[k + 2] == null || cur[k] == null) continue;
    const x = X(xs[k]), y = Y(cur[k]);
    const ang = Math.atan2(Y(cur[k + 2]) - Y(cur[k - 2]), X(xs[k + 2]) - X(xs[k - 2])) * 180 / Math.PI;
    houses += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(1)})">` +
      `<rect x="-5" y="-9" width="10" height="9" fill="${th.paper}" stroke="${th.ink}" stroke-width="0.8"/>` +
      `<path d="M-6.5,-9 L0,-14.5 L6.5,-9 Z" fill="${th.paper}" stroke="${th.ink}" stroke-width="0.8"/></g>`;
  }
  // GNSS stations near the cut: ground truth on the same axis
  let gps = "";
  const kx = Math.cos(A[1] * Math.PI / 180) ** 2;
  for (const g of S.gnss || []) {
    const t = ((g.lon - A[0]) * (B[0] - A[0]) * kx + (g.lat - A[1]) * (B[1] - A[1])) / ((B[0] - A[0]) ** 2 * kx + (B[1] - A[1]) ** 2);
    if (t < 0 || t > 1 || g.cm[di] == null) continue;
    const foot = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
    if (kmBetween(foot, [g.lon, g.lat]) > 1.5) continue;
    const x = X(t * total), y = Y(g.cm[di]);
    gps += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${th.paper}" stroke="${th.ink}" stroke-width="1.6"/>` +
      `<text x="${(x + 8).toFixed(1)}" y="${(y + 15).toFixed(1)}" font-size="11" fill="${th.ink}">${g.station} GPS: ${g.cm[di] > 0 ? "+" : "−"}${Math.abs(g.cm[di]).toFixed(0)} ${T("cm")}</text>`;
  }
  // steepest bend along the cut (accumulated since the first date), as 1 : N
  let steep = 0, steepAt = 0;
  for (let k = 3; k <= N - 3; k++) if (cur[k - 3] != null && cur[k + 3] != null) {
    const sl = Math.abs(cur[k + 3] - cur[k - 3]) / 100 / ((xs[k + 3] - xs[k - 3]) * 1000);
    if (sl > steep) { steep = sl; steepAt = xs[k]; }
  }
  const yt = []; for (let v = Math.ceil(lo / 10) * 10; v <= hi; v += 10) yt.push(v);
  const xstep = total > 30 ? 10 : total > 12 ? 5 : 2, xt = []; for (let v = 0; v <= total + 1e-6; v += xstep) xt.push(v);
  const fanPaths = fanIdx.map((_, j) => `<path d="${pathD(xs, fan.map((f) => f[j]), X, Y)}" fill="none" stroke="${grey}" stroke-width="0.7"/>`).join("");
  const sgn = (v) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v);
  body.innerHTML = `<div class="sec-head"><b>${T("sec_title")} A–B · ${total.toFixed(1)} ${T("km")}</b><span>${S.dates[di]}</span></div>
  <svg viewBox="0 0 ${W} ${H}" width="100%">
    <defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="5" stroke="${grey}" stroke-width="0.8"/></pattern></defs>
    ${yt.map((v) => `<line x1="${ml}" x2="${W - mr}" y1="${Y(v)}" y2="${Y(v)}" stroke="${muted}" stroke-width="0.3"/><text x="${ml - 5}" y="${Y(v) + 3.5}" font-size="10" text-anchor="end" fill="${muted}">${sgn(v)}</text>`).join("")}
    ${xt.map((v) => `<text x="${X(v)}" y="${H - 14}" font-size="10" text-anchor="middle" fill="${muted}">${v}</text>`).join("")}
    <text x="${W - mr}" y="${H - 2}" font-size="10" text-anchor="end" fill="${muted}">${T("km")}</text>
    <text x="4" y="${mt - 5}" font-size="10" fill="${muted}">${T("cm")}</text>
    ${ground}${band}
    <line x1="${ml}" x2="${W - mr}" y1="${Y(0)}" y2="${Y(0)}" stroke="${th.ink}" stroke-width="0.8" stroke-dasharray="4,3"/>
    <text x="${ml + 4}" y="${Y(0) - 5}" font-size="10" fill="${th.ink}">${T("sec_zero").replace("{d}", S.dates[0])}</text>
    ${fanPaths}
    <path d="${pathD(xs, cur, X, Y)}" fill="none" stroke="${ink}" stroke-width="2.2"/>
    ${houses}${gps}
    <text x="${ml - 2}" y="${H - 2}" font-size="12" font-weight="bold" fill="${th.ink}">A</text>
    <text x="${W - mr - 34}" y="${H - 2}" font-size="12" font-weight="bold" fill="${th.ink}">B</text>
  </svg>
  <div class="small">${T("sec_note").replace("{x}", exag.toLocaleString("uk"))}${steep > 0 ? " " + T("sec_steep").replace("{n}", Math.round(1 / steep).toLocaleString("uk")).replace("{k}", steepAt.toFixed(1)) : ""}</div>
  <div class="small">${T("sec_redraw")}</div>`;
}

// ---------------------------------------------------------------- paper texture, graticule frame, scale bar, readout
// Theme keys: texture {grain, stains, vignette} and frame {band_px}. ?frame=1 turns the frame on in any theme.
function paperTexture(th) {
  const el = $("paper"), t = th.texture;
  document.body.dataset.theme = th.name;
  if (!t) { el.classList.add("hidden"); return; }
  const svg = (freq, oct, a, seed) => `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${oct}' seed='${seed}'/>` +
    `<feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 ${a} 0'/></filter><rect width='600' height='600' filter='url(#f)'/></svg>`)}")`;
  el.style.backgroundImage = [
    `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(70,45,20,${t.vignette ?? 0.3}) 100%)`,
    svg(0.9, 2, t.grain ?? 0.5, 3), svg(0.006, 3, t.stains ?? 0.3, 7)].join(",");
  el.style.backgroundSize = "100% 100%, 300px 300px, 1200px 1200px";
  el.classList.remove("hidden");
}

function frameOn() { return !!(state.theme?.frame || q.get("frame") === "1"); }

function dms(v, pos, neg) {
  const h = v >= 0 ? pos : neg, a = Math.abs(v), d = Math.floor(a), m = (a - d) * 60;
  const mm = Math.round(m * 10) / 10;
  return `${d}°${(mm % 1 ? mm.toFixed(1) : String(mm)).padStart(2, "0")}′ ${h}`;
}

function frameRect() {
  const p = sideEl(), wide = innerWidth > 700;
  const x0 = wide ? p.offsetLeft + p.offsetWidth + 10 : 6;
  return { x0, y0: 6, x1: innerWidth - 6, y1: innerHeight - 6 };
}

function niceStep(spanDeg, n = 6) {
  const steps = [0.5, 1, 2, 5, 10, 15, 30, 60, 120].map((m) => m / 60);
  return steps.find((s) => spanDeg / s <= n) || 2;
}

function drawFrame() {
  const svg = $("frame"), ro = $("readout"), sh = placeScore();
  if (!map || !frameOn()) { svg.classList.add("hidden"); ro.classList.add("hidden"); scaleCtl(true); return; }
  svg.classList.remove("hidden"); ro.classList.remove("hidden"); scaleCtl(false);
  const th = state.theme, R = frameRect(), b = th.frame?.band_px ?? 7, ink = th.ink, paper = th.paper;
  const W = innerWidth, H = innerHeight;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("width", W); svg.setAttribute("height", H);
  const tl = map.unproject([R.x0, R.y0]), br = map.unproject([R.x1, R.y1]);
  const lonStep = niceStep(br.lng - tl.lng), latStep = niceStep(tl.lat - br.lat);
  let s = `<rect x="${R.x0}" y="${R.y0}" width="${R.x1 - R.x0}" height="${R.y1 - R.y0}" fill="none" stroke="${ink}" stroke-width="1.6"/>` +
          `<rect x="${R.x0 + b}" y="${R.y0 + b}" width="${R.x1 - R.x0 - 2 * b}" height="${R.y1 - R.y0 - 2 * b}" fill="none" stroke="${ink}" stroke-width="0.7"/>`;
  // alternating bands between the two lines, one per graticule step (the classic "zebra" border)
  const lon0 = Math.floor(tl.lng / lonStep) * lonStep, lat0 = Math.floor(br.lat / latStep) * latStep;
  let k = 0;
  for (let lo = lon0; lo <= br.lng + lonStep; lo += lonStep, k++) {
    const xa = Math.max(R.x0 + b, map.project([lo, tl.lat]).x), xb = Math.min(R.x1 - b, map.project([lo + lonStep, tl.lat]).x);
    if (xb <= xa) continue;
    const idx = Math.round(lo / lonStep);
    if (idx % 2 === 0) s += `<rect x="${xa}" y="${R.y0}" width="${xb - xa}" height="${b}" fill="${ink}"/><rect x="${xa}" y="${R.y1 - b}" width="${xb - xa}" height="${b}" fill="${ink}"/>`;
    const xl = map.project([lo, tl.lat]).x;
    if (xl > R.x0 + b + 20 && xl < R.x1 - b - 20) {
      s += `<line x1="${xl}" y1="${R.y0 + b}" x2="${xl}" y2="${R.y0 + b + 5}" stroke="${ink}" stroke-width="0.7"/>` +
           `<line x1="${xl}" y1="${R.y1 - b}" x2="${xl}" y2="${R.y1 - b - 5}" stroke="${ink}" stroke-width="0.7"/>` +
           `<text x="${xl}" y="${R.y0 + b + 15}" text-anchor="middle" class="ft">${dms(lo, T("ew_e"), T("ew_w"))}</text>`;
    }
  }
  for (let la = lat0; la <= tl.lat + latStep; la += latStep) {
    const ya = Math.max(R.y0 + b, map.project([tl.lng, la + latStep]).y), yb = Math.min(R.y1 - b, map.project([tl.lng, la]).y);
    if (yb <= ya) continue;
    const idx = Math.round(la / latStep);
    if (idx % 2 === 0) s += `<rect x="${R.x0}" y="${ya}" width="${b}" height="${yb - ya}" fill="${ink}"/><rect x="${R.x1 - b}" y="${ya}" width="${b}" height="${yb - ya}" fill="${ink}"/>`;
    const yl = map.project([tl.lng, la]).y;
    if (yl > R.y0 + b + 20 && yl < R.y1 - b - 30) {
      s += `<line x1="${R.x0 + b}" y1="${yl}" x2="${R.x0 + b + 5}" y2="${yl}" stroke="${ink}" stroke-width="0.7"/>` +
           `<line x1="${R.x1 - b}" y1="${yl}" x2="${R.x1 - b - 5}" y2="${yl}" stroke="${ink}" stroke-width="0.7"/>` +
           `<text x="${R.x1 - b - 8}" y="${yl - 3}" text-anchor="end" class="ft">${dms(la, T("ns_n"), T("ns_s"))}</text>`;
    }
  }
  // scale bar: 4 alternating segments of a round length, bottom-left inside the frame
  const y = R.y1 - b - 26 - sh, xA = R.x0 + b + 16;
  const p1 = map.unproject([xA, y]), p2 = map.unproject([xA + 100, y]);
  const kmPer100 = kmBetween([p1.lng, p1.lat], [p2.lng, p2.lat]);
  const target = kmPer100 * 1.6, nice = [0.5, 1, 2, 5, 10, 20, 50, 100].find((v) => v >= target / 4 * 0.8) || 100;
  const segPx = nice / kmPer100 * 100;
  for (let i = 0; i < 4; i++) s += `<rect x="${xA + i * segPx}" y="${y}" width="${segPx}" height="5" fill="${i % 2 ? paper : ink}" stroke="${ink}" stroke-width="0.7"/>`;
  for (let i = 0; i <= 4; i += 2) s += `<text x="${xA + i * segPx}" y="${y - 4}" text-anchor="middle" class="ft">${i * nice}</text>`;
  s += `<text x="${xA + 4 * segPx + 6}" y="${y + 5}" class="ft">${T("km")}</text>`;
  if (state.man) {
    const man = state.man, yrs = [man.dates[0], man.dates.at(-1)].map((d) => (d || man.generated || "").slice(0, 4));   // a quake card has no dates
    const name = [...label(man.title).toLocaleUpperCase()].join("\u2009");
    const sub = (state.man.frame_sub ? label(state.man.frame_sub) : T("frame_sub")).replace("{a}", yrs[0]).replace("{b}", yrs[1]);
    const cx = (R.x0 + R.x1) / 2, w = Math.max(name.length * 9.5, sub.length * 6.3) + 44, h = 42;
    s += `<rect class="cart" data-i="0" x="${cx - w / 2}" y="${R.y0 + 2}" width="${w}" height="${h}" fill="${paper}" stroke="${ink}" stroke-width="0.8"/>` +
         `<rect class="cart" data-i="3" x="${cx - w / 2 + 3}" y="${R.y0 + 5}" width="${w - 6}" height="${h - 6}" fill="none" stroke="${ink}" stroke-width="0.4"/>` +
         `<text x="${cx}" y="${R.y0 + 22}" text-anchor="middle" class="ft cart" style="font-size:16px;letter-spacing:.06em">${name}</text>` +
         `<text x="${cx}" y="${R.y0 + 35}" text-anchor="middle" class="ft cart" style="font-size:12.5px;font-style:italic">${sub}</text>`;
  }
  svg.innerHTML = `<style>.ft{font-family:${th.font.replace(/"/g, "'")};font-size:11px;fill:${ink}}</style>${s}`;
  const ct = [...svg.querySelectorAll("text.cart")];
  if (ct.length) {                                    // fit the cartouche to the real text width
    const w = Math.max(...ct.map((t) => t.getBBox().width)) + 36, cx = (R.x0 + R.x1) / 2;
    svg.querySelectorAll("rect.cart").forEach((r) => { const i = +r.dataset.i;
      r.setAttribute("x", cx - w / 2 + i); r.setAttribute("width", w - 2 * i); });
  }
  ro.style.left = "auto"; ro.style.right = `${innerWidth - R.x1 + b + 12}px`;
  ro.dataset.low = innerHeight - R.y1 + b + 10 + sh; ro.dataset.high = innerHeight - y + 12; ro.dataset.clear = xA + 4 * segPx + 30;
  placeReadout();
}

function scaleCtl(show) {
  const c = document.querySelector(".maplibregl-ctrl-scale");
  if (c) c.style.display = show ? "" : "none";
}

function elevAt(lon, lat) {
  const l = layersOf("elevation")[0], E = l && state.data[l.id];
  if (!E) return null;
  const fx = (lon - E.lon0) / E.dlon, fy = (lat - E.lat0) / E.dlat, c = Math.round(fx), r = Math.round(fy);
  if (c < 0 || r < 0 || c >= E.nx || r >= E.ny) return null;
  return E.z[r * E.nx + c];
}

function placeReadout() {                           // bottom-right; lifted above the scale bar when they would touch
  const ro = $("readout"), d = ro.dataset;
  ro.style.bottom = `${d.low}px`;
  if (ro.textContent && ro.getBoundingClientRect().left < +d.clear) ro.style.bottom = `${d.high}px`;
}

function readout(lng, lat) {
  if (!frameOn()) return;
  const parts = [dms(lat, T("ns_n"), T("ns_s")), dms(lng, T("ew_e"), T("ew_w"))];
  const z = elevAt(lng, lat);
  if (z != null) parts.push(T("asl").replace("{h}", z.toLocaleString("uk")));
  const S = surfaceData();
  if (S) {
    const v = sampleSurface(S, S.frames[S.frames.length - 1], lng, lat), yrs = S.years || 1;
    if (v != null && v < 0) parts.push(T("sinks").replace("{v}", Math.abs(v / 10 / yrs).toFixed(0)));
  }
  $("readout").textContent = parts.join(" · ");
  placeReadout();
}

// ---------------------------------------------------------------- partitura: one row per district, one wedge per 12 days
// A row is the median curve of the 500 m cells around a named place (engine: rhythm_layer). Each wedge hangs from the staff
// line; its length is how far the ground went down in that interval, scaled to 12 days, so a longer gap is not a louder beat.
// Rows marked `still` (|rate| < 2σ) are drawn in the muted ink and stay silent when the sound is on.
const MONTHS = { uk: "січ,лют,бер,кві,тра,чер,лип,сер,вер,жов,лис,гру", en: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec" };
const PENTA = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24, 27];       // minor pentatonic: any rows sound together without a clash
const scoreLayer = () => layersOf("rhythm").find((l) => state.visible[l.id]);

function scoreSteps(d) {            // per row: the step of each interval scaled to 12 days (negative = down)
  const days = d.dates.map(dayOf);
  return d.rows.map((r) => r.series_cm.slice(1).map((v, j) => {
    const a = r.series_cm[j];
    return v == null || a == null ? null : (v - a) * 12 / Math.max(1, days[j + 1] - days[j]);
  }));
}

function placeScore() {
  const box = $("score"), root = document.documentElement.style;
  if (box.classList.contains("hidden")) { root.setProperty("--score-h", "0px"); return 0; }
  if (frameOn()) {
    const R = frameRect(), b = state.theme.frame?.band_px ?? 7;
    box.style.left = `${R.x0 + b + 8}px`; box.style.right = `${innerWidth - R.x1 + b + 8}px`; box.style.bottom = `${innerHeight - R.y1 + b + 8}px`;
  } else {
    const p = sideEl(), wide = innerWidth > 700;
    box.style.left = `${wide ? p.offsetLeft + p.offsetWidth + 10 : 12}px`; box.style.right = "12px"; box.style.bottom = "12px";
  }
  const h = box.offsetHeight + 8;
  root.setProperty("--score-h", `${h}px`);
  return h;
}

function renderScore() {
  const box = $("score"), lay = scoreLayer(), d = lay && state.data[lay.id];
  if (!d || !d.rows?.length) { box.classList.add("hidden"); placeScore(); drawFrame(); return; }
  box.classList.remove("hidden");
  placeScore();
  const th = state.theme, rows = d.rows, bars = d.kind === "bars", steps = bars ? null : scoreSteps(d), narrow = innerWidth <= 700;
  const ink = th.ink, muted = th.muted, red = rgba([...th.velocity.color, 255]);
  const W = Math.max(320, box.clientWidth - 20), LW = narrow ? 112 : 196, RW = narrow ? 64 : 104, top = 16, RH = 21;
  const H = top + rows.length * RH + 2, days = d.dates.map(dayOf), span = days.at(-1) || 1;
  const X = (t) => LW + (W - LW - RW) * t / span;
  const moving = bars ? [] : steps.filter((_, i) => !rows[i].still).flat().filter((v) => v != null && v < 0).map((v) => -v).sort((a, b) => a - b);
  const big = moving.length ? moving[Math.floor(0.95 * (moving.length - 1))] : 1, L = RH - 7;   // 95th percentile fills the row
  let s = "", wedges = "";
  // month ticks along the top
  const d0 = new Date(d.dates[0] + "T00:00:00Z"), mn = MONTHS[lang] ? MONTHS[lang].split(",") : MONTHS.en.split(",");
  for (let m = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 1)); (m - d0) / DAY <= span; m = new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth() + 1, 1))) {
    const x = X((m - d0) / DAY), jan = m.getUTCMonth() === 0, roomy = (W - LW - RW) / 12 > 46;
    s += `<line x1="${x}" y1="${top - 4}" x2="${x}" y2="${H}" stroke="${muted}" stroke-width="${jan ? 0.8 : 0.3}" opacity="${jan ? 0.7 : 0.45}"/>` +
         `<text x="${x + 2}" y="${top - 6}" font-size="10" fill="${muted}">${jan && roomy ? m.getUTCFullYear() : mn[m.getUTCMonth()]}</text>`;
  }
  s += `<text x="${W}" y="${top - 6}" font-size="10" fill="${muted}" text-anchor="end">${bars ? d.unit : T("cm_yr")}</text>`;
  if (bars && d.event_date) {                          // the event's day, a red hairline through the rows
    const xe = X(dayOf(d.event_date)), de = new Date(d.event_date + "T00:00:00Z");
    s += `<line x1="${xe}" y1="${top - 4}" x2="${xe}" y2="${H}" stroke="${red}" stroke-width="0.8" stroke-dasharray="2,2"/>` +
         `<text x="${xe + 3}" y="${H - 2}" font-size="10" fill="${red}" font-style="italic">${de.getUTCDate()} ${mn[de.getUTCMonth()]}</text>`;
  }
  rows.forEach((r, i) => {
    const y0 = top + i * RH + 4, col = r.still ? muted : red;
    s += `<rect class="sc-row" data-i="${i}" x="0" y="${top + i * RH}" width="${W}" height="${RH}" fill="transparent"/>` +
         `<line x1="${LW}" y1="${y0}" x2="${W - RW}" y2="${y0}" stroke="${muted}" stroke-width="0.6" opacity=".7"/>` +
         `<text x="${LW - 8}" y="${y0 + 8}" font-size="${narrow ? 11 : 12.5}" text-anchor="end" font-style="italic" fill="${r.still ? muted : ink}">${label(r.name)}</text>`;
    if (bars) {
      const mx = Math.max(...r.bars.filter((v) => v != null), 1e-9), ev = d.event_date ? dayOf(d.event_date) : null;
      s += `<text id="sc-v-${i}" x="${W}" y="${y0 + 8}" font-size="${narrow ? 10.5 : 12}" text-anchor="end" fill="${ink}" style="font-variant-numeric:tabular-nums"></text>`;
      r.bars.forEach((v, j) => {
        if (v == null || !(v > 0)) return;
        const xa = X(days[j]), xb = X(days[j + 1]), g = Math.min(1.5, (xb - xa) * 0.15);
        const hit = ev != null && days[j] < ev && ev <= days[j + 1];
        wedges += `<rect x="${xa + g}" y="${y0}" width="${Math.max(0.5, xb - xa - 2 * g)}" height="${Math.max(0.8, L * v / mx)}" fill="${hit ? red : ink}"${hit ? "" : ` opacity=".62"`}/>`;
      });
      return;
    }
    const rate = r.ref ? T("score_ref") : r.still ? `${T("score_still")} · ${Math.abs(r.rate_cm_yr).toFixed(0)}±${r.sigma_cm_yr.toFixed(0)}`
                                  : `${r.rate_cm_yr < 0 ? "−" : "+"}${Math.abs(r.rate_cm_yr).toFixed(0)} ± ${r.sigma_cm_yr.toFixed(0)}`;
    s += `<text x="${W}" y="${y0 + 8}" font-size="${narrow ? 10.5 : 12}" text-anchor="end" fill="${r.still ? muted : ink}"${r.still ? ` font-style="italic"` : ""} style="font-variant-numeric:tabular-nums">${rate}</text>`;
    steps[i].forEach((v, j) => {
      if (v == null) return;
      const xa = X(days[j]), xb = X(days[j + 1]), g = Math.min(1.2, (xb - xa) * 0.12), xm = (xa + xb) / 2;
      if (v < 0) {
        const len = Math.min(L, L * -v / big);
        wedges += `<polygon points="${xa + g},${y0} ${xb - g},${y0} ${xm},${y0 + len}" fill="${col}"/>`;
      } else {
        const len = Math.min(5, 5 * v / big);
        wedges += `<polygon points="${xa + g + 1},${y0} ${xb - g - 1},${y0} ${xm},${y0 - len}" fill="${muted}" opacity=".55"/>`;
      }
    });
  });
  const x = X(state.day);
  s += `<defs><clipPath id="sc-past"><rect id="sc-clip" x="0" y="0" width="${x}" height="${H}"/></clipPath></defs>` +
       `<g opacity=".2">${wedges}</g><g clip-path="url(#sc-past)">${wedges}</g>` +
       `<line id="sc-cur" x1="${x}" y1="${top - 4}" x2="${x}" y2="${H}" stroke="${ink}" stroke-width="1"/><g id="sc-flash" fill="${red}"></g>`;
  box.innerHTML = `<div class="sc-head"><b>${label(lay.label)}</b><span class="sc-note">${d.note ? label(d.note) : T("score_note")}</span>` +
    `<button id="sc-play" title="${T("score_play")}">${state.playing ? "❚❚" : "▶"}</button>` +
    `</div>` +
    `<svg viewBox="0 0 ${W} ${H}" height="${H}">${s}</svg>`;
  box.dataset.x0 = LW; box.dataset.w = W - LW - RW; box.dataset.span = span; box.dataset.top = top; box.dataset.rh = RH;
  $("sc-play").onclick = togglePlay;
  if ($("sc-sound")) $("sc-sound").onclick = () => { state.sound = !state.sound; if (state.sound) audioCtx(); $("sc-sound").classList.toggle("on", state.sound); };
  box.querySelectorAll(".sc-row").forEach((el) => {
    const i = +el.dataset.i;
    el.onmouseenter = () => { state.scoreHover = i; markScoreRows(); redraw(); };
    el.onmouseleave = () => { state.scoreHover = null; markScoreRows(); redraw(); };
    el.onclick = () => {
      if (bars) return;
      state.scorePin = state.scorePin === i ? null : i; markScoreRows(); redraw();
      if (state.scorePin === i) map.easeTo({ center: [rows[i].lon, rows[i].lat], zoom: Math.max(map.getZoom(), 12), duration: 900,
                                             offset: [0, -box.offsetHeight / 2] });   // centre it in the part of the map the strip leaves free
    };
  });
  markScoreRows();
  scoreTime();
  drawFrame();
}

function markScoreRows() {
  $("score").querySelectorAll(".sc-row").forEach((el) => {
    const i = +el.dataset.i, on = i === state.scoreHover || i === state.scorePin;
    el.setAttribute("fill", on ? "rgba(140,46,30,0.08)" : "transparent");
  });
}

function scoreTime() {             // the cursor and the inked part follow the slider; cheap enough for every frame
  const box = $("score"), cur = document.getElementById("sc-cur");
  if (!cur || box.classList.contains("hidden")) return;
  const x = +box.dataset.x0 + +box.dataset.w * state.day / +box.dataset.span;
  cur.setAttribute("x1", x); cur.setAttribute("x2", x); document.getElementById("sc-clip").setAttribute("width", x);
  const d = state.data[scoreLayer().id];
  if (d.kind === "bars") {                         // the value of the pair the map shows (it ends at the current date)
    const j = dateIndex() - 1;
    d.rows.forEach((r, i) => { const el = document.getElementById(`sc-v-${i}`), v = j >= 0 ? r.bars[j] : null;
      if (el) el.textContent = v == null ? "—" : `${v < 10 ? v.toFixed(1) : v.toFixed(0)} ${d.unit}`; });
  }
}

function scoreMapLayers(th) {     // where the rows are: faint rings, the hovered or pinned one bold and named
  const lay = scoreLayer(); if (!lay || state.data[lay.id].kind === "bars") return [];
  const rows = state.data[lay.id].rows, c = th.velocity.color, on = [state.scoreHover, state.scorePin].filter((i) => i != null);
  const L = [new deck.ScatterplotLayer({ id: "score-rings", data: rows.map((r, i) => ({ ...r, i })), getPosition: (r) => [r.lon, r.lat],
    radiusUnits: "meters", getRadius: (r) => r.r_km * 1000, filled: false, stroked: true, lineWidthUnits: "pixels",
    getLineWidth: (r) => (on.includes(r.i) ? 2.5 : 1), getLineColor: (r) => [...(r.still ? th.contours?.color || [90, 80, 70] : c), on.includes(r.i) ? 255 : 110],
    updateTriggers: { getLineWidth: on.join(","), getLineColor: [on.join(","), th.name] } })];
  if (on.length) L.push(textLayer("score-name", on.map((i) => ({ p: [rows[i].lon, rows[i].lat + rows[i].r_km / 110.6], s: label(rows[i].name), a: 0 })),
    th, { size: 15, offset: [0, -12], color: [...c, 255], halo: true, bold: true, italic: true, chars: "auto" }));
  return L;
}

// sound: a chime for every BELL_CM the district goes down, so a fast district chimes often and a slow one rarely; together
// they make a polyrhythm. Each moving row has its own note of a minor pentatonic (fastest = lowest); still rows are silent.
// A chime only rings at a new deepest level, so noise that lifts a district and drops it again does not ring twice.
const BELL_CM = 2;
let _audio = null;
function audioCtx() {
  if (!_audio) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const out = ctx.createGain(); out.gain.value = 0.5;
    const comp = ctx.createDynamicsCompressor();          // several chimes at once must never clip
    comp.threshold.value = -18; comp.ratio.value = 6;
    out.connect(comp); comp.connect(ctx.destination);
    _audio = { ctx, out };
  }
  if (_audio.ctx.state === "suspended") _audio.ctx.resume();
  return _audio;
}

function chime(freq, when = 0) {   // soft mallet on a wooden bar: a sine that rings, plus a short bright knock
  const { ctx, out } = audioCtx(), t = ctx.currentTime + when;
  for (const [mult, g, dec] of [[1, 0.32, 1.6], [3.99, 0.07, 0.12]]) {
    const o = ctx.createOscillator(), v = ctx.createGain();
    o.type = "sine"; o.frequency.value = freq * mult;
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g, t + 0.006);
    v.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    o.connect(v); v.connect(out); o.start(t); o.stop(t + dec + 0.05);
  }
}

function seriesAt(r, days, day) {  // the row's curve at a slider day, linear between dates
  let j = 0;
  while (j < days.length - 2 && days[j + 1] <= day) j++;
  const a = r.series_cm[j], b = r.series_cm[j + 1];
  if (a == null || b == null) return a ?? b ?? 0;
  return a + (b - a) * Math.min(1, Math.max(0, (day - days[j]) / (days[j + 1] - days[j])));
}

function scoreBells() {            // called on every slider move; rings only while playing with the sound on
  const lay = scoreLayer(); if (!lay || state.data[lay.id].kind === "bars") return;
  const d = state.data[lay.id], days = d.dates.map(dayOf), ring = state.playing && state.sound;
  const moving = d.rows.map((r, i) => i).filter((i) => !d.rows[i].still);
  state.bells = state.bells || {};
  moving.forEach((i, voice) => {
    const lvl = Math.floor(-seriesAt(d.rows[i], days, state.day) / BELL_CM), prev = state.bells[i];
    if (!ring || prev == null) { state.bells[i] = lvl; return; }
    if (lvl <= prev) return;
    const f = 220 * 2 ** (PENTA[voice % PENTA.length] / 12);   // rows come fastest first: the fastest gets the lowest note
    for (let k = 0; k < Math.min(3, lvl - prev); k++) chime(f, 0.07 * k);
    state.bells[i] = lvl; flashRow(i);
  });
}

function flashRow(i) {             // a dot at the cursor on the row that just chimed
  const box = $("score"), g = document.getElementById("sc-flash");
  if (!g) return;
  const x = +box.dataset.x0 + +box.dataset.w * state.day / +box.dataset.span, y = +box.dataset.top + i * +box.dataset.rh + 4;
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 4); c.setAttribute("class", "sc-ping");
  g.appendChild(c); setTimeout(() => c.remove(), 700);
}

function togglePlay() {
  state.playing = !state.playing;
  for (const b of [$("play"), document.getElementById("sc-play"), document.getElementById("st-play")]) if (b) b.textContent = state.playing ? "❚❚" : "▶";
  if (!state.playing) return;
  if (state.sound) audioCtx();
  if (state.day >= state.maxDay) setDay(0);
  state.bells = {}; scoreBells();                                    // start counting from where the cursor stands
  let last = performance.now();
  const step = (now) => {
    if (!state.playing) return;
    const dt = Math.max(0, Math.min(100, now - last)); last = now;   // the first frame may be stamped before the click
    const dur = scoreLayer() ? 18000 : 4000;                           // with the score on, a year takes ~18 s: one beat ≈ 0.6 s
    const nd = Math.min(state.maxDay, state.day + state.maxDay * dt / dur); setDay(nd);
    if (nd >= state.maxDay) { state.playing = false; for (const b of [$("play"), document.getElementById("sc-play"), document.getElementById("st-play")]) if (b) b.textContent = "▶"; return; }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---------------------------------------------------------------- the atlas: cover, chapters, glossary
// web/data/scenes.json may carry an "atlas" (cover words) and "chapters" (scene ids in reading order). Without them (a
// packed single plate) there is no cover and the plates simply follow the scene list.
const atlas = { idx: null, order: [], gloss: [], forms: [] };
const sceneById = (id) => atlas.idx?.scenes.find((s) => s.id === id);
const chapterOf = (id) => (atlas.idx?.chapters || []).findIndex((c) => c.scenes.includes(id));
const coverOn = () => !$("cover").classList.contains("hidden");

function goPlate(id) {
  const sc = sceneById(id);
  if (!sc) { showCover(true); return; }
  if (sc.href) { location.href = sc.href + (lang !== "en" ? `?lang=${lang}` : ""); return; }
  if ($("back-atlas") && id !== state.scene) { location.href = `index.html?scene=${id}` + (lang !== "en" ? `&lang=${lang}` : ""); return; }
  showCover(false); $("scene").value = id;
  if (id !== state.scene) loadScene(id); else if (state.storyData) storyOpen(true, 0, true);
}

function showCover(on) {
  if (on && !atlas.idx?.atlas) return;
  if (on) renderCover();
  $("cover").classList.toggle("hidden", !on); glossTip(null); renderSheet();
  setParam("cover", on ? "1" : null);
  if (on) $("cover").scrollTop = 0;
  else if (map) { map.resize(); redraw(); drawFrame(); }      // the map may have been laid out while the cover hid it
}

function renderCover() {
  const A = atlas.idx.atlas, other = lang === "uk" ? "en" : "uk";
  const chapters = (atlas.idx.chapters || []).map((c, k) => `<section class="cv-ch"><div class="cv-num">${ROMAN[k]}</div>` +
    `<h2>${label(c.title)}</h2><p class="cv-intro">${label(c.intro)}</p><ol>` +
    c.scenes.map((id) => { const sc = sceneById(id); return sc ? `<li><a href="?scene=${id}" data-id="${id}">${label(sc.title)}</a>` +
      `<span>${label(sc.blurb || sc.subtitle)}</span></li>` : ""; }).join("") + `</ol></section>`).join("");
  const alpha = (atlas.idx.alpha || []).map(sceneById).filter(Boolean);
  const alphaHtml = alpha.length ? `<details class="cv-alpha"><summary>${T("alpha")}</summary><p>${T("alpha_t")}</p><ul>` +
    alpha.map((sc) => `<li><a href="?scene=${sc.id}" data-id="${sc.id}">${label(sc.title)}</a> <span>${label(sc.blurb || sc.subtitle)}</span></li>`).join("") +
    `</ul></details>` : "";
  const words = [...atlas.gloss].sort((a, b) => label(a.title).localeCompare(label(b.title)))
    .map((g) => `<div><b>${label(g.title)}.</b> ${label(g.text)}</div>`).join("");
  $("cover").innerHTML = `<div class="cv-page"><div class="cv-kicker">${label(A.kicker)}</div>` +
    `<img class="cv-flower" src="edelweiss.svg" alt="" width="200" height="222">` +
    `<h1>${label(A.title)}</h1><div class="cv-sub">${label(A.subtitle)}</div><div class="cv-rule"></div>` +
    `<p class="cv-lede">${label(A.lede)}</p><div class="cv-chapters">${chapters}</div>` +
    alphaHtml + (words ? `<details class="cv-words"><summary>${T("glossary")}</summary><div class="cv-wgrid">${words}</div></details>` : "") +
    `<footer><div>${label(A.credits)}</div><a class="cv-lang" href="?cover=1&lang=${other}">${other === "uk" ? "Українська" : "English"}</a></footer></div>`;
  $("cover").querySelectorAll("a[data-id]").forEach((a) => (a.onclick = (e) => { e.preventDefault(); goPlate(a.dataset.id); }));
  glossify([$("cover").querySelector(".cv-sub"), $("cover").querySelector(".cv-lede")]);
}

// Glossary: the first use of a term on a page gets a dotted underline; hovering, focusing or tapping it opens a short
// card. A form with capitals matches exactly, a lower-case one in any case. An English form takes a plural ending only
// ("pass" -> "passes", never "passed"); a Ukrainian stem takes any ending ("іоносфер" -> "іоносфері"). One-character
// forms (σ, ρ, ±) match anywhere.
const LETTER = /[\p{L}\p{N}]/u;
function glossForms() {
  atlas.forms = [];
  for (const g of atlas.gloss) for (const f of g.match?.[lang] || g.match?.en || []) atlas.forms.push({ f, id: g.id, ci: f === f.toLowerCase() });
  atlas.forms.sort((a, b) => b.f.length - a.f.length);
}
function glossFind(s, t) {
  const hay = t.ci ? s.toLowerCase() : s, one = [...t.f].length === 1;
  for (let k = hay.indexOf(t.f); k >= 0; k = hay.indexOf(t.f, k + 1)) {
    if (!one && k > 0 && LETTER.test(s[k - 1])) continue;
    let e = k + t.f.length;
    if (!one && LETTER.test(t.f.at(-1))) while (e < s.length && LETTER.test(s[e])) e++;
    if (/^[\x20-\x7e]+$/.test(t.f) && !["", "s", "es"].includes(s.slice(k + t.f.length, e).toLowerCase())) continue;   // English: pass(es), not passed
    return [k, e];
  }
  return null;
}
function glossify(els) {
  if (!atlas.forms.length) return;
  const used = new Set();
  for (const el of els) {
    if (!el) continue;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), texts = [];
    while (w.nextNode()) if (!w.currentNode.parentElement.closest(".gl, a, button")) texts.push(w.currentNode);
    for (let node of texts) {
      for (;;) {
        let best = null;
        for (const t of atlas.forms) {
          if (used.has(t.id)) continue;
          const m = glossFind(node.nodeValue, t);
          if (m && (!best || m[0] < best.k)) best = { k: m[0], e: m[1], id: t.id };
        }
        if (!best) break;
        used.add(best.id);
        const mid = node.splitText(best.k), rest = mid.splitText(best.e - best.k);
        const span = document.createElement("span");
        span.className = "gl"; span.dataset.g = best.id; span.tabIndex = 0;
        mid.replaceWith(span); span.append(mid); node = rest;
      }
    }
  }
}
function glossTip(el) {
  const tip = $("gloss"), g = el && atlas.gloss.find((x) => x.id === el.dataset.g);
  if (!g) { tip.classList.add("hidden"); return; }
  tip.innerHTML = `<b>${label(g.title)}</b>${label(g.text)}`; tip.classList.remove("hidden");
  const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left - 12)) + "px";
  tip.style.top = (r.bottom + 8 + h < innerHeight - 8 ? r.bottom + 8 : Math.max(8, r.top - h - 8)) + "px";
}
function glossEvents() {
  document.addEventListener("mouseover", (e) => { const g = e.target.closest?.(".gl"); if (g) glossTip(g); });
  document.addEventListener("mouseout", (e) => { if (e.target.closest?.(".gl") && !e.relatedTarget?.closest?.(".gl")) glossTip(null); });
  document.addEventListener("focusin", (e) => glossTip(e.target.closest?.(".gl") || null));
  document.addEventListener("click", (e) => glossTip(e.target.closest?.(".gl") || null));     // a tap opens it, a tap elsewhere closes
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("gloss").classList.contains("hidden")) { glossTip(null); e.stopImmediatePropagation(); } }, true);
}

// ---------------------------------------------------------------- atlas pages: a plate plays its pages (sites/<id>.story.json)
// A page sets the camera, the layers (exact list; theme-only layers still follow the theme), cell modes, the cut, the date
// and the words. People write pages; this code only plays them. Keys: ← → / PageUp PageDown (presentation clickers), Esc.
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
const sideEl = () => (state.storyOn ? $("story") : $("panel"));      // what stands on the left of the map

function setParam(k, v) {
  const u = new URL(location);
  if (v == null) u.searchParams.delete(k); else u.searchParams.set(k, v);
  try { history.replaceState(null, "", u); } catch (e) { /* file:// pages may refuse */ }
}

function storyOpen(on, page, instant) {
  state.storyOn = !!(on && state.storyData);
  $("panel").classList.toggle("hidden", state.storyOn);
  $("story").classList.toggle("hidden", !state.storyOn);
  $("story-open").classList.toggle("hidden", !state.storyData || state.storyOn); $("story-open").textContent = T("story_open");
  if (state.storyOn) { applyPage(page ?? state.page ?? 0, instant); return; }
  state.marks = []; drawNotes(); setParam("page", null); renderSheet();
  renderPanel(); redraw(); drawFrame();
}

function applyPage(i, instant) {
  const S = state.storyData, n = S.pages.length;
  i = Math.max(0, Math.min(n - 1, i));
  const p = S.pages[i]; state.page = i;
  if (state.playing) togglePlay();
  const want = new Set(p.layers || []), base = new Set(state.man.base || []);
  for (const l of state.man.layers) {
    let on = want.has(l.id) || (!!l.group && want.has(l.group));
    if (l.by_theme && !(state.theme.layers_on || []).includes(l.id)) on = false;
    if (base.has(l.id) && !(p.hide || []).includes(l.id)) on = true;
    state.visible[l.id] = on;
  }
  for (const l of layersOf("cells")) state.mode[l.id] = p.modes?.[l.id] ?? state.data[l.id].default_mode ?? "";
  const sd = surfaceData();
  if (sd) { state.secMode = p.cut || "cut"; state.section = state.secBase = p.line || sd.section || null; state.scanKm = 0; state.pending = null; }
  const rows = scoreLayer() ? state.data[scoreLayer().id].rows : [];
  state.scorePin = p.pin ? rows.findIndex((r) => r.name?.en === p.pin || label(r.name) === p.pin) : null;
  if (state.scorePin < 0) state.scorePin = null;
  state.scoreHover = null; state.point = null; state.marks = p.marks || [];
  const day = p.day === "start" ? 0 : p.day === "end" || p.day == null ? state.maxDay : Math.max(0, Math.min(state.maxDay, dayOf(p.day)));
  renderLegend(); renderStoryCard(); syncTimebox(); renderSection(); renderScore(); setDay(day);
  storyCamera(p, i, instant);
  drawNotes(); setParam("page", i + 1);
}

function storyCamera(p, i, instant) {
  const c = p.camera || {}, wide = innerWidth > 700, card = $("story").getBoundingClientRect();
  const sh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--score-h")) || 0;
  const sec = $("section").classList.contains("hidden") ? 0 : $("section").offsetHeight + 20;
  const pad = wide ? { top: 64, right: 50, bottom: 24 + Math.max(sh, sec), left: card.right + 36 }
                   : { top: card.bottom + 16, right: 16, bottom: 16 + sh, left: 16 };
  const calm = instant || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const opt = { padding: pad, duration: calm ? 0 : 1300, essential: true, linear: true, easing: (t) => t * (2 - t) };
  if (c.bbox) map.fitBounds([[c.bbox[0], c.bbox[1]], [c.bbox[2], c.bbox[3]]], opt);
  else map.easeTo({ center: c.center, zoom: c.zoom, ...opt });
  if (p.play) map.once("moveend", () => { if (state.storyOn && state.page === i && !state.playing) togglePlay(); });
}

function renderStoryCard() {
  const S = state.storyData, i = state.page, p = S.pages[i], n = S.pages.length, box = $("story");
  const facts = (p.facts || []).map((f) => `<div class="fact"><div class="fv">${f.value}${f.unit ? `<small> ${label(f.unit)}</small>` : ""}</div>` +
    `<div class="fl">${label(f.label)}</div></div>`).join("");
  const legend = p.legend ? [...$("legend").querySelectorAll(".legend-item")].map((e) => e.outerHTML).join("") : "";
  const tabs = S.pages.map((q, k) => `<button class="tab${k === i ? " on" : ""}" data-k="${k}" title="${label(q.title)}">${ROMAN[k] || k + 1}</button>`).join("");
  const timed = needsTime() && state.man.dates.length > 1;
  // one paragraph up front, the rest behind "Tell me more"; "How sure" pages show everything (doubts are never folded away)
  const keep = p.keep ?? 1;
  state.sheetParas = (p.text || []).slice(keep);
  const ch = chapterOf(state.scene), last = i === n - 1, at = atlas.order.indexOf(state.scene);
  const nextId = last && at >= 0 ? atlas.order[at + 1] : null, nextSc = nextId && sceneById(nextId);
  const onward = !last || at < 0 ? "" : nextSc
    ? `<div class="st-onward">${T("next_plate")}${chapterOf(nextId) !== ch ? ` · ${ROMAN[chapterOf(nextId)]}` : ""}: <a href="#" data-go="${nextId}">${label(nextSc.title)} →</a></div>`
    : (atlas.idx?.atlas ? `<div class="st-onward"><a href="#" data-go="">${T("the_end")}</a></div>` : "");
  box.innerHTML = `<div class="st-kicker">` + (atlas.idx?.atlas ? `<a href="#" class="st-toc" id="st-toc" title="Edelweiss">${T("contents")}</a>`
      : $("back-atlas") ? `<a href="${$("back-atlas").getAttribute("href")}" class="st-toc" title="Edelweiss">${T("contents")}</a>` : "") +   // a packed plate of the atlas
    `${ch >= 0 ? ROMAN[ch] + " · " : ""}${label(S.title)} · ${T("story_" + (p.section || "intro"))}</div>` +
    `<h2>${label(p.title)}</h2>${(p.text || []).slice(0, keep).map((t) => `<p>${label(t)}</p>`).join("")}` +
    (state.sheetParas.length ? `<button class="st-more-btn" id="st-more">${state.moreOpen ? T("less") : T("more")}</button>` : "") +
    (facts ? `<div class="facts">${facts}</div>` : "") + (legend ? `<div class="st-legend">${legend}</div>` : "") +
    (timed ? `<div class="st-time"><button id="st-play">${state.playing ? "❚❚" : "▶"}</button><span id="st-date"></span></div>` : "") + onward +
    `<nav><button id="st-prev"${i ? "" : " disabled"}>← ${T("story_back")}</button><span class="tabs">${tabs}</span>` +
    `<button id="st-next"${i < n - 1 || onward ? "" : " disabled"}>${T("story_next_btn")} →</button></nav>` +
    `<div class="st-foot"><a href="#" id="st-explore">${T("story_explore")}</a></div>`;
  box.classList.remove("turn"); void box.offsetWidth; box.classList.add("turn");      // a short page-turn
  $("st-prev").onclick = () => applyPage(i - 1);
  $("st-next").onclick = () => (last ? goPlate(nextId) : applyPage(i + 1));
  box.querySelectorAll("[data-go]").forEach((a) => (a.onclick = (e) => { e.preventDefault(); goPlate(a.dataset.go); }));
  if ($("st-toc")) $("st-toc").onclick = (e) => { e.preventDefault(); showCover(true); };
  glossify([...box.querySelectorAll("p, .fl")]);
  box.querySelectorAll(".tab").forEach((b) => (b.onclick = () => applyPage(+b.dataset.k)));
  $("st-explore").onclick = (e) => { e.preventDefault(); storyOpen(false); };
  if ($("st-more")) $("st-more").onclick = () => {             // the choice is kept from page to page
    state.moreOpen = !state.moreOpen; renderSheet(); $("st-more").textContent = state.moreOpen ? T("less") : T("more"); };
  renderSheet();
  if (timed) $("st-play").onclick = togglePlay;
}

// the locator: a small engraved globe in the corner, the plate marked on it, so the reader knows where on Earth this is
let _world = null;
async function renderLocator() {
  const el = $("locator"), man = state.man;
  if (!el || !man) return;
  if (!_world) { try { _world = await getJSON("data/world-land.json"); } catch (e) { el.classList.add("hidden"); return; } }
  const [w, s0, e, n] = man.bbox, lon0 = (w + e) / 2, lat0 = Math.max(-60, Math.min(60, (s0 + n) / 2)), R = 54, C = 60;
  const rad = Math.PI / 180, sp0 = Math.sin(lat0 * rad), cp0 = Math.cos(lat0 * rad);
  const proj = ([lon, lat]) => {
    const l = (lon - lon0) * rad, f = lat * rad, cf = Math.cos(f);
    let x = cf * Math.sin(l), y = cp0 * Math.sin(f) - sp0 * cf * Math.cos(l);
    if (sp0 * Math.sin(f) + cp0 * cf * Math.cos(l) < 0) { const k = Math.hypot(x, y) || 1; x /= k; y /= k; }   // far side: onto the rim
    return [(C + R * x).toFixed(1), (C - R * y).toFixed(1)];
  };
  const path = (pts) => "M" + pts.map((q) => proj(q).join(",")).join("L") + "Z";
  const grat = [];
  for (let lo = -180; lo < 180; lo += 30) grat.push("M" + Array.from({ length: 37 }, (_, i) => proj([lo, -90 + i * 5]).join(",")).join("L"));
  for (let la = -60; la <= 60; la += 30) grat.push("M" + Array.from({ length: 73 }, (_, i) => proj([-180 + i * 5, la]).join(",")).join("L"));
  const ink = state.theme.ink || "#3a2a1c", red = rgba([...(state.theme.velocity?.color || [150, 44, 26]), 255]);
  const [mx, my] = proj([lon0, (s0 + n) / 2]);
  el.innerHTML = `<svg viewBox="0 0 120 120" width="120" height="120" aria-label="${label(man.title)}">
    <defs><clipPath id="loc-c"><circle cx="${C}" cy="${C}" r="${R}"/></clipPath></defs>
    <circle cx="${C}" cy="${C}" r="${R}" fill="rgba(255,255,255,.18)"/>
    <g clip-path="url(#loc-c)"><path d="${grat.join("")}" fill="none" stroke="${ink}" stroke-opacity=".22" stroke-width=".5"/>
    <path d="${_world.rings.map(path).join("")}" fill="${ink}" fill-opacity=".2" stroke="${ink}" stroke-opacity=".7" stroke-width=".6" fill-rule="evenodd"/></g>
    <circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${ink}" stroke-width="1.2"/>
    <circle cx="${mx}" cy="${my}" r="7" fill="none" stroke="${red}" stroke-width="1.4"/><circle cx="${mx}" cy="${my}" r="2.4" fill="${red}"/></svg>`;
  el.classList.remove("hidden");
}

// the detail sheet: a second paper beside the story card, only on request
function renderSheet() {
  const sh = $("sheet"), paras = state.sheetParas || [];
  if (!state.storyOn || !state.moreOpen || !paras.length || coverOn()) { sh.classList.add("hidden"); return; }
  sh.innerHTML = `<button class="sh-x" id="sh-x" title="${T("less")}">✕</button>` + paras.map((t) => `<p>${label(t)}</p>`).join("");
  sh.classList.remove("hidden");
  const r = $("story").getBoundingClientRect();
  if (innerWidth > 760) { sh.style.left = r.right + 10 + "px"; sh.style.top = r.top + "px"; }
  else { sh.style.left = "12px"; sh.style.top = Math.min(innerHeight - 160, r.bottom + 8) + "px"; }
  $("sh-x").onclick = () => { state.moreOpen = false; renderSheet(); const b = $("st-more"); if (b) b.textContent = T("more"); };
  glossify([...sh.querySelectorAll("p")]);
}

function drawNotes() {             // engraved call-outs: a ring on the place, a leader line, an italic note
  const svg = $("notes"), marks = state.storyOn ? state.marks || [] : [];
  if (!map || !marks.length) { svg.classList.add("hidden"); svg.innerHTML = ""; return; }
  svg.classList.remove("hidden");
  const th = state.theme, ink = th.ink, paper = th.paper, W = innerWidth, H = innerHeight;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("width", W); svg.setAttribute("height", H);
  let s = "";
  for (const m of marks) {
    const P = map.project([m.lon, m.lat]), dx = m.dx ?? 30, dy = m.dy ?? -24, x = P.x + dx, y = P.y + dy;
    const end = dx < 0 ? "end" : "start", tx = x + (dx < 0 ? -4 : 4);
    s += `<circle cx="${P.x}" cy="${P.y}" r="4.5" fill="none" stroke="${ink}" stroke-width="1.3"/>` +
         `<line x1="${P.x + (dx > 0 ? 3 : -3)}" y1="${P.y + (dy > 0 ? 3 : -3)}" x2="${x}" y2="${y}" stroke="${ink}" stroke-width="0.8"/>` +
         `<text x="${tx}" y="${y + 4}" text-anchor="${end}" class="nt">${label(m.text)}</text>`;
  }
  svg.innerHTML = `<style>.nt{font-family:${th.font.replace(/"/g, "'")};font-size:14px;font-style:italic;fill:${ink};` +
    `paint-order:stroke;stroke:${paper};stroke-width:4px;stroke-linejoin:round}</style>${s}`;
}

// ---------------------------------------------------------------- time, loading
function setDay(day) {
  state.day = day; $("time").value = day; renderSection();
  scoreBells(); scoreTime();
  $("date").textContent = state.man.dates.length ? new Date(new Date(state.man.dates[0] + "T00:00:00Z").getTime() + day * DAY).toISOString().slice(0, 10) : "";
  const sd = document.getElementById("st-date"); if (sd) sd.textContent = $("date").textContent;
  const t = document.getElementById("tcur");
  if (t) { const x = 4 + 252 * (day - +t.dataset.x0) / +t.dataset.span; t.setAttribute("x1", x); t.setAttribute("x2", x); }
  redraw();
}

async function loadScene(id) {
  state.scene = id;
  $("loading").textContent = T("loading"); $("loading").classList.remove("hidden");
  try {
    const man = await getJSON(`data/${id}/manifest.json`);
    man.layers = man.layers.filter((l) => l.kind !== "rhythm" || q.get("score") === "1");
    const data = {};
    await Promise.all(man.layers.map(async (l) => {
      if (l.kind !== "image") { data[l.id] = await getJSON(`data/${id}/${l.file}`); return; }
      const img = new Image();                         // decoded up front: the map only repaints when layers change
      await new Promise((ok, bad) => { img.onload = ok; img.onerror = () => bad(new Error("image " + l.file)); img.src = l.url || `data/${id}/${l.file}`; });
      data[l.id] = { img }; }));
    state.storyData = man.story ? await getJSON(`data/${id}/${man.story}`) : null;
    state.man = man; state.data = data; state.point = null; state.visible = {}; state.mode = {};
    state.scoreHover = state.scorePin = null; state.bells = {};
    for (const l of man.layers) {
      state.visible[l.id] = l.visible ?? true;
      if (l.group && q.get(l.group) === "1") state.visible[l.id] = true;
      if (l.by_theme) state.visible[l.id] = (state.theme.layers_on || []).includes(l.id);
      if (l.kind === "cells") state.mode[l.id] = data[l.id].default_mode || "";
      if (l.kind === "surface") {
        state.section = state.secBase = data[l.id].section || null; state.pending = null; state.scanKm = 0;
        const sm = q.get("section");
        state.secMode = sm === "scan" || sm === "block" ? sm : "cut";
        if (sm === "1" || sm === "scan" || sm === "block") state.visible[l.id] = true;
      }
    }
    const n = man.dates.length;
    state.maxDay = n > 1 ? Math.round((new Date(man.dates[n - 1]) - new Date(man.dates[0])) / DAY) : 0;
    $("time").max = state.maxDay;
    renderPanel(); renderLocator();
    map.setMaxBounds(null);
    const wide = innerWidth > 700, sh = placeScore();               // keep the city clear of the score strip
    map.fitBounds([[man.bbox[0], man.bbox[1]], [man.bbox[2], man.bbox[3]]],
                  { padding: wide ? { top: 20, bottom: 20 + sh, right: 20, left: 330 } : { top: 20, bottom: 20 + sh, left: 20, right: 20 }, duration: 0 });
    const [w0, s0, e0, n0] = man.bbox, mx = (e0 - w0) * (state.theme.overscan ?? 0), my = (n0 - s0) * (state.theme.overscan ?? 0);
    map.setMaxBounds([[w0 - mx, s0 - my], [e0 + mx, n0 + my]]);
    setDay(state.maxDay);
    const first = !state.loadedOnce; state.loadedOnce = true;
    if (state.storyData && q.get("story") !== "0") storyOpen(true, first ? (+q.get("page") || 1) - 1 : 0, true);
    else storyOpen(false);
    const u = new URL(location); u.searchParams.set("scene", id); try { history.replaceState(null, "", u); } catch (e) { /* file:// pages may refuse */ }
  } finally { $("loading").classList.add("hidden"); }
}

async function setTheme(name) {
  state.theme = await getJSON(`themes/${name}.json`);
  if (state.theme.font_load && document.fonts) {          // the label atlas is drawn once: the fonts must be there first
    const faces = [state.theme.font_load, ...(state.theme.label_font_load ? [state.theme.label_font_load] : [])];
    try { await Promise.race([Promise.all(faces.map((f) => document.fonts.load(`${state.theme.label_weight || 400} 16px "${f}"`))), new Promise((r) => setTimeout(r, 2500))]); } catch (e) { /* fall back */ }
  }
  applyThemeCSS(state.theme); paperTexture(state.theme);
  if (map) { map.setStyle(mapStyle(state.theme)); }
  if (state.man) {            // layers a theme asks for (e.g. little trees in the parchment style) follow the theme
    for (const l of state.man.layers) if (l.by_theme) state.visible[l.id] = (state.theme.layers_on || []).includes(l.id);
    renderPanel(); redraw();
  }
  drawFrame();
}

async function main() {
  document.querySelectorAll("[data-i18n]").forEach((e) => (e.textContent = T(e.dataset.i18n)));
  const idx = await getJSON("data/scenes.json");
  const sceneSel = $("scene"), themeSel = $("theme");
  idx.scenes.forEach((s) => sceneSel.add(new Option(label(s.title) + ((idx.alpha || []).includes(s.id) ? " · alpha" : ""), s.id)));
  atlas.idx = idx; atlas.order = (idx.chapters || []).flatMap((c) => c.scenes);
  try { atlas.gloss = (await getJSON("data/glossary.json")).terms || []; } catch (e) { atlas.gloss = []; }   // optional
  glossForms(); glossEvents();
  if (idx.atlas && (!q.get("scene") || q.get("cover") === "1")) showCover(true);             // the title page comes first
  if ($("to-cover")) { if (idx.atlas) $("to-cover").onclick = (e) => { e.preventDefault(); showCover(true); }; else $("to-cover").remove(); }
  THEMES.forEach((t) => themeSel.add(new Option(t, t)));
  const scene = q.get("scene") || idx.scenes.find((s) => !s.href).id, theme = q.get("theme") || (idx.atlas ? "scroll" : THEMES[0]);
  sceneSel.value = scene; themeSel.value = theme;
  await setTheme(theme);
  map = new maplibregl.Map({ container: "map", style: mapStyle(state.theme), center: [0, 0], zoom: 2, attributionControl: false });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");
  overlay = new deck.MapboxOverlay({ layers: [] });
  map.addControl(overlay);
  map.on("move", () => { drawFrame(); drawNotes(); });
  map.on("zoomend", () => { if (Object.values(state.theme?.lines || {}).some((x) => x.airy || x.collide || x.zoom_fade)) redraw(); });
  addEventListener("resize", () => { renderScore(); renderSheet(); });
  map.on("mousemove", (e) => readout(e.lngLat.lng, e.lngLat.lat));
  map.on("click", (e) => {
    if (layersOf("surface").some((l) => state.visible[l.id])) {           // section mode: two clicks = a new cut
      const pt = [e.lngLat.lng, e.lngLat.lat];
      if (!state.pending) { state.pending = pt; state.section = null; }
      else { state.secBase = state.section = [state.pending, pt]; state.scanKm = 0; state.pending = null; }
      renderSection(); redraw(); return;
    }
    const p = nearestCell(e.lngLat.lng, e.lngLat.lat); state.point = p;
    if (p) showPoint(p); else $("point").classList.add("hidden"); redraw(); });
  await new Promise((r) => { if (map.loaded()) r(); else { map.once("load", r); setTimeout(r, 1500); } });   // hidden tabs may never fire "load"
  await loadScene(scene);
  drawFrame();
  sceneSel.onchange = () => {                       // a scene with "href" is its own page (Reykjanes)
    const sc = idx.scenes.find((s) => s.id === sceneSel.value);
    if (sc?.href) location.href = sc.href; else loadScene(sceneSel.value);
    sceneSel.blur();
  };
  themeSel.onchange = () => setTheme(themeSel.value);
  $("trustmode").onchange = (e) => { state.trust = e.target.value; redraw(); };
  $("time").oninput = (e) => setDay(+e.target.value);
  $("play").onclick = togglePlay;
  $("story-open").onclick = () => storyOpen(true, state.page);
  addEventListener("keydown", (e) => {
    if (coverOn()) return;                          // the title page is read with the mouse
    if (!state.storyOn || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName || "")) return;
    if (["ArrowRight", "PageDown"].includes(e.key)) { e.preventDefault(); applyPage(state.page + 1); }
    else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); applyPage(state.page - 1); }
    else if (e.key === "Escape") storyOpen(false);
  });
}
main().catch((e) => { document.body.insertAdjacentHTML("beforeend", `<pre style="position:absolute;bottom:0;left:0;color:red">${e}</pre>`); console.error(e); });
