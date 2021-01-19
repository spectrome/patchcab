import modules from './modules';
import patches from './patches';
import type { Rack, Library } from '../types';
import { safeName } from '../helpers';

const stateImport = (state: Rack, library: Library): void => {
  const $modules = state.modules
    .map((module) => {
      if (!module.type) {
        module.type = module.id.substr(0, module.id.lastIndexOf('-'));
      }

      const $moduleLib = library.find(({ set, name }) => `${set}/${safeName(name)}` === module.type);

      if (!$moduleLib) {
        return undefined;
      } else {
        module.size = $moduleLib.size;
        module.libs = $moduleLib.libs;
      }

      return module;
    })
    .filter(Boolean);

  const $patches = state.patches
    .map(($patch) => {
      const exists =
        $modules.findIndex((item) => {
          return $patch.input.indexOf(`${item.id}://`) === 0 || $patch.output.indexOf(`${item.id}://`) === 0;
        }) > -1;

      return exists ? $patch : undefined;
    })
    .filter(Boolean);

  modules.import($modules);
  patches.import($patches);
};

const stateExport = (title: string): Rack => {
  const $patches = patches.export();
  const $modules = modules.export();

  return { title, modules: $modules, patches: $patches };
};

const stateReset = (): void => {
  patches.reset();
  modules.reset();
};

export { stateExport, stateImport, stateReset };
