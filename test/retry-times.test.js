jest.retryTimes(2);

let attempts = 0;

describe('jest.retryTimes', () => {
  it('retries a failing test', () => {
    attempts += 1;

    expect(attempts).toBe(2);
  });
});
