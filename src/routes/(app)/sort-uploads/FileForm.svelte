<script lang="ts">
  import type { MP3TagTags } from "mp3tag.js/types/tags";
  import LabelledInput from "./LabelledInput.svelte";

  let {
    file
  }: {
    file: {
      filename: string;
      data: MP3TagTags;
      cover: string;
    }
  } = $props();
</script>

<form method="POST" class="file">
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

  <!-- SONG INFO -->
  <div class="info">
    <div class="filename">{file.filename}</div>
    <LabelledInput label="Title:" name="title" placeholder="Title" value={file.data.v1?.title} />
    <LabelledInput label="Album:" name="album" placeholder="Album" value={file.data.v1?.album} />
    <LabelledInput label="Artist(s):" name="artists" placeholder="Artist(s)" value={file.data.v1?.artist} />
    <LabelledInput label="Genre:" name="genre" placeholder="Genre" value={file.data.v2?.TCON} />
    <LabelledInput label="Track Number:" name="trackNum" placeholder="Track Number" value={file.data.v1?.track} />
    <LabelledInput label="Year:" name="year" placeholder="Release Year" value={file.data.v1?.year} />
  </div>

  <button class="submit-button">Submit</button>
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

  .submit-button {
    flex: 0 0 5em;
    /* margin-left: 1em; */
    background: var(--lime);
    color: var(--black);
  }
</style>
