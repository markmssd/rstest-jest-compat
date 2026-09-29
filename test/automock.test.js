import { fetchUser } from './fixtures/api';

jest.mock('./fixtures/api');

describe('jest.mock without a factory', () => {
  it('turns every export into a mock function', () => {
    expect(jest.isMockFunction(fetchUser)).toBe(true);
    expect(fetchUser(1)).toBeUndefined();
  });

  it('lets each test set a resolved value', async () => {
    jest.mocked(fetchUser).mockResolvedValue({ id: 1, name: 'Mocked user' });

    await expect(fetchUser(1)).resolves.toEqual({ id: 1, name: 'Mocked user' });
    expect(fetchUser).toHaveBeenCalledWith(1);
  });
});
