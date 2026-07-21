import { Link } from "react-router-dom";
import { DocPage } from "../../components/DocPage";
import { H2, H3 } from "../../components/Heading";
import { CodeBlock } from "../../components/CodeBlock";
import { Callout } from "../../components/Callout";
import { PropsTable } from "../../components/PropsTable";
import { TOAST_OPTIONS } from "../../data/reference";
import { routeByPath } from "../../data/routes";

const IMPORT = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;`;

const TYPES = `// The four toast types — heading only, or heading + description.
ToastMagic::success('Successfully created');
ToastMagic::info('Heads up', 'A new version is available.');
ToastMagic::warning('Almost out of stock', 'Only 3 items left.');
ToastMagic::error('Something went wrong', 'Please try again in a moment.');`;

const CONTROLLER = `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Post;
use Devrabiul\\ToastMagic\\Facades\\ToastMagic;
use Illuminate\\Http\\Request;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $post = Post::create($request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]));

        ToastMagic::success('Post created', 'Your post is now live.');

        return redirect()->route('posts.show', $post);
    }
}`;

const OPTIONS = `ToastMagic::success('Order placed', 'We are preparing your shipment.', [
    'showCloseBtn'  => true,       // show a close button on this toast
    'customBtnText' => 'View order',
    'customBtnLink' => route('orders.show', $order),
    'timeOut'       => 10000,      // per-toast auto-dismiss (ms)
    'showDuration'  => 300,        // per-toast entrance delay (ms)
]);`;

const VALIDATION = `public function update(Request $request, User $user)
{
    $validator = Validator::make($request->all(), [
        'name'  => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
    ]);

    if ($validator->fails()) {
        // Pass the MessageBag straight in — each error becomes its own line.
        ToastMagic::error($validator->errors());

        return back()->withInput();
    }

    $user->update($validator->validated());

    ToastMagic::success('Profile updated');

    return back();
}`;

const AVATAR = `// Swap the type icon for a user avatar — perfect for chat and activity feeds.
ToastMagic::info('New message', $user->name . ' sent you a message.', [
    'avatar'        => $user->avatar_url,
    'customBtnText' => 'Reply',
    'customBtnLink' => route('messages.show', $thread),
    'timeOut'       => 12000,
]);`;

const REDIRECT = `public function destroy(Post $post)
{
    $post->delete();

    ToastMagic::warning('Post deleted', 'The post has been moved to trash.');

    // The toast is flashed to the session and shown on the NEXT request —
    // both of these work:
    return back();                          // stay where the user came from
    // return redirect()->route('posts.index');
}`;

const FLUENT = `// Fluent alternative — chain off ToastMagic::dispatch().
ToastMagic::dispatch()->success('User created', 'The user has been created.', [
    'customBtnText' => 'View profile',
    'customBtnLink' => route('users.show', $user),
]);`;

const ESCAPE = `// Heading and description render as HTML — always escape user input.
ToastMagic::success('Welcome, ' . e($user->name) . '!');`;

export default function ControllersPage() {
  return (
    <DocPage page={routeByPath("/docs/integration/controllers")!}>
      <h1>Controllers &amp; Redirects</h1>
      <p className="lead">
        Trigger toasts from anywhere in your Laravel application with the <code>ToastMagic</code>{" "}
        facade. Toasts queued in a controller are flashed to the session and shown on the next page
        load, so they survive a redirect out of the box.
      </p>

      <H2 id="import-the-facade">Import the facade</H2>
      <p>
        Add a single <code>use</code> statement at the top of your controller. Every toast type is a
        static method on the facade:
      </p>
      <CodeBlock code={IMPORT} language="php" />

      <H2 id="the-four-types">The four toast types</H2>
      <p>
        Each type maps to a colour and an icon. The first argument is the heading; the optional
        second argument is a longer description:
      </p>
      <CodeBlock code={TYPES} language="php" />
      <Callout kind="info">
        The available types are <code>success</code>, <code>info</code>, <code>warning</code>, and{" "}
        <code>error</code>. See <Link to="/docs/methods">Methods</Link> for the full facade
        reference.
      </Callout>

      <H2 id="in-a-controller-action">In a controller action</H2>
      <p>
        A typical store action creates a record, queues a toast, and redirects. Nothing else is
        required — the toast appears once the destination page renders:
      </p>
      <CodeBlock code={CONTROLLER} language="php" filename="app/Http/Controllers/PostController.php" />

      <H2 id="per-toast-options">Per-toast options</H2>
      <p>
        Pass an options array as the third argument to customise a single toast without touching
        your global <Link to="/docs/configuration">configuration</Link>:
      </p>
      <CodeBlock code={OPTIONS} language="php" />
      <PropsTable rows={TOAST_OPTIONS} nameHeader="Option" />
      <Callout kind="tip">
        <code>customBtnText</code> and <code>customBtnLink</code> only render a button when supplied{" "}
        <em>together</em>. Links are sanitized — only <code>http(s)</code>, <code>/</code>, and{" "}
        <code>#</code> URLs are allowed.
      </Callout>

      <H2 id="validation-messagebag">Passing a validation MessageBag</H2>
      <p>
        Hand a validation <code>MessageBag</code> directly to <code>error()</code>. Every message is
        flattened into the toast, one per line:
      </p>
      <CodeBlock code={VALIDATION} language="php" />
      <Callout kind="info">
        This works with any <code>MessageBag</code>, including <code>$e-&gt;errors()</code> from a
        caught <code>ValidationException</code>.
      </Callout>

      <H2 id="avatar-toasts">Avatar toasts</H2>
      <p>
        Provide an <code>avatar</code> image URL to replace the type icon with a picture — ideal for
        notification-style toasts:
      </p>
      <CodeBlock code={AVATAR} language="php" />

      <H2 id="surviving-redirects">Surviving a redirect</H2>
      <p>
        Because toasts are flashed to the session, they are rendered on the{" "}
        <strong>next</strong> request. That means both <code>return back()</code> and{" "}
        <code>redirect()-&gt;route(...)</code> carry the toast to the destination page:
      </p>
      <CodeBlock code={REDIRECT} language="php" />

      <H3 id="fluent-dispatch">Fluent dispatch syntax</H3>
      <p>
        Prefer a fluent style? Chain the type off <code>ToastMagic::dispatch()</code> — it accepts
        the same heading, description, and options arguments:
      </p>
      <CodeBlock code={FLUENT} language="php" />

      <H2 id="escaping-user-input">Escaping user input</H2>
      <p>
        Toast headings and descriptions are rendered as HTML (newlines become <code>&lt;br&gt;</code>
        ), so never pass raw user input. Escape it first:
      </p>
      <CodeBlock code={ESCAPE} language="php" />
      <Callout kind="warning">
        Always run untrusted values through <code>e()</code> or <code>strip_tags()</code>. Read{" "}
        <Link to="/docs/security">Security</Link> for the full XSS and link-sanitization rules.
      </Callout>

      <Callout kind="tip">
        Triggering toasts from a Livewire component or a client-side AJAX response instead? See the{" "}
        <Link to="/docs/integration/livewire">Livewire</Link> and{" "}
        <Link to="/docs/integration/javascript">JavaScript</Link> integration guides.
      </Callout>
    </DocPage>
  );
}
