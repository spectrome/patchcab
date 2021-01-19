import * as svelte from 'svelte/internal';
import Patchcab from './Patchcab.svelte';

declare global {
  interface Window {
    __sv: typeof svelte;
  }
}

window['__sv'] = svelte;

export * from './lib';
export * from './components';
export { Container } from './rack';

export default Patchcab;
