<script lang="ts">
  import { onMount } from "svelte";

  const { data } = $props();

  onMount(() => {
    console.log(data.unsortedFiles);
  });
</script>

{#if data.unsortedFiles}
  <div id="page">
    {#each data.unsortedFiles as file}
      <div class="file">
        {#if file.data.v2?.APIC?.[0]}
          <img
            src={`data:${file.data.v2!.APIC![0].format};base64,${file.cover}`}
            alt=""
            class="cover"
          />
        {:else}
          <img src="/placeholder-cover.png" alt="" class="cover" />
        {/if}
      </div>
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
  }
</style>
