const logger = {
  calls: 0,
  log(message) {
    this.calls += 1;
    return message;
  },
};

describe('jest.spyOn', () => {
  it('calls through by default and records calls', () => {
    const spy = jest.spyOn(logger, 'log');

    expect(logger.log('hi')).toBe('hi');
    expect(spy).toHaveBeenCalledWith('hi');
  });

  it('silences the original with mockImplementation()', () => {
    jest.spyOn(logger, 'log').mockImplementation();

    expect(logger.log('hi')).toBeUndefined();
  });

  it('silences console output', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation();

    console.warn('this should not print');

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('can replace the return value', () => {
    jest.spyOn(logger, 'log').mockReturnValue('replaced');

    expect(logger.log('hi')).toBe('replaced');
  });
});
