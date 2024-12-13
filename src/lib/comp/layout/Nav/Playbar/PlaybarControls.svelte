<script lang="ts">
  import { formatTime } from "$lib";
  import { appState } from "$lib/state.svelte";
  import { onMount } from "svelte";

  let {
    audioPlayer = $bindable(),
    settings = $bindable(),
  }: {
    audioPlayer?: HTMLAudioElement;
    settings: { shuffle: boolean; loop: boolean; loopOne: boolean };
  } = $props();

  let currentTime = $state(0);
  let duration = $state(0);
  let paused = $state(true);

  // UPDATING PLAYBAR DISPLAY STATS
  onMount(() => {
    setInterval(() => {
      currentTime = audioPlayer?.currentTime || 0;
      duration = audioPlayer?.duration || 0;
      paused = audioPlayer?.paused || audioPlayer == undefined;
    }, 50);
  });

  // SKIPPING
  function handleScrubClick(dir: -1 | 1) {
    if (audioPlayer) {
      audioPlayer.currentTime += 5 * dir;
    }
  }

  // PAUSING
  function handlePause() {
    if (audioPlayer) {
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    }
  }

  // SEEKING
  function handleSeek(e: MouseEvent) {
    if (audioPlayer) {
      let target = e.target! as HTMLElement;
      if (target.id == "progress-bar") {
        target = target.parentElement!;
      }

      let pos =
        Math.floor(
          ((e.clientX - target.offsetLeft) / target.clientWidth) * 100,
        ) / 100;
      audioPlayer.currentTime = audioPlayer.duration * pos;
    }
  }
</script>

<div id="playback-controls">
  <div id="controls">
    <!-- SHUFFLE -->
    <button
      id="shuffle-button"
      class="nostyle icon"
      class:enabled={settings.shuffle}
      onclick={(e) => {
        settings.shuffle = !settings.shuffle;
        if (!settings.shuffle) appState.playedIndexes = [];
      }}>shuffle</button
    >

    <!-- PREVIOUS -->
    <button id="previous-button" class="nostyle icon">skip_previous</button>

    <!-- REWIND -->
    <button
      id="skip-back-button"
      class="nostyle icon"
      onclick={() => handleScrubClick(-1)}
    >
      fast_rewind
    </button>

    <!-- PAUSE/PLAY -->
    <button id="play-button" class="nostyle icon" onclick={handlePause}>
      {paused ? "play_circle_filled" : "pause_circle_filled"}
    </button>

    <!-- FAST FORWARD -->
    <button
      id="skip-button"
      class="nostyle icon"
      onclick={() => handleScrubClick(1)}
    >
      fast_forward
    </button>

    <!-- SKIP -->
    <button id="next-button" class="nostyle icon">skip_next</button>

    <!-- REPEAT -->
    <button
      id="repeat-button"
      class="nostyle icon"
      class:enabled={settings.loop || settings.loopOne}
      onclick={(e) => {
        if (settings.loopOne) {
          settings.loopOne = false;
          settings.loop = false;
        } else if (!settings.loop) {
          settings.loop = true;
        } else if (!settings.loopOne) {
          settings.loop = false;
          settings.loopOne = true;
        }
      }}>{settings.loopOne ? "repeat_one" : "repeat"}</button
    >
  </div>

  <div id="progress-bar-container">
    <div class="time-text">{formatTime(currentTime) || "0:00"}</div>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="nostyle" id="progress-bar-bg" onclick={handleSeek}>
      <div
        id="progress-bar"
        style:width={`${(currentTime / duration) * 100}%`}
      ></div>
    </button>
    <div class="time-text">{formatTime(duration) || "0:00"}</div>
  </div>
</div>

<style>
  #playback-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  #controls {
    font-size: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25em;
  }

  #play-button {
    font-size: 1.25em;
  }

  #progress-bar-container {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  #progress-bar-bg {
    background: var(--jet);
    width: 25em;
    height: 0.4em;
    border-radius: 0.2em;
    overflow: hidden;
  }

  #progress-bar {
    width: 0%;
    height: 100%;
    background: var(--lime);
    border-radius: 0.2em;
  }

  .time-text {
    margin-bottom: 0.15em;
  }

  .enabled {
    color: var(--lime);
  }
</style>
