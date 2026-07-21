import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

const FACADE = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

ToastMagic::success('Successfully Created');
ToastMagic::info('New update available', 'Version 2.3 is ready.');
ToastMagic::warning('Your storage is almost full');
ToastMagic::error('Something went wrong');`;

const DISPATCH = `ToastMagic::dispatch()->success('User Created', 'The user has been created.', [
    'showCloseBtn'  => true,
    'customBtnText' => 'View Profile',
    'customBtnLink' => 'https://example.com',
]);`;

const BLADE = `<!DOCTYPE html>
<html lang="en">
<head>
    {{-- Stylesheet — render inside <head> --}}
    {!! ToastMagic::styles() !!}
</head>
<body>
    @yield('content')

    {{-- Scripts — render just before </body> --}}
    {!! ToastMagic::scripts() !!}
</body>
</html>`;

const JS = `const toastMagic = new ToastMagic();

toastMagic.success('Success!', 'Your data has been saved!');
toastMagic.error('Error!', 'Something went wrong.');
toastMagic.clear(); // or toastMagic.dismissAll();`;

export default function Api() {
  return (
    <DocPage page={routeByPath("/docs/api")!}>
      <h1>API Reference</h1>
      <p className="lead">
        The complete public surface of Laravel Toaster Magic: the <code>ToastMagic</code> facade, the
        fluent <code>dispatch()</code> builder, the Blade asset helpers, and the client-side{" "}
        <code>ToastMagic</code> JavaScript class.
      </p>

      <H2 id="the-facade">The ToastMagic facade</H2>
      <p>
        Server-side toasts are flashed through the facade{" "}
        <code>Devrabiul\ToastMagic\Facades\ToastMagic</code>. Import it once, then call one of the four
        type methods with a heading, an optional description, and an optional per-toast options array —{" "}
        <code>(heading, description?, options?)</code>. The toast is queued into the session and rendered
        on the next response.
      </p>
      <CodeBlock code={FACADE} language="php" />
      <Callout kind="info">
        Every method and its full argument list is documented on the{" "}
        <Link to="/docs/methods">Methods</Link> reference, and every option key is listed on the{" "}
        <Link to="/docs/options">Options</Link> page.
      </Callout>

      <H2 id="fluent-dispatch">The fluent dispatch() builder</H2>
      <p>
        <code>ToastMagic::dispatch()</code> returns the underlying builder so you can chain a type method
        onto it. It is functionally equivalent to calling the type method on the facade directly, and reads
        naturally when you want to emphasise that a toast is being dispatched:
      </p>
      <CodeBlock code={DISPATCH} language="php" />

      <H2 id="blade-helpers">Blade asset helpers</H2>
      <p>
        Two helpers inject the package's CSS and JavaScript into your layout.{" "}
        <code>ToastMagic::styles()</code> returns the <code>&lt;link&gt;</code> tags and belongs inside{" "}
        <code>&lt;head&gt;</code>; <code>ToastMagic::scripts()</code> returns the{" "}
        <code>&lt;script&gt;</code> tags and belongs just before the closing <code>&lt;/body&gt;</code>.
        Render both with the unescaped <code>{"{!! !!}"}</code> Blade syntax:
      </p>
      <CodeBlock code={BLADE} language="html" />
      <Callout kind="tip">
        Assets are published automatically on the first page load and refresh whenever the package updates,
        so these helpers are the only wiring most applications need.
      </Callout>

      <H2 id="javascript-class">The JavaScript class</H2>
      <p>
        Once <code>ToastMagic::scripts()</code> is on the page, a global <code>ToastMagic</code> class is
        available in the browser. Instantiate it to fire toasts entirely client-side — for example from an
        AJAX success handler — without a round trip to the server:
      </p>
      <CodeBlock code={JS} language="js" />
      <p>
        The type methods accept a positional signature:{" "}
        <code>
          toastMagic.{"{type}"}(heading, description, showCloseBtn, customBtnText, customBtnLink, timeOut,
          showDuration, avatar)
        </code>
        . Call <code>clear()</code> (or its alias <code>dismissAll()</code>) to dismiss every visible toast.
      </p>

      <Callout kind="info">
        Continue to the <Link to="/docs/methods">Methods</Link> reference for every callable and its return
        value, or the <Link to="/docs/options">Options</Link> page for all option fields, types, and defaults.
      </Callout>
    </DocPage>
  );
}
