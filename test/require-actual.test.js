import { add } from './fixtures/math';

jest.mock('./fixtures/math', () => {
  const actual = jest.requireActual('./fixtures/math');

  return { ...actual, add: jest.fn((a, b) => actual.add(a, b) * 10) };
});

describe('jest.requireActual', () => {
  it('reaches the real module from inside a factory', () => {
    expect(add(1, 2)).toBe(30);
  });

  it('returns the real module in a test', () => {
    expect(jest.requireActual('./fixtures/math').add(1, 2)).toBe(3);
  });
});
