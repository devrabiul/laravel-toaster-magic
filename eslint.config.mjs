import js from "@eslint/js";

export default [
    {
        // The shipped runtime is a plain browser script, not a module. It has to
        // parse in every browser the package supports without a build step, so
        // it is deliberately written in ES5-compatible syntax apart from the
        // handful of DOM APIs the README documents as required.
        files: ["assets/js/**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "script",
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly",
                URL: "readonly",
                Date: "readonly",
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { args: "after-used" }],
            eqeqeq: ["error", "smart"],
            "no-implicit-globals": "off",
        },
    },
    {
        files: ["build/**/*.mjs", "tests-js/**/*.mjs", "*.config.mjs"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly",
                process: "readonly",
            },
        },
        rules: {
            ...js.configs.recommended.rules,
        },
    },
];
