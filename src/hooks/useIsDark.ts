import { useEffect, useState } from "react";

/** Reactively tracks the `.dark` class on <html> so components (e.g. code blocks)
 *  can re-render when the theme toggles. */
export function useIsDark(): boolean {
  const [dark, setDark] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}
