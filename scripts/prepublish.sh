#!/bin/bash

npm run build;
npx es-check es5 ./dist/prestoplay-react.cjs.min.js;
