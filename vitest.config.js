import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'vitest.config.js', '*.config.js', '**/*.test.js', '**/*.spec.js']
        },
        include: ['**/*.test.js', '**/*.spec.js']
    }
});
