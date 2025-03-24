import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
    prettier,
    prettierConfig,
});

export default defineConfig([
    {
        files: ['**/*.js'], // Apply this configuration to all .js files
        ignores: [
            'node_modules/', // Ignore node_modules
            'dist/', // Ignore dist directory
            'coverage/', // Ignore coverage directory
            '.env', // Ignore .env file
        ],
        extends: compat.extends('airbnb-base', 'plugin:prettier/recommended'),
        plugins: {
            prettier: prettierPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            ecmaVersion: 2021,
            sourceType: 'commonjs',
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn about unused variables
            'no-console': 'off', // Allow console.log (useful for debugging)
            'import/no-unresolved': 'off', // Disable unresolved import errors
            'node/no-unsupported-features/es-syntax': 'off', // Allow modern ES syntax
            'node/no-missing-require': 'off', // Disable missing require errors
            'node/no-unpublished-require': 'off', // Disable unpublished require errors
            'prettier/prettier': 'error', // Enable Prettier rules
            'no-underscore-dangle': 0,
        },
    },
]);
