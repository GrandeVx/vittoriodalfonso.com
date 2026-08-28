import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-tailwindcss";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  ...tailwind.configs["flat/recommended"],
  globalIgnores([
    ".next/**",
    ".context/**",
    ".contentlayer/**",
    "node_modules/**",
    "next-env.d.ts",
    "public/**",
  ]),
]);
