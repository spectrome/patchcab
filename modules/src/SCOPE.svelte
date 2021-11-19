<script lang="ts">
  import { Waveform } from 'Tone';
  import { scale, onMount } from '@patchcab/core';
  import { Faceplate, Patch, Knob, Switch } from '@patchcab/core';

  let node = new Waveform(512);

  let canvas;
  let ctx;
  let draw = false;

  const ratio = window.devicePixelRatio || 1;
  const width = 160 * ratio;
  const height = 180 * ratio;
  const margin = 20 * ratio;
  const sweepTriggerThresh = 0;

  export let state = {
    trigger: false,
    level: 0,
    holdoff: 1,
  };

  const loop = () => {
    if (!draw || !ctx) {
      return;
    }
    requestAnimationFrame(loop);
    const wave = node.getValue();
    drawWave(wave);
  };

  const drawWave = (input) => {
    ctx.fillStyle = `rgba(35, 45, 48, ${state.trigger ? '0.2' : '1'})`;
    ctx.fillRect(0, 0, width, height);

    let wave = input;

    if (state.trigger) {
      let sweep = 0;
      for (let i = 1, len = input.length; i < len; i++) {
        if (input[i] > state.level && input[i - 1] < state.level) {
          sweep = i;
          break;
        }
      }
      if (sweep > 0) {
        wave = input.slice(sweep);
      }

      ctx.beginPath();
      const levelPos = scale(state.level, [-1, 1], [height - margin, 0 + margin], 0);
      ctx.moveTo(0, levelPos, 0);
      ctx.lineTo(width, levelPos);
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.1)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.beginPath();

    for (let i = 0, len = wave.length; i < len; i++) {
      const x = scale(i, [0, input.length - 1], [0, width], 0);
      const y = scale(wave[i], [-1, 1], [height - margin, 0 + margin], 0);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const onConnect = (nodes: number) => {
    if (nodes) {
      draw = true;
      loop();
    } else {
      draw = false;
    }
  };

  onMount(() => {
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext('2d');
  });

  const toggleTrigger = () => {
    state.trigger = !state.trigger;
  };
</script>

<style>
  canvas {
    background: #232d30;
    position: absolute;
    left: 15px;
    top: 60px;
    width: 160px;
    height: 180px;
  }
</style>

<Faceplate title="SCOPE" color="var(--color-3)">
  <canvas bind:this={canvas} />
  <Knob size="s" label="level" x={72} y={254} bind:value={state.level} min={-0.9} max={0.9} precision={2} />
  <Switch square label="trigger" x={23} y={264} value={state.trigger} onToggle={toggleTrigger} />
  <Patch label="in" x={84} y={325} name="audio-1" input={node} {onConnect} />
</Faceplate>
