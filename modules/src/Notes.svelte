<script lang="ts">
  import { Faceplate } from '@patchcab/core';

  export let state = {
    note: '',
  };
</script>

<style>
  textarea {
    position: absolute;
    background: #2c2929;
    border: none;
    resize: none;
    top: 60px;
    left: 15px;
    width: calc(100% - 30px);
    height: calc(100% - 100px);
    padding: 10px;
    color: var(--color-light);
    font-size: 12px;
  }
</style>

<Faceplate title="Notes"><textarea bind:value={state.note} /></Faceplate>
