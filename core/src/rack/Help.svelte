<script lang="ts">
  import { isShortcut } from '../helpers';
  import type { View } from '../types';

  export let view: View;

  $: visible = view === 'help';

  $: {
    if (visible) {
      document.body.classList.add('overlay');
    } else {
      document.body.classList.remove('overlay');
    }
  }

  const onKey = (e: KeyboardEvent) => {
    if (isShortcut(e) && visible && e.key === 'Escape') {
      e.preventDefault();
      view = 'rack';
    }
  };
</script>

<style>
  main {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: var(--color-ui-bg);
    z-index: var(--zindex-modal);
  }

  button.close {
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
  }

  ul {
    width: 100%;
    max-width: 420px;
  }

  li {
    display: flex;
    justify-content: space-between;
    list-style: none;
    font-size: 13px;
    font-weight: 300;
    margin: 0 12px;
    padding: 12px;
  }

  hr {
    border-bottom: dashed 1px var(--color-dark-highlight);
    margin: 0 6px;
    flex: 1;
  }

  li:hover hr {
    border-color: var(--color-light-shadow);
  }
</style>

<svelte:body on:keydown={onKey} />
{#if visible}
  <main>
    <button aria-label="Close" class="close" on:click={() => (view = 'rack')}>
      <svg width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.793 8.5L.646 15.646l.708.708L8.5 9.207l7.146 7.147.708-.707L9.207 8.5l7.147-7.146-.707-.708L8.5 7.793
                          1.354.646l-.708.708L7.793 8.5z"
          fill="#C4C4C4"
        />
      </svg>
    </button>
    <ul>
      <li>
        Open/Close module library
        <hr />
        <strong>SPACE</strong>
      </li>
      <li>
        Remove a module (click it first)
        <hr />
        <strong>BACKSPACE</strong>
      </li>
      <li>
        Connect more than one patch cable
        <hr />
        <strong>SHIFT+CLICK</strong>
      </li>
      <li>
        Duplicate a module
        <hr />
        <strong>RIGHT CLICK</strong>
      </li>
      <li>
        Mute/Unmute all outputs
        <hr />
        <strong>ENTER</strong>
      </li>
      <li>
        Open synth from a file
        <hr />
        <strong>CTRL + O</strong>
      </li>
      <li>
        Save synth to a file
        <hr />
        <strong>CTRL + S</strong>
      </li>
    </ul>
  </main>
{/if}
