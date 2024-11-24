<script lang="ts">
  const {
    children,
    onclick
  }: {
    children: () => any;
    onclick?: (e: Event) => any;
  } = $props();

  let takingAction = $state(false);
  let clicksLeft = $state(5);
</script>

<button onclick={(e) => {
  if (takingAction && clicksLeft <= 0 && onclick) {
    onclick(e);
    return;
  }

  e.preventDefault();
  if (!takingAction) {
    takingAction = true;
  }
  else {
    clicksLeft -= 1;
  }
}}>
  {#if !takingAction}
    {@render children()}
  {:else}
    Click {clicksLeft} more times to confirm
  {/if}
</button>

<style>
  :root {
    --background: var(--lime);
  }

  button {
    background: var(--background);
    color: var(--black);
    flex: 1 0;
  }
</style>
