<script lang="ts">
  import { afterUpdate, setContext, onMount } from 'svelte';
  import Menu from './Menu.svelte';
  import Loading from './Loading.svelte';
  import modules from '../state/modules';
  import patches from '../state/patches';
  import libraries from '../state/libraries';
  import { useClickOutside, useDrag } from '../actions';
  import type { OnDrag } from '../actions';
  import { BAR_HEIGHT, HP } from '../contstants';
  import { isShortcut } from '../helpers';
  import type { Module } from '../types';

  export let module: Module;

  let state = module.state;
  let position = module.position;
  let contextVisible = false;
  let contextPosition = {
    x: 0,
    y: 0,
  };

  $: modules.update(module.id, state);

  setContext('module', {
    id: module.id,
  });

  let Component: () => void;
  let container: HTMLDivElement;
  let active = false;

  const getModule = async (moduleType: string) => {
    try {
      const { default: Comp } = await import(`/modules/${moduleType}.js`);
      Component = Comp;
    } catch (err) {
      console.log('Failed loading module', err);
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (isShortcut(e) && active && e.key === 'Backspace') {
      modules.remove(module.id);
      patches.remove(module.id);
    }
  };

  const onMenu = (e: MouseEvent) => {
    e.preventDefault();

    const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop;

    contextPosition = {
      x: e.clientX + scrollX - 20,
      y: e.clientY + scrollY - BAR_HEIGHT,
    };

    contextVisible = true;
  };

  const onContextRemove = () => {
    modules.remove(module.id);
    patches.remove(module.id);
  };

  const onContextDuplicate = () => {
    modules.add({
      type: module.type,
      size: module.size,
      libs: module.libs,
      state: undefined,
    });
  };

  const onMouseDown = (e: MouseEvent) => {
    if (e.buttons > 1) {
      e.stopPropagation();
    }
    active = true;
  };

  const onGlobalDown = () => {
    active = false;
  };

  const onMove: OnDrag = (x, y, box) => {
    x = Math.round(x - (x % HP.w));
    y = Math.round(y - (y % HP.h));

    if (x < 0 || y < 0) {
      return;
    }

    if (x !== box.x || y !== box.y) {
      const moved = modules.move(module, x, y);

      if (moved) {
        position = { x, y };
      }
    }
  };

  afterUpdate(() => {
    modules.afterUpdate();
  });

  onMount(async () => {
    await libraries.add(module.libs);
    getModule(module.type);
  });
</script>

<style>
  div {
    display: block;
    position: absolute;
    will-change: transform;
    user-select: none;
    top: 0px;
    left: 0px;
  }

  :global(div *) {
    user-select: none;
    -webkit-user-select: none;
  }

  .preview {
    background-size: 100% 100%;
  }
</style>

<svelte:body on:keydown={onKey} />

{#if Component}
  <div
    id={module.id}
    bind:this={container}
    on:mousedown={onMouseDown}
    on:contextmenu={onMenu}
    use:useDrag={onMove}
    use:useClickOutside={onGlobalDown}
    style="transform: translate({position.x}px, {position.y + BAR_HEIGHT}px); width: {module.size.w *
      HP.w}px; height: {module.size.h * HP.h}px;"
  >
    <svelte:component this={Component} bind:state />
  </div>
{:else}
  <div
    id={module.id}
    class="preview"
    style="background-image: url('/modules/{module.type}.png'); transform: translate({position.x}px, {position.y +
      BAR_HEIGHT}px); width: {module.size.w * HP.w}px;
		height: {module.size.h * HP.h}px;"
  >
    <Loading />
  </div>
{/if}

<div style="transform: translate({contextPosition.x}px, {contextPosition.y}px); z-index: var(--zindex-menu);">
  <Menu bind:visible={contextVisible}>
    <button on:click={onContextRemove}>Remove <strong>BACKSPACE</strong> </button>
    <hr />
    <button on:click={onContextDuplicate}>Duplicate</button>
  </Menu>
</div>
