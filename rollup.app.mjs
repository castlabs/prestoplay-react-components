import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import replace from '@rollup/plugin-replace';
import url from 'postcss-url';
import image from '@rollup/plugin-image';

/**
 * @fileoverview Rollup configuration for local development & dev server.
 * It builds ./app.
 */

export default [
  {
    input: "app/src/index.tsx",
    output: {
      file: "app/dist/bundle.js",
      format: "iife",
      sourcemap: true,
    },
    plugins: [
      image(),
      resolve({
        extensions: [".js"],
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      commonjs(),
      typescript({
        tsconfig: './app/tsconfig.json',
        compilerOptions: {
          outDir: './app/dist'
        },
        include: [
          "./app/src/**/*.jsx",
          "./app/src/**/*.js",
          "./src/**/*.jsx",
          "./src/**/*.js",
          "./app/src/**/*.tsx",
          "./app/src/**/*.ts",
          "./src/**/*.tsx",
          "./src/**/*.ts"
        ],
        exclude: ["dist/**/*.d.ts"]
      }),
      postcss({
        plugins: [
          url({
            url: "inline"
          })
        ]
      }),
      serve({
        open: true,
        verbose: true,
        contentBase: ["", "app", "app/src"],
        host: "0.0.0.0",
        port: "3002",
      }),
      livereload({
        watch: "app/dist",
        // port: 12345,
        // clientUrl: 'http://<localip>:12345/livereload.js?snipver=1'
      })
    ]
  }
]

