#!/bin/bash

rm -rf ./dist;
rollup -c ./scripts/rollup.config.lib.mjs;
