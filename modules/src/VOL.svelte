<script lang="ts">
  import { Channel, Gain, Scale } from 'Tone';
  import { onMount } from '@patchcab/core';
  import { Patch, Volume, Faceplate, Switch } from '@patchcab/core';

  const MIN = -80;
  const MAX = 2;

  export let state = {
    volume: MIN,
  };

  const node = new Gain();
  const channel = new Channel(state.volume);
  const scale = new Scale(0, 1);

  $: channel.volume.value = state.volume;

  const onConnect = (nodes: number) => {
    if (nodes) {
      scale.connect(node.gain);
    } else {
      scale.disconnect(node.gain);
      node.gain.value = 1;
    }
  };

  onMount(async () => {
    node.connect(channel);
    channel.mute = true;

    return () => {
      scale.dispose();
    };
  });
</script>

<Faceplate title="VOL" color="var(--color-dark)">
  <Volume x={24} y={60} h={204} bind:value={state.volume} min={MIN} max={MAX} />

  <Patch label="cv" x={40} y={280} name="cv-1" input={scale} {onConnect} />
  <Patch label="in" x={20} y={320} name="audio-in" input={node} />
  <Patch label="out" x={60} y={320} name="audio-out" output={channel} />
</Faceplate>
