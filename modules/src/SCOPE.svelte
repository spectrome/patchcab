<script lang="ts">
  import { Waveform } from 'Tone';
  import { scale, onMount } from '@patchcab/core';
  import { Faceplate, Patch } from '@patchcab/core';

  let node = new Waveform(512);

  let canvas;
  let ctx;
  let draw = false;

  const ratio = window.devicePixelRatio || 1;
  const width = 160 * ratio;
  const height = 180 * ratio;
  const margin = 20 * ratio;

  const loop = () => {
    if (!draw || !ctx) {
      return;
    }
    requestAnimationFrame(loop);
    const wave = node.getValue();
    drawWave(wave);
  };

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
  <Patch label="in" x={84} y={325} name="audio-1" input={node} {onConnect} />
</Faceplate>
