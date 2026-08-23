<?php

namespace Devrabiul\ToastMagic;

use Illuminate\Config\Repository as Config;
use Illuminate\Session\SessionManager as Session;
use Illuminate\Support\MessageBag;

/**
 * Class ToastMagic
 *
 * Queues toast notifications into the session and renders the styles and
 * scripts that turn them into on-screen toasts.
 *
 * Rendering safety: message content is escaped by default. Values queued here
 * are handed to the JavaScript runtime as data, and the runtime writes them with
 * `textContent` unless a toast explicitly opts into HTML with `['html' => true]`.
 */
class ToastMagic
{
    /**
     * Session key the queued messages are flashed under.
     */
    public const SESSION_KEY = 'laravel-toaster-magic::messages';

    /**
     * The toast types this package understands.
     *
     * @var list<string>
     */
    public const TYPES = ['success', 'error', 'warning', 'info'];

    /**
     * Themes shipped with the package. A configured theme outside this list is
     * ignored rather than concatenated into generated output.
     *
     * @var list<string>
     */
    public const THEMES = [
        'default', 'material', 'ios', 'glassmorphism',
        'neon', 'minimal', 'neumorphism', 'neumorphic', 'compact',
    ];

    /**
     * Valid container position classes.
     *
     * @var list<string>
     */
    public const POSITIONS = [
        'toast-top-start', 'toast-top-end', 'toast-top-center',
        'toast-bottom-start', 'toast-bottom-end', 'toast-bottom-center',
    ];

    /**
     * Valid entrance/exit animations.
     *
     * @var list<string>
     */
    public const ANIMATIONS = ['default', 'slide', 'fade', 'pop', 'bounce'];

    /**
     * The session manager.
     */
    protected Session $session;

    /**
     * The configuration repository.
     */
    protected Config $config;

    /**
     * The messages queued during this request.
     *
     * @var array<int, array<string, mixed>>
     */
    protected array $messages = [];

    /**
     * The `type` attribute used on the inline script tags.
     */
    protected string $jsType = 'text/javascript';

    /**
     * Optional Content-Security-Policy nonce applied to the inline scripts.
     */
    protected ?string $nonce = null;

    /**
     * ToastMagic constructor.
     *
     * @param Session $session The session manager instance.
     * @param Config $config The configuration repository instance.
     */
    public function __construct(Session $session, Config $config)
    {
        $this->session = $session;
        $this->config = $config;
    }

    /**
     * Generate the HTML for the required styles.
     *
     * @return string The HTML link tag for the stylesheet.
     */
    public function styles(): string
    {
        $stylePath = 'packages/devrabiul/laravel-toaster-magic/css/laravel-toaster-magic.min.css';

        return '<link rel="stylesheet" href="' . $this->escapeAttribute($this->getDynamicAsset($stylePath)) . '">';
    }

    /**
     * Generate the script tags for the runtime.
     *
     * The Livewire build loads the same shared runtime as the standard build and
     * layers the event bridge on top, so both render identically.
     *
     * @return string
     */
    public function scriptsPath(): string
    {
        $base = 'packages/devrabiul/laravel-toaster-magic/js/';
        $scripts = $this->scriptTag($base . 'laravel-toaster-magic.js');

        if (!empty($this->config->get('laravel-toaster-magic.livewire_enabled'))) {
            $scripts .= $this->scriptTag($base . 'livewire-v3/livewire-toaster-magic-v3.js');
        }

        return $scripts;
    }

    /**
     * Build a `<script src>` tag for a published asset path.
     */
    private function scriptTag(string $src): string
    {
        return '<script src="' . $this->escapeAttribute($this->getDynamicAsset($src)) . '"></script>';
    }

    /**
     * Build the opening tag for an inline script, including the CSP nonce when one is set.
     */
    private function inlineScriptOpen(): string
    {
        $nonce = $this->resolveNonce();

        return '<script type="' . $this->escapeAttribute($this->jsType) . '"'
            . ($nonce !== null ? ' nonce="' . $this->escapeAttribute($nonce) . '"' : '')
            . '>';
    }

