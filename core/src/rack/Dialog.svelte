<script lang="ts">
  import { useClickOutside } from '../actions';
  import type { OnClickOutside } from '../actions';
  import { isShortcut } from '../helpers';

  export let visible: boolean;

  const hideDialog: OnClickOutside = (event: MouseEvent) => {
    visible = false;
  };

  const onKey = (e: KeyboardEvent) => {
    if (isShortcut(e) && visible && e.key === 'Escape') {
      e.preventDefault();
      visible = false;
    }
  };
</script>

<style>
  .dialog {
    display: none;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.65);
  }

  .dialog.visible {
    display: flex;
  }

  .dialog > div {
    background: var(--color-ui-bg);
    padding: 24px 18px 18px;
  }
</style>

<svelte:body on:keydown={onKey} />
<div class="dialog" class:visible>
  <div use:useClickOutside={hideDialog}>
    <slot />
  </div>
</div>
