import { uglify } from 'rollup-plugin-uglify'
import autoprefixer from 'autoprefixer'
import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import cssfonts from 'postcss-fontpath'
import cssimport from 'postcss-import'
import cssurl from 'postcss-url'
import env from 'postcss-preset-env'
import json from 'rollup-plugin-json'
import nodeResolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import svg from 'rollup-plugin-svg'

const entry = process.env.ENTRY || 'organisms/poll'
const ns = process.env.NS || 'WC'

const getModuleName = (it) => {
  const cmpts = it.split('/')

  return cmpts[cmpts.length === 1 ? 0 : (cmpts.length - 1)]
}

const cssPlugins = [
  cssimport({
    addModulesDirectories: ['node_modules'],
  }),
  cssurl({
    url: 'inline',
  }),
  cssfonts(),
  env(),
  autoprefixer(),
]

// eslint-disable-next-line multiline-ternary
const css = () => postcss(entry === 'embedded' ? {} : {
  extract: true,
  modules: true,
  namedExports: function namedExports (name) {
    return `_$${name.replace(/-/g, '_')}`
    // return name.replace(/-/g, '$_$');
  },
  plugins: cssPlugins,
})

const commonPlugins = [
  nodeResolve(),
  svg(),
  css(),
  json(),
  cjs(),
]

const shouldUglify = () => process.env.NODE_ENV === 'production' ? [uglify()] : []

const es = () => ({
  input: `lib/${entry}.js`,
  output: {
    file: `es/${getModuleName(entry)}.js`,
    format: 'es',
  },
  plugins: commonPlugins,
})

const dist = (name = ns) => ({
  input: `lib/${entry}.js`,
  output: {
    file: `dist/${getModuleName(entry)}.js`,
    format: 'umd',
    name,
  },
  plugins: commonPlugins.concat([babel(), shouldUglify()]),
})

export default [es(), dist()]
