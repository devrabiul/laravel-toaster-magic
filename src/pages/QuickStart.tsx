import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { TypeButtons } from "../components/ToastDemo";
import { routeByPath } from "../data/routes";

const INSTALL = `composer require devrabiul/laravel-toaster-magic
php artisan vendor:publish --provider="Devrabiul\\ToastMagic\\ToastMagicServiceProvider"`;

const LAYOUT = `<head>
    {{-- ... --}}
    {!! ToastMagic::styles() !!}
</head>
<body>
    @yield('content')

    {!! ToastMagic::scripts() !!}
</body>`;

const CONTROLLER = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

public function store(Request $request)
{
    $user = User::create($request->validated());

    ToastMagic::success('User created', 'The account is ready to use.');

    return back();
}`;

export default function QuickStart() {
  return (
    <DocPage page={routeByPath("/docs/quick-start")!}>
      <h1>Quick Start</h1>
      <p className="lead">
        The shortest path from an empty Laravel app to a working toast — install, wire up the layout,
        and fire a notification from a controller.
      </p>

      <H2 id="step-1-install">1. Install the package</H2>
      <p>Require it with Composer and publish the assets and config:</p>
      <CodeBlock code={INSTALL} language="bash" />
      <Callout kind="info">
        Assets auto-publish on first load too, so you can even skip the second command. See{" "}
        <Link to="/docs/installation">Installation</Link> for the full breakdown.
      </Callout>

      <H2 id="step-2-layout">2. Add the styles &amp; scripts to your layout</H2>
      <p>
        Drop the stylesheet into <code>&lt;head&gt;</code> and the scripts right before the closing{" "}
        <code>&lt;/body&gt;</code> tag of your main Blade layout. This is a one-time change that every
        view extending the layout inherits:
      </p>
      <CodeBlock code={LAYOUT} language="html" filename="resources/views/layouts/app.blade.php" />

      <H2 id="step-3-trigger">3. Trigger a toast from a controller</H2>
      <p>
        Import the <code>ToastMagic</code> facade, call <code>success()</code> with a heading (and an
        optional description), then <code>return back()</code>. Toaster Magic flashes the toast to the
        session and displays it on the redirected page:
      </p>
      <CodeBlock code={CONTROLLER} language="php" />
      <p>That's the entire loop. Reload the page after the action and the toast slides in.</p>

      <H2 id="try-it">Try it live</H2>
      <p>Click any button to fire a real toast — the same component your users will see:</p>
      <TypeButtons />

      <H2 id="next">Next steps</H2>
      <Callout kind="tip">
        Now learn the full API in <Link to="/docs/basic-usage">Basic Usage</Link> — the four toast
        types, headings vs. descriptions, per-toast options, validation errors, and avatar toasts.
      </Callout>
    </DocPage>
  );
}
