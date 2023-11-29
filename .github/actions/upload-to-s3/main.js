const execSync = require('child_process').execSync
const core = require('@actions/core')

/**
 * @fileoverview Upload a directory to S3.
 */

const directory = core.getInput('directory', {required: true})
const destination = core.getInput('destination', {required: true})
const dryRun = core.getBooleanInput('dry-run')

const args = ['--recursive']
if (dryRun) {
  args.push('--dryrun')
}

core.info(`Uploading ${directory} to S3.`)
execSync(`aws s3 cp ${args.join(' ')} "${directory}" "${destination}"`, { stdio: 'inherit' })
// Note: the default cache policy is 1 day, I think that's OK for now.
// In the future if traffic increases we can increase the expiration
// as much as we want.
