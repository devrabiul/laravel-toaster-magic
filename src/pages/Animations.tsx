import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2, H3 } from "../components/Heading";
import { ANIMATIONS } from "../data/reference";
import { routeByPath } from "../data/routes";

const CONFIG_ANIMATION = `<?php

// config/laravel-toaster-magic.php
return [
    'options' => [
        'animation' => 'bounce', // default | slide | fade | pop | bounce
        // ...other options
    ],
];`;

const CLEAR_CACHE = `php artisan config:clear`;

const USAGE = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

// The entrance/exit animation is read from config —
// no extra arguments are needed on the call itself.
ToastMagic::success('Order placed', 'We are preparing your shipment.');`;

export default function Animations() {
  return (
    <DocPage page={routeByPath("/docs/animations")!}>
      <h1>Animations</h1>
      <p className="lead">
        Choose how toasts enter and leave the screen with a single config value, and let the stack
        rearrange itself smoothly as toasts appear and dismiss.
      </p>

      <H2 id="setting-the-animation">Setting the animation</H2>
      <p>
        The <code>animation</code> key inside the <code>options</code> array of{" "}
        <code>config/laravel-toaster-magic.php</code> controls the entrance and exit motion for
        every toast:
      </p>
      <CodeBlock
        code={CONFIG_ANIMATION}
        language="php"
        filename="config/laravel-toaster-magic.php"
      />
      <p>Clear the config cache so the change takes effect in production:</p>
      <CodeBlock code={CLEAR_CACHE} language="bash" />
      <CodeBlock code={USAGE} language="php" />
      <Callout kind="info">
        The animation is global — it applies to every <code>success</code>, <code>error</code>,{" "}
        <code>warning</code>, and <code>info</code> toast. You do not pass it per toast.
      </Callout>

      <H2 id="available-animations">Available animations</H2>
      <p>
        There are five animation values. Each one is a valid <code>'animation'</code> setting:
      </p>
      <div className="table-wrap">
        <table className="props">
          <thead>
            <tr>
              <th>Animation</th>
              <th>Config value</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            {ANIMATIONS.map((animation) => (
              <tr key={animation.id}>
                <td>
                  <strong>{animation.name}</strong>
                </td>
                <td className="col-name">
                  <code>'{animation.id}'</code>
                </td>
                <td>{animation.blurb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3 id="picking-an-animation">Picking an animation</H3>
      <p>
        <code>default</code> and <code>slide</code> feel crisp and professional for admin panels.{" "}
        <code>fade</code> is the calmest, least distracting choice. <code>pop</code> and{" "}
        <code>bounce</code> add personality for consumer-facing apps — use them sparingly so success
        confirmations stay pleasant rather than noisy.
      </p>

      <H2 id="stack-reflow">Smooth FLIP stack reflow</H2>
      <p>
        When several toasts are on screen and one is dismissed, the remaining toasts slide into
        their new positions instead of snapping. This reflow uses the FLIP technique — First, Last,
        Invert, Play: the library measures each toast's position before and after the layout change,
        then animates the difference. It runs automatically for every theme and animation, so there
        is nothing to enable.
      </p>
      <Callout kind="tip">
        The FLIP reflow respects <code>prefers-reduced-motion</code>. When a visitor has requested
        reduced motion in their operating system, the reordering and entrance/exit transitions are
        shortened so the interface stays comfortable and accessible — you get this behavior for free,
        with no config flag or JavaScript feature detection on your side.
      </Callout>

      <Callout kind="info">
        Animations pair with every theme. Explore the seven looks on the{" "}
        <Link to="/docs/themes">Themes</Link> page, and anchor the stack to any corner from{" "}
        <Link to="/docs/positioning">Positioning</Link>.
      </Callout>
    </DocPage>
  );
}
