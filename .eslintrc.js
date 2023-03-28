module.exports = {
  root: true,
  extends: [ "@finga" ],
  rules: {
    "@typescript-eslint/type-annotation-spacing": "error",
    "keyword-spacing": "off",
    "@typescript-eslint/keyword-spacing": "error",
    
    // These are the most common lint errors still present in the codebase.
    // Uncomment this if you want to ignore them temporarily.
    // But ideally we should aim to fix all of them.

    // // cca 100x:
    // "import/no-named-as-default": "off",
    // // cca 500x:
    // "import/export": "off",
    // "@typescript-eslint/no-explicit-any": "off",
    // "@typescript-eslint/no-unsafe-call": "off",
    // "@typescript-eslint/no-unsafe-assignment": "off",
    // "@typescript-eslint/ban-ts-comment": "off",
    // "@typescript-eslint/no-unsafe-return": "off",
    // "@typescript-eslint/no-unsafe-member-access": "off",
    // "@typescript-eslint/no-unsafe-argument": "off",
    // "@typescript-eslint/unbound-method": "off",
    // "@typescript-eslint/no-floating-promises": "off",
    // "@typescript-eslint/no-misused-promises": "off",
    // // cca 70x:
    // "@typescript-eslint/require-await": "off", 
  },
  "overrides": [
    {
      "files": [
        "tests/**/*.ts",
        "tests/**/*.tsx",
        "tests/**/*.js",
        "tests/**/*.jsx",
      ],
      "rules": {
        "@typescript-eslint/no-non-null-assertion": "off",
      }
    }
  ]
}
