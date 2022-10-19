module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules'],
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!mongodb)'],
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!src/vendor/**'],
  coveragePathIgnorePatterns: [
    // this files/folder will be test through integration tests
    'module.ts',
    'filter.ts',
    'main.ts',
    'constants',
    'database',
  ],
  coverageThreshold: {
    global: {
      branches: '10',
      functions: '10',
      lines: '10',
    },
  },
  coverageReporters: ['html', 'text-summary', 'cobertura'],
  coverageDirectory: 'coverage',
};
