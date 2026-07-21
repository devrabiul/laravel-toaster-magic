import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2, H3 } from "../components/Heading";
import { POSITIONS } from "../data/reference";
import { routeByPath } from "../data/routes";

const CONFIG_POSITION = `<?php

// config/laravel-toaster-magic.php
return [
    'options' => [
        'positionClass' => 'toast-bottom-end', // defaults to 'toast-top-end'
        // ...other options
    ],
];`;

const CLEAR_CACHE = `php artisan config:clear`;

const USAGE = `use Devrabiul\\ToastMagic\\Facades\\ToastMagic;

// Every toast is anchored to the corner set in config.
ToastMagic::success('Saved', 'Your settings were updated.');`;

export default function Positioning() {
  return (
    <DocPage page={routeByPath("/docs/positioning")!}>
      <h1>Positioning</h1>
      <p className="lead">
        Anchor the toast stack to any of six spots: the three top edges and the three bottom edges.
        The newest toast always appears closest to the anchored corner.
      </p>

      <H2 id="setting-the-position">Setting the position</H2>
      <p>
        The <code>positionClass</code> key inside the <code>options</code> array of{" "}
        <code>config/laravel-toaster-magic.php</code> decides where the stack sits. The default is{" "}
        <code>toast-top-end</code> (top-right):
      </p>
      <CodeBlock code={CONFIG_POSITION} language="php" filename="config/laravel-toaster-magic.php" />
      <p>Clear the config cache after changing it so the new position takes effect:</p>
      <CodeBlock code={CLEAR_CACHE} language="bash" />
      <CodeBlock code={USAGE} language="php" />
      <Callout kind="info">
        <code>positionClass</code> is a global setting — it applies to every toast. When it is
        omitted, Laravel Toaster Magic falls back to <code>toast-top-end</code>.
      </Callout>

      <H2 id="available-positions">Available positions</H2>
      <p>There are six valid values for <code>positionClass</code>:</p>
      <div className="table-wrap">
        <table className="props">
          <thead>
            <tr>
              <th>Placement</th>
              <th>Config value</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {POSITIONS.map((position) => (
              <tr key={position.id}>
                <td>
                  <strong>{position.name}</strong>
                </td>
                <td className="col-name">
                  <code>'{position.id}'</code>
                </td>
                <td>{position.id === "toast-top-end" ? "Default" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3 id="stacking-order">Stacking order</H3>
      <p>
        Stacking follows the anchor. For the three <code>top</code> positions the newest toast
        appears at the top and older ones move down; for the three <code>bottom</code> positions the
        newest sits at the bottom and older toasts move up. When a toast is dismissed, the rest
        reflow smoothly — see <Link to="/docs/animations">Animations</Link>.
      </p>

      <H3 id="rtl-support">RTL support</H3>
      <p>
        The <code>start</code> and <code>end</code> names are direction-aware. In a right-to-left
        layout (<code>dir="rtl"</code>), <code>toast-top-end</code> anchors to the left, so the
        stack always sits on the correct side for the reading direction.
      </p>

      <Callout kind="tip">
        Positioning composes with the rest of the styling — combine it with any{" "}
        <Link to="/docs/themes">theme</Link> and <Link to="/docs/dark-mode">dark mode</Link> for the
        exact look you want.
      </Callout>
    </DocPage>
  );
}
