import analyze from 'rollup-plugin-analyzer';
import copy from 'rollup-plugin-copy';
import deleteFiles from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-node-externals';
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
  onwarn(warning, warn) {
    warn(warning)

    // Stop the build if there are circular dependencies.
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      throw new Error('Build failed, circular dependencies are not allowed!')
    }
  },
}

/**
 * Common config for compilation of CSS files.
 *
 * @type {import('rollup').RollupOptions}
 */
const BASE_CONFIG_CSS = {
  input: 'src/themes/pp-ui-base-theme.css',
  onwarn(warning, warn) {
    /**
     * When building rollup-plugin-postcss Rollup emits a false file-overwrite warning.
     * Ignore it.
     */
    if (warning.code === "FILE_NAME_CONFLICT") {
      return
    }

    warn(warning);
  }
}

const assertNoJsFiles = () => {
  const jsFiles = glob.sync("src/**/*.{js,jsx}")

  if (jsFiles.length > 0) {
    throw new Error(`Source code contains JS files. The build process does NOT support that. Files: ${jsFiles}`)
  }
}

assertNoJsFiles()

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

  // Build a UMD bundle.
  merge(BASE_CONFIG_JS, {
    input: ['src/index.ts'],
    output: [{
      file: "dist/prestoplay-react.cjs.min.js",
      /**
       * CJS is good enough, no need to use UMD, because React is in CJS
       * format as well.
       */
      format: 'cjs',
    }],
    plugins: [terser(), /* analyze() */],
  }),

  // Build TS typings for the bundle.
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/prestoplay-react.d.ts' }],
    external: [/\.css$/],
    plugins: [dts()],
  },

  // Build the CSS styles/themes.
  merge(BASE_CONFIG_CSS, {
    output: [{ file: 'dist/themes/pp-ui-base-theme.css' }],
    plugins: [
      postcss({
        extract: true,
        minimize: true,
      }),
      // Copy icons over to dist.
      copy({
        targets: [
          {
            src: 'src/themes/resources/**',
            dest: 'dist/themes/resources',
          },
        ]
      })
    ],
  }),
  
  // Build CSS styles/theme with in-lined SVG icons.
  merge(BASE_CONFIG_CSS, { 
    output: [{ file: 'dist/themes/pp-ui-base-theme-embedded.css' }],
    plugins: [
      postcss({
        plugins: [
          url({
            url: "inline"
          })
        ],
        extract: true,
        minimize: true,
      }),
    ],
  }),
]

export default options;
