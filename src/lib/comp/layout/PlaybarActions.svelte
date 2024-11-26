<script lang="ts">
  let rating = 3;
</script>

<div id="actions">
  <div id="rating">
    {#each { length: 5 } as _, i}
      <div
        class="star icon"
        style:color={rating > i ? "var(--lime)" : "var(--jet)"}
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
      <div id="volume-slider">
        <div id="volume-slider-value"></div>
      </div>
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
