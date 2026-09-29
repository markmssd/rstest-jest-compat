# rstest-jest-compat

Run an existing Jest suite under [Rstest](https://rstest.rs) without rewriting your specs.

Rstest's API is close to Jest's, but not close enough to just set `jest = rs` and go.
`jest.mock()` isn't picked up at all, and a handful of other differences fail silently.
This is one file, [`jest-compat.mjs`](./jest-compat.mjs), that covers the common ones, so
you can try Rstest on a real suite first and migrate the syntax later.

Tested with Rstest 0.12.2 and Jest 30.5.

## Usage

Copy `jest-compat.mjs` into your project, or install this package and import
`rstest-jest-compat` instead. Then add it to your config through `extends`:

```ts
// rstest.config.ts
import { defineConfig } from '@rstest/core';
import { jestCompat } from './jest-compat.mjs';

export default defineConfig({
  extends: jestCompat({ restoreMocks: true }),
  testEnvironment: 'jsdom',
});
```

Your config stays a plain, fully typed `defineConfig`. Set `restoreMocks` on
`jestCompat()`, not in your config: Rstest's own `restoreMocks` also resets every
`jest.fn()` implementation.

When installed as a package, the adapter adds itself to `output.bundleDependencies`
where needed, since its setup file has to be bundled. It can't work with
`bundleDependencies: false`; list your packages instead.

## What it covers

| Jest | What goes wrong in Rstest without it |
| --- | --- |
| `jest.mock`, `unmock`, `doMock`, `doUnmock`, `requireActual` | Rstest only processes module mocks written as `rs.mock()`, so `jest.mock()` throws "was not transformed by Rstest" |
| `jest.mock('x', () => ({ ...jest.requireActual('x'), fn: jest.fn() }))` | The real `default` export survives the spread, so `import x from 'x'` ignores the mock |
| `<root>/__mocks__/<package>` applied automatically | Only applied when the spec calls `jest.mock('<package>')` |
| `jest.spyOn(obj, 'fn').mockImplementation()` | With no argument, Rstest calls the original instead of doing nothing |
| `restoreMocks: true` | Rstest also resets every `jest.fn().mockReturnValue(...)`, including the ones in manual mocks |
| `jest.useFakeTimers({ doNotFake, advanceTimers })` | Rstest names these options differently and ignores Jest's names, so `setTimeout` stays fake |
| `jest.setTimeout()`, `jest.retryTimes()` | Not functions in Rstest |
| `describe(myFunction, ...)` | Rstest crashes the worker (or hangs) instead of naming the suite `myFunction` |

Everything else on `jest` comes straight from `rs`: `jest.fn`, `jest.mocked`,
`jest.clearAllMocks`, `jest.advanceTimersByTime`, and so on.

## What it doesn't cover

- **Snapshot names.** Rstest joins test names with ` > ` (`describe > test 1`), Jest with a
  space (`describe test 1`), so snapshots written by Jest have to be regenerated.
- **`jest.isolateModules`, `jest.createMockFromModule`, `jest.requireMock`**, and custom
  environments such as `jest-environment-jsdom-global`.
- **Jest config.** Options like `moduleNameMapper` or `testPathIgnorePatterns` still need
  their Rstest equivalents (see the
  [migration guide](https://rstest.rs/guide/migration/jest)).

## Tests

[`test/`](./test) is a separate project that installs this package and runs the same specs
under both runners:

```bash
npm install --prefix test
npm test
```

Both pass all 41 tests. Under Rstest without the adapter (with only `globalThis.jest = rs`),
12 of the 16 files fail.
