<script lang="ts">
  import Label from './Label.svelte';

  export let value: unknown;
  export let set: unknown;
  export let label: string;
  export let onToggle: () => void;
  export let square: boolean;
  export let high: boolean;

  export let x = 0;
  export let y = 0;

  const onClick = () => {
    if (typeof onToggle === 'function') {
      onToggle();
    } else if (!set && typeof value == 'boolean') {
      value = !value;
    } else {
      value = set;
    }
  };
</script>

<style>
  button {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 18px;
    background: var(--color-dark);
    border: 1px solid rgba(0, 0, 0, 0.32);
    box-shadow: inset 2px 2px 0px rgba(255, 255, 255, 0.08), 0px 0px 0px 2px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    color: inherit;
  }

  button.high {
    background: var(--color-dark-highlight);
  }

  button.square {
    width: 20px;
    height: 20px;
    border-radius: 3px;
  }

  button.on {
    background: var(--color-on);
    box-shadow: inset 2px 2px 0px rgba(255, 255, 255, 0.24), 0px 0px 0px 2px rgba(0, 0, 0, 0.12);
  }

  button.on.high {
    background: var(--color-on-highlight);
  }
</style>

<button
  aria-label="switch"
  style="left: {x}px; top: {y}px;"
  on:click={onClick}
  class:on={value === set || (value && typeof value === 'boolean')}
  class:square
  class:high>
  {#if label}
    <Label>{label}</Label>
  {/if}
</button>
