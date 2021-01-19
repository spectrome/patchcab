import puppeteer from 'puppeteer';
import rollupServe from 'rollup-plugin-serve';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import path from 'path';
import fs from 'fs';
import { safeName } from './helpers';
import type { Module } from './types';

const HP = {
  w: 16,
  h: 380,
};

const PORT = 3000;

const screenshot = async (modules: Module[], PATH_BUILD: string, PATH_PUBLIC: string): Promise<boolean> => {
  rollupServe({
    contentBase: PATH_PUBLIC,
    port: PORT,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const template = fs
    .readFileSync(path.resolve(__dirname, '../../public/index.html'), 'utf8')
    .replace(
      /<script[^>]*>[^`]+?<\/script>/g,
      `<script type="module">import { Container } from 'http://localhost:${PORT}/js/core.js'

	const container = new Container({
	  target: document.body,
	  props: {
		module: {
		  type: 'MODULE_NAME',
		  size: { w: MODULE_SIZE_W, h: MODULE_SIZE_H },
		  state: undefined,
		  position: { x: 0, y: 0 },
		  patches: [],
		  libs: MODULE_LIBS,
		},
	  },
	})
</script>`
    )
    .replace(/href="\//g, `href="http://localhost:${PORT}/`);

  const page = await browser.newPage();

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    const fileName = safeName(module.name);

    const html = template
      .replace('MODULE_NAME', `${module.set}/${safeName(module.name)}`)
      .replace('MODULE_SIZE_W', `${module.size.w}`)
      .replace('MODULE_SIZE_H', `${module.size.h}`)
      .replace('MODULE_LIBS', JSON.stringify(module.libs));

    await page.setViewport({
      width: module.size.w * HP.w,
      height: module.size.h * HP.h + 48,
      deviceScaleFactor: 2,
    });

    await page.setContent(html);

    await page.screenshot({
      path: path.resolve(PATH_BUILD, `${fileName}.png`),
      clip: {
        x: 0,
        y: 48,
        width: module.size.w * HP.w,
        height: module.size.h * HP.h,
      },
    });

    await imagemin([PATH_BUILD, `${fileName}.png`], {
      destination: PATH_BUILD,
      plugins: [imageminPngquant()],
    });

    fs.copyFileSync(
      path.resolve(PATH_BUILD, `${fileName}.png`),
      path.resolve(PATH_PUBLIC, `modules/${module.set}/${fileName}.png`)
    );
  }

  await browser.close();
  return true;
};

export default screenshot;
