# 🍞 Laravel Toaster Magic — v2.7.0 Release Notes

**Release date:** 2026-11-26
**Type:** Minor release, **no breaking changes and no runtime changes**

v2.7.0 is an **"AI agent support"** release. The package now ships an **Agent Skill** and a
**Laravel Boost guideline** that teach AI coding agents (Claude Code, Google Antigravity, and every
agent Laravel Boost supports) how to set up and use Laravel Toaster Magic correctly.

> ℹ️ **Nothing changes in your application.** No JavaScript, CSS, config option or toast behaviour
> was touched. Upgrading is a plain `composer update`.

---

## ✨ Highlights

- 🤖 **Agent Skill** in the open [Agent Skills](https://agentskills.io) format. The agent loads it
  only when a task involves toasts or flash messages.
- 🧭 **Laravel Boost guideline.** `boost:install` / `boost:update` picks up the guideline and the
  skill automatically.
- 🛠️ **`php artisan toast-magic:skills`** copies the skill into a project for Claude Code and Google
  Antigravity when you do not use Boost.
- 🔌 **One-command plugins** for Claude Code and Google Antigravity, installed from GitHub.
- 🎬 **All 517 presets in the skill's catalogue**, so agents pick real preset names instead of
  inventing them.

---

## 🤖 What the skill teaches

Agents tend to get a few things about this package wrong. The skill covers:

- **Setup:** `{!! ToastMagic::styles() !!}` in `<head>` and `{!! ToastMagic::scripts() !!}` before
  `</body>` (raw echo, not `{{ }}`), CSP nonces and Vite.
- **The APIs:** the facade, the shared `window.toastMagic` instance (never `new ToastMagic()`), HTML
  `data-toast-*` attributes and the Livewire `toastMagic` event, where `title` is the heading and
  `message` is the description.
- **Security:** toast text is escaped automatically, so user input is passed as-is without `e()`.
  `['html' => true]` is only for markup the developer controls, and `escape_html` stays on.
- **Configuration:** every theme, position, animation and option, and the fact that invalid values
  fall back silently.
- **Presets:** the pack must be enabled, names must be exact, and `avatar` wins over `preset`. A
  catalogue of all 517 presets lists each one's pack, icon and recommended type.
- **Troubleshooting:** a symptom → cause table for toasts that do not appear, look unstyled or show
  the wrong icon.

---

## 📦 Getting the skill

### Laravel Boost

Nothing to do. After upgrading, run:

```bash
php artisan boost:update
```

Boost finds the skill in `resources/boost/skills` and the guideline in `resources/boost/guidelines`,
and installs them for your agents.

### Without Boost

```bash
php artisan toast-magic:skills                 # Claude Code and Google Antigravity
php artisan toast-magic:skills --claude        # only .claude/skills/laravel-toaster-magic
php artisan toast-magic:skills --antigravity   # only .agents/skills/laravel-toaster-magic
php artisan toast-magic:skills --force         # overwrite, e.g. after updating the package
```

Commit the created folder so everyone on your team gets the skill. Existing files are not
overwritten unless you pass `--force`.

### As a plugin, for every project on your machine

```bash
# Claude Code
/plugin install laravel-toaster-magic --marketplace devrabiul/laravel-toaster-magic

# Google Antigravity
agy plugin install https://github.com/devrabiul/laravel-toaster-magic
```

---

## 🧰 For contributors

The skill and the guideline describe the preset catalogue, so they are now **generated** by
`npm run build` from the shipped pack files rather than written by hand. `npm run build:check`, which
already runs in CI, fails when they are out of date, and the build stops if a new preset has no
recommended type. The same build keeps the version in both plugin manifests in step with
`package.json`. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🐛 Fixed

- **PRESETS.md** referred to a `ToastMagic::PRESETS` constant that does not exist. It now points to
  `ToastMagic::allPresets()`, `presetManifest()` and `enabledPresets()`.
- **`src/presets.php`** said `build/presets/generate.py` regenerates it, which was never true. The
  header now says how the file is kept in step with the pack files.

---

## 🧩 Compatibility

| Requirement | Supported |
|-------------|-----------|
| PHP         | 8.0 – 8.5 |
| Laravel     | 8 – 13    |
| Livewire    | v3 & v4   |

`illuminate/console` is now a declared dependency, needed by the new Artisan command. Every Laravel
application already includes it.

---

## ⬆️ Upgrade Guide

```bash
composer update devrabiul/laravel-toaster-magic
```

That is all. The CSS and JavaScript did not change, so there is nothing to republish. The assets
re-copy themselves once on the first request after the upgrade, as they do for every release.

Optionally, give your AI agent the new skill. See [Getting the skill](#-getting-the-skill).

---

## 🙏 Thanks

Thanks to everyone using and reporting issues on Laravel Toaster Magic. If it helps you in
production, consider [planting a tree](https://plant.treeware.earth/devrabiul/laravel-toaster-magic). 🌱

**Full changelog:** see [CHANGELOG.md](CHANGELOG.md).
