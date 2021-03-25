<script lang="ts">
  import { Waveform } from 'Tone';
  import { scale, onMount } from '@patchcab/core';
  import { Faceplate, Patch, Switch } from '@patchcab/core';

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
    internalTrigger: false,
  };

  const loop = () => {
    if (!draw || !ctx) {
      return;
    }
    requestAnimationFrame(loop);
    const wave = node.getValue();
    if (state.internalTrigger) {
      drawSweptWave(wave);
      return;
    }
    drawWave(wave);
  };

  const drawSweptWave = (wave) => {
    let sweepStart = -1;
    let previousValue = wave[0];
    for (let i = 0, len = wave.length; i < len; i++) {
      const currentValue = wave[i];

      // Start the sweep if the signal passed through the threshold value at any point between
      // prevousValue and currentValue, inclusive.
      if (sweepStart == -1 && (currentValue > sweepTriggerThresh && previousValue < sweepTriggerThresh)) {
        sweepStart = i;
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // 0.1 opacity gradually fades out over successive redraws.
        ctx.fillRect(0, 0, width, height)
        ctx.moveTo(0, height/2);
        ctx.beginPath();
      } else if (sweepStart == -1) {
        // Keep scanning through wave, looking for a threshold crossing.
        previousValue = currentValue;
        continue;
      }

      const x = scale(i-sweepStart, [0, len - 1], [0, width], 0);
      const y = scale(wave[i], [-1, 1], [height - margin, 0 + margin], 0);

      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  const drawWave = (wave) => {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    for (let i = 0, len = wave.length; i < len; i++) {
      const x = scale(i, [0, len - 1], [0, width], 0);
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

  const toggleTrigger = () => {state.internalTrigger = !state.internalTrigger};
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
  <Switch square label="internal trigger" x={84} y={260} value={state.internalTrigger} onToggle={toggleTrigger}/>
  <Patch label="in" x={84} y={325} name="audio-1" input={node} {onConnect} />
</Faceplate>
