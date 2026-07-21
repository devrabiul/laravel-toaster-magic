import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2, H3 } from "../components/Heading";
import { PropsTable } from "../components/PropsTable";
import { TypeButtons } from "../components/ToastDemo";
import { TOAST_OPTIONS } from "../data/reference";
import { routeByPath } from "../data/routes";

const IMPORT = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;`;

const TYPES = `ToastMagic::success('Successfully Created');
ToastMagic::info('New update available');
ToastMagic::warning('Your storage is almost full');
ToastMagic::error('Something went wrong');`;

const HEADING_ONLY = `// Heading only — a single-line toast
ToastMagic::success('Successfully Created');`;

const HEADING_DESC = `// Heading + description
ToastMagic::success('Success!', 'Your data has been saved!');`;

const OPTIONS = `ToastMagic::success('Success!', 'Saved!', [
    'showCloseBtn'  => true,
    'customBtnText' => 'View Record',
    'customBtnLink' => 'https://example.com',
    'timeOut'       => 10000, // per-toast auto-dismiss (ms)
    'showDuration'  => 300,   // per-toast show delay (ms)
]);

return back();`;

const VALIDATION = `public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name'  => 'required|string|max:255',
        'email' => 'required|email',
    ]);

    if ($validator->fails()) {
        // Pass the MessageBag straight in — each error becomes its own line.
        ToastMagic::error($validator->errors());

        return back()->withInput();
    }

    // ...
}`;

const AVATAR = `ToastMagic::info('New message', 'Hey, are you free for a quick call?', [
    'avatar' => $user->avatar_url,
]);`;

export default function BasicUsage() {
  return (
    <DocPage page={routeByPath("/docs/basic-usage")!}>
      <h1>Basic Usage</h1>
      <p className="lead">
        The four toast types, headings and descriptions, the per-toast options array, validation
        errors, and avatar notifications — everything you fire from a Laravel controller with the{" "}
        <code>ToastMagic</code> facade.
      </p>

      <H2 id="the-facade">The facade</H2>
      <p>
        Every toast starts by importing the facade. Add this <code>use</code> statement at the top of
        your controller (or any class where you flash toasts):
      </p>
      <CodeBlock code={IMPORT} language="php" />

      <H2 id="types">The four types</H2>
      <p>
        Toaster Magic ships four toast types, each with its own icon and accent color:{" "}
        <code>success</code>, <code>error</code>, <code>warning</code>, and <code>info</code>. Every
        type takes the same arguments — <code>(heading, description?, options?)</code>:
      </p>
      <CodeBlock code={TYPES} language="php" />
      <TypeButtons />

      <H2 id="heading-description">Heading vs. heading + description</H2>
      <p>
        The heading is required; the description is optional. Pass only a heading for a compact,
        single-line toast, or add a second argument for a supporting line of detail.
      </p>
      <H3 id="heading-only">Heading only</H3>
      <CodeBlock code={HEADING_ONLY} language="php" />
      <H3 id="heading-plus-description">Heading with description</H3>
      <CodeBlock code={HEADING_DESC} language="php" />

      <H2 id="options">The options array</H2>
      <p>
        Pass an options array as the third argument to customize a single toast without touching your
        global config. The most common keys are the close button, an action link, and the timing
        controls:
      </p>
      <CodeBlock code={OPTIONS} language="php" />
      <PropsTable rows={TOAST_OPTIONS} nameHeader="Option" />
      <Callout kind="info">
        <code>customBtnText</code> and <code>customBtnLink</code> must be provided together — the
        action button only renders when both are set. Links are sanitized: only{" "}
        <code>http://</code>, <code>https://</code>, <code>/</code>, and <code>#</code> URLs are
        allowed; anything else becomes <code>#</code>.
      </Callout>

      <H2 id="validation-errors">Passing a validation MessageBag</H2>
      <p>
        Hand a validation <code>MessageBag</code> directly to <code>error()</code> — Toaster Magic
        flattens it and renders one message per line, so form errors need no manual formatting:
      </p>
      <CodeBlock code={VALIDATION} language="php" />
      <Callout kind="tip">
        This works with any <code>MessageBag</code>, including <code>$e-&gt;errors()</code> from a
        caught <code>ValidationException</code>.
      </Callout>

      <H2 id="avatar-toasts">Avatar toasts</H2>
      <p>
        Pass an <code>avatar</code> image URL in the options array to replace the type icon with a
        picture — perfect for chat messages, mentions, and activity-feed notifications:
      </p>
      <CodeBlock code={AVATAR} language="php" />

      <H2 id="next">Next steps</H2>
      <Callout kind="info">
        See every per-toast key in the <Link to="/docs/options">Options</Link> reference, and set
        app-wide defaults for theme, position, and timing on the{" "}
        <Link to="/docs/configuration">Configuration</Link> page.
      </Callout>
    </DocPage>
  );
}
