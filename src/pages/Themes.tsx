import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2, H3 } from "../components/Heading";
import { TypeButtons } from "../components/ToastDemo";
import { THEMES } from "../data/reference";
import { routeByPath } from "../data/routes";

const CONFIG_THEME = `<?php

// config/laravel-toaster-magic.php
return [
    'options' => [
        'theme' => 'glassmorphism', // default | material | ios | glassmorphism | neon | minimal | neumorphism | neumorphic
        // ...other options
    ],
];`;

const CLEAR_CACHE = `php artisan config:clear`;

const PER_TOAST = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

// The theme comes from config — every toast in the app shares it.
ToastMagic::success('Saved', 'Your profile is up to date.');`;

const COMPACT_CONFIG = `<?php

// config/laravel-toaster-magic.php
return [
    'options' => [
        'theme' => 'compact',
    ],
];`;

const NEUMORPHIC_CONFIG = `<?php

// config/laravel-toaster-magic.php
return [
    'options' => [
        'theme' => 'neumorphic',
    ],
];`;

const NEUMORPHIC_VARS = `.toast-container.theme-neumorphic {
    /* Material the toast and controls are cut from. */
    --tm-neu-surface: #eef0f5;

    /* Highlight top-left, shadow bottom-right. */
    --tm-neu-shadow-light: rgba(255, 255, 255, 0.9);
    --tm-neu-shadow-dark: rgba(163, 177, 198, 0.55);

    /* Softness, distance off the page, diffusion. */
    --tm-neu-radius: 1.5rem;
    --tm-neu-distance: 7px;
    --tm-neu-blur: 18px;
}`;

const GRADIENT_CONFIG = `<?php

