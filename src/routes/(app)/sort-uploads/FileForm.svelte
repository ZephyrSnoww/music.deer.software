<script lang="ts">
  import type { MP3TagTags } from "mp3tag.js/types/tags";
  import DangerousButton from "./DangerousButton.svelte";
  import { enhance } from "$app/forms";

  let {
    file,
  }: {
    file: {
      filename: string;
      data: MP3TagTags;
      cover: string;
    };
  } = $props();

  let action = $state("?/submit");

  let allArtists = $state(file.data.v2?.TPE1?.split(", ") || []);
  let allArtistsString = $derived(allArtists.join(", "));
</script>

<form method="POST" {action} class="file" use:enhance>
  <!-- COVER ART -->
  {#if file.data.v2?.APIC?.[0]}
    <img
      src={`data:${file.data.v2!.APIC![0].format};base64,${file.cover}`}
      alt=""
      class="cover"
    />
  {:else}
    <img src="/placeholder-cover.png" alt="" class="cover" />
  {/if}

  <!-- HIDDEN INPUTS FOR SERVERSIDE INFO -->
  <input
    type="text"
    name="filename"
    value={file.filename}
    style:display="none"
  />

  <input
    type="text"
    name="artists"
    value={allArtistsString}
    style:display="none"
  />

  <!-- SONG INFO -->
  <div class="info">
    <div class="filename">{file.filename}</div>

    <label>
      <span>Title:</span>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={file.data.v2?.TIT2}
      />
    </label>

    <label>
      <span>Album:</span>
      <input
        type="text"
        name="album"
        placeholder="Album (If left blank, will default to track title)"
        value={file.data.v2?.TALB}
      />
    </label>

    <!-- <LabelledInput label="Title:" name="title" placeholder="Title" value={file.data.v2?.TIT2} /> -->
    <!-- <LabelledInput label="Album:" name="album" placeholder="Album (If left blank, will default to track title)" value={file.data.v2?.TALB} /> -->

    <span class="artists-input">
      <span>Artist(s):</span>
      {#each allArtists as artistName, i}
        <input
          type="text"
          bind:value={allArtists[i]}
          style:width={`${allArtists[i].length + 5}ch`}
        />
        {#if i > 0}
          <button
            class="remove-button"
            onclick={(e) => {
              e.preventDefault();
              allArtists.splice(i, 1);
            }}>-</button
          >
        {/if}
      {/each}

      <button
        onclick={(e) => {
          e.preventDefault();
          allArtists.push("");
        }}>+</button
      >
    </span>

    <!-- <LabelledInput label="Artist(s):" name="artists" placeholder="Artist(s)" value={file.data.v2?.TPE1} /> -->
    <!-- <LabelledInput label="Genre:" name="genre" placeholder="Genre" value={file.data.v2?.TCON} /> -->
    <!-- <LabelledInput label="Track Number:" name="trackNum" placeholder="Track Number" value={file.data.v1?.track} /> -->
    <!-- <LabelledInput label="Year:" name="year" placeholder="Release Year" value={file.data.v1?.year} /> -->
  </div>

  <div class="buttons">
    <DangerousButton
      onclick={() => {
        action = "?/submit";
      }}
      --background="var(--lime)">Submit</DangerousButton
    >
    <DangerousButton
      onclick={() => {
        action = "?/delete";
      }}
      --background="var(--red)">Remove</DangerousButton
    >
  </div>
</form>

<style>
  .file {
    display: flex;
    gap: 0.5em;
    border: 1px solid var(--lime);
    width: 100%;
  }

  .cover {
    aspect-ratio: 1;
    object-fit: cover;
    width: 10em;
  }

  .info {
    flex: 1 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0.25em 0;
    gap: 0.25em;
  }

  label {
    width: 100%;
    display: flex;
    gap: 0.25em;
  }

  label > input {
    flex: 1 0;
  }

  .artists-input {
    width: 100%;
    display: flex;
    gap: 0.25em;
    flex-wrap: wrap;
  }

  .buttons {
    flex: 0 0 5em;
    display: flex;
    flex-direction: column;
  }

  .remove-button {
    background: var(--red);
    padding: 0;
    width: 2ch;
    margin-left: -2ch;
  }
</style>
