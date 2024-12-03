<script>
  // import Input from "$lib/comp/Input.svelte";
</script>

<div id="search">
  <!-- <Input placeholder="Search" --width="20em" --font-size="1.25em" /> -->
   <input type="text" placeholder="Search" id="search-input" />
</div>

<style>
  #search {
    grid-area: search;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: black;
  }

  #search-input {
    width: 20em;
    font-size: 1.25em;
  }
</style>
