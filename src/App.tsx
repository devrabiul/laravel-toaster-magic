import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SearchDialog } from "./components/SearchDialog";
import { Sidebar } from "./components/Sidebar";

// Pages are imported eagerly (not lazily) so route changes are instant with no
// loading flash. The whole site is small enough that a single bundle is faster
// to navigate than paying a Suspense fallback on every page change.
import Home from "./pages/Home";
import GettingStarted from "./pages/GettingStarted";
import Installation from "./pages/Installation";
import QuickStart from "./pages/QuickStart";
import BasicUsage from "./pages/BasicUsage";
import Themes from "./pages/Themes";
import Animations from "./pages/Animations";
import Positioning from "./pages/Positioning";
import Configuration from "./pages/Configuration";
import ColorGradientMode from "./pages/ColorGradientMode";
import DarkMode from "./pages/DarkMode";
import Examples from "./pages/Examples";
import Security from "./pages/Security";
import BestPractices from "./pages/BestPractices";
import Migration from "./pages/Migration";
import Controllers from "./pages/integration/ControllersPage";
import Livewire from "./pages/integration/LivewirePage";
import JavaScriptPage from "./pages/integration/JavaScriptPage";
import Blade from "./pages/integration/BladePage";
import Api from "./pages/Api";
import Methods from "./pages/Methods";
import Options from "./pages/Options";
import Faq from "./pages/Faq";
import Troubleshooting from "./pages/Troubleshooting";
import Changelog from "./pages/Changelog";
import Contributing from "./pages/Contributing";
import License from "./pages/License";
import NotFound from "./pages/NotFound";

/** Scrolls to top on route change, or to the anchored heading if the URL has a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // ⌘K / Ctrl+K opens search; "/" opens it when not typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (
        e.key === "/" &&
        !searchOpen &&
        !/^(input|textarea|select)$/i.test((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <ScrollManager />
      <Navbar
        onMenuClick={() => setSidebarOpen((o) => !o)}
        onSearchClick={() => setSearchOpen(true)}
      />

      {isHome ? (
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      ) : (
        <div className="layout">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main id="main-content">
            <Routes>
              <Route path="/docs/getting-started" element={<GettingStarted />} />
              <Route path="/docs/installation" element={<Installation />} />
              <Route path="/docs/quick-start" element={<QuickStart />} />
              <Route path="/docs/basic-usage" element={<BasicUsage />} />
              <Route path="/docs/themes" element={<Themes />} />
              <Route path="/docs/animations" element={<Animations />} />
              <Route path="/docs/positioning" element={<Positioning />} />
              <Route path="/docs/configuration" element={<Configuration />} />
              <Route path="/docs/color-gradient-mode" element={<ColorGradientMode />} />
              <Route path="/docs/dark-mode" element={<DarkMode />} />
              <Route path="/docs/examples" element={<Examples />} />
              <Route path="/docs/security" element={<Security />} />
              <Route path="/docs/best-practices" element={<BestPractices />} />
              <Route path="/docs/migration" element={<Migration />} />
              <Route path="/docs/integration/controllers" element={<Controllers />} />
              <Route path="/docs/integration/livewire" element={<Livewire />} />
              <Route path="/docs/integration/javascript" element={<JavaScriptPage />} />
              <Route path="/docs/integration/blade" element={<Blade />} />
              <Route path="/docs/api" element={<Api />} />
              <Route path="/docs/methods" element={<Methods />} />
              <Route path="/docs/options" element={<Options />} />
              <Route path="/docs/faq" element={<Faq />} />
              <Route path="/docs/troubleshooting" element={<Troubleshooting />} />
              <Route path="/docs/changelog" element={<Changelog />} />
              <Route path="/docs/contributing" element={<Contributing />} />
              <Route path="/docs/license" element={<License />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      )}

      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
