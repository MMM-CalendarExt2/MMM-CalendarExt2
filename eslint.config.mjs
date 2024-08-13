import eslintPluginJs from "@eslint/js";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import globals from "globals";

const config = [
  ...eslintPluginJsonc.configs["flat/recommended-with-json"],
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        moment: "readonly"
      }
    },
    plugins: {
      ...eslintPluginStylistic.configs["all-flat"].plugins
    },
    rules: {
      ...eslintPluginJs.configs.all.rules,
      ...eslintPluginStylistic.configs["all-flat"].rules,
      "camelcase": "off",
      "capitalized-comments": "off",
      "curly": "off",
      "default-case": "off",
      "id-length": "off",
      "import/no-unresolved": "off",
      "init-declarations": "off",
      "line-comment-position": "off",
      "max-lines": ["warn", 700],
      "max-lines-per-function": ["warn", 200],
      "max-params": ["warn", 5],
      "max-statements": "off",
      "multiline-comment-style": "off",
      "no-inline-comments": "off",
      "no-magic-numbers": "off",
      "no-negated-condition": "off",
      "no-param-reassign": [
        "error",
        {
          props: true,
          ignorePropertyModificationsFor: [
            "arrs",
            "calendar",
            "dom",
            "e",
            "payload",
            "slotDom",
            "targetDom"
          ]
        }
      ],
      "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
      "no-prototype-builtins": "off",
      "no-ternary": "off",
      "no-undefined": "warn",
      "no-useless-assignment": "warn",
      "one-var": "off",
      "prefer-destructuring": "off",
      "prefer-named-capture-group": "off",
      "sort-keys": "off",
      "sort-vars": "off",
      "@stylistic/array-element-newline": "off",
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/function-call-argument-newline": "off",
      "@stylistic/function-paren-newline": "off",
      "@stylistic/implicit-arrow-linebreak": "off",
      "@stylistic/indent": ["error", 2],
      "@stylistic/multiline-ternary": "off",
      "@stylistic/multiline-comment-style": "off",
      "@stylistic/newline-per-chained-call": "off",
      "@stylistic/no-extra-parens": "off",
      "@stylistic/nonblock-statement-body-position": "off",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/quote-props": ["error", "consistent"],
      "@stylistic/padded-blocks": "off",
      "@stylistic/space-before-function-paren": ["error", "never"]
    }
  }
];

export default config;
