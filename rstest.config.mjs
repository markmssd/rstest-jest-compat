import { defineConfig } from '@rstest/core';
import { withJestCompat } from './jest-compat.mjs';

export default defineConfig(
  withJestCompat({
    restoreMocks: true,
    include: ['test/**/*.test.js'],
  }),
);
