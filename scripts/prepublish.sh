#!/bin/bash

set -e;

npm run test;
npm run build;
npx es-check es5 ./dist/prestoplay-react.cjs.min.js;
