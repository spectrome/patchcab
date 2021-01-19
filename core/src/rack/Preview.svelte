<script lang="ts">
  import { onMount } from 'svelte';
  import Loading from './Loading.svelte';

  export let src: string;
  export let style: string;

  let loaded = false;

  onMount(() => {
    const image = new Image();

    image.addEventListener('load', () => {
      loaded = true;
    });

    image.src = src;
  });
</script>

<style>
  div {
    display: block;
    position: relative;
    float: left;
    margin: 0 8px 8px 0;
    cursor: pointer;
    background: var(--color-ui-bg);
    opacity: 0.3;
  }

  div.loaded {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
  }
</style>

<div on:click {style} class:loaded>
  {#if loaded}
    <img {src} alt="" />
  {:else}
    <Loading />
  {/if}
</div>
