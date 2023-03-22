import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import glob from 'glob'
import dts from 'rollup-plugin-dts';
import url from "postcss-url";
import copy from 'rollup-plugin-copy';
import untypedMerge from 'rollup-merge-config';
import terser from '@rollup/plugin-terser';


/**
 * @fileoverview Rollup configuration for building the library.
 * It builds ./src and produces ./dist.
 */

/**
 * @param {...import('rollup').RollupOptions} args options
 * @returns {import('rollup').RollupOptions} merged options
 */
const merge = (...args) => {
  return untypedMerge(...args)
}

/**
 * Common config for compilation of JS/TS files.
 * 
 *
 * @type {import('rollup').RollupOptions}
 */
const BASE_CONFIG_JS = {
  plugins: [
    external(),
    resolve(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
}


let allInputFiles = glob.sync("src/**/*.ts*");
const entries = allInputFiles.reduce((p, f) => {
  let entryName = f.replace("src/", "").replace(/\.ts(x)?/, "")
  p[entryName] = f
  return p
}, {})

/**
 * @type {import('rollup').RollupOptions[]}
 */
const options = [
  // Build the individual module
  merge(BASE_CONFIG_JS, {
    input: entries,
    output: [{ dir: "dist", format: 'esm' }],
  }),
  // build the packaged single file module
  merge(BASE_CONFIG_JS,{
    input: ['src/index.ts'],
    output: [{ file: "dist/prestoplay-react.js", format: 'esm' }],
    plugins: [
      terser(), // minify
    ],
  }),
  // build the types for the single file module
  {
    input: 'dist/index.d.ts',
    output: [{file: 'dist/prestoplay-react.d.ts', format: "esm"}],
    external: [/\.css$/],
    plugins: [dts()],
  },
  // build the themes
  {
    input: 'src/themes/pp-ui-base-theme.css',
    output: [{file: 'dist/themes/pp-ui-base-theme.css', format: 'es'}],
    plugins: [
      postcss({
        modules: false,
        extract: true
      }),
      copy({
        targets: [
          {src: 'src/themes/resources/**', dest: 'dist/themes/resources'},
        ]
      })
    ],
  },
  {
    input: 'src/themes/pp-ui-base-theme.css',
    output: [{file: 'dist/themes/pp-ui-base-theme-embedded.css', format: 'es'}],
    plugins: [postcss({
      plugins: [
        url({
          url: "inline"
        })
      ],
      modules: false,
      extract: true
    })],
  }
]

export default options;
