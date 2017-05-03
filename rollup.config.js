import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from'rollup-plugin-commonjs';

import vue from 'rollup-plugin-vue2';
import sass from 'rollup-plugin-sass';

import uglify from 'rollup-plugin-uglify';

export default {
    entry : 'src/index.js',
    format : 'umd',
    moduleName : 'WebApi',
    dest : 'dist/components.js',
    sourceMap: true,
    plugins : [
        vue(),
        sass({
            output:'dist/components.css'
        }),
        //uglify(),
        nodeResolve({jsnext: true, main: true, browser: true}),
        commonjs(
            // { exclude: ['node_modules/vue/**'] }
        ),
        babel({
            exclude: ['node_modules/**', 'bower_components/**']
        }),
        json()
    ]
};