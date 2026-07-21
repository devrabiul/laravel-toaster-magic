import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { TypeButtons } from "../components/ToastDemo";
import { routeByPath } from "../data/routes";

const INSTALL = `composer require devrabiul/laravel-toaster-magic
php artisan vendor:publish --provider="Devrabiul\\ToastMagic\\ToastMagicServiceProvider"`;

const BLADE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>My App</title>

    {{-- Toaster Magic stylesheet --}}
    {!! ToastMagic::styles() !!}
</head>
<body>
    @yield('content')

    {{-- Toaster Magic scripts (keep last, before </body>) --}}
    {!! ToastMagic::scripts() !!}
</body>
</html>`;

const CONTROLLER = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

public function store(Request $request)
{
    Post::create($request->validated());

    ToastMagic::success('Successfully Created');

    return back();
}`;

export default function GettingStarted() {
  return (
    <DocPage page={routeByPath("/docs/getting-started")!}>
      <h1>Getting Started</h1>
      <p className="lead">
        Laravel Toaster Magic is a lightweight, dependency-free toast notification package for
        Laravel. Add elegant, animated toasts to your app in three short steps — no jQuery, Bootstrap,
        or Tailwind required.
      </p>

      <H2 id="what-it-is">What it is</H2>
      <p>
        Toaster Magic ships everything you need to flash beautiful notifications from your Laravel
        backend: a <code>ToastMagic</code> facade for controllers, seven built-in themes, smooth
        animations with automatic stack reflow, and first-class Livewire v3 &amp; v4 support. It has{" "}
        <strong>zero frontend dependencies</strong> — the styles and scripts are self-contained and
        published for you automatically.
      </p>
      <Callout kind="info">
        The package is maintained by Muhammad Rabiul. Source lives on{" "}
        <a href="https://github.com/devrabiul/laravel-toaster-magic" target="_blank" rel="noreferrer">
          GitHub
        </a>{" "}
        and releases on{" "}
        <a
          href="https://packagist.org/packages/devrabiul/laravel-toaster-magic"
          target="_blank"
          rel="noreferrer"
        >
          Packagist
        </a>
        . You can play with every theme on the{" "}
        <a href="https://laravel-toaster-magic.rixetbd.com" target="_blank" rel="noreferrer">
          live demo
        </a>
        .
      </Callout>

      <H2 id="the-three-step-path">The three-step path</H2>
      <p>
        Getting from a fresh install to your first toast is a matter of three moves: install, wire up
        the Blade layout, and fire a toast from a controller.
      </p>

      <H2 id="step-1-install">1. Install &amp; publish</H2>
      <p>
        Pull the package in with Composer, then publish its assets and config with{" "}
        <code>vendor:publish</code>:
      </p>
      <CodeBlock code={INSTALL} language="bash" />
      <Callout kind="tip">
        Publishing is optional — assets also auto-publish on first page load and refresh
        automatically when the package updates. See the full{" "}
        <Link to="/docs/installation">Installation</Link> guide for details.
      </Callout>

      <H2 id="step-2-blade">2. Add the styles &amp; scripts</H2>
      <p>
        Render the stylesheet inside <code>&lt;head&gt;</code> and the scripts just before the closing{" "}
        <code>&lt;/body&gt;</code> tag of your main Blade layout. Do this once and every page inherits
        toast support:
      </p>
      <CodeBlock code={BLADE} language="html" filename="resources/views/layouts/app.blade.php" />

      <H2 id="step-3-fire">3. Fire a toast from a controller</H2>
      <p>
        Import the facade and call one of the four type helpers —{" "}
        <code>success</code>, <code>error</code>, <code>warning</code>, or <code>info</code> — then{" "}
        <code>return back()</code>. The toast is flashed to the session and appears on the next page
        load:
      </p>
      <CodeBlock code={CONTROLLER} language="php" />

      <H2 id="try-it">See it in action</H2>
      <p>
        Here is exactly what your users will see. Click a button to fire a live toast right on this
        page:
      </p>
      <TypeButtons />

      <H2 id="next-steps">Next steps</H2>
      <p>You have the essentials — now go deeper:</p>
      <div className="card-grid">
        <Link className="card" to="/docs/installation">
          <p className="card__title">Installation →</p>
          <p className="card__desc">
            Composer, <code>vendor:publish</code>, requirements, and auto-publishing.
          </p>
        </Link>
        <Link className="card" to="/docs/quick-start">
          <p className="card__title">Quick Start →</p>
          <p className="card__desc">A minimal, end-to-end first-toast walkthrough.</p>
        </Link>
        <Link className="card" to="/docs/configuration">
          <p className="card__title">Configuration →</p>
          <p className="card__desc">Set global defaults for theme, position, and timing.</p>
        </Link>
      </div>
    </DocPage>
  );
}
