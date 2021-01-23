<script lang="ts">
  import { Oscillator, Scale } from 'Tone';
  import type { ToneOscillatorType } from 'Tone';
  import { Patch, Knob, Switch, Faceplate, onMount } from '@patchcab/core';

  const MIN = 40;
  const MAX = 2400;

  export let state = {
    freq: 440,
    type: 'sine' as ToneOscillatorType,
    fm: 1,
  };

  const oscillator = new Oscillator(state.freq, state.type).start();
  const scale = new Scale(MIN, MAX);

  $: oscillator.frequency.value = state.freq;
  $: oscillator.type = state.type;

  $: scale.min = Math.max(MIN, state.freq - state.freq * state.fm);
  $: scale.max = Math.min(MAX, state.freq + (MAX - state.freq) * state.fm);

  const onConnect = (nodes: number) => {
    if (nodes) {
      scale.connect(oscillator.frequency);
    } else {
      scale.disconnect(oscillator.frequency);
      oscillator.frequency.overridden = false;
      oscillator.frequency.value = state.freq;
    }
  };
</script>

<Faceplate title="OSC">
  <Knob label="frequency" x={20} y={60} bind:value={state.freq} min={MIN} max={MAX} steps={500} />

  <Knob size="s" label="fm" x={27} y={150} bind:value={state.fm} min={0.01} max={1} precision={2} />

  <Switch x={20} y={220} bind:value={state.type} label="sin" set="sine" />
  <Switch x={60} y={220} bind:value={state.type} label="sqr" set="square" />
  <Switch x={20} y={270} bind:value={state.type} label="tri" set="triangle" />
  <Switch x={60} y={270} bind:value={state.type} label="saw" set="sawtooth" />

  <Patch label="fm" x={20} y={320} name="signal-in" input={scale} {onConnect} />
  <Patch label="out" x={60} y={320} name="audio-out" output={oscillator} />
</Faceplate>
