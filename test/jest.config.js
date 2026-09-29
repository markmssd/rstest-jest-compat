module.exports = {
  restoreMocks: true,
  testMatch: ['<rootDir>/**/*.test.js'],
  transform: {
    '^.+\\.js$': '@swc/jest',
  },
};
