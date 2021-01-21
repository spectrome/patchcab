<script lang="ts">
  import { Envelope } from 'Tone';
  import { Bang, Faceplate, Patch, Knob } from '@patchcab/core';

  export let state = {
    attack: 0.5,
    decay: 0.1,
    sustain: 0.5,
    release: 1,
  };

  const envelope = new Envelope(state.attack, state.decay, state.sustain, state.release);

  $: envelope.attack = state.attack;
  $: envelope.decay = state.decay;
  $: envelope.sustain = state.sustain;
  $: envelope.release = state.release;

  const bang = new Bang((time, bangAttack, bangRelease) => {
    if (bangAttack && bangRelease) {
      envelope.triggerAttackRelease(0.05, time);
    } else if (bangAttack) {
      envelope.triggerAttack(time);
    } else if (bangRelease) {
      envelope.triggerRelease(time);
    }
  });
</script>

<Faceplate title="ADSR" color="var(--color-5)" light>
  <Knob size="s" label="attack" x={27} y={60} bind:value={state.attack} min={0} max={2} precision={2} steps={1200} />
  <Knob size="s" label="decay" x={27} y={122} bind:value={state.decay} min={0} max={2} precision={2} steps={1200} />
  <Knob size="s" label="sustain" x={27} y={186} bind:value={state.sustain} min={0} max={1} precision={2} steps={1000} />
  <Knob size="s" label="release" x={27} y={250} bind:value={state.release} min={0} max={5} precision={2} steps={1000} />

  <Patch label="gate" x={20} y={320} name="gate" input={bang} />
  <Patch label="out" x={60} y={320} name="cv" output={envelope} />
</Faceplate>
