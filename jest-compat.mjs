/**
 * Run an existing Jest suite under Rstest without rewriting specs.
 *
 *   // rstest.config.ts
 *   import { defineConfig } from '@rstest/core';
 *   import { jestCompat } from './jest-compat.mjs';
 *
 *   export default defineConfig({
 *     extends: jestCompat({ restoreMocks: true }),
 *     testEnvironment: 'jsdom',
 *   });
 *
 * The file plays three roles depending on who loads it: config extension (Node), loader
 * (Rspack, rewrites `jest.*` module APIs), and setup file (installs the `jest` global).
 * Keep it inside the project root: Rstest ignores the `rs.mock` calls of setup files
 * outside it.
 */
import fs from 'node:fs';
import { isBuiltin } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
const SCRIPT = /(\/index)?\.[cm]?[jt]sx?$/;

// Loader. Rstest only hoists module mocks whose callee is literally `rs.`.

const REQUIRE_ACTUAL_SPREAD = /\.\.\.jest\.requireActual\(\s*(['"])([^'"]+)\1\s*\)(?!\s*\.)/g;
const JEST_MODULE_API = /\bjest\.(mock|unmock|doMock|doUnmock|requireActual)\(/g;

export default function jestCompatLoader(source) {
  const rewritten = source
    .replace(REQUIRE_ACTUAL_SPREAD, '...__jestCompatOmitDefault(rs.requireActual($1$2$1))')
    .replace(JEST_MODULE_API, 'rs.$1(');

  if (this.resourcePath !== SELF) {
    return rewritten;
  }

  const { rootMocks } = this.getOptions();

  return [rewritten, ...rootMocks.map((request) => `rs.mock(${JSON.stringify(request)});`)].join('\n');
}

// Config extension.

/** Jest applies `<root>/__mocks__/<package>` without a `jest.mock` call; Rstest needs one. */
const findRootMocks = (root) => {
  const mocksDir = path.join(root, '__mocks__');

  return fs.existsSync(mocksDir)
    ? fs
        .readdirSync(mocksDir, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && SCRIPT.test(entry.name))
        .map((entry) =>
          path
            .relative(mocksDir, path.join(entry.parentPath, entry.name))
            .split(path.sep)
            .join('/')
            .replace(SCRIPT, ''),
        )
        .filter((request) => !isBuiltin(request))
    : [];
};

/**
 * Pass `restoreMocks` here rather than in your config: Jest's restores spies and leaves
 * `jest.fn()` alone, Rstest's also resets every mock implementation.
 *
 * @param {{ restoreMocks?: boolean }} [options]
 * @returns {import('@rstest/core').ExtendConfigFn}
 */
export const jestCompat =
  ({ restoreMocks = false } = {}) =>
  (userConfig) => ({
    globals: true,
    setupFiles: [SELF],
    source: {
      define: { __JEST_COMPAT_RESTORE_MOCKS__: String(restoreMocks) },
    },
    tools: {
      rspack: (_rspackConfig, { addRules }) => {
        addRules([
          {
            test: /\.[cm]?[jt]sx?$/,
            exclude: /node_modules/,
            enforce: 'post',
            loader: SELF,
            options: { rootMocks: findRootMocks(path.resolve(userConfig.root ?? process.cwd())) },
          },
        ]);
      },
    },
  });

// Setup file. Only runs inside the test environment, where Rstest's globals exist.

if (typeof rs !== 'undefined' && typeof beforeEach === 'function') {
  const spies = new Set();

  // Jest's `mockImplementation()` with no argument is a no-op; Rstest's calls through.
  const spyOn = (...args) => {
    const spy = rs.spyOn(...args);
    const { mockImplementation } = spy;

    spy.mockImplementation = (implementation = () => undefined) => mockImplementation(implementation);
    spies.add(spy);

    return spy;
  };

  // Jest's `restoreAllMocks()` only un-spies; Rstest's also resets every mock implementation.
  const restoreAllMocks = () => {
    spies.forEach((spy) => spy.mockRestore());
    spies.clear();
  };

  // eslint-disable-next-line no-undef
  if (__JEST_COMPAT_RESTORE_MOCKS__) {
    beforeEach(restoreAllMocks);
  }

  // Jest's fake-timer options have different names in Rstest.
  const useFakeTimers = ({ doNotFake, advanceTimers, ...config } = {}) => {
    rs.useFakeTimers({
      ...config,
      ...(doNotFake && { toNotFake: doNotFake }),
      ...(advanceTimers && {
        shouldAdvanceTime: true,
        ...(typeof advanceTimers === 'number' && { advanceTimeDelta: advanceTimers }),
      }),
    });

    return jest;
  };

  const jest = Object.assign(Object.create(rs), {
    spyOn,
    restoreAllMocks,
    useFakeTimers,
    // Jest's timeout applies to hooks too.
    setTimeout: (timeout) => rs.setConfig({ testTimeout: timeout, hookTimeout: timeout }),
    retryTimes: (retry) => rs.setConfig({ retry }),
  });

  // Jest names a suite after a function passed as its name; Rstest hangs on it.
  const describe = new Proxy(globalThis.describe, {
    apply: (target, thisArg, [name, ...rest]) =>
      Reflect.apply(target, thisArg, [typeof name === 'function' ? name.name : name, ...rest]),
  });

  // Jest makes a factory's object the default export; spreading `requireActual` would
  // otherwise keep the real `default` and hide the mocks.
  const omitDefault = ({ default: _default, ...namedExports }) => namedExports;

  Object.assign(globalThis, { __jestCompatOmitDefault: omitDefault, jest, describe });
}
