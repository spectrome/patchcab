<script lang="ts">
  import { usePan } from '../actions';
  import type { OnPan } from '../actions';
  import { scale, round } from '../helpers';
  import Label from './Label.svelte';

  export let x: number;
  export let y: number;
  export let min: number;
  export let max: number;
  export let value: number;
  export let label: string;
  export let steps: number = 200;
  export let precision: number = 0;
  export let size: 's' | 'l' = 'l';

  $: rotation = scale(value, [min, max], [0, 270], 0);

  const onPan: OnPan = ({ dy }) => {
    if (dy !== 0) {
      const interval = (max - min) / steps;
      const change = round(value - dy * interval, precision);
      value = Math.max(Math.min(change, max), min);
    }
  };
</script>

<style>
  div {
    display: block;
    position: absolute;
    width: 56px;
    height: 56px;
    cursor: row-resize;
  }
  div.small {
    width: 42px;
    height: 42px;
  }
  svg {
    position: absolute;
    top: 0px;
    left: 0px;
    transform-origin: center;
  }
  .shadow-l {
    top: 4px;
    left: 2px;
  }
  .shadow-s {
    top: 3px;
    left: 3px;
  }
</style>

<div class:small={size === 's'} style="left: {x}px; top: {y}px;" use:usePan={onPan}>
  {#if size === 's'}
    <svg class="shadow-s" width="42" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="21" cy="21" r="13" fill="rgba(0,0,0,0.16)" />
    </svg>

    <svg
      style="transform: rotate({-135 + rotation}deg);"
      width="42"
      height="42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="21" cy="21" r="13" fill="var(--color-light-shadow)" />
      <circle cx="21" cy="21" r="11" fill="var(--color-light)" />
      <circle cx="21" cy="12" r="2" fill="var(--color-6)" />
    </svg>
    <svg width="42" height="35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M41.993 21.551l-3-.077a18.203 18.203 0 000-.948l3-.077a21.497 21.497 0 010
				1.102zm-.853-6.518l-2.877.851c-.089-.301-.186-.6-.29-.895l2.828-1.001c.122.344.235.693.34
				1.045zm-2.832-5.928a21.009 21.009 0 00-.647-.89l-2.378
				1.829c.191.249.376.503.554.762l2.471-1.701zm-4.523-4.766l-1.828
				2.378c-.25-.191-.504-.376-.763-.555l1.701-2.47c.303.208.599.423.89.647zm-5.773-3.14l-1.001 2.828a17.8 17.8 0
				00-.895-.29l.85-2.877c.353.104.702.217 1.046.34zM21.552.007l-.078 3a18.382 18.382 0 00-.948 0l-.077-3a21.4 21.4
				0 011.102 0zM15.032.86l.851 2.877c-.301.089-.6.186-.895.29L13.988 1.2a20.83 20.83 0 011.045-.34zM9.105
				3.692l1.701 2.47c-.26.179-.513.364-.762.555L8.216 4.34c.29-.224.586-.44.889-.647zM4.339 8.216l2.378
				1.828c-.191.249-.376.503-.555.762l-2.47-1.701c.208-.303.423-.599.647-.89zm-3.14 5.772l2.828 1.001a17.8 17.8 0
				00-.29.895l-2.877-.85c.104-.353.217-.702.34-1.046zm-1.192 6.46a21.401 21.401 0 000 1.103l3-.077a18.382 18.382 0
				010-.948l-3-.077zm.853 6.519l2.877-.851c.089.301.186.6.29.895L1.2 28.012a20.83 20.83 0 01-.34-1.045zm2.832
				5.928l2.47-1.701c.179.26.364.513.555.762L4.34
				33.785c-.224-.291-.44-.587-.647-.89zm33.97.89l-2.38-1.828c.192-.25.377-.504.556-.763l2.47
				1.701c-.208.303-.423.599-.647.89zm3.139-5.773l-2.828-1.001c.104-.295.201-.594.29-.895l2.877.85c-.104.353-.217.702-.34
				1.046z"
        fill="currentColor"
      />
    </svg>
    {#if label}
      <Label top={-4}>{label}</Label>
    {/if}
  {:else}
    <svg
      style="transform: rotate({-135 + rotation}deg);"
      class="shadow-l"
      width="56"
      height="56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M56 29.649c-1.653-1.825-2.876-4.088-3.307-6.57-.503-2.555-.36-5.037.431-7.446a25.97 25.97 0
				00-6.613-8.686c-2.372.146-4.888-.292-7.189-1.46-2.3-1.168-4.17-2.92-5.535-4.89-3.666-.73-7.333-.804-10.783-.147a13.958
				13.958 0 01-5.607 4.818c-2.3 1.095-4.817 1.533-7.26 1.241-2.733 2.263-5.105 5.183-6.83 8.467.647 2.336.79
				4.891.287 7.446-.647 2.555-1.869 4.745-3.594 6.497.072 3.722.79 7.372 2.228 10.657 2.229.876 4.242 2.336 5.895
				4.526 1.582 2.044 2.516 4.525 2.876 6.861 2.875 2.19 6.038 3.87 9.704 4.891 2.085-1.168 4.53-1.898 7.117-1.898
				2.588 0 4.96.73 7.117 2.044 3.45-.803 6.83-2.409 9.777-4.672.431-2.409 1.366-4.744 3.019-6.788 1.653-2.044
				3.738-3.431 6.039-4.307.718-1.606 1.365-3.358 1.797-5.183.215-1.606.36-3.576.431-5.401z"
        fill="var(--color-dark-shadow)"
      />
    </svg>
    <svg
      style="transform: rotate({-135 + rotation}deg);"
      width="56"
      height="56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M56 29.649c-1.653-1.825-2.876-4.088-3.307-6.57-.503-2.555-.36-5.037.431-7.446a25.97 25.97 0
				00-6.613-8.686c-2.372.146-4.888-.292-7.189-1.46-2.3-1.168-4.17-2.92-5.535-4.89-3.666-.73-7.333-.804-10.783-.147a13.958
				13.958 0 01-5.607 4.818c-2.3 1.095-4.817 1.533-7.26 1.241-2.733 2.263-5.105 5.183-6.83 8.467.647 2.336.79
				4.891.287 7.446-.647 2.555-1.869 4.745-3.594 6.497.072 3.722.79 7.372 2.228 10.657 2.229.876 4.242 2.336 5.895
				4.526 1.582 2.044 2.516 4.525 2.876 6.861 2.875 2.19 6.038 3.87 9.704 4.891 2.085-1.168 4.53-1.898 7.117-1.898
				2.588 0 4.96.73 7.117 2.044 3.45-.803 6.83-2.409 9.777-4.672.431-2.409 1.366-4.744 3.019-6.788 1.653-2.044
				3.738-3.431 6.039-4.307.718-1.606 1.365-3.358 1.797-5.183.215-1.606.36-3.576.431-5.401z"
        fill="var(--color-6)"
      />
      <circle cx="28" cy="28" r="17" fill="var(--color-light-shadow)" />
      <circle cx="28" cy="28" r="14" fill="var(--color-light)" />
      <circle cx="28" cy="5" fill="var(--color-light)" r="2" />
    </svg>
    {#if label}
      <Label top={3}>{label}</Label>
    {/if}
  {/if}
</div>
