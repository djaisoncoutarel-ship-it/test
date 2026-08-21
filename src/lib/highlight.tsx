import React from "react";

/* Mini-coloration syntaxique maison, ligne par ligne. */

function renderCssLine(line: string): React.ReactNode {
  const trimmed = line.trim();
  const indent = line.match(/^\s*/)?.[0] ?? "";

  if (trimmed.endsWith("{")) {
    return (
      <>
        {indent}
        <span className="tk-sel">{trimmed.slice(0, -1).trim()}</span>
        <span className="tk-br"> {"{"}</span>
      </>
    );
  }
  if (trimmed === "}") {
    return <span className="tk-br">{line}</span>;
  }
  const m = trimmed.match(/^([a-zA-Z-]+)\s*:\s*([\s\S]*)$/);
  if (m) {
    return (
      <>
        {indent}
        <span className="tk-prop">{m[1]}</span>
        <span className="tk-br">:</span>
        <span className="tk-val"> {m[2]}</span>
      </>
    );
  }
  return line;
}

function renderHtmlLine(line: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  const re = /(<\/?)([a-zA-Z][\w-]*)|([\w-]+)(?==")|(="[^"]*")|(\/?>)/g;
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    if (m[1] !== undefined || m[5] !== undefined) {
      out.push(
        <span key={k++} className="tk-br">
          {m[0]}
        </span>,
      );
    } else if (m[2] !== undefined) {
      out.push(
        <span key={k++} className="tk-tag">
          {m[2]}
        </span>,
      );
    } else if (m[3] !== undefined) {
      out.push(
        <span key={k++} className="tk-prop">
          {m[3]}
        </span>,
      );
    } else if (m[4] !== undefined) {
      out.push(
        <span key={k++} className="tk-str">
          {m[4]}
        </span>,
      );
    }
    last = re.lastIndex;
  }
  if (last < line.length) out.push(line.slice(last));
  return <>{out}</>;
}

export function CodeBlock({ code, lang }: { code: string; lang: "css" | "html" }) {
  const lines = code.split("\n");
  return (
    <pre className="overflow-auto p-4 text-[13px] leading-[1.7] font-mono">
      {lines.map((l, i) => (
        <div key={i} className="flex min-w-max">
          <span className="w-8 shrink-0 pr-3 text-right text-[11px] leading-[1.9] text-sage/40 select-none">
            {i + 1}
          </span>
          <span className="whitespace-pre pr-6">
            {lang === "css" ? renderCssLine(l) : renderHtmlLine(l)}
          </span>
        </div>
      ))}
    </pre>
  );
}
