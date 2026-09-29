import { greeting } from './fixtures/greeting';

jest.mock('./fixtures/greeting');

describe('__mocks__ next to a module', () => {
  it('is used by jest.mock without a factory', () => {
    expect(greeting()).toBe('manual mock');
  });
});
