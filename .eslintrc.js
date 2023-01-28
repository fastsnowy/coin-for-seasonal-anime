module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "@typescript-eslint", "import", "unused-imports"],
    extends: [
      "eslint:recommended",
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "plugin:import/warnings",
      "prettier",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "prefer-const": "warn",
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc" },
          groups: ["builtin", "external", "parent", "sibling", "index", "object", "type"],
          pathGroupsExcludedImportTypes: ["builtin", "object"],
          pathGroups: [
            { pattern: "{@mantine/**,@emotion/**,@tabler/**,@heroicons/**}", group: "parent", position: "before" },
          ],
        },
      ],
      "import/newline-after-import": "warn",
      "unused-imports/no-unused-imports": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  }
  