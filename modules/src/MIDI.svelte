<script lang="ts">
  import { now } from 'Tone';
  import { isShortcut, Bang } from '@patchcab/core';
  import { Faceplate, Patch } from '@patchcab/core';

  let down = false;

  const keys = 'qwertyuiopasdfghjklzxcvbnm';

  const gate = new Bang();

  const onKeyDown = (e) => {
    if (!isShortcut(e)) {
      return true;
    }

    const index = keys.indexOf(e.key);

    if (!down && index > -1) {
      gate.bang(now(), true, false);
    }
    down = true;
  };

  const onKeyUp = () => {
    gate.bang(now(), false, true);
    down = false;
  };
</script>

<svelte:body on:keydown={onKeyDown} on:keyup={onKeyUp} />
<Faceplate title="MIDI" color="var(--color-4)">
  <Patch label="gate" x={20} y={320} name="gate-out" output={gate} />
</Faceplate>
