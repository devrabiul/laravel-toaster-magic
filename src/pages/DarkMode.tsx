import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2, H3 } from "../components/Heading";
import { TypeButtons } from "../components/ToastDemo";
import { routeByPath } from "../data/routes";

const BODY_ATTR = `<!doctype html>
<html lang="en">
<head>
    {!! ToastMagic::styles() !!}
</head>
<body theme="dark">
    {{-- your app --}}

    {!! ToastMagic::scripts() !!}
</body>
</html>`;

const BLADE_DYNAMIC = `{{-- Drive the attribute from a user preference or session --}}
<body theme="{{ auth()->user()?->dark_mode ? 'dark' : 'light' }}">`;

const TOGGLE_JS = `<script>
  function toggleToastTheme() {
    const body = document.body;
    const isDark = body.getAttribute('theme') === 'dark';
    body.setAttribute('theme', isDark ? 'light' : 'dark');
  }
</script>

<button type="button" onclick="toggleToastTheme()">Toggle theme</button>`;

const OS_JS = `<script>
  // Follow the operating-system preference on load
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.setAttribute('theme', prefersDark ? 'dark' : 'light');
</script>`;

export default function DarkMode() {
  return (
    <DocPage page={routeByPath("/docs/dark-mode")!}>
      <h1>Dark Mode</h1>
      <p className="lead">
        Laravel Toaster Magic reads a single <code>theme</code> attribute on the{" "}
        <code>&lt;body&gt;</code> element. Set it to <code>dark</code> and every toast renders in its
        dark variant — no extra config, assets, or CSS required.
      </p>

      <H2 id="enabling-dark-mode">Enabling dark mode</H2>
      <p>
        Add <code>theme="dark"</code> to the <code>&lt;body&gt;</code> tag of your Blade layout. Keep
        the usual <code>ToastMagic::styles()</code> in the <code>&lt;head&gt;</code> and{" "}
        <code>ToastMagic::scripts()</code> before <code>&lt;/body&gt;</code>:
      </p>
      <CodeBlock code={BODY_ATTR} language="html" filename="resources/views/layouts/app.blade.php" />
      <Callout kind="info">
        The value can be <code>dark</code> or <code>light</code>. When the attribute is absent,
        toasts render in the light appearance. Because it lives on <code>&lt;body&gt;</code>, one
        attribute covers every toast on the page.
      </Callout>

      <H3 id="driving-from-a-preference">Driving it from a user preference</H3>
      <p>
        Because it is just a Blade attribute, you can bind it to a stored preference, a session
        value, or a cookie:
      </p>
      <CodeBlock code={BLADE_DYNAMIC} language="html" />

      <H2 id="how-it-interacts-with-themes">How it interacts with themes</H2>
      <p>
        Dark mode is orthogonal to the seven <Link to="/docs/themes">themes</Link>. The{" "}
        <code>theme</code> config option chooses the <em>visual style</em> (default, material, iOS,
        glassmorphism, neon, minimal, neumorphism), while the <code>theme="dark"</code> attribute
        chooses the <em>color scheme</em>. Every built-in theme ships light and dark variants, so the
        two settings compose: a <code>material</code> toast automatically switches to its dark
        surface when the body is marked dark.
      </p>
      <Callout kind="tip">
        The <code>neon</code> theme is designed for dark interfaces and looks especially good with{" "}
        <code>theme="dark"</code>. Themes that lean on blur, such as <code>glassmorphism</code> and{" "}
        <code>ios</code>, also adapt their translucency to the darker backdrop.
      </Callout>

      <H2 id="toggling-dynamically">Toggling dynamically</H2>
      <p>
        Switching at runtime is a one-line attribute change — flip <code>theme</code> between{" "}
        <code>dark</code> and <code>light</code> and every visible and future toast follows
        instantly:
      </p>
      <CodeBlock code={TOGGLE_JS} language="html" />

      <H3 id="following-the-os-preference">Following the OS preference</H3>
      <p>
        To respect the visitor's system setting, read <code>prefers-color-scheme</code> and set the
        attribute on load. Place this in an inline script in the <code>&lt;head&gt;</code> so there
        is no flash of the wrong appearance before your app paints:
      </p>
      <CodeBlock code={OS_JS} language="html" />

      <H2 id="live-preview">Live preview</H2>
      <p>
        Use the theme toggle in this site's top bar, then fire a toast below — the toast styling
        tracks the page's light or dark appearance.
      </p>
      <TypeButtons />

      <Callout kind="info">
        Dark mode also pairs with <Link to="/docs/color-gradient-mode">color &amp; gradient mode</Link>{" "}
        and any <Link to="/docs/positioning">position</Link>, so you can fine-tune the full look
        without leaving the config file.
      </Callout>
    </DocPage>
  );
}
