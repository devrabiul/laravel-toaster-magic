import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { TypeButtons } from "../components/ToastDemo";
import { routeByPath } from "../data/routes";

const COLOR_CONFIG = `// config/laravel-toaster-magic.php
'options' => [
    'color_mode' => true,
    // ...
],`;

const GRADIENT_CONFIG = `// config/laravel-toaster-magic.php
'options' => [
    'gradient_enable' => true,
    'theme'           => 'default', // default, material, or neon look best
    // ...
],`;

const BOTH_CONFIG = `'options' => [
    'color_mode'      => true,
    'gradient_enable' => true,
    'theme'           => 'neon',
    // ...
],`;

export default function ColorGradientMode() {
  return (
    <DocPage page={routeByPath("/docs/color-gradient-mode")!}>
      <h1>Color &amp; Gradient Mode</h1>
      <p className="lead">
        Two independent flags change how the toast surface is painted:{" "}
        <code>color_mode</code> fills the whole card with the type color, and{" "}
        <code>gradient_enable</code> adds a subtle gradient accent.
      </p>

      <H2 id="color-mode">Color mode</H2>
      <p>
        By default toasts use a neutral card with a small colored accent (icon and border) matching
        the type. Set <code>color_mode</code> to <code>true</code> and the entire background is
        tinted by type — green for success, red for error, amber for warning, and blue for info —
        for a bolder, higher-contrast look.
      </p>
      <CodeBlock code={COLOR_CONFIG} language="php" filename="config/laravel-toaster-magic.php" />
      <Callout kind="info">
        Color mode changes the <em>background</em> of the toast, so it pairs naturally with the{" "}
        <code>default</code>, <code>material</code>, and <code>minimal</code> themes. It also respects{" "}
        <Link to="/docs/dark-mode">dark mode</Link> — the tints are dimmed for dark surfaces.
      </Callout>

      <H2 id="gradient-mode">Gradient mode</H2>
      <p>
        Gradient mode keeps the type color but blends it into a soft gradient across the toast for a
        more polished, modern finish. Enable it with <code>gradient_enable</code>:
      </p>
      <CodeBlock code={GRADIENT_CONFIG} language="php" filename="config/laravel-toaster-magic.php" />
      <Callout kind="tip">
        Gradient mode works best with the <code>default</code>, <code>material</code>, and{" "}
        <code>neon</code> themes — their surfaces are designed for the gradient blend. On heavily
        blurred themes like <code>glassmorphism</code> the effect is muted. Browse all seven on the{" "}
        <Link to="/docs/themes">Themes</Link> page.
      </Callout>

      <H2 id="combining">Combining both</H2>
      <p>
        The two flags are independent and can be used together — a color-filled card with a gradient
        wash. This is especially striking on the <code>neon</code> theme in a dark UI:
      </p>
      <CodeBlock code={BOTH_CONFIG} language="php" />

      <H2 id="try-it">Try it</H2>
      <p>
        Fire a toast of each type to see the type colors these modes build on. Adjust the flags in
        your config to preview color and gradient variations in your own app:
      </p>
      <TypeButtons />

      <Callout kind="info">
        Both flags live in the <code>options</code> array of the config file. See the full{" "}
        <Link to="/docs/configuration">Configuration</Link> reference for every default.
      </Callout>
    </DocPage>
  );
}
