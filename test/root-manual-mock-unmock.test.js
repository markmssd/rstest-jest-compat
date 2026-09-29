import { greet } from 'example-pkg';

jest.unmock('example-pkg');

describe('jest.unmock', () => {
  it('opts a file out of a root manual mock', () => {
    expect(greet('Ada')).toBe('Hello, Ada');
  });
});
