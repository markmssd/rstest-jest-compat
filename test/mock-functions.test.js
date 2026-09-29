describe('jest.fn', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('records calls and results', () => {
    const double = jest.fn((value) => value * 2);

    double(2);

    expect(double).toHaveBeenCalledTimes(1);
    expect(double.mock.calls).toEqual([[2]]);
    expect(double.mock.results[0].value).toBe(4);
  });

  it('queues one-off return values', () => {
    const next = jest.fn().mockReturnValueOnce('first').mockReturnValue('rest');

    expect([next(), next(), next()]).toEqual(['first', 'rest', 'rest']);
  });

  it('mocks promises', async () => {
    const load = jest.fn().mockResolvedValueOnce('loaded').mockRejectedValueOnce(new Error('failed'));

    await expect(load()).resolves.toBe('loaded');
    await expect(load()).rejects.toThrow('failed');
  });

  it('clears calls with clearAllMocks', () => {
    const tracked = jest.fn();

    tracked();
    jest.clearAllMocks();

    expect(tracked).not.toHaveBeenCalled();
  });
});
