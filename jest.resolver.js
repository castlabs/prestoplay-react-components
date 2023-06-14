/**
 * Imports from @react-hook are for some reason not resolved correctly, and they end up
 * importing ESM code instead of transpiled ES5 which causes a crash of the test suite.
 * Fix it by correcting those paths here.
 *
 * (The package.json.exports field in @react-hook/ is the problem.
 * Ideally I would fix this via the `options.packageFilter`, but that
 * for some reason is not working - possibly a bug in Jest. So I'm just
 * doing a simple replace here instead.)
 */
function fixReactHookPaths(path) {
  const replacements = {
    '@react-hook/resize-observer/dist/module/index.js': '@react-hook/resize-observer/dist/main/index.js',
    '@react-hook/passive-layout-effect/dist/module/index.js': '@react-hook/passive-layout-effect/dist/main/index.js',
    '@react-hook/latest/dist/module/index.js': '@react-hook/latest/dist/main/index.js',
  }

  Object.keys(replacements).forEach(key => {
    path = path.replace(key, replacements[key])
  })

  return path
}

/**
* https://jestjs.io/docs/configuration/#resolver-string
*/
module.exports = (path, options) => {
  let result = options.defaultResolver(path, options)
  return fixReactHookPaths(result)
}
