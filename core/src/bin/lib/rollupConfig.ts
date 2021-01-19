import { nodeResolve } from '@rollup/plugin-node-resolve';
import autoPreprocess from 'svelte-preprocess';
import common from '@rollup/plugin-commonjs';
import externalGlobals from 'rollup-plugin-external-globals';
import typescript from 'rollup-plugin-typescript2';
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';
import glslify from 'rollup-plugin-glslify';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import path from 'path';
import fs from 'fs';
import type { Library } from './types';

const DEV = process.argv.indexOf('--build') < 0;

const searchRecursive = (dir: string, pattern: string): boolean => {
  if (!fs.existsSync(dir)) {
    return false;
  }

  let results: boolean[] = [];

  fs.readdirSync(dir).forEach((dirInner) => {
    dirInner = path.resolve(dir, dirInner);
    const stat = fs.statSync(dirInner);
    if (stat.isDirectory()) {
      results = results.concat(searchRecursive(dirInner, pattern));
    }
    if (stat.isFile() && dirInner.endsWith(pattern)) {
      results.push(true);
    }
  });

  return results.length > 0;
};

const config = (input: Record<string, string>, libs: Record<string, Library>, dir: string): Record<string, unknown> => {
  const TS = searchRecursive(path.resolve(process.cwd(), 'src'), '.ts');

  const externals = Object.keys(libs);
  const globals: Record<string, string> = {};

  externals.forEach((item) => {
    globals[item] = libs[item].alias;
  });

  return {
    input,
    external: ['@patchcab/core', 'svelte/internal'].concat(externals),
    output: {
      name: 'patchcab',
      format: 'es',
      dir,
      paths: {
        '@patchcab/core': '/js/core.js',
      },
    },
    plugins: [
      common(),
      nodeResolve({
        extensions: ['.ts', '.js', '.json', '.svelte', '.mjs', '.vert', '.frag'],
      }),
      glslify(),
      TS &&
        typescript({
          tsconfigOverride: {
            sourceMap: false,
            compilerOptions: {
              noImplicitAny: true,
              lib: ['es6', 'dom', 'es2015'],
              module: 'es2015',
              target: 'es5',
              moduleResolution: 'node',
              esModuleInterop: true,
              declaration: false,
              declarationMap: false,
              outDir: dir,
            },
            include: [path.resolve(process.cwd(), 'src')],
          },
        }),
      svelte({
        emitCss: false,
        preprocess: autoPreprocess(),
      }),
      externalGlobals({
        'svelte/internal': '__sv',
        ...globals,
      }),
      DEV &&
        serve({
          open: false,
          contentBase: path.resolve(process.cwd(), './public'),
          port: 3000,
          historyApiFallback: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }),
      DEV && livereload(),
      !DEV && terser(),
    ],
  };
};

export default config;
