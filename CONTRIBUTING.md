# Contributing to Laravel Toaster Magic

Thank you for considering contributing to Laravel Toaster Magic! Your contributions help improve the package and make it more useful for the Laravel community.

## How to Contribute

### 1. Fork and Clone the Repository
First, fork the repository on GitHub and then clone it to your local machine:
```sh
git clone https://github.com/your-username/laravel-toaster-magic.git
cd laravel-toaster-magic
```

### 2. Install Dependencies
Ensure you have PHP and Composer installed. Then, install dependencies:
```sh
composer install
```

### 3. Create a New Branch
Before making changes, create a new branch for your feature or bugfix:
```sh
git checkout -b feature-or-fix-name
```

### 4. Make Your Changes
- Follow PSR-4 and PSR-12 coding standards.
- Write clear, maintainable, and well-documented code.
- Update or add tests if necessary.

### 5. Run Tests
Ensure all tests pass before submitting your contribution:
```sh
vendor/bin/pest
npm ci && npm test
```

### 5a. Rebuild Generated Files
If you changed a stylesheet or a preset pack, rebuild before committing:
```sh
npm run build
```
This regenerates the minified CSS and the AI reference files under `resources/boost/`
(the Agent Skill's preset catalogue and the Laravel Boost guideline), and copies the
`package.json` version into the Claude Code and Antigravity plugin manifests. CI runs
`npm run build:check` and fails if any of them are out of date. A new preset also needs a
recommended type, either in the PRESETS.md "Available presets" table or in a
`build/presets` catalogue, or the build stops and names it.

### 6. Commit Your Changes
Write meaningful commit messages following best practices:
```sh
git add .
git commit -m "Add feature/fix description"
```

### 7. Push to GitHub and Create a Pull Request
Push your branch to GitHub:
```sh
git push origin feature-or-fix-name
```
Then, create a pull request (PR) from your branch to the `main` branch in the original repository.

### 8. Code Review and Merging
- The maintainers will review your PR and may request changes.
- Once approved, it will be merged into the main branch.

## Reporting Issues
If you encounter any issues, please create a [GitHub issue](https://github.com/devrabiul/laravel-toaster-magic/issues) with a clear description of the problem and steps to reproduce it.

## Code of Conduct
By participating in this project, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

Thank you for contributing! 🚀

