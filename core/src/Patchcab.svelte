<script lang="ts">
  import { onMount } from 'svelte';
  import modules from './state/modules';
  import { stateImport } from './state/helpers';
  import { Bar, Cables, Help, Container, Loading, Shelf } from './rack';
  import type { Library, View, Rack } from './types';

  export let api: string;
  export let rack: Rack;

  let view: View = 'rack';
  let library: Library;
  let modulesAll = modules.store;
  let loading = false;
  let title = '';

  onMount(async () => {
    const response = await fetch('/modules.json');
    try {
      library = await response.json();
    } catch (error) {
      console.error(error);
      library = [];
    }

    title = 'My untiled synth';

    if (api) {
      const path = location.pathname;
      if (path.length === 9) {
        loading = true;
        title = '';

        try {
          const response = await fetch(`${api}?url=${path.substr(1)}`);
          const data = (await response.json()) as { rack: Rack; url: string };

          stateImport(data.rack, library);
          title = data.rack.title;

          loading = false;

          return;
        } catch (err) {
          console.log(err);
        }

        loading = false;
      }
    }

    if (rack) {
      stateImport(rack, library);
    }
  });
</script>

{#if loading}
  <Loading />
{:else}
  <Bar bind:title bind:view {library} {api} />

  <Shelf bind:view {library} />
  <Help bind:view />
  {#each $modulesAll as module (module.id)}
    <Container {module} />
  {/each}
  <Cables />
{/if}
