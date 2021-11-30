import path from 'path';
import fs from 'fs';
import ts from 'typescript';
import { svelte2tsx } from 'svelte2tsx';

function getConfig() {
  const fileName = path.join(__dirname, './types.tsconfig.json');
  const host: ts.ParseConfigFileHost = ts.sys as any;
  const config = ts.getParsedCommandLineOfConfigFile(fileName, ts.getDefaultCompilerOptions(), host);
  if (config === undefined) {
    throw new Error(`Failed to parse typescript configuration ${fileName}`);
  }
  return config;
}

function createCompilerHost(options: ts.CompilerOptions) {
  const host = ts.createCompilerHost(options);
  options.emitDeclarationOnly = true;

  const originalFileExists = host.fileExists;
  host.fileExists = (fileName) => {
    if (fileName.endsWith('.svelte.tsx')) {
      return true;
    }
    return originalFileExists(fileName);
  };

  const originalReadFile = host.readFile;
  host.readFile = (fileName) => {
    if (fileName.endsWith('.svelte.tsx')) {
      const { dir, name } = path.parse(fileName);
      const svelteFileName = path.join(dir, name);
      const svelteCode = fs.readFileSync(svelteFileName, 'utf-8');
      const tsx = svelte2tsx(svelteCode, {
        filename: svelteFileName,
        isTsFile: true,
      });
      return postprocessTSX(tsx.code);
    }
    return originalReadFile(fileName);
  };

  const exportedTypes: { [key: string]: string[] } = {};
  const originalWriteFile = host.writeFile;
  host.writeFile = (fileName, data, writeByteOrderMark) => {
    if (path.basename(fileName) === 'index.d.ts') {
      //data = postprocessIndexDTS(fileName, data, exportedTypes);
    } else if (fileName.endsWith('.d.ts')) {
      exportedTypes[fileName] = extractExportedTypesFromDTS(data);
    }
    if (fileName.endsWith('svelte.d.ts')) {
      data = `/// <reference types="../../config/svelte.shim" />\n${data}`;
    }
    originalWriteFile(fileName, data, writeByteOrderMark);
    console.log(path.relative(process.cwd(), fileName));
  };

  return host;
}

function postprocessTSX(code: string) {
  const COMPONENT_SUFFIX = '__SvelteComponent_';
  const regex = new RegExp(
    `export default class (?<componentName>.+)${COMPONENT_SUFFIX}` +
      ` extends createSvelte2TsxComponent\\((?<propDef>.+)\\)`
  );
  const match = code.match(regex);
  if (match && match.groups) {
    const { componentName, propDef } = match.groups;
    const oldComponentExport = match[0];
    const newComponentExport =
      `export default class ${componentName} extends SvelteComponentTyped` +
      `<${componentName}Props, ${componentName}Events, ${componentName}Slots>`;
    return (
      `import { SvelteComponentTyped } from 'svelte';` +
      code.replace(oldComponentExport, newComponentExport) +
      `const propDef = ${propDef}();` +
      `export type ${componentName}Props = typeof propDef.props;` +
      `export type ${componentName}Events = typeof propDef.events;` +
      `export type ${componentName}Slots = typeof propDef.slots;`
    );
  }
  return code;
}

function extractExportedTypesFromDTS(code: string) {
  const regex = /export declare type (?<typeName>\S+)/g;
  const exports: string[] = [];
  let match;
  while ((match = regex.exec(code))) {
    if (match.groups) {
      exports.push(match.groups.typeName);
    }
  }
  return exports;
}

function postprocessIndexDTS(fileName: string, code: string, typesOfImports: { [key: string]: string[] }) {
  const injectExports = (exportStatement: string, exportedTypes: string[]) => {
    if (exportedTypes.length === 0) {
      return exportStatement;
    }
    const curlyExportRegex = /{\s*(?<exports>.+)\s*}/g;
    const match = curlyExportRegex.exec(exportStatement);
    if (match && match.groups) {
      // case: `export { foo as Bar }`
      exportedTypes.unshift(match.groups.exports.trim());
    } else {
      // case: `export Foo`
      exportedTypes.unshift(`default as ${exportStatement}`);
    }
    return `{ ${exportedTypes.join(', ')} }`;
  };

  const exportFileRegex = /export (?<exportStatement>.+) from ["'](?<exportFile>[^"']+)/g;
  let match;
  while ((match = exportFileRegex.exec(code))) {
    if (match.groups) {
      const { exportStatement, exportFile } = match.groups;
      const absoluteExportFile = path.resolve(path.dirname(fileName), `${exportFile}.d.ts`);
      const injectTypes = typesOfImports[absoluteExportFile] || [];
      const injectedExportStatement = injectExports(exportStatement, injectTypes);
      const injected = match[0].replace(exportStatement, injectedExportStatement);
      code = code.replace(match[0], injected);
    }
  }

  return code;
}

function compile() {
  console.log(`generating types...`);

  const { options: compilerOptions, fileNames } = getConfig();
  const shims = require.resolve('svelte2tsx/svelte-shims.d.ts');
  fileNames.push(shims);
  const host = createCompilerHost(compilerOptions);
  const program = ts.createProgram(fileNames, compilerOptions, host);
  program.emit();
}

compile();
