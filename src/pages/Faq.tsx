import { Link } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

const PUBLISH = `php artisan vendor:publish --provider="Devrabiul\\ToastMagic\\ToastMagicServiceProvider"`;

const LIVEWIRE = `// config/laravel-toaster-magic.php
'livewire_enabled' => true,
'livewire_version' => 'v3', // or 'v4'`;

const ESCAPE = `ToastMagic::success('Welcome, ' . e($user->name) . '!');`;

const DARK = `<body theme="dark">`;

const THEME = `// config/laravel-toaster-magic.php
'options' => [
    'theme'         => 'glassmorphism',
    'positionClass' => 'toast-bottom-end',
],`;

export default function Faq() {
  return (
    <DocPage page={routeByPath("/docs/faq")!}>
      <h1>Frequently Asked Questions</h1>
      <p className="lead">Short answers to the questions that come up most.</p>

      <H2 id="publish-assets">Do I need to publish assets?</H2>
      <p>
        Not manually in most cases. The CSS and JavaScript auto-publish on the first page load and refresh
        automatically whenever the package updates. You can still publish explicitly — for example to commit
        the assets or the config file to version control:
      </p>
      <CodeBlock code={PUBLISH} language="bash" />
      <p>
        The only mandatory wiring is rendering <code>{"{!! ToastMagic::styles() !!}"}</code> in{" "}
        <code>&lt;head&gt;</code> and <code>{"{!! ToastMagic::scripts() !!}"}</code> before{" "}
        <code>&lt;/body&gt;</code>. See <Link to="/docs/installation">Installation</Link>.
      </p>

      <H2 id="enable-livewire">How do I enable Livewire?</H2>
      <p>
        Turn on the Livewire switches in <code>config/laravel-toaster-magic.php</code> and set the version
        that matches your app (v3 and v4 are both supported):
      </p>
      <CodeBlock code={LIVEWIRE} language="php" />
      <p>
        Then dispatch the <code>toastMagic</code> event from any component. See the{" "}
        <Link to="/docs/integration/livewire">Livewire</Link> integration guide for the full example.
      </p>

      <H2 id="content-escaped">Is toast content escaped?</H2>
      <p>
        Not yet, by default. Toast headings and descriptions are rendered as <strong>HTML</strong> (newlines
        become <code>&lt;br&gt;</code>), so never pass unescaped user input — that would be an XSS risk.
        Escape it yourself with <code>e()</code> or <code>strip_tags()</code>:
      </p>
      <CodeBlock code={ESCAPE} language="php" />
      <p>
        Action-button links are sanitized automatically: only <code>http://</code>, <code>https://</code>,{" "}
        <code>/</code>, and <code>#</code> are allowed. Escaping content by default is on the roadmap for
        v3.0.0. See <Link to="/docs/security">Security</Link>.
      </p>

      <H2 id="dark-mode">How do I enable dark mode?</H2>
      <p>
        Add a <code>theme="dark"</code> attribute to your <code>&lt;body&gt;</code> tag. Toaster Magic reads
        it and switches every toast to its dark palette:
      </p>
      <CodeBlock code={DARK} language="html" />
      <p>
        See the <Link to="/docs/dark-mode">Dark Mode</Link> guide for wiring it to a user preference toggle.
      </p>

      <H2 id="theme-position">How do I change the theme or position?</H2>
      <p>
        Set <code>theme</code> and <code>positionClass</code> under the <code>options</code> key in the
        config file (or override them per toast). There are seven themes and six positions:
      </p>
      <CodeBlock code={THEME} language="php" />
      <p>
        Browse them on the <Link to="/docs/themes">Themes</Link> and{" "}
        <Link to="/docs/positioning">Positioning</Link> pages.
      </p>

      <H2 id="rtl">Does it support RTL?</H2>
      <p>
        Yes. The toast layout follows the document direction, so setting <code>dir="rtl"</code> on your{" "}
        <code>&lt;html&gt;</code> element (or the relevant container) flips the toast stack and its alignment
        to match right-to-left languages.
      </p>

      <H2 id="dependencies">Does it need jQuery, Bootstrap, or Tailwind?</H2>
      <p>
        No. Laravel Toaster Magic is completely dependency-free — it ships its own CSS and vanilla
        JavaScript and does not require jQuery, Bootstrap, Tailwind, or any build step. Drop in the two
        Blade helpers and it works with any Laravel front end.
      </p>
    </DocPage>
  );
}
