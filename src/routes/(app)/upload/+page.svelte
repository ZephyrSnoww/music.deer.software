<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/comp/Button.svelte";
  import Input from "$lib/comp/Input.svelte";
  import type { CustomFormData } from "$lib/types";

  let { form }: { form: CustomFormData } = $props();
</script>

<form method="POST" id="upload" enctype="multipart/form-data" use:enhance>
  <div id="title">Upload or Enter URL</div>
  <input type="file" accept="audio/*" name="file" />
  <Input placeholder="Enter URL" name="url" --width="35em" />
  <Button>Submit</Button>
</form>

{#if form?.message}
  {#if form.error}
    <div id="error-box">
      <div id="error-title">Error</div>
      <div>{form.message}</div>
    </div>
  {:else}
    <div id="message-box">
      <div>{form.message}</div>
    </div>
  {/if}
{/if}

<style>
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
  #message-box {
    background: black;
    border-radius: 0.5em;
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    border: 1px solid var(--red);
    max-width: 15em;
    margin-top: 1em;
  }

  #error-title {
    text-align: center;
  }

  #message-box {
    border: 1px solid var(--lime);
  }
</style>
