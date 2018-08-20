import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'
import nodeResolve from 'rollup-plugin-node-resolve'

const copyPublicModules = (entries = []) => entries.reduce((acc, it) => {
  acc[it] = `public/${it}`

  return acc
}, {})

const shouldUglify = () => process.env.NODE_ENV === 'production' ? [uglify()] : []

const polyfill = () => ({
  input: 'lib/polyfill.js',
  output: {
    file: 'dist/polyfill.js',
    format: 'iife',
  },
  plugins: [
    babel(),
    copy(copyPublicModules([
      'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js.map',
      'node_modules/core-js/client',
    ])),
    copy({ 'lib/fonts': 'fonts' }),
    nodeResolve(),
    shouldUglify(),
  ],
})

export default [polyfill()]
