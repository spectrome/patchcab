import { HP } from 'contstants';
import { get, writable } from 'svelte/store';
import type { Module, State, ModuleState } from '../types';

class Modules {
  private modules = writable<Module[]>([]);
  private moduleStates = writable<ModuleState[]>([]);
  private updateCallbacks: (() => void)[] = [];

  constructor(modules: Module[] = [], states: ModuleState[] = []) {
    this.modules.set(modules);
    this.moduleStates.set(states);
  }

  get store() {
    return this.modules;
  }

  get state() {
    return get(this.modules);
  }

  public add(module: Module) {
    const position = this.getEmptySpace(module.size);
    module.position = position;

    if (!module.id) {
      const id = Math.random().toString(36).substr(2, 9);
      module.id = `${module.type}-${id}`;
    }

    this.moduleStates.update(($states) => {
      return $states.concat([{ id: module.id, state: module.state, position }]);
    });

    this.modules.update(($modules) => {
      return $modules.concat([module]);
    });

    return module.id;
  }

  public update(id: string, state: State) {
    this.moduleStates.update(($states) => {
      return $states.map(($state) => ($state.id === id ? { id, state, position: $state.position } : $state));
    });
  }

  public remove(id: string) {
    this.modules.update(($modules) => {
      return $modules.filter((module) => module.id !== id);
    });

    this.moduleStates.update(($state) => {
      return $state.filter((state) => state.id !== id);
    });
  }

  public move(module: Module, x: number, y: number): boolean {
    const states = get(this.moduleStates);

    for (let i = 0; i < states.length; i++) {
      const state = states[i];

      if (state.id === module.id) {
        continue;
      }

      const target = this.state.find((item) => item.id === state.id);

      if (
        !(
          y + module.size.h * HP.h <= state.position.y ||
          y >= state.position.y + target.size.h * HP.h ||
          x + module.size.w * HP.w <= state.position.x ||
          x >= state.position.x + target.size.w * HP.w
        )
      ) {
        return false;
      }
    }

    this.moduleStates.update(($states) =>
      $states.map(($state) =>
        $state.id === module.id
          ? {
              ...$state,
              position: { x, y },
            }
          : $state
      )
    );

    return true;
  }

  public import($modules: Module[]) {
    this.moduleStates.update(() => {
      const states = $modules.map((module) => ({
        id: module.id,
        state: module.state,
        position: module.position,
      }));

      return states;
    });

    this.modules.set($modules);
  }

  public export() {
    const states = get(this.moduleStates);

    const modules = this.state.map(($module) => {
      const module = { ...$module };
      const { state, position } = states.find(($state) => $state.id === module.id);
      module.state = state;
      module.position = position;

      delete module.libs;
      delete module.size;
      delete module.type;

      return module;
    });

    return modules;
  }

  public onAfterUpdate(callback: () => void) {
    this.updateCallbacks.push(callback);
  }

  public afterUpdate() {
    this.updateCallbacks.forEach((callback) => callback());
  }

  private getEmptySpace(size: { w: number; h: number }): { x: number; y: number } {
    const moduleList = this.state;
    let x = 0;
    let y = 0;
    let empty = moduleList.length === 0;

    const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop;

    while (!empty) {
      let hit = false;
      for (let i = 0; i < moduleList.length; i++) {
        const targetBox = document.getElementById(moduleList[i].id).getBoundingClientRect();
        if (
          !(
            y + HP.h * size.h - 48 <= targetBox.y + scrollY ||
            y >= targetBox.bottom - 48 + scrollY ||
            x + HP.w * size.w <= targetBox.x + scrollX ||
            x >= targetBox.right + scrollX
          )
        ) {
          hit = true;
          break;
        }
      }

      if (!hit) {
        empty = true;
      } else {
        if (x > window.innerWidth) {
          y += 380;
          x = 0;
        } else {
          x += 16;
        }
      }
    }

    return { x, y };
  }

  public reset() {
    this.modules.set([]);
    this.moduleStates.set([]);
  }
}

const modules = new Modules();

export default modules;
