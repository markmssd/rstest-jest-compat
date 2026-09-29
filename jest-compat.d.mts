import type { ExtendConfigFn } from '@rstest/core';

export interface JestCompatOptions {
  /** Jest's `restoreMocks`: restore spies before each test, leave `jest.fn()` alone. */
  restoreMocks?: boolean;
}

export declare const jestCompat: (options?: JestCompatOptions) => ExtendConfigFn;
