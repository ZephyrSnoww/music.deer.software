<script lang="ts">
  let open = $state(false);
  let pos = $state({ x: 0, y: 0 });
</script>

<svelte:window
  oncontextmenu={(e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey) return;

    // @ts-expect-error I don't know why typescript for HTML elements sucks so bad
    if (e.target?.closest(`[data-type="song-listing"]`)) {
      e.preventDefault();
      pos = { x: e.clientX, y: e.clientY };
      open = true;
    }
  }}
  onclick={(e: MouseEvent) => {
    // @ts-expect-error I don't know why typescript for HTML elements sucks so bad
    if (open && !e.target?.closest(`[data-type="context-menu"]`)) {
      open = false;
      e.preventDefault();
      e.stopPropagation();
    }
  }}
/>

{#if open}
  <div
    id="right-click-menu"
    data-type="context-menu"
    style:transform={`translate(${pos.x}px, ${pos.y}px)`}
  >
    hiii
  </div>
{/if}

<style>
  #right-click-menu {
    background: var(--fog);
    /* border: 1px solid var(--lime); */
    border-radius: 0.5em;
    padding: 0.5em;
    position: absolute;
    z-index: 75;
  }
</style>
