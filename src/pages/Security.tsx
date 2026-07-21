import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

const RAW_HTML = `// Newlines in the message become <br> so multi-line toasts render nicely.
ToastMagic::info('Backup complete', "Database: ok\\nStorage: ok\\nQueue: ok");`;

const UNSAFE = `// ❌ UNSAFE — $user->name is rendered as HTML.
// If a user sets their name to "<img src=x onerror=alert(1)>" this executes.
ToastMagic::success('Welcome, ' . $user->name . '!');`;

const SAFE_ESCAPE = `// ✅ SAFE — e() escapes HTML entities before they reach the toast.
ToastMagic::success('Welcome, ' . e($user->name) . '!');`;

const SAFE_STRIP = `// ✅ Alternative — strip_tags() removes markup entirely.
ToastMagic::error('Import failed for: ' . strip_tags($row->title));`;

const SANITIZED_LINK = `// customBtnLink only accepts http(s), root-relative (/), and fragment (#) URLs.
ToastMagic::info('Docs updated', 'See what changed.', [
    'customBtnText' => 'Read the changelog',
    'customBtnLink' => 'https://example.com/changelog', // allowed
]);

// javascript: and data: URLs are rejected and replaced with "#".
ToastMagic::info('Blocked', 'This link is neutralized.', [
    'customBtnText' => 'Click',
    'customBtnLink' => 'javascript:alert(1)', // becomes "#"
]);`;

export default function Security() {
  return (
    <DocPage page={routeByPath("/docs/security")!}>
      <h1>Security</h1>
      <p className="lead">
        Toast content is rendered as HTML. That makes rich, multi-line messages easy — but it means
        you must escape any user-supplied text yourself.
      </p>

      <H2 id="html-rendering">Messages are rendered as HTML</H2>
      <p>
        Both the heading and description of a toast are inserted into the DOM as HTML, not plain
        text. This is intentional: it lets newlines (<code>\n</code>) become <code>&lt;br&gt;</code>{" "}
        tags so you can build tidy multi-line toasts.
      </p>
      <CodeBlock code={RAW_HTML} language="php" />
      <p>
        The upside is flexibility. The downside is that any markup in the string is interpreted by
        the browser — including markup that came from your users.
      </p>

      <H2 id="xss-risk">The XSS risk</H2>
      <Callout kind="danger">
        Because messages are rendered as HTML, passing <strong>unescaped user input</strong> to a
        toast is a cross-site scripting (XSS) vulnerability. A crafted value can inject a{" "}
        <code>&lt;script&gt;</code> or an event handler that runs in your users' browsers.
      </Callout>
      <p>
        Never interpolate raw user input, database values that originated from users, or request
        data into a toast message:
      </p>
      <CodeBlock code={UNSAFE} language="php" />

      <H2 id="escaping">Escape user input</H2>
      <p>
        Wrap any untrusted value with Laravel's <code>e()</code> helper (an alias for{" "}
        <code>htmlspecialchars()</code>) before it reaches the toast. This converts{" "}
        <code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code>, and quotes into safe entities:
      </p>
      <CodeBlock code={SAFE_ESCAPE} language="php" />
      <p>
        If you want to remove markup entirely rather than display it as escaped text, use{" "}
        <code>strip_tags()</code>:
      </p>
      <CodeBlock code={SAFE_STRIP} language="php" />
      <Callout kind="warning">
        Escape at the point you build the toast string, not earlier — double-escaping produces
        visible <code>&amp;lt;</code> artifacts. Escape once, right before the{" "}
        <code>ToastMagic::</code> call.
      </Callout>

      <H2 id="sanitized-links">Sanitized action links</H2>
      <p>
        The <code>customBtnLink</code> option is sanitized automatically. Only{" "}
        <code>http://</code>, <code>https://</code>, root-relative (<code>/</code>), and fragment (
        <code>#</code>) URLs are allowed. Anything else — such as <code>javascript:</code> or{" "}
        <code>data:</code> URLs — is replaced with <code>#</code>, neutralizing the link:
      </p>
      <CodeBlock code={SANITIZED_LINK} language="php" />
      <Callout kind="info">
        This protection covers the action button link only. The button <em>text</em> (
        <code>customBtnText</code>) and the message body are not auto-escaped — escape those
        yourself as shown above.
      </Callout>

      <H2 id="roadmap">Roadmap: escape by default</H2>
      <Callout kind="warning">
        A future <strong>v3.0.0</strong> release plans to escape toast content by default, with an
        explicit opt-in for raw HTML. Until then, treat every message as raw HTML and escape
        untrusted input yourself.
      </Callout>
      <p>
        For broader guidance on safe defaults, accessibility, and UX, see{" "}
        <Link to="/docs/best-practices">Best Practices</Link>.
      </p>
    </DocPage>
  );
}
