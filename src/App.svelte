<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './components/Counter.svelte'
  import Game from './components/Game.svelte';

  let active = true
</script>
  <!--<button on:click={() => {active = false}}>stop</button>-->

{#if active}
  <Game/>
{/if}
