<script lang="ts">
  import { enhance } from "$app/forms";
  import Checkbox from "$lib/comp/Checkbox.svelte";
  import type { CustomFormData } from "$lib/types";
  import { source } from "sveltekit-sse";

  let { form }: { form?: CustomFormData } = $props();
  let loading = $state(false);

  let inputURL = $state("");
  let urlIsPlaylist = $state(false);
  let urlIsLarge = $state(false);

  $effect(() => {
    if (inputURL) {
      inputURL = inputURL.split("?")[0];

      if (inputURL.match(/(\/sets\/)|(\/playlist\/)/)) {
        urlIsPlaylist = true;
        urlIsLarge = true;
      } else if (
        inputURL.match(
          /((soundcloud\.com\/[^/]+)|(\/album\/[^/]+)|(\/playlist\/[^/]+)|(\/artist\/[^/]+)|([^.]+\.bandcamp\.com))$/,
        )
      ) {
        urlIsPlaylist = false;
        urlIsLarge = true;
      } else {
        urlIsPlaylist = false;
        urlIsLarge = false;
      }
    }
  });

  const uploadEvent = source("/events").select("upload");
</script>

<div id="upload-page">
  {#if !loading}
    <form
      method="POST"
      id="upload"
      enctype="multipart/form-data"
      use:enhance={() => {
        loading = true;
        return async ({ update, result }) => {
          await update();
          loading = false;
        };
      }}
    >
      <div id="title">Upload or Enter URL</div>
      <input type="file" accept="audio/*" name="file" class="nostyle" />
      <input
        type="text"
        placeholder="Enter URL"
        name="url"
        bind:value={inputURL}
        style:width="35em"
      />

      {#if urlIsPlaylist}
        <Checkbox checked={false} name="createPlaylist"
          >Create playlist</Checkbox
        >
      {/if}

      {#if urlIsLarge}
        <Checkbox checked={false} name="skipSorting"
          >Skip sorting page (may lead to incorrect metadata)</Checkbox
        >
      {/if}

      <button>Submit</button>
    </form>
  {:else}
    <div style:text-align="center">{@html $uploadEvent || "Processing..."}</div>
  {/if}
</div>

<style>
  #upload-page {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  #upload {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  #title {
    font-size: 1.5em;
    text-align: center;
  }
</style>
