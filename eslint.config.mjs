import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: ["eslint:recommended", "next", "next/core-web-vitals", "next/typescript", "prettier"],
  }),
  {
    rules: {
      // possible problems
      "array-callback-return": "warn",
      "no-inner-declarations": "warn",
      "no-template-curly-in-string": "warn",
      "no-unmodified-loop-condition": "error",
      // suggestions
      camelcase: [
        "warn",
        {
          properties: "never",
          ignoreDestructuring: true,
          ignoreImports: true,
          ignoreGlobals: true,
        },
      ],
    },
  },
];

export default eslintConfig;
