const execSync = require('child_process').execSync
const core = require('@actions/core')

/**
 * @fileoverview Publish to NPM, if the version is in the beta format
 * (e.g. 1.2.3-beta.4 or 1.2.3-alpha.1 etc.) then publish to a beta channel.
 */

/**
 * @typedef {'normal'|'beta'} VersionType
 * @typedef {{ type: VersionType, label?: string }} VersionInfo
 */

/**
 * @param {string} version version string
 * @return {VersionInfo|null} version info or null if invalid
 */
function parseVersion(version) {
  const regexBetaVersion = /^\d+\.\d+\.\d+-(\w+)\.\d+$/;
  const regexVersion = /^\d+\.\d+\.\d+$/;

  const betaMatch = version.match(regexBetaVersion);
  if (betaMatch) {
    const label = betaMatch[1];
    return { type: 'beta', label };
  }

  const isNormal = regexVersion.test(version);
  if (isNormal) {
    return { type: 'normal' };
  }

  return null;
}


const version = core.getInput('version', {required: true})
const npmToken = core.getInput('npm-token', {required: true})
const dryRun = core.getBooleanInput('dry-run')

const versionInfo = parseVersion(version)

if (versionInfo === null) {
  core.error(`Invalid version format. Version: ${version}`)
  process.exit(1)
}

const { type, label } = versionInfo;
const args = ['--provenance']
if (dryRun) {
  args.push('--dry-run')
}
if (label) {
  args.push(`--tag ${label}`)
}

core.info(`Publishing ${type === 'beta' ? 'Beta version' : 'version'} ${version}.`)
execSync(`export NPM_TOKEN=${npmToken}; npm publish ${args.join(' ')}`, { stdio: 'inherit' })
