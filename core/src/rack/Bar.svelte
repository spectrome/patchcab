<script lang="ts">
  import { saveAs } from 'file-saver';
  import fileDialog from 'file-dialog';
  import Menu from './Menu.svelte';
  import Share from './Share.svelte';
  import { isShortcut } from '../helpers';
  import { stateExport, stateImport, stateReset } from '../state/helpers';
  import type { Library, Rack, View } from '../types';

  export let view: View;
  export let library: Library;
  export let api: string;
  export let title: string;

  let menuMainToggle: HTMLElement;

  const onAddModule = () => {
    view = 'shelf';
  };

  const onShortcuts = () => {
    view = 'help';
  };

  const onExport = () => {
    const $rack = stateExport(title);
    const blob = new Blob([JSON.stringify($rack) as BlobPart], {
      type: 'application/json;charset=utf-8',
    });

    saveAs(blob, 'patch.json');
  };

  const onReset = () => {
    stateReset();
  };

  const onImport = () => {
    fileDialog().then((files) => {
      try {
        if (!files || files.length < 1) {
          return;
        }
        const reader = new FileReader();

        reader.onload = (e) => {
          if (typeof e.target.result !== 'string') {
            return;
          }
          const $rack: Rack = JSON.parse(e.target.result);

          stateImport($rack, library);
        };

        reader.readAsText(files[0]);
      } catch (err) {
        console.log(err);
      }
    });
  };

  const onKey = (e: KeyboardEvent) => {
    if (isShortcut(e) && e.ctrlKey) {
      if (e.key === 'n') {
        e.preventDefault();
        stateReset();
      }

      if (e.key === 's') {
        e.preventDefault();
        onExport();
      }

      if (e.key === 'o') {
        e.preventDefault();
        onImport();
      }
    }
  };
</script>

<style>
  header {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 48px;
    background: var(--color-ui-bg);
    color: var(--color-ui-fg);
    z-index: var(--zindex-bar);
    text-align: center;
    font-size: 12px;
  }

  nav {
    position: absolute;
    top: 0px;
    left: 0px;
  }

  nav > button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 48px;
  }

  nav button svg {
    pointer-events: none;
  }
</style>

<svelte:body on:keydown={onKey} />
<header>
  <nav>
    <button aria-label="Toggle menu" bind:this={menuMainToggle}>
      <svg width="16" height="13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h16v1H0V0zM0 6h16v1H0V6zM16 12H0v1h16v-1z" fill="#C4C4C4" />
      </svg>
    </button>
    <Menu bind:toggle={menuMainToggle}>
      <button on:click={onReset}>New <strong>CTRL+N</strong></button>
      <hr />
      <button on:click={onAddModule}>Add module <strong>SPACE</strong></button>
      <hr />
      <button on:click={onExport}>Save to file <strong>CTRL+S</strong></button>
      <button on:click={onImport}>Load from file <strong>CTRL+O</strong></button>
      <hr />
      <button on:click={onShortcuts}>Help</button>
      <a href="https://github.com/spectrome/patchcab" target="_blank" rel="noreferrer"
        ><span
          ><svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 32 32"
            ><path
              fill="currentColor"
              d="M16 2a14 14 0 00-4.43 27.28c.7.13 1-.3 1-.67v-2.38c-3.89.84-4.71-1.88-4.71-1.88a3.71 3.71 0 00-1.62-2.05c-1.27-.86.1-.85.1-.85a2.94 2.94 0 012.14 1.45 3 3 0 004.08 1.16 2.93 2.93 0 01.88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4 5.4 0 011.44-3.76 5 5 0 01.14-3.7s1.17-.38 3.85 1.43a13.3 13.3 0 017 0c2.67-1.81 3.84-1.43 3.84-1.43a5 5 0 01.14 3.7 5.4 5.4 0 011.44 3.76c0 5.38-3.27 6.56-6.39 6.91a3.33 3.33 0 01.95 2.59v3.84c0 .46.25.81 1 .67A14 14 0 0016 2z"
            /></svg
          >
          GitHub</span
        ></a
      >
    </Menu>
  </nav>
  <div>
    {#if api}
      <Share {api} bind:title />
    {/if}
  </div>
  <div />
</header>
