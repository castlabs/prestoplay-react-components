const path = require('path')

/**
 * @param {string} filepath relative to project root
 * @return {string} absolute path
 */
function file(filepath) {
  return path.resolve(__dirname, `../../${filepath}`)
}

module.exports = {
  file,
}
