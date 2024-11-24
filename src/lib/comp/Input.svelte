<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";

  let {
    value = $bindable(),
    type = "text",
    name,
    placeholder,
    onkeydown,
    oninput,
  }: {
    value?: string;
    type?: HTMLInputTypeAttribute;
    name?: string;
    placeholder?: string;
    onkeydown?: (e: KeyboardEvent) => any;
    oninput?: (e: Event) => any;
  } = $props();
</script>

<input {type} {name} bind:value {placeholder} {onkeydown} {oninput} />

<style>
  :root {
    --width: unset;
    --font-size: unset;
  }

  input {
    background: var(--jet);
    color: var(--smoke);
    padding: 0 0.25em;
    filter: brightness(0.75);
    border-radius: 0.2em;

    font-size: var(--font-size);
    width: var(--width);
    transition: var(--default-transition);
    transition-property: filter;
  }

  input:hover {
    filter: brightness(0.85);
  }

  input:focus {
    filter: brightness(1);
  }
</style>
