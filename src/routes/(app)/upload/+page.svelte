<script lang="ts">
  import { enhance } from "$app/forms";
  import type { CustomFormData } from "$lib/types";

  let { form }: { form?: CustomFormData } = $props();
  let loading = $state(false);
  let showWarning = $state(false);
</script>

<div id="upload-page">
  {#if !loading}
    <form
      method="POST"
      id="upload"
      enctype="multipart/form-data"
      use:enhance={() => {
        loading = true;
        let timeWarning = setTimeout(() => {
          showWarning = true;
        }, 5000);
        return async ({ update, result }) => {
          await update();
          loading = false;
          clearInterval(timeWarning);
        };
      }}
    >
      <div id="title">Upload or Enter URL</div>
      <input type="file" accept="audio/*" name="file" class="nostyle" />
      <input
        type="text"
        placeholder="Enter URL"
        name="url"
        style:width="35em"
      />
      <button>Submit</button>
    </form>

    {#if form?.message}
      {#if form.error}
        <div id="error-box">
          <div id="error-title">Error</div>
          <div>{form.message}</div>
        </div>
      {:else}
        <div id="message-box">
          <div>{@html form.message}</div>
        </div>
      {/if}
    {/if}
  {:else}
    <div class="box">
      <div>Processing...</div>
    </div>
    {#if showWarning}
      <div class="box">
        <div>
          The only reason this might take longer than a few seconds
          <br />
          is if you entered a playlist or album URL with lots of songs.
          <br />
          If that isn't the case and you're stuck waiting for a while,
          <br />
          you should probably reload the page and try again.
          <br /><br />
          If you <i>did</i> enter a playlist or album with lots of songs,
          <br />
          please be patient.
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  #upload-page {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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

  #error-box,
  #message-box,
  .box {
    background: black;
    border-radius: 0.5em;
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    max-width: 25em;
    margin-top: 1em;
    border: 1px solid var(--lime);
  }

  #error-title {
    text-align: center;
  }

  #error-box {
    border: 1px solid var(--red);
  }

  #error-box > div,
  #message-box > div,
  .box > div {
    text-align: center;
  }
</style>
