<script lang="ts">
  import { subnavTransitionIn, subnavTransitionOut } from "$lib/animations";
  import { appState } from "$lib/state.svelte";
  import type { ClientData } from "$lib/types";
  import PlaylistsSubnav from "./PlaylistsSubnav.svelte";
  
  let { data }: { data: ClientData } = $props();
</script>

<svelte:document
  onclick={(e: Event) => {
    if (
      appState.subnav &&
      !(e.target as HTMLElement).className.includes("nav")
    ) {
      appState.subnav = "";
    }
  }}
/>

<div id="subnav" class="subnav" in:subnavTransitionIn out:subnavTransitionOut>
  {#if appState.subnav == "playlists"}
    <PlaylistsSubnav {data} />
  {/if}
</div>

<style>
  #subnav {
    position: absolute;
    width: 15em;
    height: calc(100% - 4em);
    border-radius: 0.3em;
    background: black;
    left: 0.5em;
    bottom: 0.5em;
    overflow-y: scroll;
  }
</style>