    /**
     * Resolve the effective CSP nonce, preferring a runtime call over config.
     */
    private function resolveNonce(): ?string
    {
        if ($this->nonce !== null && $this->nonce !== '') {
            return $this->nonce;
        }

        $configured = $this->config->get('laravel-toaster-magic.csp_nonce');

        return is_string($configured) && $configured !== '' ? $configured : null;
    }

    /**
     * Resolve a public asset path into a URL.
     *
     * Whether the URL needs a `public/` prefix depends on where the document
     * root points, which {@see ToastMagicServiceProvider} already determines
     * from the entry script. `asset_path_prefix` overrides the detection for
     * layouts it cannot infer.
     *
     * This deliberately no longer branches on the client's IP address: the
     * requesting IP says nothing about the server's directory layout, and behind
     * a reverse proxy it reported `127.0.0.1` in production.
     */
    private function getDynamicAsset(string $path): string
    {
        $configured = $this->config->get('laravel-toaster-magic.asset_path_prefix');

        if (is_string($configured)) {
            $prefix = trim($configured, '/');

            return asset($prefix === '' ? $path : $prefix . '/' . $path);
        }

        // 'root' means the entry script sits at the project root, so the public
        // directory is itself part of the URL. Every other layout serves the
        // public directory as the document root and needs no prefix.
        $processingDirectory = $this->config->get('laravel-toaster-magic.system_processing_directory');

        return asset($processingDirectory === 'root' ? 'public/' . $path : $path);
    }

    /**
     * Generate the script tags and the queued toast calls.
     *
     * Ordering matters: the configuration object is emitted *before* the runtime
     * so the runtime can read it during initialization. It used to come after,
     * which left every configured value — theme, position, close button — stuck
     * on its built-in default until a later patch-up ran on DOMContentLoaded.
     *
     * @return string The HTML script tags for the JavaScript.
     */
    public function scripts(): string
    {
        $messages = $this->session->get(self::SESSION_KEY);

        if (!is_array($messages)) {
            $messages = [];
        }

        $options = $this->resolveOptions();
        $runtimeConfig = $this->runtimeConfig($options);
        $styleVariables = $this->resolveStyleVariables($options);

        // 1. Configuration, before the runtime so it is available on first read.
        $script = $this->inlineScriptOpen();
        $script .= 'window.toastMagicConfig = ' . $this->jsonForHtml($runtimeConfig) . ';';
        $script .= 'window.toastMagicStyleVars = ' . $this->jsonForHtml($styleVariables, JSON_FORCE_OBJECT) . ';';
        $script .= '</script>';

        // 2. The runtime itself (plus the Livewire bridge when enabled).
        $script .= $this->scriptsPath();

        // 3. The queued toasts. The runtime buffers internally until the DOM is
        //    ready, so these calls are safe wherever the tag is placed.
        if ($messages !== []) {
            $stagger = $this->staggerDelay($options);
            $delay = 0;

            $script .= $this->inlineScriptOpen();

            foreach ($messages as $message) {
                $payload = $this->toastPayload((array)$message, $options);

                $script .= 'setTimeout(function(){window.toastMagic&&window.toastMagic.'
                    . $payload['type'] . '(' . $this->jsonForHtml($payload['options']) . ');},'
                    . $delay . ');';

                $delay += $stagger;
            }

            $script .= '</script>';
        }

        return $script;
    }

