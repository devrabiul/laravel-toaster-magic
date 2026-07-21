import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { PropsTable } from "../components/PropsTable";
import { CONFIG_OPTIONS, ROOT_CONFIG, TOAST_OPTIONS } from "../data/reference";
import { routeByPath } from "../data/routes";

const TOAST_EXAMPLE = `ToastMagic::success('Order shipped', 'Your order is on its way!', [
    'showCloseBtn'  => true,
    'customBtnText' => 'Track Order',
    'customBtnLink' => '/orders/42',
    'timeOut'       => 8000,  // per-toast auto-dismiss (ms)
    'showDuration'  => 300,   // per-toast show delay (ms)
    'avatar'        => '/img/courier.png',
]);`;

const CONFIG_EXAMPLE = `// config/laravel-toaster-magic.php
return [
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
    'livewire_enabled'  => false,
    'livewire_version'  => 'v3',
];`;

export default function Options() {
  return (
    <DocPage page={routeByPath("/docs/options")!}>
      <h1>Options</h1>
      <p className="lead">
        Two option sets: <strong>per-toast options</strong> passed as the third argument to a facade call,
        and <strong>configuration options</strong> in <code>config/laravel-toaster-magic.php</code> that set
        the application-wide defaults.
      </p>

      <H2 id="per-toast-options">Per-toast options</H2>
      <p>
        Pass an options array as the third argument to any type method to customize a single toast without
        touching your global config. These keys override the matching configuration default for that one
        toast:
      </p>
      <CodeBlock code={TOAST_EXAMPLE} language="php" />
      <PropsTable rows={TOAST_OPTIONS} nameHeader="Option" />
      <Callout kind="warning">
        <code>customBtnText</code> and <code>customBtnLink</code> must be provided together — the action
        button only renders when both are set. Links are sanitized: only <code>http://</code>,{" "}
        <code>https://</code>, <code>/</code>, and <code>#</code> URLs are allowed, and anything else is
        replaced with <code>#</code>.
      </Callout>

      <H2 id="configuration-options">Configuration options</H2>
      <p>
        The <code>options</code> array inside <code>config/laravel-toaster-magic.php</code> holds the
        defaults applied to every toast. Publish the config with{" "}
        <code>php artisan vendor:publish --provider="Devrabiul\ToastMagic\ToastMagicServiceProvider"</code>{" "}
        and edit it to taste:
      </p>
      <CodeBlock code={CONFIG_EXAMPLE} language="php" />
      <PropsTable rows={CONFIG_OPTIONS} nameHeader="Option" />

      <H2 id="root-config-keys">Root configuration keys</H2>
      <p>
        The config file also has a few top-level keys alongside the <code>options</code> array — most
        importantly the Livewire switches:
      </p>
      <PropsTable rows={ROOT_CONFIG} nameHeader="Key" />

      <Callout kind="info">
        For a walkthrough of each setting with previews, see the{" "}
        <Link to="/docs/configuration">Configuration</Link> guide.
      </Callout>
    </DocPage>
  );
}
