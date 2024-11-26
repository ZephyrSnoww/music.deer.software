<script lang="ts">
  import FileForm from "./FileForm.svelte";
  import { onMount } from "svelte";

  const { data } = $props();

  onMount(() => {
    console.log(data.unsortedFiles);
  });
</script>

{#if data.unsortedFiles}
  <div id="page">
    {#each data.unsortedFiles as file}
      <FileForm {file} />
    {/each}
  </div>
{:else}
  <div id="page">
    No songs found! (or it error'd trying to read them?)
  </div>
{/if}

<style>
  #page {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.5em;
    width: 60%;
    padding-top: 5em;
    padding-bottom: 10em;
  }
</style>
