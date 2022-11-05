module.exports = {
  preset: "rollup-jest",
  // roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFilesAfterEnv: [
    // "@testing-library/react/cleanup-after-each",
    // "@testing-library/jest-dom/extend-expect"
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!(@castlabs/prestoplay)/)'],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}
