import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "tm-theme";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Reads/writes the color scheme. Keeps the `.dark` class on <html> (used by the
 * docs styles) and the `theme` attribute on <body> (used by toaster-magic's own
 * CSS) in sync so the live toast demos follow the docs theme.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const apply = useCallback((next: Theme) => {
    const dark = next === "dark";
    document.documentElement.classList.toggle("dark", dark);
    document.body.setAttribute("theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore private-mode storage errors */
    }
  }, []);

  useEffect(() => {
    apply(theme);
  }, [theme, apply]);

  // Follow the OS preference until the user makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      if (!stored) setThemeState(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}
