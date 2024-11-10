<script lang="ts">
  import { subnavTransitionIn, subnavTransitionOut } from "$lib/animations";
  import { state } from "$lib/state.svelte";
</script>

<svelte:document onclick={(e: Event) => {
  if (
    state.subnav && 
    // @ts-expect-error Typing for HTML events sucks ass
    !e.target?.className.includes("nav")
) {
    state.subnav = "";
  }
}} />

<div id="subnav" class="subnav" in:subnavTransitionIn out:subnavTransitionOut>
  {state.subnav}
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
