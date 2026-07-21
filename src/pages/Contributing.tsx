import { Link } from "react-router-dom";
import { Callout } from "../components/Callout";
import { CodeBlock } from "../components/CodeBlock";
import { DocPage } from "../components/DocPage";
import { H2 } from "../components/Heading";
import { routeByPath } from "../data/routes";

const CLONE = `# 1. Fork the repository on GitHub, then clone your fork.
git clone https://github.com/YOUR-USERNAME/laravel-toaster-magic.git
cd laravel-toaster-magic

# 2. Add the upstream remote so you can stay in sync.
git remote add upstream https://github.com/devrabiul/laravel-toaster-magic.git`;

const INSTALL = `# Install the PHP dependencies with Composer.
composer install`;

const TESTS = `# Run the full test suite before you push.
vendor/bin/phpunit`;

const BRANCH_PR = `# Work on a focused branch off main.
git checkout -b fix/short-description

# Commit, push to your fork, then open a pull request against
# devrabiul/laravel-toaster-magic:main from the GitHub UI.
git push origin fix/short-description`;

export default function Contributing() {
  return (
    <DocPage page={routeByPath("/docs/contributing")!}>
      <h1>Contributing</h1>
      <p className="lead">
        Contributions are welcome — bug reports, documentation fixes, and pull requests all help make
        Laravel Toaster Magic better.
      </p>

      <H2 id="fork-and-clone">Fork and clone</H2>
      <p>
        Start by forking the{" "}
        <a href="https://github.com/devrabiul/laravel-toaster-magic" target="_blank" rel="noreferrer">
          repository
        </a>{" "}
        on GitHub, then clone your fork locally and wire up the upstream remote:
      </p>
      <CodeBlock code={CLONE} language="bash" />

      <H2 id="install-dependencies">Install dependencies</H2>
      <p>Install the PHP dependencies with Composer:</p>
      <CodeBlock code={INSTALL} language="bash" />

      <H2 id="run-tests">Run the test suite</H2>
      <p>
        The package ships with a PHPUnit test suite. Run it before you start and again before you
        push, so you know your change is green:
      </p>
      <CodeBlock code={TESTS} language="bash" />
      <Callout kind="tip">
        When you fix a bug or add a feature, add or update a test that covers it — a failing test that
        your change turns green is the clearest way to describe the fix.
      </Callout>

      <H2 id="coding-standards">Follow the coding standards</H2>
      <p>
        Match the existing code style: PSR-12 formatting, clear names, and small focused commits.
        Keep pull requests scoped to a single concern, and update the documentation when you change
        behavior or add an option.
      </p>

      <H2 id="open-a-pull-request">Open a pull request</H2>
      <p>
        Work on a descriptive branch, push it to your fork, and open a pull request against{" "}
        <code>main</code>. In the description, explain the motivation and what changed so reviewers
        have the context they need.
      </p>
      <CodeBlock code={BRANCH_PR} language="bash" />

      <H2 id="report-issues">Report issues</H2>
      <p>
        Found a bug or have a feature idea? Open an issue on the{" "}
        <a
          href="https://github.com/devrabiul/laravel-toaster-magic/issues"
          target="_blank"
          rel="noreferrer"
        >
          GitHub issue tracker
        </a>
        . For bugs, include your Laravel and package versions and a minimal reproduction — a short
        snippet or steps — so the problem can be pinned down quickly. If you're stuck first, the{" "}
        <Link to="/docs/troubleshooting">Troubleshooting</Link> and <Link to="/docs/faq">FAQ</Link>{" "}
        pages cover the most common issues.
      </p>

      <H2 id="code-of-conduct">Code of Conduct</H2>
      <p>
        This project is released with a Code of Conduct. By participating — in issues, reviews, or
        pull requests — you agree to abide by its terms and to keep interactions respectful and
        constructive. Maintainers volunteer their time, so a friendly, collaborative tone goes a long
        way.
      </p>
    </DocPage>
  );
}
