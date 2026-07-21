import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

const ESCAPE = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

// ❌ Never interpolate raw user input — it is rendered as HTML.
ToastMagic::success('Welcome back, ' . $user->name . '!');

// ✅ Escape untrusted values with e() right before the toast call.
ToastMagic::success('Welcome back, ' . e($user->name) . '!');

// ✅ Or strip markup entirely when you only need plain text.
ToastMagic::error('Import failed for: ' . strip_tags($row->title));`;

const SHORT = `// ❌ Too much — a toast is not a place for a paragraph.
ToastMagic::warning(
    'Heads up',
    'Your subscription is going to expire in three days. To avoid any interruption '
    . 'to your service please visit the billing page, review your plan, and update '
    . 'your payment method before the renewal date shown on your invoice.'
);

// ✅ One idea, with the detail behind an action button.
ToastMagic::warning('Subscription expiring', 'Renews in 3 days.', [
    'customBtnText' => 'Manage billing',
    'customBtnLink' => '/billing',
]);`;

const TIMEOUT = `// Give people time to read; scale the timeout to the message.
ToastMagic::success('Saved'); // the ~5s default is fine for confirmations

ToastMagic::error('Payment declined', 'Card ending 4242 was refused.', [
    'timeOut'      => 10000, // errors deserve longer — 8–12s
    'showCloseBtn' => true,  // and an explicit way to dismiss
]);

// Actionable toasts should not vanish on their own — keep them until dismissed.
ToastMagic::info('Post moved to trash', 'You can still restore it.', [
    'timeOut'       => 0,    // 0 = sticky, requires a manual close
    'showCloseBtn'  => true,
    'customBtnText' => 'Undo',
    'customBtnLink' => '/posts/42/restore',
]);`;

const DEDUPE = `return [
    'options' => [
        'preventDuplicates' => true, // collapse identical back-to-back toasts
        'pauseOnHover'      => true,  // let users pause the timer to read
    ],
];`;

const POSITION = `return [
    'options' => [
        'positionClass' => 'toast-top-end', // the default; pick once, stay consistent
    ],
];`;

export default function BestPractices() {
  return (
    <DocPage page={routeByPath("/docs/best-practices")!}>
      <h1>Best Practices</h1>
      <p className="lead">
        Toasts are interruptions. A few habits keep them safe, readable, and welcome rather than
        noisy — here is how to get the most out of Laravel Toaster Magic.
      </p>

      <H2 id="escape-user-content">Always escape user-supplied content</H2>
      <p>
        Toast headings and descriptions are rendered as <strong>HTML</strong>, not plain text
        (newlines even become <code>&lt;br&gt;</code>). That makes rich messages easy, but it means
        any unescaped user input is a cross-site scripting (XSS) hole. Escape untrusted values with
        Laravel's <code>e()</code> helper — or strip markup with <code>strip_tags()</code> — at the
        point you build the string.
      </p>
      <CodeBlock code={ESCAPE} language="php" />
      <Callout kind="danger">
        Escape once, immediately before the <code>ToastMagic::</code> call. Escaping earlier risks
        double-escaped <code>&amp;lt;</code> artifacts, and escaping later is too late. See{" "}
        <Link to="/docs/security">Security</Link> for the full threat model and how action links are
        sanitized.
      </Callout>

      <H2 id="keep-messages-short">Keep messages short and scannable</H2>
      <p>
        A toast is glanceable by design — it appears, is read in a second or two, and disappears.
        Lead with a short heading that states the outcome, and keep the description to a single
        clarifying line. Push anything longer into a page or a modal, and expose the follow-up as an
        action button instead of prose.
      </p>
      <CodeBlock code={SHORT} language="php" />

      <H2 id="sensible-timeouts">Choose sensible timeouts</H2>
      <p>
        The default <code>timeOut</code> of 5000&nbsp;ms suits most confirmations. Scale it to how
        much the reader has to absorb and how much the message matters: give errors longer, and make
        anything actionable sticky (<code>timeOut =&gt; 0</code>) with a close button so it cannot
        slip away before it is acted on.
      </p>
      <CodeBlock code={TIMEOUT} language="php" />
      <Callout kind="tip">
        Leave <code>pauseOnHover</code> enabled so users who need more time can pause the dismiss
        timer simply by hovering the toast.
      </Callout>

      <H2 id="dont-over-notify">Don't over-notify</H2>
      <p>
        Every toast competes for attention, and a stack of them trains people to ignore all of them.
        Notify on outcomes the user cares about — a save, a failure, a completed background job — not
        on routine navigation or every field change. Reserve toasts for feedback that would
        otherwise be invisible; when the result is already obvious on screen, stay quiet.
      </p>
      <p>
        When the same event can fire repeatedly, enable <code>preventDuplicates</code> to collapse
        identical back-to-back toasts rather than stacking copies.
      </p>
      <CodeBlock code={DEDUPE} language="php" filename="config/laravel-toaster-magic.php" />

      <H2 id="consistent-positions">Keep positions consistent</H2>
      <p>
        Pick one <Link to="/docs/positioning">position</Link> for your whole application and stick to
        it. Users learn where notifications appear; moving them around per page forces a hunt every
        time. Set <code>positionClass</code> once in the published config and only override it for a
        genuinely different context, such as a full-screen editor.
      </p>
      <CodeBlock code={POSITION} language="php" filename="config/laravel-toaster-magic.php" />

      <H2 id="accessibility">Accessibility</H2>
      <p>
        Notifications should be usable by everyone, including keyboard and screen-reader users:
      </p>
      <ul>
        <li>
          <strong>Respect reduced motion.</strong> The smooth FLIP stack reflow already honors{" "}
          <code>prefers-reduced-motion</code>; if you author your own transitions, do the same. See{" "}
          <Link to="/docs/animations">Animations</Link>.
        </li>
        <li>
          <strong>Don't rely on color alone.</strong> The four types carry distinct icons and
          wording, so the meaning survives for color-blind users and in high-contrast modes.
        </li>
        <li>
          <strong>Offer a way to dismiss.</strong> Enable <code>showCloseBtn</code> on important
          toasts so users aren't forced to wait out the timer, and keep <code>pauseOnHover</code> on
          so a moving target can be paused and read.
        </li>
        <li>
          <strong>Never encode critical information only in a toast.</strong> Because it is transient,
          mirror anything essential — a validation summary, an error — somewhere persistent on the
          page as well.
        </li>
        <li>
          <strong>Keep contrast readable</strong> when using color or gradient mode — verify your
          chosen <Link to="/docs/themes">theme</Link> stays legible in both light and{" "}
          <Link to="/docs/dark-mode">dark mode</Link>.
        </li>
      </ul>
      <Callout kind="info">
        Following these defaults keeps notifications informative without becoming an accessibility or
        security liability. For the security specifics, continue to{" "}
        <Link to="/docs/security">Security</Link>.
      </Callout>
    </DocPage>
  );
}
