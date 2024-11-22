<script lang="ts">
</script>

<div id="playback-controls">
  <div id="controls">
    <button id="shuffle-button" class="icon">shuffle</button>
    <button id="previous-button" class="icon">skip_previous</button>
    <button id="skip-back-button" class="icon">fast_rewind</button>
    <button id="play-button" class="icon">play_circle_filled</button>
    <button id="skip-button" class="icon">fast_forward</button>
    <button id="next-button" class="icon">skip_next</button>
    <button id="repeat-button" class="icon">repeat</button>
  </div>

  <div id="progress-bar-container">
    <div class="time-text">0:00</div>
    <div id="progress-bar-bg">
      <div id="progress-bar"></div>
    </div>
    <div class="time-text">0:00</div>
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
    width: 33%;
    height: 100%;
    background: var(--lime);
  }

  .time-text {
    margin-bottom: 0.15em;
  }
</style>
