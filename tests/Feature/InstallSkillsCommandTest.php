<?php

use Devrabiul\ToastMagic\Console\InstallSkillsCommand;
use Illuminate\Support\Facades\File;

/** Absolute path of an installed skill file inside the test application. */
function installedSkill(string $agent, string $file = 'SKILL.md'): string
{
    return base_path(InstallSkillsCommand::TARGETS[$agent]['path'] . '/' . InstallSkillsCommand::SKILL . '/' . $file);
}

/** Absolute path of a skill file shipped by the package. */
function packagedSkill(string $file = 'SKILL.md'): string
{
    return dirname(__DIR__, 2) . '/resources/boost/skills/' . InstallSkillsCommand::SKILL . '/' . $file;
}

function clearInstalledSkills(): void
{
    File::deleteDirectory(base_path('.claude'));
    File::deleteDirectory(base_path('.agents'));
}

beforeEach(fn () => clearInstalledSkills());
afterEach(fn () => clearInstalledSkills());

it('installs the skill for Claude Code and Google Antigravity by default', function () {
    $this->artisan('toast-magic:skills')->assertExitCode(0);

    foreach (['claude', 'antigravity'] as $agent) {
        expect(File::get(installedSkill($agent)))->toBe(File::get(packagedSkill()))
            ->and(File::get(installedSkill($agent, 'references/presets.md')))
            ->toBe(File::get(packagedSkill('references/presets.md')));
    }
});

it('installs for only the agent that is asked for', function (string $flag, string $installed, string $absent) {
    $this->artisan('toast-magic:skills', [$flag => true])->assertExitCode(0);

    expect(File::exists(installedSkill($installed)))->toBeTrue()
        ->and(File::exists(installedSkill($absent)))->toBeFalse();
})->with([
    'claude' => ['--claude', 'claude', 'antigravity'],
    'antigravity' => ['--antigravity', 'antigravity', 'claude'],
]);

it('leaves existing files alone without --force', function () {
    File::ensureDirectoryExists(dirname(installedSkill('claude')));
    File::put(installedSkill('claude'), 'customised by the team');

    $this->artisan('toast-magic:skills', ['--claude' => true])
        ->expectsOutputToContain('--force')
        ->assertExitCode(0);

    // The customised file is kept, and the missing reference is still added.
    expect(File::get(installedSkill('claude')))->toBe('customised by the team')
        ->and(File::exists(installedSkill('claude', 'references/presets.md')))->toBeTrue();
});

it('overwrites existing files with --force', function () {
    File::ensureDirectoryExists(dirname(installedSkill('claude')));
    File::put(installedSkill('claude'), 'outdated');

    $this->artisan('toast-magic:skills', ['--claude' => true, '--force' => true])->assertExitCode(0);

    expect(File::get(installedSkill('claude')))->toBe(File::get(packagedSkill()));
});
