import { useState } from "react";
import { Link } from "react-router-dom";
import { toastMagic, type ToastMagicConfig } from "toaster-magic";
import { CodeBlock } from "../components/CodeBlock";
import { Seo } from "../components/Seo";
import { routeByPath } from "../data/routes";

const HERO_CODE = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

public function store(Request $request)
{
    // ... validate & save your model ...

    ToastMagic::success(
        'Success!',
        'Your data has been saved!',
    );

    return back();
}`;

const CONTROLLER_CODE = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

ToastMagic::success('Saved', 'Profile updated.');`;

const LIVEWIRE_CODE = `$this->dispatch('toastMagic',
    status: 'success',
    title: 'Saved',
    message: 'Profile updated.',
);`;

const JS_CODE = `const toast = new ToastMagic();

toast.success('Saved', 'Profile updated.');`;

const THEME_IDS = [
  "default",
  "material",
  "ios",
  "glassmorphism",
  "neon",
  "minimal",
  "neumorphism",
] as const;

const FEATURES = [
  "⚡ Livewire v3 & v4",
  "🎨 7 themes",
  "🎬 4 animations",
  "🌙 Dark mode",
  "🌍 RTL support",
  "✅ Zero dependencies",
];

function fireSaved(theme: ToastMagicConfig["theme"] = "default") {
  toastMagic.configure({ theme, closeButton: true, positionClass: "toast-top-end" });
  toastMagic.success("Success!", "Your data has been saved!");
}

function fireThemed(theme: ToastMagicConfig["theme"]) {
  toastMagic.configure({ theme, closeButton: true, positionClass: "toast-top-end" });
  toastMagic.success(`${theme} theme`, "This is how a toast looks.");
}

export default function Home() {
  const home = routeByPath("/")!;
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText("composer require devrabiul/laravel-toaster-magic");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <Seo title={home.title} description={home.description} path="/" keywords={home.keywords} />
      <div className="home">
        {/* Split code-forward hero: copy on the left, live editor card on the right */}
        <section className="split-hero">
          <div className="hero__bg" aria-hidden="true">
            <span className="hero__blob hero__blob--1" />
            <span className="hero__blob hero__blob--2" />
            <span className="hero__blob hero__blob--3" />
            <div className="hero__grid" />
          </div>

          <div className="split-hero__copy">
            <span className="hero__badge">🎉 v2.3 · Livewire v3 &amp; v4 · MIT licensed</span>
            <h1 className="split-hero__title">
              Laravel toasts that feel <span className="grad">magic</span>
            </h1>
            <p className="split-hero__subtitle">
              A lightweight, dependency-free toast package for Laravel — 7 themes, smooth animations,
              and first-class Livewire support. No jQuery, Bootstrap, or Tailwind.
            </p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/docs/getting-started">
                Get Started →
              </Link>
              <a
                className="btn btn--ghost"
                href="https://github.com/devrabiul/laravel-toaster-magic"
                target="_blank"
                rel="noreferrer"
              >
                ★ Star on GitHub
              </a>
            </div>
            <div className="split-hero__install">
              <span style={{ color: "var(--text-faint)" }}>$</span>
              <span>composer require devrabiul/laravel-toaster-magic</span>
              <button onClick={copyInstall} aria-label="Copy install command">
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="split-hero__demo">
            <div className="code-window">
              <div className="code-window__bar">
                <span className="code-window__dot code-window__dot--r" />
                <span className="code-window__dot code-window__dot--y" />
                <span className="code-window__dot code-window__dot--g" />
                <span className="code-window__file">app/Http/Controllers/PostController.php</span>
              </div>
              <CodeBlock code={HERO_CODE} language="php" />
              <div className="code-window__run">
                <span>This is the exact toast it fires →</span>
                <button className="btn-run" onClick={() => fireSaved()}>
                  ▶ Run example
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="feature-strip">
          {FEATURES.map((f) => (
            <span className="feature-strip__item" key={f}>
              {f}
            </span>
          ))}
        </div>

        {/* Same toast, three call sites */}
        <section className="home-section">
          <h2 className="home-section__title">Use it your way</h2>
          <p className="home-section__sub">
            Fire the same toast from a controller, a Livewire component, or the browser. Click{" "}
            <strong>Run</strong> to see each one.
          </p>
          <div className="usage-grid">
            <div className="usage-card">
              <div className="usage-card__head">
                <div className="usage-card__tag">Controller</div>
                <div className="usage-card__title">ToastMagic facade</div>
              </div>
              <CodeBlock code={CONTROLLER_CODE} language="php" />
              <div className="usage-card__run">
                <button className="btn-run" onClick={() => fireSaved()}>
                  ▶ Run
                </button>
              </div>
            </div>

            <div className="usage-card">
              <div className="usage-card__head">
                <div className="usage-card__tag">Livewire</div>
                <div className="usage-card__title">dispatch event</div>
              </div>
              <CodeBlock code={LIVEWIRE_CODE} language="php" />
              <div className="usage-card__run">
                <button className="btn-run" onClick={() => fireSaved()}>
                  ▶ Run
                </button>
              </div>
            </div>

            <div className="usage-card">
              <div className="usage-card__head">
                <div className="usage-card__tag">JavaScript</div>
                <div className="usage-card__title">new ToastMagic()</div>
              </div>
              <CodeBlock code={JS_CODE} language="js" />
              <div className="usage-card__run">
                <button className="btn-run" onClick={() => fireSaved()}>
                  ▶ Run
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive theme row */}
        <section className="home-section">
          <h2 className="home-section__title">Seven themes, one config line</h2>
          <p className="home-section__sub">
            Set <code>'theme'</code> in <code>config/laravel-toaster-magic.php</code> — or click one
            to preview it live.
          </p>
          <div className="themes-line__chips">
            {THEME_IDS.map((t) => (
              <button key={t} className="theme-chip" onClick={() => fireThemed(t)}>
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="cta-band">
          <h2 className="home-section__title">Ready to sprinkle some magic?</h2>
          <p className="home-section__sub">
            Read the guide, explore the API, or jump straight into examples.
          </p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/docs/quick-start">
              Quick Start →
            </Link>
            <Link className="btn btn--ghost" to="/docs/api">
              API Reference
            </Link>
          </div>
        </section>

        <footer className="home-footer">
          Built with ♥ by{" "}
          <a href="https://github.com/devrabiul" target="_blank" rel="noreferrer">
            Muhammad Rabiul
          </a>
          . Released under the MIT License.
        </footer>
      </div>
    </>
  );
}
