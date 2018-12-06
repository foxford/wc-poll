/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'
import nodeResolve from 'rollup-plugin-node-resolve'

import { shouldUglify, copyPublicModules } from './rollup/util'
import { directories } from './package.json'

const polyfill = () => ({
  input: `${directories.lib}/polyfill.js`,
  output: {
    format: 'iife',
  },
  plugins: [
    babel(),
    copy(copyPublicModules([
      'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js.map',
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
      'node_modules/@webcomponents/webcomponentsjs/bundles',
      'node_modules/core-js/client',
    ])),
    nodeResolve(),
    shouldUglify(),
  ],
})

export default polyfill()
