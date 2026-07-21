import { Link } from "react-router-dom";
import { DocPage } from "../../components/DocPage";
import { H2, H3 } from "../../components/Heading";
import { CodeBlock } from "../../components/CodeBlock";
import { Callout } from "../../components/Callout";
import { routeByPath } from "../../data/routes";

const CONFIG = `<?php
// config/laravel-toaster-magic.php

return [
    'options' => [
        // ... your default toast options
    ],

    'livewire_enabled' => true,   // turn on the Livewire bridge
    'livewire_version' => 'v3',   // 'v3' or 'v4' — match your Livewire install
];`;

const SIMPLE = `// Inside any Livewire component method.
$this->dispatch('toastMagic',
    status: 'success',
    title: 'Saved',
    message: 'Your changes have been saved.',
);`;

const FULL = `<?php

namespace App\\Livewire;

use App\\Models\\User;
use Livewire\\Component;

class CreateUser extends Component
{
    public string $name = '';
    public string $email = '';

    public function save()
    {
        $this->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);

        User::create([
            'name'  => $this->name,
            'email' => $this->email,
        ]);

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

        $this->reset(['name', 'email']);
    }
}`;

const COMPAT = `$this->dispatch('toastMagic',
    status: 'info',
    title: 'Heads up',
    message: 'Both option keys are accepted.',
    options: [
        'showCloseBtn' => true,   // preferred key
        'closeButton'  => false,  // ignored here — showCloseBtn wins
    ],
);`;

export default function LivewirePage() {
  return (
    <DocPage page={routeByPath("/docs/integration/livewire")!}>
      <h1>Livewire (v3 &amp; v4)</h1>
      <p className="lead">
        Dispatch toast notifications from Livewire components using event-based dispatching. Laravel
        Toaster Magic ships with a first-class bridge for both Livewire v3 and v4.
      </p>

      <H2 id="enable-livewire">Enable Livewire in config</H2>
      <p>
        The Livewire bridge is off by default. Turn it on and set the version to match your install
        in <code>config/laravel-toaster-magic.php</code>:
      </p>
      <CodeBlock code={CONFIG} language="php" filename="config/laravel-toaster-magic.php" />
      <Callout kind="info">
        Set <code>livewire_version</code> to <code>'v3'</code> or <code>'v4'</code>. The package
        registers the matching listener so dispatched events are picked up on the front end
        automatically — no extra JavaScript or Blade wiring beyond the standard{" "}
        <Link to="/docs/integration/blade">asset setup</Link>.
      </Callout>

      <H2 id="dispatching-a-toast">Dispatching a toast</H2>
      <p>
        From any component method, dispatch the <code>toastMagic</code> event with named arguments.
        The <code>status</code>, <code>title</code>, and <code>message</code> parameters map to the
        toast type, heading, and description; <code>options</code> is the same per-toast options
        array used everywhere else:
      </p>
      <CodeBlock code={SIMPLE} language="php" />
      <p>
        Valid <code>status</code> values are <code>success</code>, <code>info</code>,{" "}
        <code>warning</code>, and <code>error</code>.
      </p>

      <H2 id="full-component-example">Full component example</H2>
      <p>
        A complete create-and-notify flow: validate, persist, then dispatch a success toast with an
        action button:
      </p>
      <CodeBlock code={FULL} language="php" filename="app/Livewire/CreateUser.php" />

      <H2 id="backward-compat">Backward compatibility: close button keys</H2>
      <p>
        The options array accepts both <code>showCloseBtn</code> and the legacy{" "}
        <code>closeButton</code> key so older code keeps working. If you pass both, the newer{" "}
        <code>showCloseBtn</code> takes precedence:
      </p>
      <CodeBlock code={COMPAT} language="php" />

      <Callout kind="warning">
        <strong>Livewire v3 &amp; v4.</strong> Both versions are fully supported — the only
        difference is the <code>livewire_version</code> value in config. On v4 the dispatch API is
        identical, so components written for v3 continue to work after upgrading; just bump the
        config value to <code>'v4'</code>. Remember to escape any user-supplied text in{" "}
        <code>title</code> or <code>message</code> — see{" "}
        <Link to="/docs/security">Security</Link>.
      </Callout>

      <H3 id="see-also">See also</H3>
      <p>
        Triggering toasts from a plain controller action instead? See the{" "}
        <Link to="/docs/integration/controllers">Controllers &amp; Redirects</Link> guide, or the{" "}
        <Link to="/docs/integration/javascript">JavaScript</Link> guide for firing them client-side.
      </p>
    </DocPage>
  );
}
