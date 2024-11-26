<script lang="ts">
  import { enhance } from "$app/forms";
  import type { CustomFormData } from "$lib/types";
  import "../generic.css";

  let { form }: { form: CustomFormData } = $props();
</script>

<div id="login-page-container">
  <form method="POST" action="?/login" id="login-box" use:enhance>
    <div id="title">Log In</div>
    <input type="text" placeholder="Username" name="username" />
    <input type="password" placeholder="Password" name="password" />
    <button>Submit</button>
  </form>

  {#if form?.error}
    <div id="error-box">
      <div id="error-title">Error</div>
      <div>{form?.message}</div>
    </div>
  {/if}
</div>

<style>
  #login-page-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1em;
  }

  #login-box,
  #error-box {
    background: black;
    border: 1px solid var(--lime);
    border-radius: 0.5em;
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }

  #error-box {
    border: 1px solid var(--red);
    max-width: 15em;
  }

  #error-title {
    font-size: 1.5em;
    text-align: center;
  }

  #title {
    font-size: 1.5em;
    text-align: center;
  }
</style>
