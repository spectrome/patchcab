<script lang="ts">
  import { usePan } from '../actions';
  import type { OnPan } from '../actions';
  import { scale, round } from '../helpers';
  import Label from './Label.svelte';

  export let x: number;
  export let y: number;
  export let h: number;
  export let min: number;
  export let max: number;
  export let value: number;
  export let label: string;
  export let disabled: boolean;

  $: level = scale(value, [min, max], [0, 100], 0);

  const onPan: OnPan = ({ dy }) => {
    if (dy !== 0 && !disabled) {
      const interval = (max - min) / 200;
      const change = value - dy * interval;
      value = round(Math.max(Math.min(change, max), min), 2);
    }
  };
</script>

<style>
  .slider {
    display: block;
    position: absolute;
    width: 48px;
    cursor: row-resize;
    background: #2c2929;
  }

  .slider.disabled svg {
    opacity: 0.25;
  }

  .bar,
  svg {
    position: absolute;
    bottom: 0px;
    height: 100%;
    width: 100%;
    pointer-events: none;
  }

  .bar {
    top: 0px;
    background: #2c2929;
  }
</style>

<div class="slider" class:disabled style="left: {x}px; top: {y}px; height: {h}px;" use:usePan={onPan}>
  <svg viewBox="0 0 48 204" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#D84A4B" d="M8 8h32v4H8zM8 16h32v4H8zM8 24h32v4H8z" />
    <path fill="#EC8657" d="M8 32h32v4H8zM8 40h32v4H8zM8 48h32v4H8z" />
    <path fill="#FFC263" d="M8 56h32v4H8zM8 64h32v4H8zM8 72h32v4H8z" />
    <path fill="#86B057" d="M8 80h32v4H8zM8 88h32v4H8zM8 96h32v4H8z" />
    <path
      fill="#0D9F4C"
      d="M8 104h32v4H8zM8 136h32v4H8zM8 168h32v4H8zM8 120h32v4H8zM8 152h32v4H8zM8 184h32v4H8zM8 112h32v4H8zM8
			144h32v4H8zM8 176h32v4H8zM8 128h32v4H8zM8 160h32v4H8zM8 192h32v4H8z"
    />
  </svg>
  <div class="bar" style="height: {100 - level}%" />
  {#if label}
    <Label>{label}</Label>
  {/if}
</div>
