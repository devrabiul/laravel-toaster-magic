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

      <H2 id="latest-highlights">Latest highlights (v2.6)</H2>
      <p>
        v2.6 is an <strong>Animated presets</strong> release. Nothing changes for existing calls —
        a toast without a <code>preset</code> renders exactly as before:
      </p>
      <ul>
        <li>
          <strong>517 animated icon presets</strong> across 11 opt-in packs, layered on top of the
          toast type you already use. Each pack is a separate script and stylesheet, so you ship
          only what you enable. See <Link to="/docs/presets">Animated Presets</Link>.
        </li>
        <li>
          <strong>
            New <code>maxVisible</code> option
          </strong>{" "}
          (default <code>15</code>) — caps the stack and dismisses the oldest to make room. Without
          it, a burst of flashed messages pushed toasts past the bottom of the viewport where they
          could not be read or dismissed. Use <code>0</code> for no limit.
        </li>
        <li>
          <strong>
            <code>stagger</code> now defaults to 800 ms
          </strong>{" "}
          (was 250 ms) — the entrance animation runs for 500 ms, so queued toasts now cascade
          instead of overlapping into a burst.
        </li>
        <li>
          <strong>Centre positions actually centre</strong> — <code>toast-top-center</code> and{" "}
          <code>toast-bottom-center</code> were anchored to the edge by a redundant physical inset.
        </li>
        <li>
          <strong>
            Removed the global <code>shadow_enable</code> option
          </strong>{" "}
          added in v2.5. If your published config sets it, the key is now inert — delete it and
          override <code>--toast-magic-box-shadow</code> in your own CSS instead.
        </li>
      </ul>

      <H2 id="v25-highlights">v2.5 highlights</H2>
      <p>
        v2.5 was a <strong>Safe by default</strong> release, and the largest so far. If you pass
        user-supplied values to a toast, it is the important one to read:
      </p>
      <ul>
        <li>
          <strong>Cross-site scripting vulnerability fixed</strong> <em>(high severity)</em> —
          reachable through <code>avatar</code>, <code>customBtnLink</code>, Livewire event options
          and <code>data-toast-btn-link</code>. URLs are now parsed with <code>new URL()</code>,
          checked against a protocol allowlist and applied with <code>setAttribute()</code>.
        </li>
        <li>
          <strong>Message content is escaped by default</strong>, with an explicit{" "}
          <code>['html' =&gt; true]</code> opt-in per toast. See <Link to="/docs/security">Security</Link>.
        </li>
        <li>
          <strong>
            New <code>compact</code> theme
          </strong>{" "}
          — smaller, denser, deliberately plain.
        </li>
        <li>
          <strong>
            Global <code>spacing</code> and <code>typography</code> options
          </strong>{" "}
          — padding, gaps and font sizes for any theme, not just <code>compact</code>.
        </li>
        <li>
          <strong>Accessibility overhaul</strong> — announcements that actually announce,{" "}
          <kbd>Esc</kbd> to dismiss, WCAG AA contrast fixes and real touch targets.
        </li>
        <li>
          <strong>Content-Security-Policy support</strong> — <code>ToastMagic::nonce($nonce)</code>{" "}
          or the <code>csp_nonce</code> config value.
        </li>
        <li>
          <strong>~140 KB published payload</strong>, down from ~1.6 MB, and the dead{" "}
          <code>livewire_version</code> config key was removed — one bridge serves both Livewire v3
          and v4.
        </li>
      </ul>

      <H2 id="v24-highlights">v2.4 highlights</H2>
      <p>
        v2.4 was a <strong>Soft UI</strong> release. It added one new theme and changed nothing else
        — the API, the default theme and every existing theme were untouched:
      </p>
      <ul>
        <li>
          <strong>New <code>neumorphic</code> theme</strong> — a soft-UI surface built from
          dual-direction shadows and a hairline inner bevel instead of borders, with raised controls
          that press into the surface on click and a progress bar in a recessed groove. See{" "}
          <Link to="/docs/themes#neumorphic">Themes</Link>.
        </li>
        <li>
          <strong>Dedicated dark treatment</strong> — the dark variant is designed separately rather
          than inverted, with muted semantic accents.
        </li>
        <li>
          <strong>Themeable via CSS variables</strong> — override <code>--tm-neu-*</code> to match
          the theme to your own surface.
        </li>
      </ul>

      <H2 id="v23-highlights">v2.3 highlights</H2>
      <p>The v2.3 line focused on polish, motion, and modern Livewire support:</p>
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
          <code>livewire_enabled</code>. (v2.3 also shipped a <code>livewire_version</code> key;
          it was removed in v2.5, as one bridge serves both.) See{" "}
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
