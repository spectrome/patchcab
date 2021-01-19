<script lang="ts">
  import { useClickOutside } from '../actions';
  import type { OnClickOutside } from '../actions';

  export let toggle: HTMLElement;
  export let center: boolean;
  export let visible = false;

  const hideMenu: OnClickOutside = (event: MouseEvent) => {
    if (event.target !== toggle) {
      visible = false;
    } else {
      visible = !visible;
    }
  };
</script>

<style>
  ul.menu {
    display: none;
    position: absolute;
    background: var(--color-ui-bg);
    white-space: nowrap;
    left: 8px;
    top: 56px;
  }

  ul.menu.center {
    left: 50%;
    transform: translate(-50%, 0);
  }

  ul.menu:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 8px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 6px 6px 6px;
    border-color: transparent transparent var(--color-ui-bg) transparent;
  }

  ul.menu.center:before {
    left: 50%;
    transform: translate(-6px, 0);
  }

  ul.menu.visible {
    display: block;
  }

  :global(ul.menu button, ul.menu a, ul.menu input, ul.menu label) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    min-width: 200px;
    text-align: left;
    text-decoration: none;
  }

  :global(ul.menu form) {
    background: var(--color-ui-bg);
    padding: 8px;
  }

  :global(ul.menu form button) {
    padding: 8px 0;
    background: var(--color-ui-hover);
    justify-content: center;
  }

  :global(ul.menu form button:hover) {
    background: var(--color-ui-bg-secondary);
  }

  :global(ul.menu input) {
    padding: 8px;
    background: var(--color-ui-bg);
    border: 1px solid var(--color-ui-bg-secondary);
    margin-bottom: 4px;
  }

  :global(ul.menu button span, ul.menu a span) {
    display: inline-flex;
    align-items: center;
  }

  :global(ul.menu button:hover, ul.menu a:hover) {
    background: var(--color-ui-hover);
  }

  :global(ul.menu button:disabled) {
    pointer-events: none;
    opacity: 0.35;
  }

  :global(ul.menu button strong) {
    opacity: 0.75;
  }

  :global(ul.menu svg) {
    margin-right: 4px;
  }

  :global(ul.menu button.divider) {
    border-bottom: 1px solid var(--color-ui-hover);
  }
</style>

<ul class="menu" class:visible class:center on:click={hideMenu} use:useClickOutside={hideMenu}>
  <slot />
</ul>
