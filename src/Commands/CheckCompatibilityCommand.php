<?php

namespace Devrabiul\LaravelPhpInspector\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class CheckCompatibilityCommand extends Command
{
    protected $signature = 'phpcompat:check 
                            {--php= : Target PHP version (overrides config)}
                            {--path= : Specific path to scan (overrides config)}';
    protected $description = 'Check PHP compatibility using PHPCompatibility and PHPCS';

    public function handle()
    {
        // Config defaults
        $phpVersion = $this->option('php') ?: config('laravel-php-inspector.php_version', '8.4');
        $exclude = config('laravel-php-inspector.exclude', ['vendor', 'storage']);
        $failOnError = config('laravel-php-inspector.fail_on_error', true);
        $showWarnings = config('laravel-php-inspector.show_warnings', true);

        // Determine paths to scan
        $paths = $this->option('path') ? [$this->option('path')] : [base_path()];

        $this->info("🔍 Checking PHP compatibility for PHP {$phpVersion}");
        $this->info("📂 Paths to scan: " . implode(', ', $paths));
        if (!empty($exclude)) {
            $this->info("❌ Excluded paths: " . implode(', ', $exclude));
        }

        $allResults = [];
        $totalFilesScanned = 0;

        foreach ($paths as $path) {
            // Run PHPCS once per path
            $command = [
                base_path('vendor/bin/phpcs'),
                '--standard=PHPCompatibility',
                '--runtime-set', 'testVersion', $phpVersion,
                '--report=json',
                $path,
                '--extensions=php',
                '--ignore=*.blade.php,' . implode(',', $exclude),
            ];

            if (!$showWarnings) {
                $command[] = '--warning-severity=0';
            }

            $process = new Process($command);
            $process->setTimeout(null);
            $process->run();

            $results = json_decode($process->getOutput(), true);

            if (isset($results['files'])) {
                $allResults = array_merge($allResults, $results['files']);
                $totalFilesScanned += count($results['files']);
            }
        }

        // Summary
        $totalErrors = 0;
        $totalWarnings = 0;

        foreach ($allResults as $details) {
            $totalErrors += $details['errors'] ?? 0;
            $totalWarnings += $details['warnings'] ?? 0;
        }

        $this->info("\n📄 Total files scanned: {$totalFilesScanned}");
        $this->info("❌ Total errors: {$totalErrors}");
        $this->info("⚠️ Total warnings: {$totalWarnings}");

        // Optional: show first 50 issues in table
        $tableData = [];
        foreach ($allResults as $file => $details) {
            foreach ($details['messages'] as $msg) {
                $tableData[] = [
                    'File' => Str::after($file, base_path() . '/'),
                    'Line' => $msg['line'],
                    'Type' => $msg['type'],
                    'Message' => $msg['message'],
                ];
            }
        }

        if (!empty($tableData)) {
            $this->line("\n🔹 Sample issues (first 50):");
            $this->table(['File', 'Line', 'Type', 'Message'], array_slice($tableData, 0, 50));
        }

        return $failOnError && $totalErrors > 0
            ? Command::FAILURE
            : Command::SUCCESS;
    }
}
