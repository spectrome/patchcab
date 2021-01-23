<script lang="ts">
  import { Channel, Gain, start, Scale } from 'Tone';
  import { onMount, isShortcut } from '@patchcab/core';
  import { Patch, Volume, Faceplate, Switch } from '@patchcab/core';

  const MIN = -80;
  const MAX = 2;

  let volume = MIN;
  let on = false;

  const node = new Gain();
  const channel = new Channel(volume).toDestination();
  const scale = new Scale(0, 1);

  $: if (on) {
    channel.volume.value = volume;
  }
  $: toggleTone(on);

  const toggleTone = async (on: boolean) => {
    if (on) {
      await start();
    }
    channel.mute = !on;
  };

  const onConnect = (nodes: number) => {
    if (nodes) {
      scale.connect(node.gain);
    } else {
      scale.disconnect(node.gain);
      node.gain.value = 1;
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (isShortcut(e) && e.key === 'Enter') {
      on = !on;
    }
  };

  onMount(async () => {
    node.connect(channel);
    channel.mute = true;

    return () => {
      channel.dispose();
    };
  });
</script>

<svelte:body on:keydown={onKey} />

<Faceplate title="OUT" color="var(--color-dark)">
  <Volume x={24} y={60} h={204} bind:value={volume} min={MIN} max={MAX} />

  <Switch x={40} y={280} bind:value={on} label="on" />

  <Patch label="cv" x={20} y={320} name="cv-1" input={scale} {onConnect} />
  <Patch label="in" x={60} y={320} name="audio-in" input={node} />
</Faceplate>
