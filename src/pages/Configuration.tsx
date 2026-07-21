import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { PropsTable } from "../components/PropsTable";
import { CONFIG_OPTIONS, ROOT_CONFIG } from "../data/reference";
import { routeByPath } from "../data/routes";

const PUBLISH = `php artisan vendor:publish --provider="Devrabiul\\ToastMagic\\ToastMagicServiceProvider"`;

const CONFIG_FILE = `<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default toast options
    |--------------------------------------------------------------------------
    |
    | These defaults apply to every toast unless you override them with the
    | third argument of a facade call (see the Options page). Any key you omit
    | falls back to the package default.
    |
    */
    'options' => [
        'closeButton'       => true,
        'positionClass'     => 'toast-top-end',
        'preventDuplicates' => false,
        'showDuration'      => 300,
        'timeOut'           => 5000,
        'theme'             => 'default',
        'gradient_enable'   => false,
        'color_mode'        => false,
        'pauseOnHover'      => true,
        'animation'         => 'default',
    ],

    /*
    |--------------------------------------------------------------------------
    | Livewire integration
    |--------------------------------------------------------------------------
    |
    | Enable event-based dispatching from Livewire components. Set the version
    | to match the Livewire major release your app runs ('v3' or 'v4').
    |
    */
    'livewire_enabled'  => false,
    'livewire_version'  => 'v3',
];`;

const OVERRIDE = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

// Global default is timeOut => 5000, positionClass => 'toast-top-end'.
// This single toast overrides both without touching the config file.
ToastMagic::success('Saved!', 'Your changes are live.', [
    'timeOut'       => 10000,
    'positionClass' => 'toast-bottom-end',
]);`;

const ENV = `// config/laravel-toaster-magic.php
'options' => [
    'theme'         => env('TOAST_THEME', 'default'),
    'positionClass' => env('TOAST_POSITION', 'toast-top-end'),
    // ...
],`;

export default function Configuration() {
  return (
    <DocPage page={routeByPath("/docs/configuration")!}>
      <h1>Configuration</h1>
      <p className="lead">
        The complete <code>config/laravel-toaster-magic.php</code> reference — every default option,
        how to publish the file, and how per-toast overrides interact with your global settings.
      </p>

      <H2 id="publishing">Publishing the config</H2>
      <p>
        The package works out of the box with sensible defaults, so publishing the config file is
        optional. Publish it when you want to change the default theme, position, timeout, or enable
        Livewire:
      </p>
      <CodeBlock code={PUBLISH} language="bash" />
      <p>
        This copies the config to <code>config/laravel-toaster-magic.php</code>. After editing it in
        production, clear the cached config with <code>php artisan config:clear</code> (or{" "}
        <code>php artisan config:cache</code>).
      </p>

      <H2 id="config-file">The config file</H2>
      <p>
        Here is the full published file. Each key under <code>options</code> is the global default
        for that toast option:
      </p>
      <CodeBlock code={CONFIG_FILE} language="php" filename="config/laravel-toaster-magic.php" />

      <H2 id="toast-options">Toast options</H2>
      <p>
        These live inside the <code>options</code> array and control the appearance and behavior of
        every toast. They map one-to-one to the values you can pass per toast at call time:
      </p>
      <PropsTable rows={CONFIG_OPTIONS} nameHeader="Option" />

      <H2 id="root-keys">Root keys</H2>
      <p>The top-level keys of the config file:</p>
      <PropsTable rows={ROOT_CONFIG} nameHeader="Key" />

      <H2 id="overrides">Per-toast overrides win</H2>
      <p>
        The config file only sets <em>defaults</em>. Any option you pass as the third argument to a
        facade call takes precedence over the config for that single toast — the rest of your toasts
        keep the global values.
      </p>
      <CodeBlock code={OVERRIDE} language="php" />
      <Callout kind="tip">
        For the full list of per-toast keys — <code>showCloseBtn</code>, <code>customBtnText</code>,{" "}
        <code>customBtnLink</code>, <code>avatar</code>, and more — see the{" "}
        <Link to="/docs/options">Options</Link> reference.
      </Callout>

      <H2 id="environment">Environment-driven config</H2>
      <p>
        Because it is a normal Laravel config file, you can drive values from your{" "}
        <code>.env</code> to vary settings per environment:
      </p>
      <CodeBlock code={ENV} language="php" />
      <Callout kind="info">
        Looking to colorize backgrounds or add gradient accents? The{" "}
        <code>color_mode</code> and <code>gradient_enable</code> flags have their own guide on the{" "}
        <Link to="/docs/color-gradient-mode">Color &amp; Gradient</Link> page.
      </Callout>
    </DocPage>
  );
}
