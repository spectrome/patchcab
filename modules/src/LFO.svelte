<script lang="ts">
  import { LFO } from 'Tone';
  import type { ToneOscillatorType } from 'Tone';
  import { Faceplate, Knob, Patch, Switch } from '@patchcab/core';

  const MIN = 0.01;
  const MAX = 20;

  export let state = {
    freq: 2,
    type: 'sine' as ToneOscillatorType,
  };

  const node = new LFO({
    type: state.type,
    frequency: state.freq,
  });

  node.start();

  $: node.frequency.value = state.freq;
  $: node.type = state.type;
</script>

<Faceplate title="LFO" color="var(--color-2)" light>
  <Knob label="frequency" x={20} y={60} bind:value={state.freq} min={MIN} max={MAX} precision={3} steps={1000} />

  <Switch x={20} y={220} bind:value={state.type} label="sin" set="sine" />
  <Switch x={60} y={220} bind:value={state.type} label="sqr" set="square" />
  <Switch x={20} y={270} bind:value={state.type} label="tri" set="triangle" />
  <Switch x={60} y={270} bind:value={state.type} label="saw" set="sawtooth" />

  <Patch label="out" x={40} y={320} name="audio-out" output={node} />
</Faceplate>
