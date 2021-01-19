<script lang="ts">
  import { Clock } from 'Tone';
  import { onMount, Bang } from '@patchcab/core';
  import { Faceplate, Patch, Knob } from '@patchcab/core';

  export let state = {
    freq: 2,
  };

  let tick = 0;

  const node1 = new Bang();
  const node2 = new Bang();
  const node4 = new Bang();
  const node8 = new Bang();

  const bang = (time: number) => {
    node1.bang(time, true, true);

    if (tick % 2 === 0) {
      node2.bang(time, true, true);
    }

    if (tick % 4 === 0) {
      node4.bang(time, true, true);
    }

    if (tick % 8 === 0) {
      node8.bang(time, true, true);
    }

    tick += 1;
  };

  let clock = new Clock(bang, state.freq);

  $: clock.frequency.value = state.freq;

  onMount(() => {
    clock.start();
  });
</script>

<Faceplate title="CLOCK" color="var(--color-3)">
  <Knob label="frequency" x={20} y={60} bind:value={state.freq} min={1} max={10} precision={2} />
  <Patch label="out" x={20} y={270} name="gate-out-1" output={node1} />
  <Patch label="1/2" x={60} y={270} name="gate-out-2" output={node2} />
  <Patch label="1/4" x={20} y={320} name="gate-out-4" output={node4} />
  <Patch label="1/8" x={60} y={320} name="gate-out-8" output={node8} />
</Faceplate>
