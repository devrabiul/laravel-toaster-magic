import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

const FLASH_REDIRECT = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

public function store(Request $request)
{
    $post = Post::create($request->validated());

    ToastMagic::success('Post created', 'Your post is now live.');

    return back();          // or redirect()->route('posts.index')
}`;

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

const ACTION_BUTTON = `ToastMagic::success('Order #1042 placed', 'We are preparing your shipment.', [
    'showCloseBtn'  => true,
    'customBtnText' => 'View order',
    'customBtnLink' => route('orders.show', $order),
]);`;

const AVATAR = `// A notification-style toast with the sender's avatar instead of a type icon.
ToastMagic::info('New message', $user->name . ' sent you a message.', [
    'avatar'        => $user->avatar_url,
    'customBtnText' => 'Reply',
    'customBtnLink' => route('messages.show', $thread),
    'timeOut'       => 12000,
]);`;

const TIMEOUT = `// Stays on screen for 15 seconds; the default is 5000ms.
ToastMagic::warning('Session expiring', 'Save your work to avoid losing changes.', [
    'timeOut'      => 15000,
    'showDuration' => 200,
]);`;

const DUPLICATES = `<?php
// config/laravel-toaster-magic.php
'options' => [
    'preventDuplicates' => true, // skip a toast identical to one already visible
    // ...
],`;

const LIVEWIRE = `// Inside a Livewire component (requires 'livewire_enabled' => true in config)
public function save()
{
    $this->validate();

    User::create($this->form);

    $this->dispatch('toastMagic',
        status: 'success',
        title: 'User Created',
        message: 'The user has been successfully created.',
        options: [
            'showCloseBtn'  => true,
            'customBtnText' => 'View Profile',
            'customBtnLink' => route('users.index'),
        ],
    );
}`;

export default function Examples() {
  return (
    <DocPage page={routeByPath("/docs/examples")!}>
      <h1>Examples</h1>
      <p className="lead">
        Copy-paste recipes for the most common toast scenarios in a Laravel app — from flashing on
        redirect to validation errors, action buttons, avatars, and Livewire.
      </p>

      <H2 id="flash-on-redirect">Flash on redirect</H2>
      <p>
        The most common pattern: queue a toast in a controller action, then redirect. The toast is
        flashed to the session and shown on the next page load — <code>return back()</code> works
        perfectly:
      </p>
      <CodeBlock code={FLASH_REDIRECT} language="php" />

      <H2 id="validation-errors">Validation errors</H2>
      <p>
        Pass a validation <code>MessageBag</code> directly to <code>error()</code>. Every message is
        flattened into the toast, one per line:
      </p>
      <CodeBlock code={VALIDATION} language="php" />
      <Callout kind="tip">
        This works with any <code>MessageBag</code>, including <code>$e-&gt;errors()</code> from a
        caught <code>ValidationException</code>.
      </Callout>

      <H2 id="action-button">Action button</H2>
      <p>
        Provide <code>customBtnText</code> and <code>customBtnLink</code> together to render a link
        button inside the toast:
      </p>
      <CodeBlock code={ACTION_BUTTON} language="php" />

      <H2 id="avatar-notification">Avatar / notification toast</H2>
      <p>
        Pass an <code>avatar</code> image URL to swap the type icon for a user avatar — ideal for
        chat and activity notifications:
      </p>
      <CodeBlock code={AVATAR} language="php" />

      <H2 id="custom-timeout">Custom per-toast timeout</H2>
      <p>
        Override the auto-dismiss timer for a single toast with <code>timeOut</code> (milliseconds),
        without touching the global config:
      </p>
      <CodeBlock code={TIMEOUT} language="php" />

      <H2 id="prevent-duplicates">Prevent duplicates</H2>
      <p>
        Enable <code>preventDuplicates</code> in config to suppress a toast when an identical one
        (same type, heading, and description) is already on screen — handy for chatty loops or rapid
        form submits:
      </p>
      <CodeBlock code={DUPLICATES} language="php" filename="config/laravel-toaster-magic.php" />

      <H2 id="livewire-dispatch">Livewire dispatch</H2>
      <p>
        From a Livewire v3 or v4 component, dispatch the <code>toastMagic</code> event. Enable{" "}
        <code>livewire_enabled</code> in config first:
      </p>
      <CodeBlock code={LIVEWIRE} language="php" />
      <Callout kind="info">
        For the full Livewire setup and the fluent <code>ToastMagic::dispatch()</code> syntax, see
        the <Link to="/docs/integration/livewire">Livewire</Link> integration guide. Remember to
        escape any user-supplied text — see <Link to="/docs/security">Security</Link>.
      </Callout>
    </DocPage>
  );
}
