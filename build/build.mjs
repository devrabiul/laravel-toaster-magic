/**
 * Asset build for laravel-toaster-magic.
 *
 * The minified stylesheet is committed to the repository because it is what
 * `ToastMagic::styles()` links to, and Composer installs never run a JS build.
 * That makes it a generated file that ships — so it needs to be reproducible,
 * and it needs to be verifiable in CI.
 *
 * Usage:
 *   node build/build.mjs           write the minified assets
 *   node build/build.mjs --check   verify the committed files match a fresh
 *                                  build, and exit non-zero if they do not
 */
import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checkOnly = process.argv.includes("--check");

/** Files to minify: [source, output]. */
const TARGETS = [
    ["assets/css/laravel-toaster-magic.css", "assets/css/laravel-toaster-magic.min.css"],
];

async function minify(sourcePath) {
    const result = await build({
        entryPoints: [join(root, sourcePath)],
        minify: true,
        write: false,
        legalComments: "none",
        // Match the browsers the runtime already assumes; keeps the minifier
        // from lowering modern CSS the package relies on.
        target: ["chrome104", "firefox102", "safari15.4", "edge104"],
    });

    return result.outputFiles[0].text;
}

let failed = false;

for (const [source, output] of TARGETS) {
    const outputPath = join(root, output);
    const minified = await minify(source);

    if (!checkOnly) {
        await writeFile(outputPath, minified);
        console.log(`built  ${output}  (${minified.length} bytes)`);
        continue;
    }

    if (!existsSync(outputPath)) {
        console.error(`MISSING  ${output} — run \`npm run build\``);
        failed = true;
        continue;
    }

    const committed = await readFile(outputPath, "utf8");

    if (committed !== minified) {
        console.error(
            `STALE  ${output} — the committed file does not match a fresh build of ${source}.\n` +
            `       Run \`npm run build\` and commit the result.`
        );
        failed = true;
        continue;
    }

    console.log(`ok     ${output} matches ${source}`);
}

if (failed) process.exit(1);
