import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import glob from 'glob'
import dts from 'rollup-plugin-dts';
import url from "postcss-url";
import copy from 'rollup-plugin-copy';

/**
 * @fileoverview Rollup configuration for building the library.
 * It builds ./src and produces ./dist.
 */

let allInputFiles = glob.sync("src/**/*.ts*");
const entries = allInputFiles.reduce((p, f) => {
  let entryName = f.replace("src/", "").replace(/\.ts(x)?/, "")
  p[entryName] = f
  return p
}, {})


function libsTypescript() {
  return typescript({
    tsconfig: './tsconfig.json',
    compilerOptions: {
      outDir: "./dist"
    },
    include: [
      "./src/**/*.tsx",
      "./src/**/*.ts"
    ]
  });
}


/**
 * @type {import('rollup').RollupOptions[]}
 */
const options = [
  // Build the individual module
  {
    input: entries,
    output: [{dir: "dist", format: 'esm'}],
    plugins: [
      external(),
      resolve(),
      libsTypescript(),
      postcss()
    ]
  },
  // build the packaged single file module
  {
    input: ['src/index.ts'],
    output: [{file: "dist/prestoplay-react.js", format: 'esm'}],
    plugins: [
      external(),
      resolve(),
      libsTypescript(),
      postcss()
    ]
  },
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
