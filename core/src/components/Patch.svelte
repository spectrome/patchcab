<script lang="ts">
  import { ToneAudioNode, Draw } from 'Tone';
  import { getContext, onMount } from 'svelte';
  import patches from '../state/patches';
  import Label from './Label.svelte';
  import { Connection, PatchInput, PatchOutput } from '../types';
  import Bang from '../nodes/Bang';

  export let x = 0;
  export let y = 0;
  export let label: string = undefined;
  export let onConnect: (nodes: number) => void;

  export let state = {
    amplitude: 0,
  };

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
          if (input) {
            if ('toDestination' in item.node) {
              try {
                item.node.disconnect(analyser);
                analyser = null;
                state.amplitude = 0;
              } catch (e) {
                console.error(e);
              }
            } else {
              // TODO:
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
          if (input) {
            if ('toDestination' in item.node) {
              analyser = item.node.context.createAnalyser();
              buffer = new Float32Array(analyser.frequencyBinCount);
              item.node.connect(analyser);
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

  let analyser: AnalyserNode | undefined;
  let buffer: Float32Array | undefined;

  const draw = () => {
    Draw.schedule(draw, '+100hz');
    if (!analyser || !buffer) {
      // console.warn('no analyser or no buffer');
      return;
    }

    analyser.getFloatTimeDomainData(buffer);
    const totalSquared = buffer.reduce((total, current) => total + current * current, 0);
    const rms = Math.sqrt(totalSquared / buffer.length);
    state.amplitude = rms;
  };

  onMount(() => {
    if (output) {
      if ('toDestination' in output) {
        const context = output.context;
        analyser = context.createAnalyser();
        buffer = new Float32Array(analyser.frequencyBinCount);
        output.connect(analyser);
      } else {
        const meterBang = new Bang((_time, attack, release) => {
          if (attack) {
            state.amplitude = 1;
          }
          if (release) {
            // TODO: clear timeout on attack?
            setTimeout(() => {
              state.amplitude = 0;
            }, 100);
          }
        });
        output.connect(meterBang);
      }
    }

    draw();

    return () => {
      if (input && 'toDestination' in input) {
        input.dispose();
      }

      if (output && 'toDestination' in output) {
        output.dispose();
      }

      // TODO: stop drawing
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
  style="left: {x}px; top: {y}px;"
>
  <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="9" fill="var(--color-6)" class="ring" />
    <circle cx="9" cy="9" r="8" fill="var(--color-light)" />
    <circle cx="9" cy="9" r="5" style="fill: hsl(0, 0%, {state.amplitude * 100}%)" />
  </svg>
  {#if label}
    <Label top={-1}>{label}</Label>
  {/if}
</patch>
