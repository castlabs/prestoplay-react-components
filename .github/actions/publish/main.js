const execSync = require('child_process').execSync
const core = require('@actions/core')

/**
 * @fileoverview Publish to NPM, if the version is in the beta format
 * (e.g. 1.2.3-beta.4 or 1.2.3-alpha.1 etc.) then publish to a beta channel.
 */

const version = core.getInput('version', {required: true})
const dryRun = core.getBooleanInput('dryRun')

const regexBetaVersion = /^\d+\.\d+\.\d+-(\w+)\.\d+$/;
const regexVersion = /^\d+\.\d+\.\d+$/;

const betaMatch = version.match(regexBetaVersion);

if (betaMatch) {
  const betaLabel = betaMatch[1];
  core.info(`Publishing a Beta version ${version}.`)
  execSync(`npm publish ${dryRun ? '--dry-run' : ''} --tag ${betaLabel}`, { stdio: 'inherit' })
  process.exit(0);
}

const isNormal = regexVersion.test(version);

if (isNormal) {
  core.info(`Publishing version ${version}.`)
  execSync(`npm publish ${dryRun ? '--dry-run' : ''}`, { stdio: 'inherit' })
  process.exit(0);
}

core.error(`Invalid version format. Version: ${version}`);
process.exit(1);
