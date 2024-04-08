module.exports = {
  root: true,
  extends: [
    "@finga",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: [
    "use-effect-no-deps",
  ],
  rules: {
    "eqeqeq": ["error", "smart"],
    "use-effect-no-deps/use-effect-no-deps": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/keyword-spacing": "error",

    // This is just a stupid rule. Many times you need to
    // pass an async callback to an onClick, and this rule
    // reports it as misuse, it is not misuse.
    "@typescript-eslint/no-misused-promises": "off",
    // For some reason these rules falsely report
    // access to React Event fields e.g. the following is correct
    // but the rules report it:
    // <div onClick={(event: React.MouseEvent<HTMLButtonElement>) => event.altKey}}/>
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
  },
  overrides: [
    {
      files: [
        "tests/**/*.ts",
        "tests/**/*.tsx",
        "tests/**/*.js",
        "tests/**/*.jsx",
      ],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
      }
    }
  ],
  settings: {
    react: {
      version: "detect"
    },
  }
}
