import eslintConfigNext from "eslint-config-next";
import tseslint from "@typescript-eslint/eslint-plugin";

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "dist/**"],
  },
  ...eslintConfigNext,
  {
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "react/jsx-props-no-spreading": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
