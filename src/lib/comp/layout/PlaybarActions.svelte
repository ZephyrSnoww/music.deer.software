<script lang="ts">
  import { onMount } from "svelte";
  import { appState } from "$lib/state.svelte";

  let {
    audioPlayer = $bindable(),
  }: {
    audioPlayer?: HTMLAudioElement;
  } = $props();

  let volume = $state(0);

  onMount(() => {
    setInterval(() => {
      volume = audioPlayer?.volume || 0;
    }, 50);
  });

  function handleVolumeChange(e: MouseEvent) {
    if (audioPlayer) {
      let target = e.target! as HTMLElement;
      if (target.id == "volume-slider-value") {
        target = target.parentElement!;
      }

      let pos = ((e.clientX - target.offsetLeft) / target.clientWidth);
      console.log(pos);
      audioPlayer.volume = pos;
    }
  }
</script>

<div id="actions">
  <div id="rating">
    {#each { length: 5 } as _, i}
      <div
        class="star icon"
        style:color={(appState.nowPlaying?.ratings?.[0]?.rating || 0) > i ? "var(--lime)" : "var(--jet)"}
      >
        star
      </div>
    {/each}
  </div>

  <div id="controls">
    <button id="like-button" class="nostyle icon">favorite</button>
    <button id="queue-button" class="nostyle icon">queue</button>
    <div id="volume">
      <button id="volume-button" class="nostyle icon">volume_up</button>
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="nostyle" id="volume-slider" onclick={handleVolumeChange}>
        <div id="volume-slider-value" style:width={`${volume * 100}%`}></div>
      </button>
    </div>
  </div>
</div>

<style>
  #actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-right: 1em;
    gap: 0.25em;
  }

  #rating {
    display: flex;
  }

  #controls {
    display: flex;
    gap: 0.5em;
  }

  #volume {
    display: flex;
    align-items: center;
    gap: 0.25em;
  }

  #volume-slider {
    height: 0.4em;
    background: var(--jet);
    border-radius: 0.2em;
    overflow: hidden;
    width: 4em;
  }

  #volume-slider-value {
    background: var(--lime);
    width: 75%;
    height: 100%;
    border-radius: 0.2em;
  }
</style>
