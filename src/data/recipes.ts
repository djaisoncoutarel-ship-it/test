export interface ControlDef {
  key: string;
  label: string;
  type: "color" | "range";
  def: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface Recipe {
  id: string;
  name: string;
  tag: string;
  desc: string;
  swatch: string;
  controls: ControlDef[];
  make: (v: Record<string, string>) => { html: string; css: string };
}

/* ---------- petites utilitaires ---------- */

export const num = (v: string) => Number(v);

export function textOn(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? "#182019" : "#f5faf6";
}

const PALETTE = [
  "#ff7a59",
  "#ffc24b",
  "#5ce0b8",
  "#7fb4ff",
  "#f2789f",
  "#b7f04a",
  "#5ee7df",
  "#ffb86b",
];

export function randomSettings(r: Recipe): Record<string, string> {
  const out: Record<string, string> = {};
  for (const c of r.controls) {
    if (c.type === "color") {
      out[c.key] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    } else {
      const min = c.min ?? 0;
      const max = c.max ?? 100;
      const step = c.step ?? 1;
      const steps = Math.round((max - min) / step);
      const val = min + Math.floor(Math.random() * (steps + 1)) * step;
      out[c.key] = (step < 1 ? Number(val.toFixed(1)) : Math.round(val)).toString();
    }
  }
  return out;
}

export const defaultSettings = (r: Recipe): Record<string, string> =>
  Object.fromEntries(r.controls.map((c) => [c.key, c.def]));

/* ---------- les recettes ---------- */

export const RECIPES: Recipe[] = [
  {
    id: "braise",
    name: "Bouton « Braise »",
    tag: "bouton",
    desc: "Un bouton qui couve : halo coloré, légère lévitation au survol, écrasement au clic.",
    swatch: "#ff7a59",
    controls: [
      { key: "couleur", label: "Couleur", type: "color", def: "#ff7a59" },
      { key: "rayon", label: "Arrondi", type: "range", min: 0, max: 28, step: 1, unit: "px", def: "12" },
      { key: "lueur", label: "Intensité du halo", type: "range", min: 0, max: 60, step: 2, unit: "px", def: "26" },
    ],
    make: (v) => {
      const c = v.couleur;
      const g = num(v.lueur);
      return {
        html: `<button class="btn-braise">Cliquez-moi</button>`,
        css: `.btn-braise {
  padding: 0.85em 2em;
  font: 600 1rem "Instrument Sans", sans-serif;
  color: ${textOn(c)};
  background: ${c};
  border: none;
  border-radius: ${v.rayon}px;
  cursor: pointer;
  box-shadow: 0 ${Math.round(g / 2)}px ${g}px ${c}55;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.btn-braise:hover {
  transform: translateY(-2px);
  box-shadow: 0 ${g}px ${Math.round(g * 1.6)}px ${c}66;
}

.btn-braise:active {
  transform: translateY(0) scale(0.97);
}`,
      };
    },
  },
  {
    id: "orbite",
    name: "Loader « Orbite »",
    tag: "chargement",
    desc: "L'anneau qui tourne depuis la nuit des temps — réglable, mais increvable.",
    swatch: "#5ce0b8",
    controls: [
      { key: "couleur", label: "Couleur", type: "color", def: "#5ce0b8" },
      { key: "taille", label: "Diamètre", type: "range", min: 24, max: 96, step: 2, unit: "px", def: "48" },
      { key: "vitesse", label: "Vitesse", type: "range", min: 0.4, max: 3, step: 0.1, unit: "s", def: "1.1" },
    ],
    make: (v) => {
      const s = num(v.taille);
      return {
        html: `<span class="orbite" role="status" aria-label="chargement"></span>`,
        css: `.orbite {
  display: inline-block;
  width: ${s}px;
  height: ${s}px;
  border-radius: 50%;
  border: ${Math.max(3, Math.round(s / 10))}px solid ${v.couleur}2b;
  border-top-color: ${v.couleur};
  animation: orbite-spin ${v.vitesse}s linear infinite;
}

@keyframes orbite-spin {
  to {
    transform: rotate(1turn);
  }
}`,
      };
    },
  },
  {
    id: "luciole",
    name: "Interrupteur « Luciole »",
    tag: "formulaire",
    desc: "Un toggle qui s'allume vraiment : le rail s'embrase et le noyau saute d'un cran.",
    swatch: "#ffc24b",
    controls: [
      { key: "couleur", label: "Couleur (allumé)", type: "color", def: "#ffc24b" },
      { key: "largeur", label: "Largeur", type: "range", min: 44, max: 96, step: 2, unit: "px", def: "60" },
    ],
    make: (v) => {
      const w = num(v.largeur);
      const h = Math.round(w * 0.54);
      const p = 4;
      const knob = h - p * 2;
      const travel = w - h;
      return {
        html: `<label class="luciole">
  <input type="checkbox" checked />
  <span class="rail"><span class="noyau"></span></span>
</label>`,
        css: `.luciole input {
  position: absolute;
  opacity: 0;
}

.luciole .rail {
  display: block;
  width: ${w}px;
  height: ${h}px;
  padding: ${p}px;
  border-radius: 99px;
  background: #2b3a35;
  box-shadow: inset 0 2px 6px #0007;
  cursor: pointer;
  transition: background 0.25s ease, box-shadow 0.25s ease;
}

.luciole .noyau {
  display: block;
  width: ${knob}px;
  height: ${knob}px;
  border-radius: 50%;
  background: #e9f1ec;
  transition: transform 0.25s cubic-bezier(0.5, 1.5, 0.4, 1);
}

.luciole input:checked + .rail {
  background: ${v.couleur};
  box-shadow: 0 0 16px ${v.couleur}59, inset 0 1px 4px #0004;
}

.luciole input:checked + .rail .noyau {
  transform: translateX(${travel}px);
}`,
      };
    },
  },
  {
    id: "lisere",
    name: "Carte « Liseré »",
    tag: "carte",
    desc: "Un contour en dégradé conique qui tourne en boucle, sans une seule image.",
    swatch: "#f2789f",
    controls: [
      { key: "couleurA", label: "Couleur A", type: "color", def: "#ff7a59" },
      { key: "couleurB", label: "Couleur B", type: "color", def: "#5ce0b8" },
      { key: "rayon", label: "Arrondi", type: "range", min: 0, max: 32, step: 1, unit: "px", def: "18" },
    ],
    make: (v) => ({
      html: `<div class="lisere">
  <div class="coeur">
    <strong>Carte liseré</strong>
    <p>Un contour qui tourne tout seul.</p>
  </div>
</div>`,
      css: `@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.lisere {
  width: min(270px, 85%);
  padding: 1.5px;
  border-radius: ${v.rayon}px;
  background: conic-gradient(from var(--angle), ${v.couleurA}, ${v.couleurB}, ${v.couleurA});
  animation: lisere-tour 3s linear infinite;
}

.lisere .coeur {
  padding: 1.3rem 1.5rem;
  border-radius: calc(${v.rayon}px - 2px);
  background: #13221e;
  color: #dfe9e3;
  font-family: "Instrument Sans", sans-serif;
}

.lisere .coeur p {
  margin: 0.3rem 0 0;
  color: #9db4a9;
  font-size: 0.9rem;
}

@keyframes lisere-tour {
  to {
    --angle: 360deg;
  }
}`,
    }),
  },
  {
    id: "glitch",
    name: "Texte « Glitch »",
    tag: "typo",
    desc: "Deux fantômes colorés qui tremblent derrière le titre. L'atelier a le sien.",
    swatch: "#7fb4ff",
    controls: [
      { key: "couleurA", label: "Fantôme A", type: "color", def: "#ff7a59" },
      { key: "couleurB", label: "Fantôme B", type: "color", def: "#5ce0b8" },
      { key: "vitesse", label: "Cadence", type: "range", min: 0.8, max: 5, step: 0.1, unit: "s", def: "2.4" },
    ],
    make: (v) => ({
      html: `<span class="glitch" data-text="petit code">petit code</span>`,
      css: `.glitch {
  position: relative;
  font: 800 clamp(2rem, 6vw, 3.2rem) / 1.1
    "Bricolage Grotesque", sans-serif;
  color: #ecf5ef;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  opacity: 0.85;
}

.glitch::before {
  color: ${v.couleurA};
  clip-path: inset(0 0 52% 0);
  animation: glitch-haut ${v.vitesse}s steps(2, end) infinite;
}

.glitch::after {
  color: ${v.couleurB};
  clip-path: inset(52% 0 0 0);
  animation: glitch-bas ${(num(v.vitesse) * 0.7).toFixed(1)}s steps(2, end)
    infinite;
}

@keyframes glitch-haut {
  0%, 100% { transform: translate(0); }
  25% { transform: translate(-3px, -1px); }
  50% { transform: translate(2px, 1px); }
  75% { transform: translate(-2px, 0); }
}

@keyframes glitch-bas {
  0%, 100% { transform: translate(0); }
  25% { transform: translate(3px, 1px); }
  50% { transform: translate(-2px, -1px); }
  75% { transform: translate(2px, 0); }
}`,
    }),
  },
  {
    id: "pulsar",
    name: "Badge « Pulsar »",
    tag: "badge",
    desc: "La petite pastille « en ligne » qui émet une onde, encore et encore.",
    swatch: "#b7f04a",
    controls: [
      { key: "couleur", label: "Couleur", type: "color", def: "#5ce0b8" },
      { key: "vitesse", label: "Pulsation", type: "range", min: 0.8, max: 4, step: 0.1, unit: "s", def: "1.8" },
    ],
    make: (v) => ({
      html: `<span class="pulsar">
  <span class="point"></span>
  en ligne
</span>`,
      css: `.pulsar {
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  padding: 0.45em 0.95em;
  border: 1px solid ${v.couleur}40;
  border-radius: 99px;
  background: #152823;
  color: #d7e5dd;
  font: 600 0.85rem "Instrument Sans", sans-serif;
}

.pulsar .point {
  position: relative;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${v.couleur};
}

.pulsar .point::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: ${v.couleur};
  animation: pulsar-onde ${v.vitesse}s ease-out infinite;
}

@keyframes pulsar-onde {
  from {
    transform: scale(1);
    opacity: 0.8;
  }
  to {
    transform: scale(2.8);
    opacity: 0;
  }
}`,
    }),
  },
  {
    id: "torrent",
    name: "Barre « Torrent »",
    tag: "progression",
    desc: "Une progression indéterminée : un flux de lumière qui traverse la piste.",
    swatch: "#ffc24b",
    controls: [
      { key: "couleur", label: "Couleur", type: "color", def: "#ffc24b" },
      { key: "hauteur", label: "Hauteur", type: "range", min: 4, max: 24, step: 1, unit: "px", def: "10" },
      { key: "vitesse", label: "Vitesse", type: "range", min: 0.6, max: 4, step: 0.1, unit: "s", def: "1.6" },
    ],
    make: (v) => ({
      html: `<div class="torrent" role="progressbar" aria-label="chargement">
  <span class="flux"></span>
</div>`,
      css: `.torrent {
  width: min(280px, 85%);
  height: ${v.hauteur}px;
  border-radius: 99px;
  background: #1c2f29;
  overflow: hidden;
}

.torrent .flux {
  display: block;
  height: 100%;
  width: 40%;
  border-radius: 99px;
  background: linear-gradient(90deg, ${v.couleur}00, ${v.couleur}, ${v.couleur}00);
  animation: torrent-va ${v.vitesse}s
    cubic-bezier(0.45, 0.2, 0.55, 0.8) infinite;
}

@keyframes torrent-va {
  from {
    transform: translateX(-110%);
  }
  to {
    transform: translateX(360%);
  }
}`,
    }),
  },
  {
    id: "levitation",
    name: "Carte « Lévitation »",
    tag: "survol",
    desc: "Au survol, la carte décolle et son ombre teintée s'étire sous elle.",
    swatch: "#5ee7df",
    controls: [
      { key: "couleur", label: "Teinte de l'ombre", type: "color", def: "#ffc24b" },
      { key: "levitation", label: "Altitude", type: "range", min: 4, max: 24, step: 1, unit: "px", def: "10" },
    ],
    make: (v) => {
      const l = num(v.levitation);
      return {
        html: `<div class="levitation">
  <strong>Survolez-moi</strong>
  <p>L'ombre s'étire, la carte décolle.</p>
</div>`,
        css: `.levitation {
  width: min(250px, 85%);
  padding: 1.4rem 1.6rem;
  border: 1px solid #23392f;
  border-radius: 14px;
  background: #142521;
  color: #dfe9e3;
  font-family: "Instrument Sans", sans-serif;
  box-shadow: 0 2px 6px #0005;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.3, 1.4, 0.4, 1),
    box-shadow 0.3s ease;
}

.levitation p {
  margin: 0.3rem 0 0;
  color: #9db4a9;
  font-size: 0.9rem;
}

.levitation:hover {
  transform: translateY(-${l}px);
  box-shadow:
    0 ${l * 2}px ${l * 3}px -6px ${v.couleur}40,
    0 ${l}px ${Math.round(l * 1.6)}px #0006;
}`,
      };
    },
  },
];
