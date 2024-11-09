<script lang="ts">
  let {
    children,
    value = $bindable(),
    options
  }: {
    children: () => any;
    value?: string;
    options: string[];
  } = $props();

  let open = $state(false);

  // svelte-ignore non_reactive_update
  let longestOption = 0;
  for (const option of options) {
    if (option.length > longestOption) {
      longestOption = option.length;
    }
  }

  let dropdownId = `dropdown-${Math.floor(Math.random() * 9999)}`;
</script>

<svelte:document onclick={(e: Event) => {
  // @ts-expect-error Typing for HTML events sucks ass
  if (open && e.target?.id != dropdownId) {
    open = false;
  }
}} />

<div class="dropdown-container">
  <button
    class="dropdown-button"
    id={dropdownId}
    style:width={`${longestOption + 4}ch`}
    onclick={() => { open = !open; }}
  >
    <span id={dropdownId}>{@render children()}</span>
    <span id={dropdownId} class="icon">{open ? "expand_less" : "expand_more"}</span>
  </button>

  {#if open}
    <div class="options-container" style:width={`${longestOption + 4}ch`}>
      {#each options as option}
        <button class="option" onclick={() => { value = option; }}>{option}</button>
      {/each}
    </div>
  {/if}
</div>

<style>
  button {
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
    display: block;
    cursor: pointer;

    filter: brightness(0.75);

    transition: var(--default-transition);
    transition-property: filter;
  }

  button:hover {
    filter: brightness(1);
  }

  .dropdown-container {
    position: relative;
  }

  .dropdown-button {
    background: var(--jet);
    color: var(--smoke);
    padding: 0 0.25em;
    border-radius: 0.2em;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .options-container {
    border-radius: 3px;
    overflow: hidden;
    overflow-y: scroll;
    max-height: 25vh;
    position: absolute;
    top: 100%;
  }

  .option {
    padding: 0 0.25em;
    background: var(--jet);
    width: 100%;
    text-align: left;
  }
</style>
