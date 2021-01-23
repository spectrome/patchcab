import type { ToneAudioNode } from 'tone';
import type Bang from './nodes/Bang';
export type { default as Bang } from './nodes/Bang';

/**
 * Library
 */
export type LibraryItem = {
  set: string;
  name: string;
  tags: string[];
  size: { w: number; h: number };
  author: { name: string; url?: string };
  libs: string[];
};

export type Library = LibraryItem[];

/**
 * Modules
 */
export type Module = {
  id?: string;
  type: string;
  position?: {
    x: number;
    y: number;
  };
  size: {
    w: number;
    h: number;
  };
  libs: string[];
  state?: State;
};

export type State = {
  [key: string]: number | string | Array<number | string>;
};

export type ModuleState = {
  id?: string;
  state: State;
  position: {
    x: number;
    y: number;
  };
};
/**
 * Patch
 */
export type PatchInput = Bang | ToneAudioNode;
export type PatchOutput = Bang | ToneAudioNode;

export type Patch = {
  input: string;
  output: string;
  node: PatchInput;
  color?: string;
  selected?: string;
};

/**
 * Action
 */
interface ActionResult<P> {
  update?: (parameters?: P) => void;
  destroy?: () => void;
}

export type Action<P> = (node: Element, parameters?: P) => ActionResult<P>;

/**
 * State
 */

export type Rack = {
  title?: string;
  modules: Module[];
  patches: Patch[];
};

/**
 * App view
 */

export type View = 'shelf' | 'rack' | 'help';

/**
 * Connection
 */

export type Connection = {
  id: string;
  node: PatchInput | PatchOutput;
};

/**
 * User
 */

export type User = {
  username: string;
};
