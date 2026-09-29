import path from 'path';

describe('root __mocks__ for Node builtins', () => {
  it('needs an explicit jest.mock call', () => {
    expect(path.join('a', 'b')).toBe('a/b');
  });
});
