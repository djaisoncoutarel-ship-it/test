import { useScramble } from "../hooks";
import { RECIPES } from "../data/recipes";

const SPECS: Array<[string, string]> = [
  ["recettes", "08"],
  ["dépendances", "00"],
  ["poids moyen", "≈ 1 Ko"],
  ["langages", "CSS · HTML"],
  ["licence", "collez, c'est à vous"],
];

export default function Opening() {
  const decoded = useScramble("prêts à coller.", 500);

  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-12 sm:pt-20">
      <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* colonne texte */}
        <div>
          <p className="font-mono text-[13px] text-sage">
            <span className="text-mint">vous@atelier</span>
            <span className="text-sage/60">:~$</span> générer un petit code
            <span className="blink ml-1 inline-block h-[13px] w-[7px] translate-y-[2px] bg-mint" aria-hidden />
          </p>

          <h1 className="font-display mt-6 text-[clamp(2.7rem,7vw,4.8rem)] leading-[1.02] font-extrabold tracking-tight text-fog">
            Petits bouts
            <br />
            de <span className="text-amber">code</span>,
            <br />
            <span className="font-mono text-[0.62em] font-bold text-mint">{decoded}</span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-sage">
            Huit recettes de CSS pur — boutons, loaders, interrupteurs, cartes animées —
            à régler en direct puis à coller dans vos projets. Pas de bibliothèque,
            pas de build, pas de blabla&nbsp;: juste le code.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[11px] text-sage">
            <span className="flex items-center gap-2">
              <kbd className="rounded border border-line bg-moss px-1.5 py-0.5 text-fog">1</kbd>
              –
              <kbd className="rounded border border-line bg-moss px-1.5 py-0.5 text-fog">8</kbd>
              <span>changer de recette</span>
            </span>
            <span className="flex items-center gap-2">
              <kbd className="rounded border border-line bg-moss px-1.5 py-0.5 text-fog">R</kbd>
              <span>réglages aléatoires</span>
            </span>
            <a
              href="#atelier"
              className="group flex items-center gap-1.5 text-mint transition-colors hover:text-amber"
            >
              descendre à l'atelier
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="bounce-soft" aria-hidden>
                <path d="M12 4v16m0 0-6-6m6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* fiche technique */}
        <div className="relative mx-auto w-full max-w-sm lg:mt-4">
          <div className="rotate-1 rounded-lg border border-line bg-pine p-6 transition-transform duration-300 hover:rotate-0">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-widest text-sage uppercase">
                fiche technique
              </span>
              <span className="font-mono text-[11px] text-coral">v0.1</span>
            </div>
            <dl>
              {SPECS.map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-2 py-1.5 font-mono text-[13px]">
                  <dt className="text-sage">{k}</dt>
                  <span className="flex-1 border-b border-dashed border-line" aria-hidden />
                  <dd className={k === "recettes" ? "font-bold text-amber" : "text-fog"}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="absolute -bottom-6 -left-4 max-w-[240px] -rotate-2 rounded-md bg-amber px-4 py-3 shadow-[0_10px_30px_-8px_rgba(255,194,75,0.4)] transition-transform duration-300 hover:-rotate-1 sm:-left-8">
            <p className="text-[13px] leading-snug font-semibold text-ink">
              Tout se copie en un clic — même les réglages que vous venez de tourner.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-16 font-mono text-[11px] text-sage/50">
        {RECIPES.length} recettes chargées en mémoire · aucune requête réseau · ouvrez l'œil
      </p>
    </section>
  );
}
