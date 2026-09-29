import { defineConfig } from '@rstest/core';
import { jestCompat } from './jest-compat.mjs';

export default defineConfig({
  extends: jestCompat({ restoreMocks: true }),
  include: ['test/**/*.test.js'],
});
