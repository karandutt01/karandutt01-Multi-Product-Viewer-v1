import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    rules: {
      "no-console": "error",
      "no-debugger": "error"
    },
     linterOptions: {
      reportUnusedDisableDirectives: "error"
    },
     ignores: [
      "node_modules/**",
      "dist/**",
      "build/**"
    ]
  }
]);
