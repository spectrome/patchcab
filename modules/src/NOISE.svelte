<script lang="ts">
  import { AutoFilter, Noise, Scale } from 'Tone';
  import type { NoiseType } from 'Tone';
  import { Patch, Switch, Faceplate, onMount } from '@patchcab/core';

  export let state = {
    type: 'pink' as NoiseType,
  };

  const noise = new Noise(state.type).start();

  const filter = new AutoFilter({
    frequency: 440,
    baseFrequency: 200,
    octaves: 8,
  }).start();

  noise.connect(filter);

  $: noise.type = state.type;

  onMount(() => {
    return () => {
      noise.dispose();
    };
  });
</script>

<Faceplate title="NOISE" color="#e0e0e0" light>
  <Switch x={40} y={170} bind:value={state.type} label="pink" set="pink" />
  <Switch x={40} y={220} bind:value={state.type} label="white" set="white" />
  <Switch x={40} y={270} bind:value={state.type} label="brown" set="brown" />

  <Patch label="out" x={40} y={320} name="audio-out" output={filter} />
</Faceplate>
