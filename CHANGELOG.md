# Changelog

All notable changes to `laravel-toaster-magic` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Avatar / notification-style toasts.** Pass an `avatar` image URL in the options array (or via
  Livewire event options) to render an image in place of the type icon — ideal for "new message" /
  "new follower" style notifications. The URL is sanitized before rendering.
- **Entrance/exit animations.** A new `animation` config option (`default`, `slide`, `fade`, `pop`,
  `bounce`) controls how toasts enter and leave the screen. `default` preserves the current behavior.
- **Smooth stack reflow.** When a toast is added or dismissed, the remaining toasts now glide
  smoothly into their new positions (FLIP technique) instead of jumping. Respects
  `prefers-reduced-motion`.

## [2.2.0] - 2026-06-17

A **"Trust & Polish"** release: no change to the package's scope, focused on correctness,
reliability, compatibility, and developer experience. All changes are backward compatible.

### Added

- **Fluent `dispatch()` entry point.** `ToastMagic::dispatch()->success(...)` now works as
  documented (previously the README example referenced a method that did not exist).
- **Per-toast duration overrides.** `timeOut` and `showDuration` can now be set per toast via
  the options array (and via Livewire event options), falling back to the global config when omitted.
- **Pause-on-hover.** The auto-dismiss timer now pauses while a toast is hovered. Enabled by
  default; disable with `'pauseOnHover' => false` in the config.
- **Programmatic dismiss API.** `toastMagic.clear()` / `toastMagic.dismissAll()` dismiss all
  visible toasts from JavaScript.
- **Validation `MessageBag` support.** Passing a `MessageBag` (e.g. `$validator->errors()`) to any
  toast type now flattens it into a single toast, one message per line.
- **Automated test suite.** Pest + Orchestra Testbench, covering message flashing, all toast types,
  unknown-type fallback, ordering, `dispatch()`, `clear()`, `MessageBag` flattening, `scripts()`
  output, newline normalization, per-toast options, and `normalizeVersion()`.
- **Continuous integration.** GitHub Actions workflow running the suite across PHP 8.0–8.5 and
  Laravel 8–13, plus a build-status badge in the README.

### Changed

- **Declared dependency constraints** in `composer.json`: `php: ^8.0` and
  `illuminate/support: ^8.0 || ^9.0 || ^10.0 || ^11.0 || ^12.0 || ^13.0`. Composer can now warn
  about installation on an unsupported stack.
- **Corrected the facade docblock** to match the real public API (`styles`, `scripts`, `scriptsPath`,
  `dispatch`, `useVite`, accurate `MessageBag` parameter types) for reliable IDE autocompletion.
- **Refactored** the duplicated `MessageBag` handling across the four toast methods into a single
  `normalizeMessage()` helper.
- **Clarified the security documentation** (see Security below).

### Fixed

- **`preventDuplicates` now works.** The option shipped in the config but was never honored by the
  JavaScript runtime; identical toasts (same type, heading, and description) that are currently
  visible are now skipped when the option is enabled.
- **`clear()` now clears queued messages.** It previously only reset the in-memory list, leaving
  already-flashed messages in the session; it now also forgets the session key.
- **`MessageBag` no longer triggers a `TypeError`.** The previous `string` type hint made the
  `MessageBag` handling unreachable.

### Security

- The **"XSS Safe"** claim has been reworded to be accurate. Custom button URLs are sanitized, but
  toast heading/description content is rendered as HTML. The Security section now documents this
  clearly and advises escaping user-supplied input (e.g. with `e()`). Escaping message content by
  default is planned for a future major release (v3.0.0), with an opt-in flag for intentional HTML.

[2.2.0]: https://github.com/devrabiul/laravel-toaster-magic/releases/tag/v2.2.0
