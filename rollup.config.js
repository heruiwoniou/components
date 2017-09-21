import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

import vue from 'rollup-plugin-vue2'
import postcss from 'postcss'
import sass from 'rollup-plugin-sass'
import clean from 'postcss-clean'
import autoprefixer from 'autoprefixer'

import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'WebApi',
  dest: 'dist/components.js',
  sourceMap: true,
  plugins: [
    vue(),
    sass({
      output: 'dist/components.css',
      processor: css => postcss([autoprefixer({ browsers: ['last 20 version', 'not ie <= 8'] }), clean]).process(css).then(result => result.css)
    }),
    uglify(),
    nodeResolve({ jsnext: true, main: true, browser: true }),
    commonjs(
      // { exclude: ['node_modules/vue/**', 'node_modules/lodash/**', 'node_modules/d3/**'] }
    ),
    babel({
      exclude: ['node_modules/**', 'bower_components/**']
    }),
    json()
  ]
}
