<script lang="ts">
  let {
    children,
    onclick,
    icon = false
  }: {
    children: () => any;
    onclick?: (e: Event) => any;
    icon?: boolean;
  } = $props();
</script>

<button {onclick} class:{icon}>{@render children()}</button>

<style>
  :root {
    --padding: 0 1em;
    --background: var(--lime);
    --color: var(--black);
  }

  button {
    font-size: unset;
    font-family: unset;
    color: unset;
    background: unset;
    border: unset;
    border-radius: unset;
    margin: unset;
    padding: unset;

    background: var(--background);
    color: var(--color);
    padding: var(--padding);
    border-radius: 0.2em;
    cursor: pointer;
    filter: brightness(0.7);

    transition: var(--default-transition) filter;
  }

  button:hover {
    filter: brightness(1);
  }
</style>
