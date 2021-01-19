<script lang="ts">
  export let title: string;
  export let color = 'var(--color-dark)';
  export let light = false;
</script>

<style>
  div {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
  }

  h1,
  svg {
    pointer-events: none;
  }

  h1 {
    font-family: 'Routed Gothic Wide';
    font-size: 14px;
    line-height: 14px;
    position: absolute;
    text-align: center;
    top: 24px;
    width: 100%;
  }

  svg {
    position: absolute;
    opacity: 0.4;
  }

  .screw-1,
  .screw-2 {
    top: 2px;
  }

  .screw-3,
  .screw-4 {
    bottom: 3px;
  }

  .screw-1,
  .screw-3 {
    left: 2px;
  }

  .screw-2,
  .screw-4 {
    right: 2px;
  }
</style>

<div draggable style="background-color: {color}; color: var(--color-{light ? 'dark' : 'light'});">
  {#if title}
    <h1>{title}</h1>
  {/if}
  <slot />
  {#each [1, 2, 3, 4] as index}
    <svg class={`screw-${index}`} width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 12A6 6 0 106 0a6 6 0 000 12zm5-6A5 5 0 111 6a5 5 0 0110 0zM4 4.667L4.667 4 6 5.333 7.333 4 8 4.667 6.667 6
				8 7.333 7.333 8 6 6.667 4.667 8 4 7.333 5.333 6 4 4.667z"
        fill="currentColor"
      />
    </svg>
  {/each}
</div>
