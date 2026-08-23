import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        include: ["tests-js/**/*.test.mjs"],
        // Each file gets a fresh jsdom global, but the runtime installs itself
        // on `window` and guards against double-installation, so tests within a
        // file share one runtime and reset state through the helper instead.
        restoreMocks: true,
    },
});
