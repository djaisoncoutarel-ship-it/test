import { useEffect, useState, type ReactNode } from "react";
import { useReveal } from "../hooks";
import { copyText } from "../lib/clipboard";

/* ---------- titre de section ---------- */

export function SectionHead({
  num,
  kicker,
  title,
}: {
  num: string;
  kicker: string;
  title: ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-xs text-mint">
        <span className="text-sage/60">//</span> {num} · {kicker}
      </p>
      <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-fog sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

/* ---------- bandeau défilant ---------- */

const Spark = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" className="mx-5 shrink-0 text-amber" fill="currentColor" aria-hidden>
    <path d="M6 0l1.4 4.6L12 6l-4.6 1.4L6 12 4.6 7.4 0 6l4.6-1.4z" />
  </svg>
);

const TICKER = [
  "choisir une recette",
  "tourner les boutons",
  "copier en un clic",
  "coller dans son projet",
  "adapter les couleurs",
  "recommencer",
];

export function Ticker() {
  return (
    <div className="marquee overflow-hidden border-y border-line bg-pine/70 py-3.5">
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {TICKER.map((item) => (
              <span key={`${dup}-${item}`} className="flex items-center">
                <span className="font-display text-sm font-bold lowercase whitespace-nowrap text-fog">
                  {item}
                </span>
                <Spark />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- méthode ---------- */

const STEPS = [
  {
    n: "01",
    t: "Choisissez",
    d: "Huit recettes vivantes dans la colonne de gauche : bouton, loader, interrupteur, cartes, badge, barre… Cliquez, ou tapez simplement le chiffre correspondant.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" />
        <circle cx="4" cy="6" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="4" cy="12" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="4" cy="18" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    n: "02",
    t: "Réglez",
    d: "Couleurs, arrondis, vitesses : chaque bouton régénère le CSS sous vos yeux, dans l'aperçu comme dans le panneau de code. Le dé « aléatoire » fait le reste.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 8h10M18 8h2M4 16h4M12 16h8" strokeLinecap="round" />
        <circle cx="16" cy="8" r="2.2" />
        <circle cx="10" cy="16" r="2.2" />
      </svg>
    ),
  },
  {
    n: "03",
    t: "Collez",
    d: "Un clic sur « copier » et le snippet file dans le presse-papiers, prêt pour votre HTML. Le journal garde une trace de chaque coupe — au cas où.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
  },
];

export function Methode() {
  const ref = useReveal();
  return (
    <section id="methode" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <div ref={ref} className="reveal">
        <SectionHead
          num="02"
          kicker="la méthode"
          title={
            <>
              Trois gestes, <span className="text-mint">pas un de plus</span>.
            </>
          }
        />
      </div>
      <div className="mt-10 space-y-10">
        {STEPS.map((s, i) => (
          <StepRow key={s.n} step={s} offset={i} />
        ))}
      </div>
    </section>
  );
}

function StepRow({ step, offset }: { step: (typeof STEPS)[number]; offset: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal grid grid-cols-[70px_1fr] items-start gap-5 sm:grid-cols-[120px_1fr] ${
        offset === 1 ? "sm:ml-14" : offset === 2 ? "sm:ml-28" : ""
      }`}
      style={{ transitionDelay: `${offset * 90}ms` }}
    >
      <span className="num-creux font-display text-6xl leading-none font-extrabold sm:text-7xl">
        {step.n}
      </span>
      <div className="pt-1">
        <h3 className="font-display flex items-center gap-3 text-xl font-bold text-fog">
          {step.t}
          <span className="text-amber">{step.icon}</span>
        </h3>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-sage">{step.d}</p>
      </div>
    </div>
  );
}

/* ---------- astuces (terminal) ---------- */

const TIPS = [
  "Un snippet ne devrait jamais dépasser 40 lignes — sinon, c'est un projet.",
  "Préférez `transform` à `top`/`left` : le GPU vous dira merci.",
  "`box-shadow` en deux couches : une courte pour la netteté, une longue pour la profondeur.",
  "`0.2s ease-out` : la durée passe-partout des micro-interactions.",
  "Testez vos snippets en zoom 200 % — l'accessibilité commence là.",
  "Une variable CSS bien nommée évite dix commentaires.",
];

function tipText(s: string): ReactNode {
  return s.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="rounded bg-moss px-1 py-0.5 text-amber">
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function TipTerminal() {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const reduced = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )[0];

  useEffect(() => {
    const tip = TIPS[idx];
    if (reduced) {
      const t = window.setTimeout(() => setIdx((i) => (i + 1) % TIPS.length), 4000);
      return () => window.clearTimeout(t);
    }
    if (chars < tip.length) {
      const t = window.setTimeout(() => setChars((c) => c + 1), 26);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setIdx((i) => (i + 1) % TIPS.length);
      setChars(0);
    }, 3200);
    return () => window.clearTimeout(t);
  }, [idx, chars, reduced]);

  const tip = TIPS[idx];
  const shown = reduced ? tip : tip.slice(0, chars);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-[#0a1210] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-coral" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-amber" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-mint" aria-hidden />
        <span className="ml-3 font-mono text-[11px] text-sage">astuces — zsh</span>
      </div>
      <div className="min-h-[200px] p-5 font-mono text-[13px] leading-relaxed">
        <p className="text-sage">
          <span className="text-mint">$</span> petit-code --astuce
        </p>
        <p className="mt-3 min-h-[60px] text-fog">
          <span className="text-amber">&gt;</span> {tipText(shown)}
          <span className="blink ml-1 inline-block h-[13px] w-[7px] translate-y-[2px] bg-mint" aria-hidden />
        </p>
        <div className="mt-5 flex gap-1.5">
          {TIPS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIdx(i);
                setChars(0);
              }}
              aria-label={`Astuce ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? "w-8 bg-amber" : "w-4 bg-line hover:bg-sage/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Astuces() {
  const ref = useReveal();
  return (
    <section id="astuces" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div ref={ref} className="reveal">
          <SectionHead
            num="03"
            kicker="astuces"
            title={
              <>
                Le terminal <span className="text-coral">murmure</span>.
              </>
            }
          />
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-sage">
            Entre deux copiés-collés, la console de l'atelier laisse échapper un
            conseil de CSS toutes les quelques secondes. Cliquez sur les jauges
            pour forcer le destin.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 font-mono text-[11px] text-sage">
            <span className="flex items-center gap-2">
              <kbd className="rounded border border-line bg-moss px-2 py-1 text-fog">1</kbd>–
              <kbd className="rounded border border-line bg-moss px-2 py-1 text-fog">8</kbd>
              recettes
            </span>
            <span className="flex items-center gap-2">
              <kbd className="rounded border border-line bg-moss px-2 py-1 text-fog">R</kbd>
              hasard
            </span>
          </div>
        </div>
        <TipTerminal />
      </div>
    </section>
  );
}

/* ---------- journal des copies ---------- */

export interface CopyEntry {
  id: number;
  name: string;
  lang: string;
  code: string;
  time: string;
}

function excerpt(code: string): string {
  const line = code.split("\n").find((l) => l.includes(":")) ?? code.split("\n")[0];
  return line.trim();
}

export function Journal({
  entries,
  onRecopy,
  onClear,
}: {
  entries: CopyEntry[];
  onRecopy: (e: CopyEntry) => void;
  onClear: () => void;
}) {
  const ref = useReveal();
  return (
    <section id="journal" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <div ref={ref} className="reveal flex flex-wrap items-end justify-between gap-4">
        <SectionHead
          num="04"
          kicker="journal"
          title={
            <>
              Ce que vous avez <span className="text-amber">copié</span>.
            </>
          }
        />
        {entries.length > 0 && (
          <button
            onClick={onClear}
            className="lien mb-1 font-mono text-[11px] text-sage hover:text-coral"
          >
            vider le journal
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-line px-6 py-14 text-center">
          <p className="font-mono text-sm text-sage">
            aucune copie pour l'instant — l'atelier attend vos ciseaux.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-line bg-pine">
          {entries.map((e, i) => (
            <div
              key={e.id}
              className="rise-in flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-line px-5 py-3.5 last:border-0"
              style={{ animationDelay: `${Math.min(i, 6) * 50}ms` }}
            >
              <span className="font-mono text-[11px] text-sage/70 tabular-nums">{e.time}</span>
              <span className="text-sm font-semibold text-fog">{e.name}</span>
              <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-mint uppercase">
                {e.lang}
              </span>
              <span className="hidden min-w-0 flex-1 truncate font-mono text-[11px] text-sage/60 md:block">
                {excerpt(e.code)}
              </span>
              <button
                onClick={() => onRecopy(e)}
                className="lien ml-auto font-mono text-[11px] text-amber"
              >
                recopier
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- pied de page ---------- */

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-display text-4xl font-extrabold tracking-tight text-fog">
            petit_code<span className="text-mint">_</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sage">
            Un petit atelier fait à la main, avec React, Tailwind et beaucoup de{" "}
            <code className="font-mono text-mint">box-shadow</code>. Aucun cookie,
            aucun tracker — juste des bouts de code qui attendent un projet.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2.5 font-mono text-xs text-sage">
          <a href="#atelier" className="lien hover:text-amber">→ l'atelier</a>
          <a href="#methode" className="lien hover:text-amber">→ la méthode</a>
          <a href="#astuces" className="lien hover:text-amber">→ les astuces</a>
          <a href="#journal" className="lien hover:text-amber">→ le journal</a>
          <a href="#haut" className="lien mt-3 text-mint hover:text-amber">↑ remonter</a>
          <p className="mt-5 text-sage/50">© 2026 — copiez librement, c'est le but.</p>
        </div>
      </div>
    </footer>
  );
}
