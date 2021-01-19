import type { Library } from './types';

const parseLibs = (itemName: string, input: (string | Library)[], library: Record<string, Library>): string[] => {
  const output: string[] = [];

  if (input?.length === 0) {
    return output;
  }

  input.forEach((item) => {
    let lib: Library;

    if (typeof item === 'object') {
      if (item.cdn && item.alias) {
        lib = item;
      } else {
        throw Error(`Incorrect lib entry for module ${itemName}`);
      }
    } else if (library[item]) {
      lib = library[item];
    } else {
      throw Error(`Incorrect lib entry for module ${itemName}`);
    }

    library[lib.alias] = lib;
    output.push(lib.cdn);
  });

  return output;
};

export default parseLibs;
