import { get, writable } from 'svelte/store';
import { randomColor } from '../helpers';
import type { Patch } from '../types';

class Patches {
  private patches = writable<Patch[]>([]);

  get store() {
    return this.patches;
  }

  get state() {
    return get(this.patches);
  }

  public add(patch: Patch) {
    patch.color = randomColor();

    this.patches.update(($patches) => {
      return [...$patches, patch];
    });
  }

  public remove(output: string, input?: string) {
    this.patches.update(($patches) => {
      return $patches.filter(($patch) => {
        if (!input) {
          return $patch.input?.indexOf(output) !== 0 && $patch.output?.indexOf(output) !== 0;
        }
        return !($patch.input === input && $patch.output === output);
      });
    });
  }

  public update(output: string, input: string, update: Partial<Patch>) {
    this.patches.update(($patches) => {
      return $patches.map(($patch) =>
        $patch.input === input && $patch.output === output
          ? {
              ...$patch,
              ...update,
            }
          : $patch
      );
    });
  }

  public import($patches: Patch[]) {
    const state = this.state;

    this.patches.set(
      $patches.map(($patch) => {
        const $exists = state.find((item) => item.input === $patch.input && item.output === $patch.output);

        if ($exists) {
          return $exists;
        }

        if (!$patch.color) {
          $patch.color = randomColor();
        }
        return $patch;
      })
    );
  }

  public export() {
    const patches = this.state.map((patch: Patch) => {
      const $patch = { ...patch };
      delete $patch.node;
      delete $patch.selected;
      delete $patch.color;
      return $patch;
    });

    return patches;
  }

  public reset() {
    this.patches.set([]);
  }
}

const patches = new Patches();

export default patches;
