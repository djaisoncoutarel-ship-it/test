import { useEffect, useRef, useState } from "react";

/* Révélation d'un bloc quand il entre dans le viewport. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* Effet « décodage » : le texte se brouille puis se révèle. */
export function useScramble(text: string, delay = 0, speed = 26) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const CHARS = "{}<>/;:=*#";
    let frame = 0;
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        frame += 1;
        const reveal = Math.floor(frame / 2);
        if (reveal >= text.length) {
          setOut(text);
          if (interval) window.clearInterval(interval);
          return;
        }
        let s = text.slice(0, reveal);
        for (let i = reveal; i < text.length; i += 1) {
          s += text[i] === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setOut(s);
      }, speed);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [text, delay, speed]);
  return out;
}
