<script lang="ts">
  import type { ClientData } from "$lib/types";
  import { appState } from "$lib/state.svelte";
  import { goto } from "$app/navigation";
  import { source } from "sveltekit-sse";
  import "../generic.css";

  import Nav from "$lib/comp/layout/Nav.svelte";
  import Playbar from "$lib/comp/layout/Playbar.svelte";
  import Search from "$lib/comp/layout/Search.svelte";
  import Subnav from "$lib/comp/layout/Subnav.svelte";
  import { fade } from "svelte/transition";

  let { children, data }: { children: () => any; data: ClientData } = $props();

  if (!data.account) {
    goto("/login");
  }

  let popups: { id: number; text: string, error?: boolean }[] = $state([]);

  const genericEvent = source("/events").select("generic");
  genericEvent.subscribe((text: string) => {
    if (text) {
      let id = Math.floor(Math.random() * 10000000000);
      popups.push({ id, text: text });
      setTimeout(() => {
        popups = popups.filter((p) => p.id != id);
      }, 5000);
    }
  });

  const errorEvent = source("/events").select("error");
  errorEvent.subscribe((text: string) => {
    if (text) {
      let id = Math.floor(Math.random() * 10000000000);
      popups.push({ id, text: text, error: true });
      setTimeout(() => {
        popups = popups.filter((p) => p.id != id);
      }, 7000);
    }
  });
</script>

<div id="popups-container">
  {#each popups as popup (popup.id)}
    <div class="popup" style:border-color={popup.error ? "var(--red)" : ""} transition:fade>{popup.text}</div>
  {/each}
</div>

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
  #popups-container {
    width: 100vw;
    height: 100vh;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    padding-bottom: 6em;
    gap: 1em;
  }

  .popup {
    /* position: absolute; */
    background: var(--black);
    padding: 1em;
    z-index: 100;
    border: 1px solid var(--lime);
    border-radius: 0.2em;
  }

  #app {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-columns: 3em auto;
    grid-template-rows: 3em auto 4.5em;
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
    justify-content: flex-start;
    flex-direction: column;
  }
</style>
