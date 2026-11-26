<?php

namespace Devrabiul\ToastMagic\Console;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

/**
 * Copy the package's Agent Skill into the application, for projects that do
 * not use Laravel Boost (Boost installs it from resources/boost/skills itself).
 *
 *   php artisan toast-magic:skills                  Claude Code and Google Antigravity
 *   php artisan toast-magic:skills --claude         only .claude/skills/laravel-toaster-magic
 *   php artisan toast-magic:skills --antigravity    only .agents/skills/laravel-toaster-magic
 *   php artisan toast-magic:skills --force          overwrite files that already exist
 *
 * Existing files are left alone without --force, so a skill the team has
 * customised and committed is never replaced by accident.
 */
class InstallSkillsCommand extends Command
{
    /**
     * Folder name of the skill, inside the package and inside each target.
     */
    public const SKILL = 'laravel-toaster-magic';

    /**
     * Skills directory for each supported agent, relative to the project root.
     *
     * @var array<string, array{label: string, path: string}>
     */
    public const TARGETS = [
        'claude' => ['label' => 'Claude Code', 'path' => '.claude/skills'],
        'antigravity' => ['label' => 'Google Antigravity', 'path' => '.agents/skills'],
    ];

    /**
     * @var string
     */
    protected $signature = 'toast-magic:skills
        {--claude : Install only for Claude Code (.claude/skills)}
        {--antigravity : Install only for Google Antigravity (.agents/skills)}
        {--force : Overwrite files that already exist}';

    /**
     * @var string
     */
    protected $description = 'Copy the Laravel Toaster Magic Agent Skill into this project for Claude Code and Google Antigravity';

    public function handle(Filesystem $files): int
    {
        $source = dirname(__DIR__, 2) . '/resources/boost/skills/' . self::SKILL;

        if (!$files->isDirectory($source)) {
            $this->error("The skill was not found at {$source}. Reinstall the package and try again.");

            return 1;
        }

        // Neither flag means both, the same as passing both.
        $selected = array_filter(array_keys(self::TARGETS), fn (string $agent): bool => (bool)$this->option($agent));
        $agents = $selected === [] ? array_keys(self::TARGETS) : $selected;
        $force = (bool)$this->option('force');
        $skipped = 0;

        foreach ($agents as $agent) {
            $relative = self::TARGETS[$agent]['path'] . '/' . self::SKILL;
            $result = $this->copySkill($files, $source, base_path($relative), $force);
            $skipped += $result['skipped'];

            $this->line(sprintf(
                '<info>%s</info> → %s  (%d written, %d skipped)',
                self::TARGETS[$agent]['label'],
                $relative,
                $result['written'],
                $result['skipped']
            ));
        }

        if ($skipped > 0) {
            $this->warn("{$skipped} existing file(s) were left unchanged. Run again with --force to overwrite them, e.g. after updating the package.");
        }

        $this->line('Commit the created folder(s) so everyone on your team gets the skill.');

        return 0;
    }

    /**
     * Copy every file of the skill into the target, file by file, so that a
     * partial install is completed without touching the files already there.
     *
     * @return array{written: int, skipped: int}
     */
    private function copySkill(Filesystem $files, string $source, string $target, bool $force): array
    {
        $written = 0;
        $skipped = 0;

        foreach ($files->allFiles($source, true) as $file) {
            $destination = $target . '/' . str_replace('\\', '/', $file->getRelativePathname());

            if ($files->exists($destination) && !$force) {
                $skipped++;
                continue;
            }

            $files->ensureDirectoryExists(dirname($destination));
            $files->copy($file->getPathname(), $destination);
            $written++;
        }

        return ['written' => $written, 'skipped' => $skipped];
    }
}
