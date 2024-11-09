<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";

  let {
    value,
    type = "text",
    placeholder
  }: {
    value?: string;
    type?: HTMLInputTypeAttribute;
    placeholder?: string;
  } = $props();
</script>

<input type="text" bind:value={value} {placeholder}>

<style>
  input {
    font-size: unset;
    font-family: unset;
    color: unset;
    background: unset;
    border: unset;
    border-radius: unset;
    margin: unset;
    padding: unset;
    min-width: unset;
    width: unset;
    outline: none;

    background: var(--jet);
    color: var(--smoke);
    padding: 0 0.25em;
    border-radius: 3px;
    box-shadow: 0px 0px 0px var(--lime);
    filter: brightness(0.75);

    transition: var(--default-transition);
    transition-property: box-shadow, filter;
  }

  input:hover {
    box-shadow: -1px 0px 0px var(--lime);
    filter: brightness(0.85);
  }

  input:focus {
    box-shadow: -3px 0px 0px var(--lime);
    filter: brightness(1);
  }
</style>
