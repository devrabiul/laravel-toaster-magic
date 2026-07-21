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
        'theme' => 'glassmorphism', // default | material | ios | glassmorphism | neon | minimal | neumorphism
        // ...other options
    ],
];`;

const CLEAR_CACHE = `php artisan config:clear`;

const PER_TOAST = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

// The theme comes from config — every toast in the app shares it.
ToastMagic::success('Saved', 'Your profile is up to date.');`;

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
        Laravel Toaster Magic ships with seven hand-crafted themes. Pick one in the config file and
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

      <H2 id="the-seven-themes">The seven themes</H2>
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
        UIs. <code>neon</code> is built for dark interfaces, while <code>minimal</code> and{" "}
        <code>neumorphism</code> lean into understated, tactile designs.
      </p>

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
