import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import Header from "./components/Header";
import Opening from "./components/Opening";
import Atelier from "./components/Atelier";
import {
  Astuces,
  Footer,
  Journal,
  Methode,
  Ticker,
  type CopyEntry,
} from "./components/Sections";
import { copyText } from "./lib/clipboard";

/* ---------- fond d'atelier ---------- */

const GLYPHS = ["{ }", "</>", ";", "=>", "::", "&&", "01", "#", "px", "()"];

function Ambient() {
  const seeds = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        ch: GLYPHS[i % GLYPHS.length],
        left: (i * 61 + 7) % 100,
        top: (i * 37 + 11) % 100,
        size: 12 + ((i * 7) % 12),
        dur: 9 + ((i * 3) % 8),
        delay: (i * 1.3) % 6,
        rot: ((i * 47) % 24) - 12,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="bg-blueprint absolute inset-0" />
      <div className="absolute -top-44 -left-44 h-[520px] w-[520px] rounded-full bg-amber/[0.05] blur-[130px]" />
      <div className="absolute -right-44 -bottom-44 h-[560px] w-[560px] rounded-full bg-mint/[0.05] blur-[130px]" />
      {seeds.map((s, i) => (
        <span
          key={i}
          className="glyph absolute font-mono font-medium"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              fontSize: s.size,
              color: "rgba(157, 180, 169, 0.14)",
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
              "--rot": `${s.rot}deg`,
            } as CSSProperties
          }
        >
          {s.ch}
        </span>
      ))}
    </div>
  );
}

/* ---------- application ---------- */

export default function App() {
  const [entries, setEntries] = useState<CopyEntry[]>([]);
  const [toast, setToast] = useState<{ key: number; title: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const handleCopy = useCallback((name: string, lang: string, code: string) => {
    setEntries((prev) =>
      [
        {
          id: Date.now() + Math.random(),
          name,
          lang,
          code,
          time: new Date().toLocaleTimeString("fr-FR"),
        },
        ...prev,
      ].slice(0, 12),
    );
    setToast({ key: Date.now(), title: name });
  }, []);

  const handleRecopy = useCallback(async (e: CopyEntry) => {
    const ok = await copyText(e.code);
    if (ok) setToast({ key: Date.now(), title: e.name });
  }, []);

  return (
    <div id="haut" className="relative min-h-screen">
      <Ambient />

      <div className="relative z-10">
        <Header count={entries.length} />
        <main>
          <Opening />
          <Ticker />
          <Atelier onCopy={handleCopy} />
          <Methode />
          <Ticker />
          <Astuces />
          <Journal
            entries={entries}
            onRecopy={handleRecopy}
            onClear={() => setEntries([])}
          />
        </main>
        <Footer />
      </div>

      <div className="noise-overlay pointer-events-none fixed inset-0 z-[60]" aria-hidden />

      {toast && (
        <div
          key={toast.key}
          className="toast-in fixed right-6 bottom-6 z-[70] flex items-center gap-3 rounded-lg border border-mint/50 bg-pine px-4 py-3 shadow-[0_18px_44px_-12px_rgba(0,0,0,0.75)]"
          role="status"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-mint/15 text-mint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
              <path d="m4 12.5 5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            <span className="block text-sm font-semibold text-fog">{toast.title}</span>
            <span className="block font-mono text-[11px] text-sage">
              copié dans le presse-papiers
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
