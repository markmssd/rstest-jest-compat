import { add } from './fixtures/math';

describe.each([
  [1, 1, 2],
  [2, 3, 5],
])('add(%i, %i)', (a, b, expected) => {
  it(`returns ${expected}`, () => {
    expect(add(a, b)).toBe(expected);
  });
});

it.each`
  a    | b    | expected
  ${1} | ${2} | ${3}
  ${4} | ${5} | ${9}
`('adds $a and $b', ({ a, b, expected }) => {
  expect(add(a, b)).toBe(expected);
});
