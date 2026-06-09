# PRESTOplay React Components

The library is written in TypeScript, we use Storybook for development
and documentation.

## Get started

```sh
npm i
```

## Develop

To start Storybook and watch for any file changes, run:

```sh
npm run storybook
```

## Build

To compile the library run:

```sh
npm run build
```

## Test

```sh
npm run test
```

## Publish

Create a release in GitHub and select a tag to create along with the release
(e.g. `1.0.0`), the tag must be equal to the version to be released. This will
trigger a GitHub action which will publish the release.

- Select: Set as the latest release

### Publish a Beta version

To publish a beta version the process is the same, just use a "beta" format for
the version string (e.g. `1.0.0-<beta>.1`), where `<beta>` can be any
alphabetical string (letters only).

- Name: e.g. 1.0.0-beta.1
- Description: The purpose of this beta and what features or changes does
  it contain
- Unselect: Set as the latest release
- _(Do NOT mark it as pre-release)_

The `publish` workflow will automatically publish this package into
a `<beta>` (non-main) NPM channel.
