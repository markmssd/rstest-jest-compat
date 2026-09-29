jest.setTimeout(6000);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('jest.setTimeout', () => {
  it('raises the timeout above the 5s default', () => wait(5200));
});
