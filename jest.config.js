module.exports = {
  preset: "rollup-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@castlabs/prestoplay.*': '<rootDir>/tests/fake_clpp.js',
  },
  resolver: '<rootDir>/jest.resolver.js',
}
