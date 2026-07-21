import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

const HELPERS = `<head>
    {!! ToastMagic::styles() !!}
</head>
<body>
    @yield('content')
    {!! ToastMagic::scripts() !!}
</body>`;

const POSITION = `// config/laravel-toaster-magic.php
'options' => [
    'positionClass' => 'toast-bottom-end',
],`;

const LIVEWIRE = `// config/laravel-toaster-magic.php
'livewire_enabled' => true,
'livewire_version' => 'v4', // must match your installed Livewire major version`;

const REPUBLISH = `php artisan vendor:publish \\
    --provider="Devrabiul\\ToastMagic\\ToastMagicServiceProvider" --force`;

const DARK = `<body theme="dark">`;

export default function Troubleshooting() {
  return (
    <DocPage page={routeByPath("/docs/troubleshooting")!}>
      <h1>Troubleshooting</h1>
      <p className="lead">Fixes for the issues people hit most often.</p>

      <H2 id="not-appearing">Toasts don't appear at all</H2>
      <p>
        By far the most common cause is a missing asset helper. Both{" "}
        <code>ToastMagic::styles()</code> and <code>ToastMagic::scripts()</code> must be present in your
        layout — the first in <code>&lt;head&gt;</code>, the second just before <code>&lt;/body&gt;</code>:
      </p>
      <CodeBlock code={HELPERS} language="html" />
      <Callout kind="warning">
        If only <code>styles()</code> is present, the toast container is styled but never initialised, so
        nothing fires. If only <code>scripts()</code> is present, toasts render unstyled. You need both.
      </Callout>

      <H2 id="wrong-position">Toasts show in the wrong corner</H2>
      <p>
        The anchor is controlled by <code>positionClass</code>. Set it under the <code>options</code> key in
        the config to one of the six valid values (<code>toast-top-start</code>, <code>toast-top-end</code>,{" "}
        <code>toast-top-center</code>, <code>toast-bottom-start</code>, <code>toast-bottom-end</code>,{" "}
        <code>toast-bottom-center</code>):
      </p>
      <CodeBlock code={POSITION} language="php" />
      <Callout kind="info">
        Config changes are cached in production. Run <code>php artisan config:clear</code> (or{" "}
        <code>config:cache</code>) after editing so the new position takes effect. See{" "}
        <Link to="/docs/positioning">Positioning</Link>.
      </Callout>

      <H2 id="livewire-not-firing">Livewire toasts don't fire</H2>
      <p>
        Event-based dispatching is opt-in. Make sure <code>livewire_enabled</code> is <code>true</code> and{" "}
        <code>livewire_version</code> exactly matches the Livewire major version installed in your app:
      </p>
      <CodeBlock code={LIVEWIRE} language="php" />
      <Callout kind="warning">
        A mismatched <code>livewire_version</code> (for example <code>'v3'</code> while running Livewire 4)
        is the usual reason a dispatched <code>toastMagic</code> event is silently ignored. Confirm your
        component dispatches the event with the <code>status</code>, <code>title</code>, and{" "}
        <code>message</code> arguments — see <Link to="/docs/integration/livewire">Livewire</Link>.
      </Callout>

      <H2 id="stale-assets">Stale assets after an update</H2>
      <p>
        Assets normally refresh automatically when the package updates, but if you published them to{" "}
        <code>public/</code> and they look outdated after a <code>composer update</code>, re-publish with{" "}
        <code>--force</code> to overwrite the old copies:
      </p>
      <CodeBlock code={REPUBLISH} language="bash" />
      <Callout kind="tip">
        Follow up with a hard refresh (or a cache-busting deploy) so browsers drop the previously cached CSS
        and JS.
      </Callout>

      <H2 id="dark-mode-not-applying">Dark mode isn't applying</H2>
      <p>
        Dark mode is triggered by a <code>theme="dark"</code> attribute on the <code>&lt;body&gt;</code>{" "}
        element. If your toasts stay light, confirm the attribute is actually present on <code>body</code>{" "}
        (not <code>html</code> or a wrapper) when the toast is shown:
      </p>
      <CodeBlock code={DARK} language="html" />
      <Callout kind="info">
        If you toggle dark mode dynamically, make sure the attribute is set before the toast is triggered.
        See <Link to="/docs/dark-mode">Dark Mode</Link>.
      </Callout>

      <Callout kind="tip">
        Still stuck? Open an issue with a minimal reproduction on{" "}
        <a
          href="https://github.com/devrabiul/laravel-toaster-magic/issues"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </Callout>
    </DocPage>
  );
}
