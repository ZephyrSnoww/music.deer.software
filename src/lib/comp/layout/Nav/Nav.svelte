<script>
  import { appState } from "$lib/state.svelte";
  import NavButton from "$lib/comp/layout/Nav/NavButton.svelte";
</script>

<!-- TODO Add subnav toggleability (probably using stores?) -->

<div id="nav">
  <a id="logo" href="/">
    <img src="/favicon-outlined.png" alt="" />
  </a>

  <NavButton
    label="Playlists"
    onclick={() => {
      if (appState.subnav) {
        appState.subnav = "";
        setTimeout(() => {
          appState.subnav = "playlists";
        }, 300);
      } else {
        appState.subnav = "playlists";
      }
    }}>list</NavButton
  >

  <NavButton
    label="Tags"
    onclick={() => {
      if (appState.subnav) {
        appState.subnav = "";
        setTimeout(() => {
          appState.subnav = "tags";
        }, 300);
      } else {
        appState.subnav = "tags";
      }
    }}>tag</NavButton
  >

  <NavButton href="/songs" label="Songs">music_note</NavButton>
  <NavButton href="/artists" label="Artists">person</NavButton>
  <NavButton href="/albums" label="Albums">album</NavButton>

  <div class="spacer"></div>

  <NavButton href="/upload" label="Add New Music">add</NavButton>
  <NavButton href="/settings" label="Settings">settings</NavButton>
</div>

<style>
  #nav {
    background: black;
    grid-area: nav;

    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  #logo {
    width: 3em !important;
    border-bottom-right-radius: 0.25em;
    z-index: 50;
  }

  #logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  #nav > * {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    text-decoration: none;
    color: unset;
    background: black;
    filter: brightness(0.7);
    transition-property: filter, background;
  }

  #nav > *:hover {
    background: #0a0a0a;
    filter: brightness(1);
  }

  .spacer {
    flex: 1 0;
  }

  .spacer:hover {
    background: black !important;
    filter: brightness(0.7) !important;
  }
</style>
