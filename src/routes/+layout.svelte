<script lang="ts">
  import { state } from "$lib/state.svelte";
  import "./fonts.css";
  import "./generic.css";

  import Nav from "./Nav.svelte";

  let { children } = $props();
</script>

<div id="app">
  <Nav />

  <div id="search">
    Search
  </div>

  <div id="content-container">
    <div id="subnav">
      {state.subnav}
    </div>

    <div id="content">
      {@render children()}
    </div>
  </div>

  <div id="playbar">
    Playbar
  </div>
</div>

<style>
  #app {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 3em auto;
    grid-template-rows: 3em auto 4em;
    grid-template-areas:
      "nav search"
      "nav content"
      "playbar playbar";
  }

  #search, #content-container, #playbar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  #content-container {
    position: relative;
    overflow: hidden;
  }

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

  #content {
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  #search {
    background: black;
  }

  #playbar {
    grid-area: playbar;
    background: black;
  }
</style>
