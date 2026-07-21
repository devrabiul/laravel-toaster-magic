import { Link } from "react-router-dom";
import { DocPage } from "../../components/DocPage";
import { H2, H3 } from "../../components/Heading";
import { CodeBlock } from "../../components/CodeBlock";
import { Callout } from "../../components/Callout";
import { routeByPath } from "../../data/routes";

const STYLES = `{{-- Inside the <head> --}}
{!! ToastMagic::styles() !!}`;

const SCRIPTS = `{{-- Just before the closing </body> tag --}}
{!! ToastMagic::scripts() !!}`;

const LAYOUT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name') }}</title>

    {{-- Your own CSS --}}
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

    {{-- Toaster Magic styles --}}
    {!! ToastMagic::styles() !!}
</head>
<body>
    <main class="container">
        @yield('content')
    </main>

    {{-- Your own JS --}}
    <script src="{{ asset('js/app.js') }}"></script>

    {{-- Toaster Magic scripts — always last --}}
    {!! ToastMagic::scripts() !!}
</body>
</html>`;

const DARK = `{{-- Add theme="dark" to <body> to render toasts in dark mode --}}
<body theme="dark">`;

export default function BladePage() {
  return (
    <DocPage page={routeByPath("/docs/integration/blade")!}>
      <h1>Blade Setup</h1>
      <p className="lead">
        Render the required stylesheet and scripts in your Blade layout so toasts can appear on every
        page. Two directives, one placed in the head and one before the closing body tag, are all you
        need.
      </p>

      <H2 id="add-the-styles">Add the styles</H2>
      <p>
        Place <code>ToastMagic::styles()</code> inside the <code>&lt;head&gt;</code> of your layout.
        The <code>{"{!! !!}"}</code> unescaped echo is required so the tag renders as HTML rather than
        escaped text:
      </p>
      <CodeBlock code={STYLES} language="html" />

      <H2 id="add-the-scripts">Add the scripts</H2>
      <p>
        Place <code>ToastMagic::scripts()</code> immediately before the closing{" "}
        <code>&lt;/body&gt;</code> tag. This registers the runtime that renders queued toasts and
        exposes the global <code>ToastMagic</code> class used by the{" "}
        <Link to="/docs/integration/javascript">JavaScript API</Link>:
      </p>
      <CodeBlock code={SCRIPTS} language="html" />

      <H2 id="full-layout">Full layout example</H2>
      <p>
        Here is a complete master layout with both directives wired up alongside your own assets.
        Extend this from your page views with <code>@extends</code>:
      </p>
      <CodeBlock code={LAYOUT} language="html" filename="resources/views/layouts/app.blade.php" />

      <H3 id="where-to-place-them">Where to place them</H3>
      <p>
        Position matters. Keep <code>styles()</code> in the head so toasts are styled before they
        paint, and keep <code>scripts()</code> as the <strong>last</strong> thing before{" "}
        <code>&lt;/body&gt;</code> — after your own JavaScript — so the runtime is initialised once
        the page is ready. Adding both to a shared master layout means every page that extends it can
        show toasts with no further setup.
      </p>

      <Callout kind="tip">
        To render toasts in dark mode, add a <code>theme="dark"</code> attribute to your{" "}
        <code>&lt;body&gt;</code> tag. See <Link to="/docs/dark-mode">Dark Mode</Link> for details.
      </Callout>
      <CodeBlock code={DARK} language="html" />

      <H2 id="assets-auto-publish">Assets auto-publish and refresh</H2>
      <p>
        You do not have to manually copy asset files. The CSS and JS referenced by these directives
        auto-publish on the first page load and refresh automatically whenever the package is
        updated, so your toasts always match the installed version.
      </p>
      <Callout kind="info">
        You can still publish the config and assets explicitly with{" "}
        <code>vendor:publish</code>. See the full{" "}
        <Link to="/docs/installation">Installation</Link> guide for the Composer command and the
        publish provider.
      </Callout>

      <Callout kind="warning">
        If toasts never appear, the most common cause is a missing <code>scripts()</code> directive
        or JavaScript that runs before it. Double-check both directives are present and correctly
        ordered — <Link to="/docs/troubleshooting">Troubleshooting</Link> covers the rest.
      </Callout>
    </DocPage>
  );
}
