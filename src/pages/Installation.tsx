import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

const COMPOSER = `composer require devrabiul/laravel-toaster-magic`;

const PUBLISH = `php artisan vendor:publish --provider="Devrabiul\\ToastMagic\\ToastMagicServiceProvider"`;

const CLEAR = `php artisan config:clear
# or, when caching config in production:
php artisan config:cache`;

export default function Installation() {
  return (
    <DocPage page={routeByPath("/docs/installation")!}>
      <h1>Installation</h1>
      <p className="lead">
        Install Laravel Toaster Magic with Composer, publish its assets and config, and you are ready
        to wire it into your Blade layout — no frontend build step required.
      </p>

      <H2 id="require">Require the package</H2>
      <p>
        Pull the package into your Laravel application from Packagist with Composer. Laravel's package
        auto-discovery registers the service provider and the <code>ToastMagic</code> facade for you —
        there is nothing to add to <code>config/app.php</code>:
      </p>
      <CodeBlock code={COMPOSER} language="bash" />

      <H2 id="publish-assets">Publish the assets &amp; config</H2>
      <p>
        Run <code>vendor:publish</code> to copy the package's CSS/JS assets into your{" "}
        <code>public</code> directory and the config file to{" "}
        <code>config/laravel-toaster-magic.php</code>:
      </p>
      <CodeBlock code={PUBLISH} language="bash" />

      <H2 id="auto-publish">Auto-publish &amp; auto-refresh</H2>
      <p>
        Publishing manually is optional. Toaster Magic publishes its assets automatically on the first
        page load, and it re-publishes them whenever you upgrade the package — so your frontend assets
        never drift out of sync with the installed version.
      </p>
      <Callout kind="info">
        Because assets self-manage, upgrading is usually just <code>composer update</code>. You only
        need to re-run <code>vendor:publish</code> if you want to overwrite a config file you have
        customised (Composer will prompt before overwriting).
      </Callout>
      <p>
        If you edit the published config on a server that caches configuration, clear or rebuild the
        cache so your changes take effect:
      </p>
      <CodeBlock code={CLEAR} language="bash" />

      <H2 id="requirements">Requirements</H2>
      <p>The requirements are intentionally minimal:</p>
      <ul>
        <li>
          A working <strong>Laravel application</strong> — that is the only real prerequisite.
        </li>
        <li>
          <strong>Zero frontend dependencies.</strong> Toaster Magic does not need jQuery, Bootstrap,
          Tailwind, or any JavaScript framework. The published styles and scripts are fully
          self-contained.
        </li>
      </ul>
      <Callout kind="tip">
        Since there are no peer packages to reconcile, Toaster Magic drops cleanly into both brand-new
        projects and large legacy apps without touching your existing asset pipeline.
      </Callout>

      <H2 id="next">Wire it into Blade</H2>
      <p>
        With the package installed, the next step is to render the required stylesheet and scripts in
        your layout using <code>{"{!! ToastMagic::styles() !!}"}</code> and{" "}
        <code>{"{!! ToastMagic::scripts() !!}"}</code>. The dedicated{" "}
        <Link to="/docs/integration/blade">Blade Setup</Link> page walks through exactly where each
        tag goes. After that, head to the <Link to="/docs/quick-start">Quick Start</Link> to fire your
        first toast.
      </p>
    </DocPage>
  );
}
