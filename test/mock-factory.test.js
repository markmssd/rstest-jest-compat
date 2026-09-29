import math, { add, multiply } from './fixtures/math';

jest.mock('./fixtures/math', () => ({
  ...jest.requireActual('./fixtures/math'),
  add: jest.fn(() => 42),
}));

describe('jest.mock with a factory', () => {
  it('replaces the mocked export', () => {
    expect(add(1, 2)).toBe(42);
  });

  it('keeps the real exports spread from requireActual', () => {
    expect(multiply(2, 3)).toBe(6);
  });

  it('makes the factory object the default export', () => {
    expect(math.add(1, 2)).toBe(42);
  });
});
