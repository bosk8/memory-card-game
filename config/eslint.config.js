'use strict';

export default [
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                localStorage: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                Date: 'readonly',
                Math: 'readonly',
                Array: 'readonly',
                Object: 'readonly',
                JSON: 'readonly',
                parseInt: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-undef': 'error',
            'no-redeclare': 'error',
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            semi: ['error', 'always'],
            quotes: ['error', 'single', { avoidEscape: true }],
            indent: ['error', 4],
            'prefer-const': 'error',
            'no-var': 'error'
        }
    },
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**', '.git/**']
    }
];
