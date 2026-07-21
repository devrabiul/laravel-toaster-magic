import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

const BUMP = `# Move to the latest release (or pin the major you want).
composer require devrabiul/laravel-toaster-magic

# Or edit composer.json, then update:
#   "devrabiul/laravel-toaster-magic": "^2.3"
composer update devrabiul/laravel-toaster-magic`;

const REPUBLISH = `# After a MAJOR upgrade, re-publish the assets and config.
php artisan vendor:publish \\
    --provider="Devrabiul\\ToastMagic\\ToastMagicServiceProvider" \\
    --force`;

const REPUBLISH_TAGS = `# Prefer to re-publish only the config and keep your assets? Use tags
# if the release exposes them, and diff the result before committing.
php artisan vendor:publish \\
    --provider="Devrabiul\\ToastMagic\\ToastMagicServiceProvider" \\
    --tag="config" --force`;

const LEGACY_FLASH = `// Before — a session flash + a toastr-style helper in the view.
return redirect()->route('users.index')
    ->with('success', 'The user has been created.');`;

const LEGACY_BLADE = `{{-- Before — reading the flash bag manually in Blade --}}
@if (session('success'))
    <script>toastr.success("{{ session('success') }}");</script>
@endif`;

const FACADE_AFTER = `// After — dispatch the toast from the controller and just redirect.
use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

ToastMagic::success('User created', 'The user has been created.');

return redirect()->route('users.index');`;

const BLADE_AFTER = `{{-- After — one style + one script tag in your layout, no per-message glue --}}
<head>
    {!! ToastMagic::styles() !!}
</head>
<body>
    {{-- ... --}}
    {!! ToastMagic::scripts() !!}
</body>`;

export default function Migration() {
  return (
    <DocPage page={routeByPath("/docs/migration")!}>
      <h1>Migration &amp; Upgrade</h1>
      <p className="lead">
        General guidance for upgrading Laravel Toaster Magic between versions, and for moving off an
        ad-hoc session-flash / toastr setup to the <code>ToastMagic</code> facade.
      </p>

      <H2 id="bump-version">Bump the Composer version</H2>
      <p>
        Upgrading is a Composer operation. Require the version you want (or the latest release) and
        let Composer resolve it:
      </p>
      <CodeBlock code={BUMP} language="bash" />
      <Callout kind="info">
        Toaster Magic follows semantic versioning: patch and minor upgrades are drop-in, while a
        major version bump may change defaults or behavior. Always read the changelog before a major
        upgrade — see below.
      </Callout>

      <H2 id="review-changelog">Review the changelog first</H2>
      <p>
        Before any major upgrade, skim what changed so you can spot renamed options, new defaults, or
        deprecations. The <Link to="/docs/changelog">Changelog</Link> page summarizes the latest
        highlights, and the authoritative history lives in the{" "}
        <a
          href="https://github.com/devrabiul/laravel-toaster-magic/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noreferrer"
        >
          CHANGELOG.md on GitHub
        </a>
        .
      </p>

      <H2 id="republish-assets">Re-publish assets and config after a major upgrade</H2>
      <p>
        The package's front-end assets auto-publish on first page load and refresh automatically when
        the package updates, so most upgrades need no manual step. After a <strong>major</strong>{" "}
        upgrade, however, it is worth re-publishing to pick up new config keys and refreshed assets:
      </p>
      <CodeBlock code={REPUBLISH} language="bash" />
      <Callout kind="warning">
        The <code>--force</code> flag <strong>overwrites</strong> your published files, including{" "}
        <code>config/laravel-toaster-magic.php</code>. If you have customized the config, back it up
        (or commit first) and re-apply your changes afterwards, or publish to a scratch location and
        diff before overwriting.
      </Callout>
      <p>
        If a release exposes publish tags, you can re-publish the config alone and leave everything
        else untouched:
      </p>
      <CodeBlock code={REPUBLISH_TAGS} language="bash" />

      <H2 id="from-session-flash">Moving from session-flash / toastr</H2>
      <p>
        A common starting point is flashing a message to the session and rendering it with a toastr
        snippet in the layout. Toaster Magic replaces that whole pattern: dispatch the toast from your
        controller with the facade, and drop the per-message Blade glue.
      </p>
      <CodeBlock code={LEGACY_FLASH} language="php" />
      <CodeBlock code={LEGACY_BLADE} language="html" />
      <p>The equivalent with the facade — the toast is queued and shown after the redirect:</p>
      <CodeBlock code={FACADE_AFTER} language="php" />
      <p>
        In your layout, replace the manual flash-reading script with the two render helpers once — the
        styles in the <code>&lt;head&gt;</code> and the scripts before <code>&lt;/body&gt;</code>:
      </p>
      <CodeBlock code={BLADE_AFTER} language="html" />
      <Callout kind="tip">
        If your old code named a session flash "toastr" or similar and read it in the view, remove
        that snippet entirely — the facade handles queuing and rendering. Passing a validation
        <code> MessageBag</code> works directly too:{" "}
        <code>ToastMagic::error($validator-&gt;errors());</code>. See{" "}
        <Link to="/docs/integration/controllers">Controllers &amp; Redirects</Link> for the full
        pattern.
      </Callout>
    </DocPage>
  );
}
