<script lang="ts">
  import { Filter, Scale } from 'Tone';
  import { Faceplate, Knob, Patch, Switch } from '@patchcab/core';

  const MIN = 20;
  const MAX = 800;

  export let state = {
    freq: 440,
    type: 'lowpass' as BiquadFilterType,
    cv: 1,
  };

  const filter = new Filter(state.freq, state.type);
  const scale = new Scale(MIN, MAX);

  $: filter.frequency.value = state.freq;
  $: filter.type = state.type;

  $: scale.min = Math.max(MIN, state.freq - state.freq * state.cv);
  $: scale.max = Math.min(MAX, state.freq + (MAX - state.freq) * state.cv);

  const onConnect = (nodes: number) => {
    if (nodes) {
      scale.connect(filter.frequency);
    } else {
      scale.disconnect(filter.frequency);
      filter.frequency.overridden = false;
      filter.frequency.value = state.freq;
    }
  };
</script>

<Faceplate title="VCF" color="var(--color-1)" light>
  <Knob label="frequency" x={20} y={60} bind:value={state.freq} min={MIN} max={MAX} />

  <Knob size="s" label="fm" x={27} y={150} bind:value={state.cv} min={0.01} max={1} precision={2} />

  <Patch label="cv" x={20} y={220} name="cv-in" input={scale} {onConnect} />

  <Switch x={20} y={270} bind:value={state.type} label="low" set="lowpass" />
  <Switch x={60} y={270} bind:value={state.type} label="high" set="highpass" />

  <Patch label="in" x={20} y={320} name="audio-in" input={filter} />
  <Patch label="out" x={60} y={320} name="audio-out" output={filter} />
</Faceplate>
