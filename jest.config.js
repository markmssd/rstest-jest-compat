module.exports = {
  restoreMocks: true,
  testMatch: ['<rootDir>/test/**/*.test.js'],
  transform: {
    '^.+\\.js$': '@swc/jest',
  },
};
