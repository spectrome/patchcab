import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import livereload from 'rollup-plugin-livereload';
import autoPreprocess from 'svelte-preprocess';
import { terser } from 'rollup-plugin-terser';
import common from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import serve from 'rollup-plugin-serve';
import path from 'path';

const DIR = path.resolve(process.cwd(), 'public/js');
const DEV = process.env.ROLLUP_WATCH;

module.exports = () => {
  return {
    input: {
      core: path.resolve(__dirname, './src/index.ts'),
    },
    external: ['@patchcab/core'],
    output: {
      name: 'patchcab',
      format: 'es',
      dir: DIR,
      paths: {
        '@patchcab/core': '/js/core.js',
      },
    },
    plugins: [
      common(),
      nodeResolve({
        extensions: ['.ts', '.js', '.json', '.svelte', '.mjs'],
      }),
      svelte({
        emitCss: false,
        preprocess: autoPreprocess(),
      }),
      typescript(),
      DEV &&
        serve({
          open: true,
          contentBase: path.resolve(DIR, '../'),
          historyApiFallback: true,
          port: '3000',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }),
      DEV && livereload(),
      !DEV && terser(),
    ],
  };
};
