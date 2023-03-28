#!/bin/bash

set -e;

rm -rf ./dist;
rollup -c ./scripts/rollup.config.lib.mjs;
