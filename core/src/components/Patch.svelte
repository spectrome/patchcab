<script lang="ts">
  import type { ToneAudioNode } from 'Tone';
  import { getContext, onMount } from 'svelte';
  import patches from '../state/patches';
  import Label from './Label.svelte';
  import type { Bang, Connection, PatchInput, PatchOutput } from '../types';

  export let x = 0;
  export let y = 0;
  export let label: string = undefined;
  export let onConnect: (nodes: number) => void;

  export let input: PatchInput;
  export let output: PatchOutput;
  export let name: string;

  const { id } = getContext('module');
  const patchID = `${id}://${name}`;

  let connections: Connection[] = [];

  patches.store.subscribe(($patches) => {
    const $connections: Connection[] = $patches
      .filter((item) => item[input ? 'input' : 'output'] === patchID)
      .map((item) => ({
        id: input ? item.output : item.input,
        node: item.node,
      }));

    if (typeof onConnect === 'function' && connections.length !== $connections.length) {
      onConnect($connections.length);
    }

    connections.forEach((item) => {
      if ($connections.findIndex((patch) => patch.id === item.id) < 0) {
        if (item.node) {
          if (output) {
            if ('toDestination' in output) {
              output.disconnect(item.node as ToneAudioNode);
            } else {
              output.disconnect(item.node as Bang);
            }
          }
        }
      }
    });

    $connections.forEach((item) => {
      if (input && !item.node) {
        patches.update(item.id, patchID, { node: input });
      }
      if (connections.findIndex((connection) => connection.id === item.id && connection.node) < 0) {
        if (item.node) {
          if (output) {
            if ('toDestination' in output) {
              output.connect(item.node as ToneAudioNode);
            } else {
              output.connect(item.node as Bang);
            }
          }
        }
      }
    });

    connections = $connections;
  });

  const onPatchClick = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    const $patch = patches.state.find((item) => item.input === patchID || item.output === patchID);

    if (!event.shiftKey && $patch) {
      patches.update($patch.output, $patch.input, {
        selected: patchID,
      });
    } else {
      patches.add({
        input: input ? patchID : null,
        output: output ? patchID : null,
        node: input ? input : null,
        selected: patchID,
      });
    }

    window.addEventListener('mouseup', onGlobalUp, { passive: true });
    window.addEventListener('touchend', onGlobalUp), { passive: true };
  };

  const onPatchRelease = () => {
    const $patch = patches.state.find((item) => item.selected);

    if (!$patch) {
      return;
    }

    if (
      $patch[output ? 'input' : 'output'] &&
      $patch[output ? 'input' : 'output'].indexOf(`${id}://`) !== 0 &&
      ((input && $patch.output) || (output && $patch.input))
    ) {
      patches.update($patch.output, $patch.input, {
        output: output ? patchID : $patch.output,
        input: input ? patchID : $patch.input,
        node: input ? input : $patch.node,
        color: $patch.color,
        selected: null,
      });
    } else {
      patches.remove($patch.output, $patch.input);
    }
  };

  const onGlobalUp = (event: MouseEvent) => {
    window.removeEventListener('mouseup', onGlobalUp);
    window.removeEventListener('touchend', onGlobalUp);

    const target = event.target as HTMLElement;

    if (target.tagName.toLowerCase() === 'patch') {
      return;
    }

    const $patch = patches.state.find((item) => item.selected);
    if ($patch) {
      patches.remove($patch.output, $patch.input);
    }
  };

  onMount(() => {
    return () => {
      if (input && 'toDestination' in input) {
        input.dispose();
      }

      if (output && 'toDestination' in output) {
        output.dispose();
      }
    };
  });
</script>

<style>
  patch {
    display: block;
    position: absolute;
    cursor: pointer;
    width: 18px;
    height: 18px;
  }
  svg {
    position: absolute;
    border-radius: 18px;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.16);
    pointer-events: none;
  }
  .ring {
    opacity: 0.15;
  }
</style>

<patch
  id={patchID}
  on:mousedown={onPatchClick}
  on:touchstart|passive={onPatchClick}
  on:mouseup={onPatchRelease}
  on:touchend={onPatchRelease}
  style="left: {x}px; top: {y}px;">
  <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="9" fill="var(--color-6)" class="ring" />
    <circle cx="9" cy="9" r="8" fill="var(--color-light)" />
    <circle cx="9" cy="9" r="5" fill="#222" />
  </svg>
  {#if label}
    <Label top={-1}>{label}</Label>
  {/if}
</patch>
