import { Link } from "react-router-dom";
import { DocPage } from "../../components/DocPage";
import { H2, H3 } from "../../components/Heading";
import { CodeBlock } from "../../components/CodeBlock";
import { Callout } from "../../components/Callout";
import { routeByPath } from "../../data/routes";

const INSTANCE = `// The ToastMagic class is registered globally by ToastMagic::scripts().
const toastMagic = new ToastMagic();

toastMagic.success('Success!', 'Your data has been saved!');
toastMagic.error('Error!', 'Something went wrong.');`;

const FETCH = `async function saveProfile(payload) {
    const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify(payload),
    });

    const toastMagic = new ToastMagic();

    if (response.ok) {
        toastMagic.success('Profile updated', 'Your changes are live.');
    } else {
        const { message } = await response.json();
        toastMagic.error('Update failed', message ?? 'Please try again.');
    }
}`;

const EVENT = `// Fire a toast in response to a custom DOM event.
const toastMagic = new ToastMagic();

document.addEventListener('cart:item-added', (event) => {
    toastMagic.info('Added to cart', event.detail.name, false, 'View cart', '/cart');
});`;

const SIGNATURE = `toastMagic.success(
    heading,        // string  — required title
    description,    // string  — longer body text
    showCloseBtn,   // bool    — show a close button
    customBtnText,  // string  — action button label
    customBtnLink,  // string  — action button URL (http(s), /, # only)
    timeOut,        // number  — auto-dismiss in ms
    showDuration,   // number  — entrance delay in ms
    avatar,         // string  — image URL, replaces the type icon
);`;

const POSITIONAL = `const toastMagic = new ToastMagic();

// heading, description, showCloseBtn, customBtnText, customBtnLink, timeOut
toastMagic.success(
    'Order placed',
    'We are preparing your shipment.',
    true,
    'View order',
    '/orders/1042',
    10000,
);`;

const CLEAR = `const toastMagic = new ToastMagic();

toastMagic.clear();       // remove all visible toasts
toastMagic.dismissAll();  // alias for clear()`;

export default function JavaScriptPage() {
  return (
    <DocPage page={routeByPath("/docs/integration/javascript")!}>
      <h1>JavaScript &amp; AJAX</h1>
      <p className="lead">
        Fire toasts entirely on the client from AJAX responses, custom events, or any front-end
        logic. The global <code>ToastMagic</code> class is available on every page that renders{" "}
        <code>ToastMagic::scripts()</code>.
      </p>

      <H2 id="creating-an-instance">Creating an instance</H2>
      <p>
        Instantiate the class once, then call a type method. The API mirrors the PHP facade — a
        heading and an optional description:
      </p>
      <CodeBlock code={INSTANCE} language="js" />
      <Callout kind="info">
        The class is registered by <code>ToastMagic::scripts()</code>. Make sure the scripts tag is
        present before your JavaScript runs — see the{" "}
        <Link to="/docs/integration/blade">Blade Setup</Link> guide.
      </Callout>

      <H2 id="from-fetch-responses">From fetch / AJAX responses</H2>
      <p>
        The most common client-side use: react to the result of a <code>fetch</code> or XHR call and
        show the appropriate toast without a page reload:
      </p>
      <CodeBlock code={FETCH} language="js" />

      <H2 id="from-custom-events">From custom events</H2>
      <p>
        Wire toasts to any DOM event to decouple your notification logic from the code that triggers
        it:
      </p>
      <CodeBlock code={EVENT} language="js" />

      <H2 id="positional-signature">The positional signature</H2>
      <p>
        Unlike the PHP facade, the JavaScript methods take options as{" "}
        <strong>positional arguments</strong> rather than an object. Every type
        (<code>success</code>, <code>info</code>, <code>warning</code>, <code>error</code>) shares
        the same signature:
      </p>
      <CodeBlock code={SIGNATURE} language="js" />
      <p>Pass only the arguments you need, in order:</p>
      <CodeBlock code={POSITIONAL} language="js" />
      <Callout kind="tip">
        Arguments are positional, so to set a later one (like <code>timeOut</code>) you must supply
        the earlier ones. Pass <code>false</code>, <code>null</code>, or an empty string for values
        you want to skip.
      </Callout>

      <H2 id="clearing-toasts">Clearing toasts</H2>
      <p>
        Remove every visible toast at once — for example when navigating away in a single-page
        section:
      </p>
      <CodeBlock code={CLEAR} language="js" />
      <p>
        <code>dismissAll()</code> is an alias for <code>clear()</code>; use whichever reads better.
      </p>

      <H3 id="facade-vs-javascript">When to prefer this over the facade</H3>
      <p>
        Reach for the JavaScript API when the toast is a reaction to something that happens
        <em> in the browser</em> — an AJAX response, a validation hint, a WebSocket message, or a UI
        interaction — where there is no new server request to flash a session toast onto.
      </p>
      <p>
        Prefer the <Link to="/docs/integration/controllers">PHP facade</Link> for anything that
        happens during a normal request/redirect cycle, and the{" "}
        <Link to="/docs/integration/livewire">Livewire</Link> dispatch API inside Livewire
        components. All three render identical toasts.
      </p>
      <Callout kind="warning">
        Headings and descriptions render as HTML. When building them from user or API data, escape
        the values first — see <Link to="/docs/security">Security</Link>.
      </Callout>
    </DocPage>
  );
}
