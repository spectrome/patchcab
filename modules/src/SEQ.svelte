<script lang="ts">
  import { Faceplate, Patch, Switch, Bang } from '@patchcab/core';

  const ROWS = 6;
  const STEPS = 16;

  export let state = {
    grid: Array(ROWS).fill(Array(STEPS).fill(0)),
  };

  let step = 1;

  const toggle = (row, cell) => {
    const clone = [];

    for (let i = 0; i < ROWS; i++) {
      clone[i] = state.grid[i].slice(0);
      if (i === row) {
        clone[i][cell] = clone[i][cell] === 1 ? 0 : 1;
      }
    }

    state.grid = clone;
  };

  const nodes = Array(ROWS)
    .fill(true)
    .map(() => new Bang());

  const bang = new Bang((time, on, off) => {
    step = step === STEPS ? 1 : step + 1;

    for (let i = 0; i < ROWS; i++) {
      if (state.grid[i][step - 1]) {
        nodes[i].bang(time, on, off);
      }
    }
  });

  const reset = new Bang(() => {
    step = 1;
  });
</script>

<style>
  steps {
    position: absolute;
    left: 20px;
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 10px;
    width: calc(100% - 40px);
    height: 20px;
    margin-bottom: 8px;
  }
</style>

<Faceplate title="SEQ" color="var(--color-7)" light>
  {#each state.grid as row, rowIndex}
    <steps style="top: {70 + rowIndex * 40}px;">
      {#each row as cell, cellIndex}
        <Switch
          x={cellIndex * 28}
          y={0}
          value={cell === 1}
          high={step === cellIndex + 1}
          square
          onToggle={() => toggle(rowIndex, cellIndex)}
        />
      {/each}
    </steps>
  {/each}

  {#each nodes as node, index}
    <Patch x={476} y={72 + index * 40} name="out-gate-{index}" output={node} />
  {/each}

  <Patch label="gate" x={20} y={320} name="gate" input={bang} />
  <Patch label="reset" x={60} y={320} name="reset" input={reset} />
</Faceplate>
