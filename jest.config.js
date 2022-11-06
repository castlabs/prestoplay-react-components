module.exports = {
  preset: "rollup-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!(@castlabs/prestoplay)/)'],
  moduleNameMapper: {
    '@castlabs/prestoplay.*': '<rootDir>/tests/fake_clpp.js',
  }
}
