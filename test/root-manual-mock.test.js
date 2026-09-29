import { version } from '@example/pkg';
import { greet } from 'example-pkg';
import { shout } from 'example-pkg/sub';

describe('root __mocks__ for node_modules packages', () => {
  it('applies without a jest.mock call', () => {
    expect(greet('Ada')).toBe('Mocked hello, Ada');
  });

  it('covers scoped packages', () => {
    expect(version()).toBe('mocked');
  });

  it('covers package subpaths', () => {
    expect(shout('hi')).toBe('MOCKED');
  });

  it('keeps the real package reachable through requireActual', () => {
    expect(jest.requireActual('example-pkg').greet('Ada')).toBe('Hello, Ada');
  });

  it('lets a test override the manual mock', () => {
    jest.mocked(greet).mockReturnValueOnce('Overridden');

    expect(greet('Ada')).toBe('Overridden');
  });
});
