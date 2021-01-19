#!/usr/bin/env node

import { copyFileSync, existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { extname, resolve } from 'path';
import * as rimraf from 'rimraf';
import { rollup, watch } from 'rollup';
import parseAuthor from 'parse-author';
import copyFiles from './lib/copyFiles';
import parseLibs from './lib/parseLibs';
import rollupConfig from './lib/rollupConfig';
import defaultLibs from './libs.json';
import { minify } from 'html-minifier-terser';
import screenshot from './lib/screenshot';
import { safeName } from './lib/helpers';
import dotenv from 'dotenv';
import type { Module, Library } from './lib/types';

dotenv.config();

const BUILD = process.argv.indexOf('--build') > -1;
const DIR = process.cwd();
const CONFIG = JSON.parse(readFileSync(resolve(DIR, 'package.json'), 'utf8'));

if (!CONFIG) {
  throw Error('No package.json file found');
}

const PATH_BUILD = resolve(DIR, './modules');
const PATH_PUBLIC = resolve(DIR, './public');
const PATH_MODULES = resolve(DIR, `./public/modules/${CONFIG.name.replace(/\//g, '-')}`);

const bin = async (): Promise<void> => {
  const libs: Record<string, Library> = defaultLibs;

  // Remove build outputs
  rimraf.sync(PATH_BUILD);
  rimraf.sync(PATH_PUBLIC);

  // Copy public asset files
  await copyFiles(resolve(__dirname, '../public'), PATH_PUBLIC);

  // Update index file
  let indexFile: string = readFileSync(resolve(PATH_PUBLIC, `index.html`), 'utf8');

  // Add optional head content
  if (process.env.PATCHCAB_HEAD) {
    indexFile = indexFile.replace(`</head>`, `${process.env.PATCHCAB_HEAD}</head>`);
  }

  // Add optional body content
  if (process.env.PATCHCAB_BODY) {
    indexFile = indexFile.replace(`</body>`, `${process.env.PATCHCAB_BODY}</body>`);
  }

  // Update props
  const props: Record<string, string> = {};

  if (process.env.PATCHCAB_API) {
    props['api'] = process.env.PATCHCAB_API;
  }

  // Check for default rack prop
  const rackIndex = process.argv.indexOf('--rack');
  const fileName = rackIndex > -1 ? resolve(DIR, process.argv[rackIndex + 1]) : '';
  if (existsSync(fileName)) {
    const rackContent = readFileSync(fileName, 'utf-8');
    props['rack'] = JSON.parse(rackContent);
  }

  indexFile = minify(indexFile.replace('props: {}', `props: ${JSON.stringify(props)}`), {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
  });

  writeFileSync(resolve(PATH_PUBLIC, `index.html`), indexFile);

  // Create empty public modules directory
  mkdirSync(PATH_MODULES, { recursive: true });

  // Look for patchcab modules in project dependencies and copy those to public modules directory
  let dependencies = CONFIG.dependencies ? Object.keys(CONFIG.dependencies) : [];

  if (CONFIG.devDependencies) {
    dependencies = dependencies.concat(Object.keys(CONFIG.devDependencies));
  }

  const depModules: Module[] = [];

  dependencies.forEach((dependency) => {
    try {
      const dependencyDir = resolve(DIR, `./node_modules/${dependency}`);
      const dependencyConfig =
        existsSync(resolve(dependencyDir, `./package.json`)) &&
        JSON.parse(readFileSync(resolve(dependencyDir, `./package.json`), 'utf8'));

      if (!dependencyConfig || !dependencyConfig.patchcab) {
        return;
      }

      dependencyConfig.patchcab.forEach((item) => {
        if (
          typeof item === 'object' &&
          item.name &&
          existsSync(resolve(dependencyDir, `./modules/${safeName(item.name)}.js`))
        ) {
          const setName = dependencyConfig.name.replace(/\//g, '-');

          const author =
            typeof dependencyConfig.author === 'string'
              ? parseAuthor(dependencyConfig.author)
              : dependencyConfig.author || {};

          depModules.push({
            set: setName,
            name: item.name,
            tags: item.tags,
            size: item.size,
            author,
            libs: parseLibs(item.name, item.libs, libs),
          });

          const targetDir = resolve(DIR, `./public/modules/${setName}/`);

          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
          }

          copyFileSync(
            resolve(dependencyDir, `./modules/${safeName(item.name)}.js`),
            resolve(targetDir, `${safeName(item.name)}.js`)
          );
          copyFileSync(
            resolve(dependencyDir, `./modules/${safeName(item.name)}.png`),
            resolve(targetDir, `${safeName(item.name)}.png`)
          );
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  });

  const ownModules: Module[] = [];
  const input: Record<string, string> = {};

  if (CONFIG.patchcab) {
    CONFIG.patchcab.forEach((item) => {
      const modulePath = resolve(DIR, `./src/${item.file}`);
      input[safeName(item.name)] = extname(modulePath) !== '.svelte' ? `${modulePath}.svelte` : modulePath;

      const author = typeof CONFIG.author === 'string' ? parseAuthor(CONFIG.author) : CONFIG.author || {};

      ownModules.push({
        set: CONFIG.name.replace(/\//g, '-'),
        name: item.name,
        tags: item.tags,
        size: item.size,
        author,
        libs: parseLibs(item.name, item.libs, libs),
      });
    });
  }

  const config = {
    ...rollupConfig(input, libs, PATH_BUILD),
  };

  // Write modules files to public directory
  writeFileSync(resolve(PATH_PUBLIC, 'modules.json'), JSON.stringify([...depModules, ...ownModules]));

  if (CONFIG.patchcab && CONFIG.patchcab.length) {
    console.log('Building Patchcab...');

    const bundle = await rollup(config);
    await bundle.write(config.output);

    console.log('Taking screenshots...');

    await copyFiles(PATH_BUILD, PATH_MODULES);
    await screenshot(ownModules, PATH_BUILD, PATH_PUBLIC);
  }

  if (BUILD) {
    console.log('Patchcab built 🎉');
    process.exit();
  } else {
    console.log('Patchcab running at http://localhost:3000 🚀');
    if (CONFIG.patchcab && CONFIG.patchcab.length) {
      const watcher = watch(config);
      let first = true;
      watcher.on('event', async (event) => {
        switch (event.code) {
          case 'START':
            if (!first) {
              console.log('Rebuilding Patchcab...');
            }
            break;
          case 'END':
            await copyFiles(PATH_BUILD, PATH_MODULES);
            if (!first) {
              console.log('Done!');
            }
            first = false;
            break;
          case 'ERROR':
            console.error(event.error);
            break;
        }
      });
    } else {
      console.log('Patchcab running at http://localhost:3000');
    }
  }
};

bin();
