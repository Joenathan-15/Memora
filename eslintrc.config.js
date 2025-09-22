module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: [
        "@typescript-eslint",
        "react",
        "import", // if used
    ],
    rules: {
        "no-restricted-imports": "off",  // turn off core
        "@typescript-eslint/no-restricted-imports": [
            "error",
            {
                paths: [
                    {
                        name: "@inertiajs/react",
                        importNames: ["Link"],
                        message:
                            "Please use the custom Link from '@/components/link' instead of Inertia's Link",
                    },
                ],
                // optional: allowTypeImports: true if you want to still allow type-only imports
                // allowTypeImports: false
            },
        ],
        // other rules …
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    // optionally: overrides for files etc
};
