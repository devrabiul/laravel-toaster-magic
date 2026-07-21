import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

export default function Changelog() {
  return (
    <DocPage page={routeByPath("/docs/changelog")!}>
      <h1>Changelog</h1>
      <p className="lead">
        Highlights from the current release of Laravel Toaster Magic. The complete, dated release
        history is maintained on GitHub.
      </p>

      <H2 id="latest-highlights">Latest highlights (v2.3)</H2>
      <p>The current v2.3 line focuses on polish, motion, and modern Livewire support:</p>
      <ul>
        <li>
          <strong>Smooth FLIP stack reflow</strong> — toasts glide into place as the stack grows and
          shrinks, and the animation respects <code>prefers-reduced-motion</code>.
        </li>
        <li>
          <strong>Entrance and exit animations</strong> — <code>slide</code>, <code>fade</code>,{" "}
          <code>pop</code>, and <code>bounce</code> in addition to the default. See{" "}
          <Link to="/docs/animations">Animations</Link>.
        </li>
        <li>
          <strong>Avatar toasts</strong> — attach an image with the <code>avatar</code> option for
          message-style notifications.
        </li>
        <li>
          <strong>Pause on hover</strong> — the <code>pauseOnHover</code> option holds the dismiss
          timer while the pointer is over a toast.
        </li>
        <li>
          <strong>Livewire v3 &amp; v4 support</strong> — dispatch toasts from components with{" "}
          <code>livewire_enabled</code> and <code>livewire_version</code>. See{" "}
          <Link to="/docs/integration/livewire">Livewire</Link>.
        </li>
      </ul>

      <Callout kind="info">
        For the full, dated release history — every version, fix, and breaking change — read the{" "}
        <a
          href="https://github.com/devrabiul/laravel-toaster-magic/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noreferrer"
        >
          complete CHANGELOG.md on GitHub
        </a>
        .
      </Callout>

      <H2 id="upgrading">Upgrading</H2>
      <p>
        Ready to move up a version? The <Link to="/docs/migration">Migration &amp; Upgrade</Link> guide
        covers bumping the Composer version and safely re-publishing assets and config after a major
        release.
      </p>
    </DocPage>
  );
}
