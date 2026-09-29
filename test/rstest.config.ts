import { defineConfig } from '@rstest/core';
import { jestCompat } from 'rstest-jest-compat';

export default defineConfig({
  extends: jestCompat({ restoreMocks: true }),
  include: ['**/*.test.js'],
});
