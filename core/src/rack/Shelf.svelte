<script lang="ts">
  import modules from '../state/modules';
  import { isShortcut, safeName } from '../helpers';
  import { HP } from '../contstants';
  import type { Library, View } from '../types';
  import type { LibraryItem } from '../types';
  import Preview from './Preview.svelte';

  export let view: View;
  export let library: Library;

  $: visible = view === 'shelf';

  $: {
    if (visible) {
      document.body.classList.add('overlay');
    } else {
      document.body.classList.remove('overlay');
    }
  }

  $: tags = library ? [...new Set(library.map((item) => item.tags).flat())].sort() : [];
  $: authors = library ? [...new Set(library.map((item) => item.author.name))].sort() : [];

  let tag: string = null;
  let author: string = null;

  $: items = library
    ? library.filter((item) => {
        let show = true;
        if (tag && item.tags.indexOf(tag) < 0) {
          show = false;
        }
        if (author && item.author.name !== author) {
          show = false;
        }
        return show;
      })
    : [];

  const onAdd = (module: LibraryItem) => {
    modules.add({
      type: `${module.set}/${safeName(module.name)}`,
      size: module.size,
      libs: module.libs,
      state: undefined,
    });
    view = 'rack';
  };

  const onKey = (e: KeyboardEvent) => {
    if (isShortcut(e) && e.key === ' ') {
      e.preventDefault();
      view = visible ? 'rack' : 'shelf';
    }
  };
</script>

<style>
  main {
    position: fixed;
    display: flex;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: var(--color-ui-bg-secondary);
    z-index: var(--zindex-modal);
  }

  aside {
    flex: 0 1 300px;
    background: var(--color-ui-bg);
  }

  button.close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
  }

  nav button {
    justify-content: space-between;
    padding: 12px 16px;
    min-width: 200px;
    text-align: left;
    width: 100%;
    text-transform: capitalize;
  }

  button span {
    display: inline-block;
    text-align: center;
    width: 12px;
  }

  span.tag {
    color: var(--color-2);
  }

  span.author {
    color: var(--color-5);
  }

  nav button:hover,
  button.active {
    background: var(--color-ui-hover);
  }

  section {
    display: block;
    width: 100%;
    height: 100%;
    padding: 40px 16px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>

<svelte:body on:keydown={onKey} />
{#if visible && library}
  <main>
    <aside>
      <button aria-label="Close" class="close" on:click={() => (view = 'rack')}>
        <svg width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.793 8.5L.646 15.646l.708.708L8.5 9.207l7.146 7.147.708-.707L9.207 8.5l7.147-7.146-.707-.708L8.5 7.793
						1.354.646l-.708.708L7.793 8.5z"
            fill="#C4C4C4"
          />
        </svg>
      </button>
      <hr />
      <nav>
        <button
          on:click={() => {
            tag = null;
            author = null;
          }}
          class:active={!tag && !author}>
          <span />
          All
        </button>
        <hr />
        {#each tags as item}
          <button on:click={() => (tag = tag !== item ? item : null)} class:active={item === tag}>
            <span class="tag">#</span>
            {item}
          </button>
        {/each}
        <hr />
        {#each authors as item}
          <button on:click={() => (author = author !== item ? item : null)} class:active={item === author}>
            <span class="author">@</span>
            {item}
          </button>
        {/each}
      </nav>
    </aside>
    <section>
      {#each items as module (module.name)}
        <Preview
          on:click={() => onAdd(module)}
          src="/modules/{module.set}/{safeName(module.name)}.png"
          style="width: {module.size.w * HP.w}px; height: {module.size.h * HP.h}px;"
        />
      {/each}
    </section>
  </main>
{/if}
