const execSync = require('child_process').execSync
const core = require('@actions/core')

/**
 * @fileoverview Publish to NPM, if the version is in the beta format
 * (e.g. 1.2.3-beta.4 or 1.2.3-alpha.1 etc.) then publish to a beta channel.
 */

const version = core.getInput('version', {required: true})
const dryRun = core.getBooleanInput('dry-run')
const NPM_TOKEN = core.getBooleanInput('npm-token')

const regexBetaVersion = /^\d+\.\d+\.\d+-(\w+)\.\d+$/
const regexVersion = /^\d+\.\d+\.\d+$/

const betaMatch = version.match(regexBetaVersion)
let betaLabel = betaMatch ? betaMatch[1] : null
const isBeta = betaMatch != null
const isNormal = regexVersion.test(version);

if (!isBeta || !isNormal) {
  core.error(`Invalid version format. Version: ${version}`);
  process.exit(1);
}

if (isBeta) {
  core.info(`Publishing a Beta version ${version}.`)
} else {
  core.info(`Publishing version ${version}.`)
}

const args = [
  dryRun ? '--dry-run' : null,
  betaLabel ? `--tag ${betaLabel}` : null,
].filter(Boolean).join(' ')

execSync(`export NPM_TOKEN=${NPM_TOKEN}; npm publish ${args}`, { stdio: 'inherit' })
process.exit(0);
