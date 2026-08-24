import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2, H3 } from "../components/Heading";
import { PresetPlayground } from "../components/PresetPlayground";
import { PRESET_PACKS, PRESET_TOTAL } from "../data/reference";
import { routeByPath } from "../data/routes";

const ENABLE_PACK = `<?php

// config/laravel-toaster-magic.php
return [
    // Preset packs to load. Each pack is a separate script and
    // stylesheet, so you ship only the icons you actually use —
    // the core runtime contains none of them.
    'presets' => ['general', 'commerce'],
];`;

const USAGE = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

ToastMagic::success('Added to cart', 'Nike Air Max ×1', ['preset' => 'cart-add']);
ToastMagic::info('Deploy succeeded', 'v2.6 is live in production.', ['preset' => 'deploy-succeeded']);
ToastMagic::error('Build failed', 'Check the pipeline logs.', ['preset' => 'build-failed']);`;

const LIVEWIRE = `$this->dispatch('toastMagic',
    status: 'success',
    title: 'Order placed',
    message: 'We are preparing your shipment.',
    options: ['preset' => 'order-placed'],
);`;

const BLADE_ATTR = `<button
    data-toast-type="success"
    data-toast-heading="Copied"
    data-toast-preset="clipboard-copy"
>
    Copy link
</button>`;

const ALL_PACKS = `'presets' => 'all',   // every pack
'presets' => [],      // none — type icons only`;

const REGISTRY = `// PHP — the registered preset names
ToastMagic::PRESETS;

// JavaScript — the same registry, in the browser
window.ToastMagicInternals.TOAST_PRESETS;`;

const REDUCED_MOTION = `@media (prefers-reduced-motion: reduce) {
    /* Preset icons still render — they simply stop moving. */
}`;

