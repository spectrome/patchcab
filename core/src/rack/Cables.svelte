<script lang="ts">
  import patches from '../state/patches';
  import modules from '../state/modules';
  import Catenary from '../helpers/Catenary';
  import Point from '../helpers/Point';
  import { BAR_HEIGHT } from '../contstants';
  import type { Patch } from '../types';

  type Cable = {
    path: string;
    color: string;
    point?: Point;
  };

  let cables: Cable[] = [];
  let activeCable: Cable = null;
  let patchList: Patch[] = [];

  const updateCables = ($patches?: Patch[]) => {
    let isActive = false;

    if ($patches) {
      patchList = $patches;
    }

    const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop;

    cables = patchList
      .map((patch) => {
        const elX = document.getElementById(patch.input || patch.selected);
        const elY = document.getElementById(patch.output || patch.selected);

        if (!elX || !elY) {
          return null;
        }

        const boxX = elX.getBoundingClientRect();
        const boxY = elY.getBoundingClientRect();

        const p1 = new Point(
          boxX.left + Math.round(elX.offsetWidth / 2) + scrollX,
          boxX.top - 50 + Math.round(elX.offsetHeight / 2) + 2 + scrollY
        );
        const p2 = new Point(
          boxY.left + Math.round(elY.offsetWidth / 2) + scrollX,
          boxY.top - 50 + Math.round(elY.offsetHeight / 2) + 2 + scrollY
        );

        let chain = new Catenary();

        if (patch.selected) {
          activeCable = {
            path: chain.getPath(p1, p2),
            color: patch.color,
            point: patch.selected === patch.input ? p2 : p1,
          };

          isActive = true;

          return null;
        }

        return {
          path: chain.getPath(p1, p2),
          color: patch.color,
        };
      })
      .filter(Boolean);

    if (!isActive) {
      activeCable = undefined;
    }
  };

  patches.store.subscribe(($patches) => updateCables($patches));
  modules.onAfterUpdate(() => updateCables());

  const onMove = (event: MouseEvent | TouchEvent) => {
    if (!activeCable) {
      return;
    }

    const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop;

    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;

    const point = new Point(clientX + scrollX, clientY + scrollY - BAR_HEIGHT);
    const chain = new Catenary();

    const path = chain.getPath(activeCable.point, point);

    activeCable = {
      ...activeCable,
      path,
    };
  };

  const darken = (color: string, amount: number) => {
    return (
      '#' +
      color
        .replace(/^#/, '')
        .replace(/../g, (color) =>
          ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
        )
    );
  };
</script>

<style>
  svg {
    position: absolute;
    top: 48px;
    left: 0px;
    width: 4800px;
    height: 3040px;
    pointer-events: none;
    opacity: 1;
    z-index: var(--zindex-cables);
  }
</style>

<svelte:body on:mousemove={onMove} on:touchmove={onMove} />

<svg>
  {#each cables as cable}
    <path stroke={darken(cable.color, -40)} stroke-linecap="round" stroke-width="5" fill="none" d={cable.path} />
    <path stroke={cable.color} stroke-linecap="round" stroke-width="3" fill="none" d={cable.path} />
  {/each}
  {#if activeCable}
    <path
      stroke={darken(activeCable.color, -40)}
      stroke-linecap="round"
      stroke-width="5"
      fill="none"
      d={activeCable.path}
    />
  {/if}
</svg>
