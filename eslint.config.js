// ESLint 9 Flat Config - Astro 프로젝트용
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";
import globals from "globals";

export default [
    {
        ignores: ["dist/**", ".astro/**", "node_modules/**"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    ...astroPlugin.configs.recommended,
    // .astro 파일: Astro 고유 문법(class, client:*, is:inline 등)과 React/TS 타입 충돌 무시
    {
        files: ["**/*.astro"],
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-enum-comparison": "off",
        },
    },
];
