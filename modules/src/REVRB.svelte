<script lang="ts">
  import { Reverb } from 'Tone';
  import { Faceplate, Knob, Patch } from '@patchcab/core';

  const MIN = 0.01;
  const MAX = 10;

  export let state = {
    decay: 1.15,
  };

  const reverb = new Reverb(state.decay);

  $: reverb.decay = state.decay;
</script>

<Faceplate title="REVRB" color="var(--color-2)" light>
  <Knob label="decay" x={20} y={60} bind:value={state.decay} min={MIN} max={MAX} precision={2} />

  <Patch label="in" x={20} y={320} name="audio-in" input={reverb} />
  <Patch label="out" x={60} y={320} name="audio-out" output={reverb} />
</Faceplate>
