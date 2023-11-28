const execSync = require('child_process').execSync


execSync('echo "1: ${ARTY}"; export ARTY="Arty is me"; echo "2: ${ARTY}"', { stdio: 'inherit' })
execSync('echo "3: ${ARTY} (On a new shell?)";', { stdio: 'inherit' })
