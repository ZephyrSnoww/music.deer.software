<script lang="ts">
  import { fadeTransitionIn, fadeTransitionOut } from "$lib/animations";

  let {
    children,
    onclick,
    label,
    href
  }: {
    children: () => any;
    onclick?: (e: Event) => any;
    label: string;
    href?: string;
  } = $props();

  let hovered = $state(false);
</script>

<div class="nav-button">
  {#if href}
    <a
      {href}
      {onclick}
      class="nav-button-content icon"
      onmouseenter={() => { hovered = true; }}
      onmouseleave={() => { hovered = false; }}
    >{@render children()}</a>
  {:else}
    <button
      {onclick}
      class="nav-button-content icon"
      onmouseenter={() => { hovered = true; }}
      onmouseleave={() => { hovered = false; }}
    >
      {@render children()}
    </button>
  {/if}

  {#if hovered}
    <div class="nav-label" in:fadeTransitionIn out:fadeTransitionOut>{label}</div>
  {/if}
</div>

<style>
  .nav-button {
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button, a {
    font-size: 2em;
    text-decoration: none;
    color: unset;
    background: black;
    width: 100%;
    height: 100%;
    filter: brightness(0.7);
    transition: var(--default-transition);
    transition-property: filter, background;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-button:hover a, .nav-button:hover button {
    background: #0a0a0a;
    filter: brightness(1);
  }

  .nav-label {
    position: absolute;
    left: calc(100% + 0.5em);
    background: black;
    padding: 0 0.25em;
    border-radius: 0.3em;
    z-index: 10;
  }
</style>
