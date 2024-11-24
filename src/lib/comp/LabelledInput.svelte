<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";
    import Input from "./Input.svelte";

  let {
    value = $bindable(),
    type = "text",
    name,
    placeholder,
    onkeydown,
    oninput,
    label,
  }: {
    label: string;
    value?: string;
    type?: HTMLInputTypeAttribute;
    name?: string;
    placeholder?: string;
    onkeydown?: (e: KeyboardEvent) => any;
    oninput?: (e: Event) => any;
  } = $props();
</script>

<label>
  <span class="label-text">{label}</span>
  <Input {value} {type} {name} {placeholder} {onkeydown} {oninput} --width="100%" />
</label>

<style>
  label {
    width: 100%;
    display: flex;
    gap: 0.25em;
  }

  span {
    text-wrap: nowrap;
  }
</style>
