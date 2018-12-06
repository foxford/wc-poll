import autoprefixer from 'autoprefixer'
import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import cssfonts from 'postcss-fontpath'
import cssimport from 'postcss-import'
import cssnano from 'cssnano'
import cssurl from 'postcss-url'
import env from 'postcss-preset-env'
import json from 'rollup-plugin-json'
import npm from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import svg from 'rollup-plugin-svg'

import { shouldUglify } from './rollup/util'
import { directories } from './package.json'
import { postcssLoader } from './rollup/loaders'

const entry = process.env.ENTRY || 'index'
const ns = process.env.NAMESPACE || 'WCPoll'

// eslint-disable-next-line multiline-ternary
const css = () => postcss({
  extract: true,
  plugins: [
    cssimport({ addModulesDirectories: ['node_modules'] }),
    cssurl({ url: 'inline' }),
    cssfonts(),
    env(),
    autoprefixer(),
  ].concat(process.env.NODE_ENV === 'production' ? cssnano() : []),
  loaders: [
    {
      name: 'postcss',
      alwaysProcess: true,
      test: /\.css/,
      process (_) {
        if (/\.s[ac]ss/.test(this.id)) {
          this.options = {
            ...this.options, modules: true,
          }
        }
        // :up is crucial important to allow transpace .css and .s[ac]ss separately

        return postcssLoader.process.call(this, _)
      },
    },
  ],
})

const dist = (name = ns) => ({
  input: `${directories.lib}/${entry}.js`,
  output: {
    exports: 'named',
    format: 'umd',
    name,
  },
  external: ['ramda'],
  plugins: [
    npm({
      browser: true,
      node: true,
    }),
    cjs(),
    css(),
    svg(),
    json(),
    babel(),
    shouldUglify(),
  ],
})

export default dist()
