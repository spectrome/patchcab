<script lang="ts">
  export let top = 1;
</script>

<style>
  div {
    top: 100%;
    left: 50%;
    position: absolute;
    pointer-events: none;
    font-family: 'Routed Gothic';
    font-size: 11px;
    color: inherit;
    white-space: nowrap;
  }
</style>

<div style="transform: translate(-50%, {top}px);">
  <slot />
</div>