    /**
     * Build the option object handed to the JavaScript runtime for one message.
     *
     * @param array<string, mixed> $message
     * @param array<string, mixed> $options Resolved global options.
     * @return array{type: string, options: array<string, mixed>}
     */
    private function toastPayload(array $message, array $options): array
    {
        $type = is_string($message['type'] ?? null) && in_array($message['type'], self::TYPES, true)
            ? $message['type']
            : 'info';

        $messageOptions = (array)($message['options'] ?? []);

        // Whether this toast renders HTML. Per-toast `html` wins; otherwise the
        // global `escape_html` decides, and it defaults to escaping.
        $html = array_key_exists('html', $messageOptions)
            ? (bool)$messageOptions['html']
            : ($options['escape_html'] ?? true) === false;

        // `showCloseBtn` is the key the README has always documented and the one
        // the Livewire bridge reads; `closeButton` is what this class used to
        // read. Both are honored, per-toast winning over the global default.
        $showCloseBtn = $messageOptions['showCloseBtn']
            ?? $messageOptions['closeButton']
            ?? ($options['closeButton'] ?? false);

        $payload = [
            'heading' => $this->normalizeWhitespace((string)($message['message'] ?? '')),
            'description' => $this->normalizeWhitespace((string)($message['description'] ?? '')),
            'showCloseBtn' => (bool)$showCloseBtn,
            'html' => $html,
        ];

        if (!empty($messageOptions['customBtnText'])) {
            $payload['customBtnText'] = (string)$messageOptions['customBtnText'];
        }

        if (!empty($messageOptions['customBtnLink'])) {
            $payload['customBtnLink'] = (string)$messageOptions['customBtnLink'];
        }

        if (!empty($messageOptions['avatar'])) {
            $payload['avatar'] = (string)$messageOptions['avatar'];
        }

        // `timeOut => 0` is meaningful (never auto-dismiss), so isset() rather
        // than empty() decides whether the override was supplied.
        if (isset($messageOptions['timeOut']) && is_numeric($messageOptions['timeOut'])) {
            $payload['timeOut'] = max(0, (int)$messageOptions['timeOut']);
        }

        if (isset($messageOptions['showDuration']) && is_numeric($messageOptions['showDuration'])) {
            $payload['showDuration'] = max(0, (int)$messageOptions['showDuration']);
        }

        return ['type' => $type, 'options' => $payload];
    }

    /**
     * Collapse runs of blank lines and normalize line endings.
     *
     * Newlines are deliberately preserved rather than converted to `<br>`: the
     * runtime turns them into real `<br>` elements *after* escaping, so a message
     * containing markup is displayed rather than executed.
     */
    private function normalizeWhitespace(string $value): string
    {
        $value = preg_replace("/(\r\n|\r|\n){2,}/", "\n", $value) ?? $value;

        return str_replace(["\r\n", "\r"], "\n", $value);
    }

    /**
     * Resolve the package options, filling in defaults a published config may predate.
     *
     * `mergeConfigFrom()` is shallow, so a config file published before an option
     * existed still arrives here without that option. Merging against the
     * packaged defaults recursively guarantees every option has a value.
     *
     * @return array<string, mixed>
     */
    private function resolveOptions(): array
    {
        static $defaults = null;

        if ($defaults === null) {
            $packaged = require __DIR__ . '/config/laravel-toaster-magic.php';
            $defaults = (array)($packaged['options'] ?? []);
        }

        return array_replace_recursive($defaults, (array)$this->config->get('laravel-toaster-magic.options', []));
    }

    /**
     * Build the configuration object exposed to the JavaScript runtime.
     *
     * Enumerated values are validated against their allowlist rather than passed
     * through, so a typo — or a value sourced from somewhere user-controlled —
     * cannot reach the DOM as a class name.
     *
     * @param array<string, mixed> $options
     * @return array<string, mixed>
     */
    private function runtimeConfig(array $options): array
    {
        return [
            'closeButton' => (bool)($options['closeButton'] ?? true),
            'positionClass' => $this->allowlist($options['positionClass'] ?? null, self::POSITIONS, 'toast-top-end'),
            'preventDuplicates' => (bool)($options['preventDuplicates'] ?? false),
            'showDuration' => max(0, (int)($options['showDuration'] ?? 300)),
            'timeOut' => max(0, (int)($options['timeOut'] ?? 5000)),
            'theme' => $this->allowlist($options['theme'] ?? null, self::THEMES, 'default'),
            'gradient_enable' => (bool)($options['gradient_enable'] ?? false),
            'color_mode' => (bool)($options['color_mode'] ?? false),
            'shadow_enable' => (bool)($options['shadow_enable'] ?? true),
            'pauseOnHover' => (bool)($options['pauseOnHover'] ?? true),
            'animation' => $this->allowlist($options['animation'] ?? null, self::ANIMATIONS, 'default'),
            'escape_html' => (bool)($options['escape_html'] ?? true),
            'stagger' => $this->staggerDelay($options),
            'closeButtonLabel' => (string)($options['closeButtonLabel'] ?? 'Close notification'),
            'containerLabel' => (string)($options['containerLabel'] ?? 'Notifications'),
        ];
    }

