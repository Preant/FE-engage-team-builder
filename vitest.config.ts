import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig((_config) => {
  return {
    test: {
      tsconfig: 'tsconfig.spec.json',
      include: ['tests/**/*.spec.ts'],
      watch: true,
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/test-setup.ts'],
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html'],
        reportsDirectory: 'tests/coverage',
        include: [
          'src/**/*.service.ts'
        ],
        exclude: [
          'node_modules/**',
          'tests/**',
          '**/*.d.ts'
        ]
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    }
  };
});