export default function Presets() {
  return (
    <DocPage page={routeByPath("/docs/presets")!}>
      <h1>Animated Presets</h1>
      <p className="lead">
        {PRESET_TOTAL} animated, multi-coloured icons that sit <strong>on top of</strong> the toast
        types you already use, split into {PRESET_PACKS.length} opt-in packs. Added in{" "}
        <strong>v2.6</strong>.
      </p>

      <Callout kind="info">
        Presets are additive. A toast without one renders exactly as it did before, and the four
        type icons are untouched. There is no global switch that changes existing calls.
      </Callout>

      <H2 id="try-them">Try them</H2>
      <p>
        Pick a pack, pick a type, then click any preset to fire a real toast. This runs the actual
        v2.6 runtime and the real preset packs, loaded on demand:
      </p>
      <PresetPlayground />

      <H2 id="what-a-preset-is">What a preset is</H2>
      <p>
        A preset is a <em>presentation layer</em> on top of an existing toast type. It does not
        replace the type and it is not a new type. The type still decides:
      </p>
      <ul>
        <li>the accent colour and the progress bar</li>
        <li>the theme treatment</li>
        <li>
          how the toast is announced to assistive technology — urgency is derived from the type
          alone, so a preset never changes whether a message is polite or assertive
        </li>
      </ul>
      <p>
        The preset decides only which animated icon is drawn in place of the type icon. That is why{" "}
        <code>success</code> with <code>cart-add</code> is still a success toast in every way that
        matters.
      </p>

      <H2 id="enabling-a-pack">Enabling a pack</H2>
      <p>
        Presets are <strong>opt-in by pack</strong>. Each pack is a separate script and stylesheet,
        so a project downloads only the icons it lists — the core runtime ships none of them.
      </p>
      <CodeBlock code={ENABLE_PACK} language="php" filename="config/laravel-toaster-magic.php" />
      <p>The default published config enables the general pack only. Two shorthands are accepted:</p>
      <CodeBlock code={ALL_PACKS} language="php" />
      <Callout kind="warning">
        A preset from a pack that is not listed is <strong>ignored</strong>, and the toast renders
        with its ordinary type icon. Nothing errors and nothing is logged — so if a preset silently
        does nothing, check that its pack is enabled first.
      </Callout>

      <H2 id="using-a-preset">Using a preset</H2>
      <p>
        Pass <code>preset</code> in the per-toast options array, exactly like any other option:
      </p>
      <CodeBlock code={USAGE} language="php" />

      <H3 id="from-livewire">From Livewire</H3>
      <CodeBlock code={LIVEWIRE} language="php" />

      <H3 id="from-blade-attributes">From a data attribute</H3>
      <p>
        The <code>data-toast-*</code> trigger API accepts <code>data-toast-preset</code>:
      </p>
      <CodeBlock code={BLADE_ATTR} language="html" />

      <H2 id="the-packs">The packs</H2>
      <p>
        {PRESET_TOTAL} presets across {PRESET_PACKS.length} packs. Enable only what you use — each
        pack is a separate download.
      </p>
      <div className="table-wrap">
        <table className="props">
          <thead>
            <tr>
              <th>Pack</th>
              <th>Covers</th>
              <th>Presets</th>
            </tr>
          </thead>
          <tbody>
            {PRESET_PACKS.map((pack) => (
              <tr key={pack.name}>
                <td className="col-name">
                  <code>{pack.name}</code>
                </td>
                <td>{pack.covers}</td>
                <td className="col-type">{pack.count}</td>
              </tr>
            ))}
            <tr>
              <td className="col-name">
                <strong>Total</strong>
              </td>
              <td />
              <td className="col-type">
                <strong>{PRESET_TOTAL}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The full catalogue — every preset name, pack by pack — lives in{" "}
        <a
          href="https://github.com/devrabiul/laravel-toaster-magic/blob/main/PRESETS.md"
          target="_blank"
          rel="noreferrer"
        >
          PRESETS.md
        </a>{" "}
        in the repository.
      </p>

      <H2 id="how-they-animate">How they animate</H2>
      <p>
        Every preset animates its own icon and keeps moving. Parts of the icon move in sequence and
        the motion runs twice before resting, rather than playing a one-shot entrance that then
        freezes. Keyframes open and close on the same frame, so the two passes read as one
        continuous movement, and every icon idles at full size and full opacity.
      </p>
      <p>
        No preset replaces the icon with a checkmark part-way through — the icon you pick is the
        icon that stays.
      </p>
      <p>The package&apos;s own test suite asserts that:</p>
      <ul>
        <li>no two presets share an animation</li>
        <li>every animation has a rule behind it</li>
        <li>the motion repeats rather than playing once</li>
        <li>a preset never renders a second icon over the first</li>
      </ul>

      <H3 id="reduced-motion">Reduced motion</H3>
      <p>
        Preset animation is neutralised under <code>prefers-reduced-motion: reduce</code>. The icons
        still render — they simply do not move.
      </p>
      <CodeBlock code={REDUCED_MOTION} language="css" />

      <H2 id="colour">Colour</H2>
      <p>
        Preset icons are multi-coloured. Each is painted from custom properties — <code>--tm-i1</code>,{" "}
        <code>--tm-i2</code> and <code>--tm-i3</code> — with a light and a dark palette per preset,
        plus a dedicated palette for the <code>neon</code> theme.
      </p>
      <p>
        Every property falls back to <code>currentColor</code>, so resetting them returns the whole
        set to monochrome tracking the toast type:
      </p>
      <CodeBlock
        code={`.toast-container {
    --tm-i1: currentColor;
    --tm-i2: currentColor;
    --tm-i3: currentColor;
}`}
        language="css"
      />
      <Callout kind="tip">
        Tests assert that no preset ships a literal colour or a missing palette, so overriding these
        three properties is guaranteed to reach every icon in every pack.
      </Callout>

      <H2 id="the-registry">The registry</H2>
      <p>
        The registered preset names are exposed on both sides, and a test asserts the two stay in
        step — a preset added to one and forgotten in the other fails CI rather than being silently
        dropped:
      </p>
      <CodeBlock code={REGISTRY} language="js" />

      <H2 id="licensing">Icon licensing</H2>
      <p>
        Icon geometry is{" "}
        <a href="https://lucide.dev" target="_blank" rel="noreferrer">
          Lucide
        </a>{" "}
        v1.33.0 (ISC). A handful — <code>check</code>, <code>download</code>, <code>upload</code> and{" "}
        <code>trash-2</code> — derive from Feather (MIT). Both licences permit redistribution,
        unlike the animated-icon libraries that would otherwise be the obvious source.
      </p>
      <p>
        Animation is plain CSS. There is no Lottie player and no runtime dependency, so the
        package&apos;s zero-dependency promise still holds with every pack enabled.
      </p>

      <H2 id="next">Next steps</H2>
      <ul>
        <li>
          <Link to="/docs/configuration">Configuration</Link> — the full config reference, including{" "}
          <code>presets</code>
        </li>
        <li>
          <Link to="/docs/options">Options</Link> — every per-toast option, including{" "}
          <code>preset</code>
        </li>
        <li>
          <Link to="/docs/themes">Themes</Link> — presets layer on top of any theme
        </li>
      </ul>
    </DocPage>
  );
}
