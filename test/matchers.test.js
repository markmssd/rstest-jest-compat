describe('expect', () => {
  it('supports asymmetric matchers', () => {
    expect({ id: 1, tags: ['a', 'b'], createdAt: new Date() }).toEqual({
      id: expect.any(Number),
      tags: expect.arrayContaining(['a']),
      createdAt: expect.any(Date),
    });
  });

  it('counts assertions', async () => {
    expect.assertions(1);

    await expect(Promise.reject(new Error('nope'))).rejects.toThrow('nope');
  });

  it('matches inline snapshots', () => {
    expect({ user: 'Ada', roles: ['admin'] }).toMatchInlineSnapshot(`
{
  "roles": [
    "admin",
  ],
  "user": "Ada",
}
`);
  });
});
