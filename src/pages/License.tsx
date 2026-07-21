import { Callout } from "../components/Callout";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

export default function License() {
  return (
    <DocPage page={routeByPath("/docs/license")!}>
      <h1>License</h1>
      <p className="lead">
        Laravel Toaster Magic is free, open-source software released under the MIT License — with a
        Treeware clause that asks you to plant a tree.
      </p>

      <H2 id="mit-license">MIT License</H2>
      <p>
        The MIT License is permissive: you are free to use the package in personal and commercial
        projects, modify it, and redistribute it — provided the original copyright and permission
        notice are kept in all copies. In short:
      </p>
      <ul>
        <li>
          <strong>Permitted</strong> — commercial use, modification, distribution, and private use.
        </li>
        <li>
          <strong>Required</strong> — include the copyright notice and the license text.
        </li>
        <li>
          <strong>No warranty</strong> — the software is provided "as is", without warranty of any
          kind, and the authors are not liable for any claim or damages.
        </li>
      </ul>
      <p>
        You can read the full text in the{" "}
        <a
          href="https://github.com/devrabiul/laravel-toaster-magic/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer"
        >
          LICENSE file on GitHub
        </a>
        . The package is authored and maintained by Muhammad Rabiul.
      </p>

      <H2 id="treeware">Treeware</H2>
      <p>
        Laravel Toaster Magic is <strong>Treeware</strong>. If you use it in production, the author
        asks that you help fund the maintenance of the package and the planet by buying the world a
        tree.
      </p>
      <Callout kind="tip">
        Plant a tree to say thanks:{" "}
        <a href="https://plant.treeware.earth/devrabiul/laravel-toaster-magic" target="_blank" rel="noreferrer">
          plant.treeware.earth/devrabiul/laravel-toaster-magic
        </a>
        . It costs a few cents, offsets a little of your project's footprint, and supports the people
        who keep the package alive.
      </Callout>
      <p>
        Trees are planted in a Treeware forest, which helps restore biodiversity and absorb carbon —
        a small, tangible way to give back for a free tool.
      </p>
    </DocPage>
  );
}
