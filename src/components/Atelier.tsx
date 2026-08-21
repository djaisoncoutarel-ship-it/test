import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  RECIPES,
  defaultSettings,
  num,
  randomSettings,
} from "../data/recipes";
import { CodeBlock } from "../lib/highlight";
import { copyText } from "../lib/clipboard";
import { useReveal } from "../hooks";
import { SectionHead } from "./Sections";

interface Props {
  onCopy: (name: string, lang: string, code: string) => void;
}

export default function Atelier({ onCopy }: Props) {
  const [activeId, setActiveId] = useState(RECIPES[0].id);
  const [values, setValues] = useState<Record<string, string>>(() =>
    defaultSettings(RECIPES[0]),
  );
  const [tab, setTab] = useState<"css" | "html">("css");
  const [copied, setCopied] = useState(false);
  const headRef = useReveal();

  const recipe = RECIPES.find((r) => r.id === activeId) ?? RECIPES[0];
  const snippet = useMemo(() => recipe.make(values), [recipe, values]);

  /* changement de recette → réglages par défaut */
  useEffect(() => {
    setValues(defaultSettings(recipe));
    setCopied(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  /* raccourcis clavier : 1–8 recettes, R aléatoire */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
        return;
      const r = RECIPES.find((x) => x.id === activeId);
      if (r && e.key.toLowerCase() === "r") setValues(randomSettings(r));
      const n = Number(e.key);
      if (n >= 1 && n <= RECIPES.length) setActiveId(RECIPES[n - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  const doCopy = async () => {
    const code = tab === "css" ? snippet.css : snippet.html;
    const ok = await copyText(code);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      onCopy(recipe.name, tab, code);
    }
  };

  return (
    <section id="atelier" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <div ref={headRef} className="reveal flex flex-wrap items-end justify-between gap-4">
        <SectionHead
          num="01"
          kicker="l'atelier"
          title={
            <>
              Choisissez, réglez, <span className="text-amber">collez</span>.
            </>
          }
        />
        <p className="mb-1 font-mono text-[11px] text-sage/70">
          {RECIPES.length} recettes · code régénéré à chaque réglage
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 xl:flex-row">
        {/* ---- liste des recettes ---- */}
        <aside className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 xl:w-[232px] xl:flex-none xl:flex-col xl:overflow-visible xl:pb-0">
          {RECIPES.map((r, i) => {
            const active = r.id === activeId;
            return (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                aria-pressed={active}
                className={`group flex min-w-[210px] items-center gap-3 rounded-md border px-3.5 py-3 text-left transition-all duration-200 xl:min-w-0 ${
                  active
                    ? "border-amber/60 bg-moss xl:translate-x-1"
                    : "border-line bg-pine/60 hover:border-sage/40 hover:bg-pine xl:hover:translate-x-1"
                }`}
              >
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    active ? "text-amber" : "text-sage/50"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-sm font-semibold ${
                      active ? "text-fog" : "text-sage group-hover:text-fog"
                    }`}
                  >
                    {r.name}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-sage/60 uppercase">
                    {r.tag}
                  </span>
                </span>
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full transition-transform ${
                    active ? "scale-125" : "opacity-50 group-hover:opacity-100"
                  }`}
                  style={{ background: r.swatch }}
                  aria-hidden
                />
              </button>
            );
          })}
        </aside>

        {/* ---- aperçu + code + réglages ---- */}
        <div className="grid min-w-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
          {/* aperçu */}
          <div className="overflow-hidden rounded-lg border border-line bg-pine lg:col-start-1 lg:row-start-1">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-sage uppercase">
                <span className="blink h-2 w-2 rounded-full bg-mint" aria-hidden />
                aperçu en direct
              </span>
              <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-mint">
                {recipe.tag}
              </span>
            </div>
            <div className="preview-dots grid h-[280px] place-items-center overflow-hidden p-6 sm:h-[300px]">
              <style>{snippet.css}</style>
              <div dangerouslySetInnerHTML={{ __html: snippet.html }} />
            </div>
          </div>

          {/* réglages */}
          <div className="rounded-lg border border-line bg-pine lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="font-mono text-[11px] tracking-widest text-sage uppercase">
                réglages
              </span>
              <button
                onClick={() => setValues(randomSettings(recipe))}
                title="Réglages aléatoires (touche R)"
                className="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[10px] text-sage transition-colors hover:border-mint/60 hover:text-mint"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
                  <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
                  <circle cx="15.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
                  <circle cx="8.5" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
                </svg>
                aléatoire
              </button>
            </div>

            <div className="space-y-6 p-4">
              <div>
                <p className="font-display text-[15px] font-bold text-fog">{recipe.name}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-sage">{recipe.desc}</p>
              </div>

              {recipe.controls.map((c) => {
                const id = `${recipe.id}-${c.key}`;
                if (c.type === "color") {
                  return (
                    <div key={c.key} className="flex items-center justify-between gap-3">
                      <div>
                        <label htmlFor={id} className="font-mono text-[11px] tracking-wider text-sage uppercase">
                          {c.label}
                        </label>
                        <span className="block font-mono text-[11px] text-mint">
                          {values[c.key]}
                        </span>
                      </div>
                      <input
                        id={id}
                        type="color"
                        value={values[c.key]}
                        onChange={(e) => setValues((v) => ({ ...v, [c.key]: e.target.value }))}
                        className="shrink-0"
                      />
                    </div>
                  );
                }
                const min = c.min ?? 0;
                const max = c.max ?? 100;
                const pct = ((num(values[c.key]) - min) / (max - min)) * 100;
                return (
                  <div key={c.key}>
                    <div className="mb-2.5 flex items-baseline justify-between">
                      <label htmlFor={id} className="font-mono text-[11px] tracking-wider text-sage uppercase">
                        {c.label}
                      </label>
                      <span className="font-mono text-[11px] text-mint tabular-nums">
                        {values[c.key]}
                        {c.unit}
                      </span>
                    </div>
                    <input
                      id={id}
                      type="range"
                      min={min}
                      max={max}
                      step={c.step ?? 1}
                      value={values[c.key]}
                      onChange={(e) => setValues((v) => ({ ...v, [c.key]: e.target.value }))}
                      style={{ "--fill": `${pct}%` } as CSSProperties}
                    />
                  </div>
                );
              })}

              <p className="border-t border-dashed border-line pt-4 font-mono text-[10px] leading-relaxed text-sage/60">
                // chaque réglage réécrit le code ci-contre, en direct.
              </p>
            </div>
          </div>

          {/* code */}
          <div className="flex flex-col overflow-hidden rounded-lg border border-line bg-pine lg:col-start-1 lg:row-start-2">
            <div className="flex items-center justify-between gap-2 border-b border-line pr-3">
              <div className="flex overflow-x-auto">
                {(["css", "html"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTab(t);
                      setCopied(false);
                    }}
                    className={`border-b-2 px-4 py-2.5 font-mono text-xs whitespace-nowrap transition-colors ${
                      tab === t
                        ? "border-amber text-amber"
                        : "border-transparent text-sage hover:text-fog"
                    }`}
                  >
                    {t === "css" ? "recette.css" : "recette.html"}
                  </button>
                ))}
              </div>
              <button
                onClick={doCopy}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                  copied
                    ? "bg-mint/15 text-mint"
                    : "bg-amber text-ink hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(255,194,75,0.55)] active:translate-y-0"
                }`}
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                      <path d="m4 12.5 5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    copié !
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                      <rect x="9" y="9" width="12" height="12" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    copier
                  </>
                )}
              </button>
            </div>
            <div className="max-h-[330px] min-h-[220px] flex-1 overflow-auto">
              <CodeBlock code={tab === "css" ? snippet.css : snippet.html} lang={tab} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
