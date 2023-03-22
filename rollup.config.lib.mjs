import copy from 'rollup-plugin-copy';
import deleteFiles from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import glob from 'glob'
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import untypedMerge from 'rollup-merge-config';
import url from "postcss-url";


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
 * @type {import('rollup').RollupOptions}
 */
const BASE_CONFIG_JS = {
  plugins: [
    external(),
    resolve(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
}

/**
 * @type {import('rollup').RollupOptions[]}
 */
const options = [
  // Clear the /dist folder and build ESM modules from TS and generate their typings.
  merge(BASE_CONFIG_JS, {
    input: glob.sync("src/**/*.{ts,tsx}"),
    output: [{
      dir: "dist",
      format: 'esm',
      // Convert file names with .ts/.tsx extensions to .js.
      entryFileNames: (chunkInfo) => {
        if (chunkInfo.facadeModuleId == null) {
          throw Error('Failed to generate an ESM module, chunkInfo.facadeModuleId is missing.')
        }

        return chunkInfo.facadeModuleId
          .replace(/^.*\/src\//, '')
          .replace(/\.tsx?$/, '.js')
      },
    }],
    plugins: [
      deleteFiles({ targets: 'dist/*' }),
    ],
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
