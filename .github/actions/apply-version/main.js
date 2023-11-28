const fs = require('fs')
const execSync = require('child_process').execSync
const core = require('@actions/core')
const utils = require('../utils')

/**
 * @fileoverview Replace version and links to API docs with the current/fresh
 * value where needed (package.json, readme, storybook intro).
 */

const TOKENS = {
  LINK_DOCS: 'CI_REPLACE_LINK_DOCS',
  VERSION: 'CI_REPLACE_VERSION',
}

const FILES = {
  README: utils.file('README.md'),
  STORYBOOK_INTRO: utils.file('story/stories/Intro.mdx'),
}

const version = core.getInput('version', {required: true})

// Note: The trailing slash is very important here, it won't work without it.
const homepage = `https://players.castlabs.com/react-dom/${version}/docs/`

core.info(`API docs link is: ${homepage}`)

/**
 * Set the "version" attribute in package.json
 * @param {string} version
 */
function updatePackageJson(version) {
  core.info(`Set package.json version to ${version}`)
  execSync(`npm pkg set version=${version};`, { stdio: 'inherit' })
}

/**
 * Replace token by link in the README.md file
 * @param {string} link
 */
function addLinkToReadme(link) {
  core.info(`Adding link to ${FILES.README}`)
  replaceText(FILES.README, TOKENS.LINK_DOCS, link)
}

/**
 * Replace token by version in Storybook Intro.mdx file
 * @param {string} version
 */
function addVersionToStorybook(version) {
  core.info(`Adding version to ${FILES.STORYBOOK_INTRO}`)
  replaceText(FILES.STORYBOOK_INTRO, TOKENS.VERSION, version)
}

/**
 * @param {string} filename file
 * @param {string} token token to replace
 * @param {string} text replacement text
 */
function replaceText(filename, token, text) {
  const content = fs.readFileSync(filename, 'utf8')
  fs.writeFileSync(filename, content.replace(token, text))
}

try {
  addLinkToReadme(homepage)
  addVersionToStorybook(version)
  updatePackageJson(version)
  core.info('Success')
} catch (err) {
  core.error('Failed to generated links to API docs' + err)
  process.exit(1)
}
