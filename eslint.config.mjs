import eslintPluginImport from "eslint-plugin-import";
import eslintPluginJs from "@eslint/js";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import globals from "globals";

const config = [
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginJs.configs.all,
  ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],
  {
    "ignores": ["package-lock.json"]
  },
  {
    "files": ["**/*.js"],
    "languageOptions": {
      "globals": {
        ...globals.browser,
        ...globals.node,
        "moment": "readonly"
      },
      "sourceType": "commonjs"
    },
    "plugins": {
      ...eslintPluginStylistic.configs["all-flat"].plugins
    },
    "rules": {
      ...eslintPluginStylistic.configs["all-flat"].rules,
      "@stylistic/array-element-newline": "off",
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/function-call-argument-newline": "off",
      "@stylistic/function-paren-newline": "off",
      "@stylistic/implicit-arrow-linebreak": "off",
      "@stylistic/indent": ["error", 2],
      "@stylistic/multiline-comment-style": "off",
      "@stylistic/multiline-ternary": "off",
      "@stylistic/newline-per-chained-call": "off",
      "@stylistic/no-extra-parens": "off",
      "@stylistic/nonblock-statement-body-position": "off",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/padded-blocks": "off",
      "@stylistic/quote-props": ["error", "consistent"],
      "@stylistic/space-before-function-paren": ["error", "never"],
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
      "no-param-reassign": [
        "error",
        {
          "ignorePropertyModificationsFor": [
            "arrs",
            "calendar",
            "dom",
            "e",
            "payload",
            "slotDom",
            "targetDom"
          ],
          "props": true
        }
      ],
      "no-plusplus": ["error", {"allowForLoopAfterthoughts": true}],
      "no-ternary": "off",
      "one-var": "off",
      "prefer-destructuring": "off",
      "prefer-named-capture-group": "off",
      "sort-keys": "off",
      "sort-vars": "off",
      "strict": "off"
    }
  },
  {
    "files": ["**/*.mjs"],
    "languageOptions": {
      "ecmaVersion": "latest",
      "globals": {
        ...globals.node
      },
      "sourceType": "module"
    },
    "plugins": {
      ...eslintPluginStylistic.configs["all-flat"].plugins
    },
    "rules": {
      ...eslintPluginStylistic.configs["all-flat"].rules,
      "@stylistic/array-element-newline": "off",
      "@stylistic/indent": ["error", 2],
      "@stylistic/padded-blocks": ["error", "never"],
      "func-style": "off",
      "max-lines-per-function": ["error", 100],
      "no-magic-numbers": "off",
      "one-var": "off",
      "prefer-destructuring": "off"
    }
  }
];

export default config;
