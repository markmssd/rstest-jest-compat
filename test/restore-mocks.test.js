const service = { name: () => 'real' };
const configured = jest.fn().mockReturnValue('configured');

describe('restoreMocks: true', () => {
  it('mocks a method in one test', () => {
    jest.spyOn(service, 'name').mockReturnValue('spied');

    expect(service.name()).toBe('spied');
  });

  it('restores spies before the next test', () => {
    expect(service.name()).toBe('real');
  });

  it('keeps implementations set on jest.fn()', () => {
    expect(configured()).toBe('configured');
  });
});
