<script lang="ts">
  import { appState } from "$lib/state.svelte";
  import "./generic.css";

  import Nav from "$lib/comp/layout/Nav.svelte";
  import Playbar from "$lib/comp/layout/Playbar.svelte";
  import Search from "$lib/comp/layout/Search.svelte";
  import Subnav from "$lib/comp/layout/Subnav.svelte";

  let { children } = $props();
</script>

<div id="app">
  <Nav />

  <Search />

  <div id="content-container">
    {#if appState.subnav}
      <Subnav />
    {/if}

    <div id="content">
      {@render children()}
    </div>
  </div>

  <Playbar />
</div>

<style>
  #app {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-columns: 3em auto;
    grid-template-rows: 3em auto 4em;
    grid-template-areas:
      "nav search"
      "nav content"
      "playbar playbar";
  }

  #content-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  #content-container {
    position: relative;
    overflow: hidden;
  }

  #content {
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
