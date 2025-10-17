// ใช้ import syntax เนื่องจากเป็นไฟล์ .mjs (ES Module)

import globals from "globals";
import js from "@eslint/js"; // สำหรับ "eslint:recommended"
import tseslint from "typescript-eslint"; // สำหรับ TypeScript
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
    // 1. Global Ignore Patterns
    {
        ignores: ["dist", ".eslintrc.cjs"],
    },

    // 2. Base Configuration (ESLint Recommended + Environment)
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        ...js.configs.recommended,

        languageOptions: {
            // ใช้ globals แทน "env"
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
        },
    },

    // 3. TypeScript Configuration
    // ...tseslint.configs.recommended จะตั้งค่า Parser, Plugins และกฎที่แนะนำของ TypeScript
    ...tseslint.configs.recommended,

    // 4. React-Hooks Configuration
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "react-hooks": reactHooks,
        },
        // นำเข้ากฎที่แนะนำสำหรับ Hooks
        rules: {
            ...reactHooks.configs.recommended.rules,
        },
    },

    // 5. React-Refresh และ Custom Rules
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "react-refresh": reactRefresh,
        },
        rules: {
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
        },
    },
];
