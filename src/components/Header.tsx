const LINKS = [
  { href: "#atelier", label: "atelier" },
  { href: "#methode", label: "méthode" },
  { href: "#astuces", label: "astuces" },
  { href: "#journal", label: "journal" },
];

export default function Header({ count }: { count: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a href="#haut" className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-mint/50 bg-mint/10 font-mono text-sm font-bold text-mint transition-colors group-hover:bg-mint group-hover:text-ink">
            {"{}"}
          </span>
          <span className="font-mono text-[15px] font-bold tracking-tight text-fog">
            petit_code
          </span>
          <span className="blink mt-0.5 inline-block h-[15px] w-[8px] bg-mint" aria-hidden />
        </a>

        <nav className="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="lien font-mono text-xs lowercase text-sage hover:text-amber"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div
          key={count}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] ${
            count > 0 ? "pop border-mint/50 bg-mint/10 text-mint" : "border-line text-sage"
          }`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {count} copi{count > 1 ? "es" : "e"}
        </div>
      </div>
    </header>
  );
}
