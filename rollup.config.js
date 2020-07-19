import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
import gzipPlugin from 'rollup-plugin-gzip';
import copy from 'rollup-plugin-copy'
import sass from 'node-sass';
import autoPreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.ts',
    output: {
        sourcemap: !production,
        format: 'iife',
        name: 'app',
        file: 'public/build/bundle.js'
    },
    plugins: [
        svelte({
            dev: !production,
            css: css => {
                css.write('public/build/bundle.css');
            },
            preprocess: autoPreprocess(),
        }),

        resolve({
            browser: true,
            dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
        }),

        replace({
            isDev: !production,
        }),

        commonjs(),

        typescript({
            typescript: require("typescript"),
            sourceMap: !production
        }),

        gzipPlugin({
            // additionalFiles: ['public/favicon.ico'],
        }),

        postcss({
            // extract: true,
            minimize: true,
            preprocessor: (content, id) => new Promise((resolve, reject) => {
                const result = sass.renderSync({ file: id })
                resolve({ code: result.css.toString() })
            }),
            // use: [
            //     [
            //         'node-sass', 
            //         {
            //             includePaths: [
            //                 './theme',
            //                 './node_modules'
            //             ]
            //         }
            //     ]
            // ]
        }),

        !production && serve({
            contentBase: 'public',
            port: 5000,
            historyApiFallback: true,
        }),

        !production && livereload('public'),

        production && terser(),
        
        production && copy({
        	targets: [
        		{ src: 'public/build/bundle.js.gz', dest: '../data' },
        	]
        }),
    ],
    watch: {
        clearScreen: false
    }
};