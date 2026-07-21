import { useState } from "react";
import { Link } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { Playground } from "../components/ToastDemo";
import { Seo } from "../components/Seo";
import { routeByPath } from "../data/routes";

const FEATURES = [
  { icon: "🔥", title: "Simple, fluent API", desc: "One-liners from any controller: ToastMagic::success('Saved'). Static or fluent syntax." },
  { icon: "⚡", title: "Livewire ready", desc: "First-class support for Livewire v3 & v4 with event-based dispatching." },
  { icon: "🎨", title: "7 beautiful themes", desc: "default, material, iOS, glassmorphism, neon, minimal, neumorphism." },
  { icon: "🎬", title: "Smooth animations", desc: "slide, fade, pop, bounce — plus a FLIP stack reflow when toasts stack." },
  { icon: "🌙", title: "Dark mode built in", desc: "Enable it globally with a single theme=\"dark\" attribute on <body>." },
  { icon: "🌍", title: "RTL support", desc: "Full compatibility with right-to-left languages, out of the box." },
  { icon: "🖼️", title: "Avatar toasts", desc: "Render an image in place of the type icon for notification-style toasts." },
  { icon: "✅", title: "Zero dependencies", desc: "No jQuery, Bootstrap, or Tailwind required. Drop it into any project." },
];

const QUICK_CODE = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

public function store()
{
    ToastMagic::success('Success!', 'Your data has been saved!');

    return back();
}`;

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
        {/* Compact hero — gets out of the way fast so the playground leads */}
        <section className="hero hero--compact">
          <div className="hero__bg" aria-hidden="true">
            <span className="hero__blob hero__blob--1" />
            <span className="hero__blob hero__blob--2" />
            <span className="hero__blob hero__blob--3" />
            <div className="hero__grid" />
          </div>
          <span className="hero__badge">🎉 v2.3 · Livewire v3 &amp; v4 · MIT licensed</span>
          <h1 className="hero__title">
            Laravel toasts that feel <span className="grad">magic</span>
          </h1>
          <p className="hero__subtitle">
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
          <div className="hero__install">
            <span style={{ color: "var(--text-faint)" }}>$</span>
            <span>composer require devrabiul/laravel-toaster-magic</span>
            <button onClick={copyInstall} aria-label="Copy install command">
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </section>

        {/* Playground leads the page — try before you read */}
        <section className="playground-showcase" aria-labelledby="try-it-live">
          <div className="playground-showcase__head">
            <h2 id="try-it-live">Try it live</h2>
            <p>
              Pick a theme, animation, and position, then fire a real toast — right here, no install
              required. It renders with the same engine the package ships.
            </p>
          </div>
          <Playground />
        </section>

        <section className="home-section">
          <h2 className="home-section__title">Everything you need</h2>
          <p className="home-section__sub">
            Batteries included, but small enough to forget it's there.
          </p>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div className="feature" key={f.title}>
                <div className="feature__icon" aria-hidden="true">
                  {f.icon}
                </div>
                <p className="feature__title">{f.title}</p>
                <p className="feature__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="home-section">
          <h2 className="home-section__title">Three lines to your first toast</h2>
          <p className="home-section__sub">Trigger it from a controller — no boilerplate.</p>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <CodeBlock code={QUICK_CODE} language="php" filename="app/Http/Controllers/PostController.php" />
          </div>
        </section>

        <section className="home-section" style={{ textAlign: "center" }}>
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
