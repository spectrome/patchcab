<script lang="ts">
  import Menu from './Menu.svelte';
  import Loading from './Loading.svelte';
  import { stateExport } from '../state/helpers';

  export let api: string;
  export let title: string;
  let toggle: HTMLElement;
  let loading: boolean = false;

  const onClick = (e: Event) => {
    e.stopPropagation();
  };

  const onShare = async (e: Event) => {
    e.preventDefault();

    loading = true;

    const $rack = stateExport(title);

    const response = await fetch(`${api}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify($rack),
    });

    const data = await response.json();

    loading = false;

    window.location.pathname = `/${data.url}`;
  };
</script>

<style>
  h1 {
    font-size: 12px;
    line-height: 48px;
    cursor: pointer;
  }
</style>

<h1 bind:this={toggle}>{title} ▾</h1>
<Menu center bind:toggle>
  <form on:submit={onShare} on:click={onClick}>
    {#if loading}
      <Loading />
    {/if}
    <input id="title" bind:value={title} type="text" autocomplete="off" placeholder="Synth title" />
    <button type="submit">Share</button>
  </form>
</Menu>
