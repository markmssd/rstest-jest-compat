import { later } from './fixtures/clock';

describe('fake timers', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('advances time manually', () => {
    jest.useFakeTimers();
    const callback = jest.fn();

    later(callback, 1000);
    jest.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('runs every pending timer', () => {
    jest.useFakeTimers();
    const callback = jest.fn();

    later(callback, 60_000);
    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('sets the system time', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2030-01-01T00:00:00Z'));

    expect(new Date().toISOString()).toBe('2030-01-01T00:00:00.000Z');
  });

  it('keeps timers listed in doNotFake real', async () => {
    jest.useFakeTimers({ doNotFake: ['setTimeout'] });

    await new Promise((resolve) => setTimeout(resolve, 10));
  }, 1000);

  it('moves fake time forward on its own with advanceTimers', async () => {
    jest.useFakeTimers({ advanceTimers: true });

    await new Promise((resolve) => setTimeout(resolve, 20));
  }, 1000);
});
