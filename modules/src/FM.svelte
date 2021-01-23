<script lang="ts">
  import { FMOscillator, Scale } from 'Tone';
  import type { ToneOscillatorType } from 'Tone';
  import { Patch, Knob, Switch, Faceplate } from '@patchcab/core';

  const MIN_FREQ = 40;
  const MAX_FREQ = 2400;
  const MAX_MOD = 2400;

  export let state = {
    freq: 440,
    type: 'sine' as ToneOscillatorType,
    fm: 1,
  };

  const oscillator = new FMOscillator(state.freq, state.type).start();
  const scale = new Scale(0, MAX_MOD);

  $: oscillator.frequency.value = state.freq;
  $: oscillator.type = state.type;

  $: scale.max = MAX_MOD * state.fm;

  const onConnect = (nodes: number) => {
    if (nodes) {
      scale.connect(oscillator.modulationIndex);
    } else {
      scale.disconnect(oscillator.modulationIndex);
      oscillator.modulationIndex.overridden = false;
      oscillator.modulationIndex.value = 3;
    }
  };
</script>

<Faceplate title="FM" color="var(--color-4)">
  <Knob label="frequency" x={20} y={60} bind:value={state.freq} min={MIN_FREQ} max={MAX_FREQ} steps={500} />

  <Knob size="s" label="fm" x={27} y={150} bind:value={state.fm} min={0.01} max={1} precision={2} />

  <Switch x={20} y={220} bind:value={state.type} label="sin" set="sine" />
  <Switch x={60} y={220} bind:value={state.type} label="sqr" set="square" />
  <Switch x={20} y={270} bind:value={state.type} label="tri" set="triangle" />
  <Switch x={60} y={270} bind:value={state.type} label="saw" set="sawtooth" />

  <Patch label="fm" x={20} y={320} name="signal-in" input={scale} {onConnect} />
  <Patch label="out" x={60} y={320} name="audio-out" output={oscillator} />
</Faceplate>
