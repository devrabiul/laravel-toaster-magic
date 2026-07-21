import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { METHODS } from "../data/reference";
import { routeByPath } from "../data/routes";

const IMPORT = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;`;

const TYPES = `// Heading only
ToastMagic::success('Successfully Created');

// Heading + description
ToastMagic::error('Error!', 'Something went wrong.');

// Heading + description + per-toast options
ToastMagic::warning('Heads up', 'Your storage is almost full', [
    'timeOut'      => 8000,
    'showCloseBtn' => true,
]);

ToastMagic::info('New message', 'Hey, are you free?', [
    'avatar' => $user->avatar_url,
]);`;

const VALIDATION = `// Pass a validation MessageBag straight to error() —
// each message is flattened onto its own line.
ToastMagic::error($validator->errors());`;

const DISPATCH = `ToastMagic::dispatch()->success('User Created', 'The user has been created.', [
    'showCloseBtn'  => true,
    'customBtnText' => 'View Profile',
    'customBtnLink' => 'https://example.com',
]);`;

const STYLES_SCRIPTS = `<head>
    {!! ToastMagic::styles() !!}
</head>
<body>
    {{-- ... --}}
    {!! ToastMagic::scripts() !!}
</body>`;

export default function Methods() {
  return (
    <DocPage page={routeByPath("/docs/methods")!}>
      <h1>Methods</h1>
      <p className="lead">
        Every method on the <code>Devrabiul\ToastMagic\Facades\ToastMagic</code> facade — the four toast
        types, the fluent <code>dispatch()</code> builder, and the two Blade asset helpers.
      </p>

      <H2 id="overview">Method summary</H2>
      <div className="table-wrap">
        <table className="props">
          <thead>
            <tr>
              <th>Method</th>
              <th>Returns</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {METHODS.map((m) => (
              <tr key={m.signature}>
                <td className="col-name">
                  <code>{m.signature}</code>
                </td>
                <td className="col-type">
                  <code>{m.returns}</code>
                </td>
                <td>{m.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Start by importing the facade wherever you flash toasts — a controller, a form request, or a
        middleware:
      </p>
      <CodeBlock code={IMPORT} language="php" />

      <H2 id="type-methods">success() · error() · warning() · info()</H2>
      <p>
        The four type methods share the same signature —{" "}
        <code>(string $heading, string $description = '', array $options = [])</code> — and differ only in
        the icon and accent color they render. Each queues a toast for the next response and returns{" "}
        <code>void</code>, so follow them with your usual <code>redirect()</code> or <code>back()</code>:
      </p>
      <CodeBlock code={TYPES} language="php" />
      <Callout kind="info">
        <code>error()</code> also accepts a validation <code>MessageBag</code> as its first argument. It is
        flattened automatically, rendering one error message per line:
      </Callout>
      <CodeBlock code={VALIDATION} language="php" />

      <H2 id="dispatch">dispatch()</H2>
      <p>
        <code>ToastMagic::dispatch()</code> returns the fluent builder so you can chain any of the four type
        methods. It produces exactly the same toast as calling the type method directly on the facade:
      </p>
      <CodeBlock code={DISPATCH} language="php" />

      <H2 id="styles-scripts">styles() &amp; scripts()</H2>
      <p>
        <code>ToastMagic::styles()</code> returns the stylesheet <code>&lt;link&gt;</code> tags and must be
        rendered inside <code>&lt;head&gt;</code>. <code>ToastMagic::scripts()</code> returns the{" "}
        <code>&lt;script&gt;</code> tags and must be rendered just before <code>&lt;/body&gt;</code>. Both
        return raw HTML strings, so echo them with the unescaped Blade tag:
      </p>
      <CodeBlock code={STYLES_SCRIPTS} language="html" />
      <Callout kind="warning">
        Omitting either helper is the most common reason toasts never appear. If nothing shows up, confirm
        both are present — see <Link to="/docs/troubleshooting">Troubleshooting</Link>.
      </Callout>

      <Callout kind="info">
        For every option key these methods accept, see the <Link to="/docs/options">Options</Link> reference.
      </Callout>
    </DocPage>
  );
}
