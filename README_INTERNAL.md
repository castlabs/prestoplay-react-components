# PRESTOplay React Components

The library is written in TypeScript and comes with a small react application that we use for development.

## Get started

```sh
npm i
```

## Develop

To start the dev app and watch for any file changes, run:
```sh
npm run start
```

## Build

To compile the library run:
```sh
npm run build
```

## Publish

Create a release in GitHub and select a tag to create along with the release
(e.g. `1.0.0`), the tag must be equal to the version to be released. This will
trigger a GitHub action which will publish the release.

### Publish a Beta version

To publish a beta version the process is the same, just use a "beta" format for
the version string (e.g. `1.0.0-<beta>.1`), where `<beta>` can be any
alphabetical string (letters only).

The `publish` workflow will automatically publish this package into
a `<beta>` (non-main) NPM channel.

## Test

```sh
npm run test
```

## Docs

We are transitioning to use `Storybook` for public docs. Once that is done `app` can be deleted.

```sh
npm run storybook
```