    /**
     * Return the value when it is a member of the allowlist, otherwise the fallback.
     *
     * @param mixed $value
     * @param list<string> $allowed
     * @param string $fallback
     * @return string
     */
    private function allowlist(mixed $value, array $allowed, string $fallback): string
    {
        return is_string($value) && in_array($value, $allowed, true) ? $value : $fallback;
    }

    /**
     * The delay between consecutive queued toasts, in milliseconds.
     *
     * @param array<string, mixed> $options
     */
    private function staggerDelay(array $options): int
    {
        return max(0, (int)($options['stagger'] ?? 250));
    }

    /**
     * JSON-encode a value for safe embedding inside a `<script>` block.
     *
     * The HEX flags stop `</script>`, `<!--` and friends terminating the block
     * early. `JSON_UNESCAPED_SLASHES` is deliberately *not* used: escaping the
     * slash is what keeps a closing script tag inside a string harmless.
     *
     * @param mixed $value
     * @param int $extraFlags
     * @return string
     */
    private function jsonForHtml(mixed $value, int $extraFlags = 0): string
    {
        return json_encode(
            $value,
            JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | $extraFlags
        ) ?: '{}';
    }

    /**
     * Escape a value for use inside a double-quoted HTML attribute.
     */
    private function escapeAttribute(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Resolve the `spacing` and `typography` config sections into CSS custom properties.
     *
     * Each section is opt-in through its own `enable` flag, and every value is
     * optional: a section that is missing, disabled, or only partially filled in
     * simply yields fewer properties, and the stylesheet falls back to the value
     * the active theme declares for that property.
     *
     * Values are constrained to a conservative character set — they end up in a
     * style property, and a spacing value has no reason to contain anything but
     * lengths, keywords and the separators between them.
     *
     * @param array<string, mixed> $config The resolved `options` config section.
     * @return array<string, string> Custom property name => value.
     */
    private function resolveStyleVariables(array $config): array
    {
        $map = [
            'spacing' => [
                'container' => '--tm-space-container',
                'icon_gap' => '--tm-space-icon-gap',
                'content_gap' => '--tm-space-content-gap',
                'close_gap' => '--tm-space-close-gap',
            ],
            'typography' => [
                'title_size' => '--tm-font-title-size',
                'title_weight' => '--tm-font-title-weight',
                'description_size' => '--tm-font-description-size',
                'description_weight' => '--tm-font-description-weight',
                'line_height' => '--tm-line-height',
            ],
        ];

        $variables = [];

        foreach ($map as $section => $properties) {
            $values = (array)($config[$section] ?? []);

            if (empty($values['enable'])) {
                continue;
            }

            foreach ($properties as $key => $property) {
                if (!isset($values[$key]) || $values[$key] === '') {
                    continue;
                }

                $value = trim((string)$values[$key]);

                // Lengths, unitless numbers, keywords, and the operators and
                // separators that appear inside calc() / clamp(). Notably absent:
                // `;`, `:`, `{`, `}` and quotes.
                if ($value === '' || !preg_match('/^[a-zA-Z0-9 .,%()+*\/_-]+$/', $value)) {
                    continue;
                }

                $variables[$property] = $value;
            }
        }

        return $variables;
    }

    /**
     * Entry point for the fluent dispatch syntax.
     *
     * Returns the ToastMagic instance so toast types can be chained, e.g.
     * `ToastMagic::dispatch()->success('User Created', 'The user has been created.')`.
     *
     * @return self
     */
    public function dispatch(): self
    {
        return $this;
    }

    /**
     * Add a flash message to the session.
     *
     * @param string $type Must be one of info, success, warning, error.
     * @param string $message The flash message content.
     * @param string|null $description Optional description for the message.
     * @param array<string, mixed> $options Optional per-toast options.
     *
     * @return void
     */
    public function add(string $type, string $message, string|null $description = null, array $options = []): void
    {
        if (!in_array($type, self::TYPES, true)) {
            $type = 'info'; // fallback
        }

        $this->messages[] = [
            'type' => $type,
            'message' => $message,
            'description' => $description,
            'options' => $options,
        ];

        $this->session->flash(self::SESSION_KEY, $this->messages);
    }

    /**
     * Normalize a message into a string.
     *
     * A {@see MessageBag} is flattened into a single string, one message per
     * line. Plain newlines are used rather than `<br>` markup so the runtime can
     * escape the text and then insert real line breaks — a literal `<br>` here
     * would be displayed as text now that escaping is on by default. Toasts that
     * opt into HTML still get `<br>`, since nothing escapes those.
     *
     * @param string|MessageBag $message
     * @param bool $html Whether this toast renders HTML.
     * @return string
     */
    protected function normalizeMessage(string|MessageBag $message, bool $html = false): string
    {
        if ($message instanceof MessageBag) {
            $lines = [];

            foreach ($message->getMessages() as $messageArray) {
                foreach ($messageArray as $currentMessage) {
                    $lines[] = $currentMessage;
                }
            }

            return implode($html ? '<br>' : "\n", $lines);
        }

        return $message;
    }

    /**
     * Whether a per-toast options array opts into HTML rendering.
     *
     * @param array<string, mixed> $options
     */
    private function rendersHtml(array $options): bool
    {
        if (array_key_exists('html', $options)) {
            return (bool)$options['html'];
        }

        return ($this->resolveOptions()['escape_html'] ?? true) === false;
    }

    /**
     * Add an info flash message to session.
     *
     * @param string|MessageBag $message The flash message content, or a validation MessageBag.
     * @param string|null $description
     * @param array<string, mixed> $options The per-toast options.
     *
     * @return void
     */
    public function info(string|MessageBag $message, string|null $description = null, array $options = []): void
    {
        $this->add('info', $this->normalizeMessage($message, $this->rendersHtml($options)), $description, $options);
    }

    /**
     * Add a success flash message to session.
     *
     * @param string|MessageBag $message The flash message content, or a validation MessageBag.
     * @param string|null $description
     * @param array<string, mixed> $options The per-toast options.
     *
     * @return void
     */
    public function success(string|MessageBag $message, string|null $description = null, array $options = []): void
    {
        $this->add('success', $this->normalizeMessage($message, $this->rendersHtml($options)), $description, $options);
    }

    /**
     * Add a warning flash message to session.
     *
     * @param string|MessageBag $message The flash message content, or a validation MessageBag.
     * @param string|null $description
     * @param array<string, mixed> $options The per-toast options.
     *
     * @return void
     */
    public function warning(string|MessageBag $message, string|null $description = null, array $options = []): void
    {
        $this->add('warning', $this->normalizeMessage($message, $this->rendersHtml($options)), $description, $options);
    }

    /**
     * Add an error flash message to session.
     *
     * @param string|MessageBag $message The flash message content, or a validation MessageBag.
     * @param string|null $description
     * @param array<string, mixed> $options The per-toast options.
     *
     * @return void
     */
    public function error(string|MessageBag $message, string|null $description = null, array $options = []): void
    {
        $this->add('error', $this->normalizeMessage($message, $this->rendersHtml($options)), $description, $options);
    }

    /**
     * Clear all queued toast messages, both in memory and in the session.
     *
     * @return void
     */
    public function clear(): void
    {
        $this->messages = [];
        $this->session->forget(self::SESSION_KEY);
    }

    /**
     * Render the inline scripts as ES modules, for Vite-based setups.
     *
     * Must be called before {@see scripts()}.
     *
     * @return $this
     */
    public function useVite(): self
    {
        $this->jsType = 'module';

        return $this;
    }

    /**
     * Apply a Content-Security-Policy nonce to the inline script tags.
     *
     * Must be called before {@see scripts()}. The `csp_nonce` config value
     * serves the same purpose when the nonce is known at config time.
     *
     * @return $this
     */
    public function nonce(string $nonce): self
    {
        $this->nonce = $nonce;

        return $this;
    }
}