return [
    'options' => [
        'theme'           => 'neon',
        'gradient_enable' => true, // best with default, material, and neon
    ],
];`;

export default function Themes() {
  return (
    <DocPage page={routeByPath("/docs/themes")!}>
      <h1>Themes</h1>
      <p className="lead">
        Laravel Toaster Magic ships with eight hand-crafted themes. Pick one in the config file and
        every toast in your application adopts the look — no CSS required.
      </p>

      <H2 id="setting-the-theme">Setting the theme</H2>
      <p>
        The active theme is controlled by the <code>theme</code> key inside the{" "}
        <code>options</code> array of <code>config/laravel-toaster-magic.php</code>. Publish the
        config first (see <Link to="/docs/installation">Installation</Link>), then set your choice:
      </p>
      <CodeBlock code={CONFIG_THEME} language="php" filename="config/laravel-toaster-magic.php" />
      <p>
        Config values are cached in production, so clear the cache after changing the theme:
      </p>
      <CodeBlock code={CLEAR_CACHE} language="bash" />
      <Callout kind="info">
        The theme is applied globally at render time by <code>ToastMagic::styles()</code> and{" "}
        <code>ToastMagic::scripts()</code>. You do not pass the theme per toast — set it once and
        every <code>success</code>, <code>error</code>, <code>warning</code>, and <code>info</code>{" "}
        call uses it.
      </Callout>
      <CodeBlock code={PER_TOAST} language="php" />

      <H2 id="live-preview">Live preview</H2>
      <p>
        Fire a toast below to see toasts in action. On the docs site the buttons use the{" "}
        <code>glassmorphism</code> look; in your Laravel app the theme is whatever you set in config.
      </p>
      <TypeButtons />

      <H2 id="the-themes">The nine themes</H2>
      <p>
        Every value below is a valid <code>'theme'</code> setting. Choose the one that best matches
        your application's design language.
      </p>
      <div className="card-grid">
        {THEMES.map((theme) => (
          <div key={theme.id} className="card">
            <p className="card__title">
              {theme.name} <code>'{theme.id}'</code>
            </p>
            <p className="card__desc">{theme.blurb}</p>
          </div>
        ))}
      </div>

      <H3 id="choosing-a-theme">Choosing a theme</H3>
      <p>
        <code>default</code> and <code>material</code> suit most dashboards and admin panels.{" "}
        <code>ios</code> and <code>glassmorphism</code> pair well with soft, blurred, image-heavy
        UIs. <code>neon</code> is built for dark interfaces, while <code>minimal</code>,{" "}
        <code>neumorphism</code> and <code>neumorphic</code> lean into understated, tactile designs.
      </p>

      <H2 id="neumorphic">Neumorphic</H2>
      <p>
        Added in <strong>v2.4</strong>, <code>neumorphic</code> is a soft-UI theme where the toast
        reads as an object extruded from the same material as the page behind it. Depth comes from a
        dual-direction shadow pair — a light highlight from the top-left and a soft dark shadow from
        the bottom-right — plus a hairline inner bevel, instead of borders or gradients.
      </p>
      <CodeBlock
        code={NEUMORPHIC_CONFIG}
        language="php"
        filename="config/laravel-toaster-magic.php"
      />
      <ul>
        <li>
          <strong>Raised, pressable controls</strong> — the icon puck, close button and action button
          lift on hover and press <em>into</em> the surface on click.
        </li>
        <li>
          <strong>Recessed progress groove</strong> — the progress bar runs in a channel carved into
          the toast's bottom edge.
        </li>
        <li>
          <strong>Monochromatic surface</strong> — the toast never turns into a colored card; only
          the icon, the progress fill and the focus ring take the semantic accent.
        </li>
        <li>
          <strong>Light mode</strong> — a cool off-white surface that blends into the page, with a
          white highlight and a soft blue-gray shadow.
        </li>
        <li>
          <strong>Dark mode</strong> — a dedicated treatment rather than an inversion: a soft
          charcoal surface where the shadow carries the depth, the highlight is a faint light edge,
          and accents are muted so nothing glows.
        </li>
      </ul>

      <H3 id="customizing-neumorphic">Customizing the surface</H3>
      <p>
        The theme is driven entirely by CSS variables scoped to{" "}
        <code>.toast-container.theme-neumorphic</code>, so you can match it to your own surface
        without forking any CSS:
      </p>
      <CodeBlock code={NEUMORPHIC_VARS} language="css" />
      <Callout kind="info">
        <code>neumorphic</code> is a separate theme from the original <code>neumorphism</code>. Both
        ship side by side, and selecting one has no effect on the other.
      </Callout>
      <Callout kind="tip">
        Try it on the <Link to="/">home page</Link> — pick <code>neumorphic</code> from the theme row
        to fire a live toast in it.
      </Callout>

      <H2 id="compact">Compact</H2>
      <p>
        Added in <strong>v2.5</strong>, <code>compact</code> is a smaller, denser take on the default
        toast — for interfaces where a notification should stay out of the way.
      </p>
      <CodeBlock code={COMPACT_CONFIG} language="php" filename="config/laravel-toaster-magic.php" />
      <ul>
        <li>
          <strong>Tighter everywhere</strong> — padding, the icon-to-text gap, the title/description
          gap and the space around the controls are all pulled in.
        </li>
        <li>
          <strong>Single control row</strong> — the close and action buttons share one row instead of
          stacking.
        </li>
        <li>
          <strong>Slimmer furniture</strong> — the progress bar drops to 2px and the track narrows
          from 370px to 320px.
        </li>
        <li>
          <strong>Deliberately plain</strong> — a solid surface, a hairline border and semantic
          accents, with no gradients, blur or glass effects.
        </li>
      </ul>
      <p>
        It supports every toast type, avatar toasts, color mode, animations, dark mode and RTL, like
        any other theme.
      </p>
      <Callout kind="tip">
        Want it tighter still — or want any <em>other</em> theme tightened? The global{" "}
        <code>spacing</code> and <code>typography</code> options work with every theme, not just this
        one. See <Link to="/docs/configuration">Configuration</Link>.
      </Callout>

      <H2 id="theme-reference">Theme reference table</H2>
      <div className="table-wrap">
        <table className="props">
          <thead>
            <tr>
              <th>Theme</th>
              <th>Config value</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {THEMES.map((theme) => (
              <tr key={theme.id}>
                <td>
                  <strong>{theme.name}</strong>
                </td>
                <td className="col-name">
                  <code>'{theme.id}'</code>
                </td>
                <td>{theme.blurb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        For deeper visual notes on each theme, see{" "}
        <a
          href="https://github.com/devrabiul/laravel-toaster-magic/blob/main/THEMES.md"
          target="_blank"
          rel="noreferrer"
        >
          THEMES.md
        </a>{" "}
        in the GitHub repository.
      </p>

      <H2 id="combine-with-color-and-gradient">Combine with color &amp; gradient mode</H2>
      <p>
        Themes compose with color and gradient styling. Enable <code>gradient_enable</code> for a
        subtle gradient wash — it looks best with the <code>default</code>, <code>material</code>,
        and <code>neon</code> themes:
      </p>
      <CodeBlock code={GRADIENT_CONFIG} language="php" filename="config/laravel-toaster-magic.php" />
      <Callout kind="tip">
        Want colored backgrounds per toast type or gradient accents? Read{" "}
        <Link to="/docs/color-gradient-mode">Color &amp; Gradient Mode</Link> for the full details.
      </Callout>

      <Callout kind="info">
        Themes also adapt to <Link to="/docs/dark-mode">dark mode</Link> — add{" "}
        <code>theme="dark"</code> to your <code>&lt;body&gt;</code> and every theme switches to its
        dark variant automatically.
      </Callout>
    </DocPage>
  );
}
