import { add } from './fixtures/math';

describe(add, () => {
  it('names the suite after the function', () => {
    expect(expect.getState().currentTestName).toMatch(/^add\b/);
  });
});
