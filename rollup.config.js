import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
import gzipPlugin from 'rollup-plugin-gzip';
import copy from 'rollup-plugin-copy'
import sass from 'node-sass'
import autoPreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript';

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
            // enable run-time checks when not in production
            dev: !production,
            // we'll extract any component CSS out into
            // a separate file — better for performance
            css: css => {
                css.write('public/build/bundle.css');
            },
            preprocess: autoPreprocess(),
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration —
        // consult the documentation for details:
        // https://github.com/rollup/rollup-plugin-commonjs
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

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
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

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}