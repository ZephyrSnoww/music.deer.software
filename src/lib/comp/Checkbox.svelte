<script lang="ts">
  let {
    checked = $bindable(),
    name,
    onclick,
    children
  }: {
    checked: boolean;
    name?: string;
    onclick?: (e?: Event) => any;
    children: () => any;
  } = $props();
</script>

<label>
  <input type="checkbox" {name} bind:checked style:display="none" />
  <span
    role="none"
    style:background={checked ? "var(--lime)" : "var(--red)"}
  ></span>
  <span>{@render children()}</span>
</label>

<style>
  :root {
    --width: 1em;
  }

  label {
    display: flex;
    gap: 0.25em;
    align-items: center;
    cursor: pointer;
  }

  span {
    display: inline-block;
    aspect-ratio: 1;
    width: var(--width);
    border-radius: 0.2em;
    text-wrap: nowrap;
  }
</style>
