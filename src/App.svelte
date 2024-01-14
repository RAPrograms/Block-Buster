<script lang="ts">
  import TemplateEditor from './components/TemplateEditor.svelte';
  import WinningModel from './components/modals/Winning.svelte';
  import MainMenu from './components/MainMenu.svelte';
  import Game from './components/Game.svelte';

  import { templateStore, type template, currentGame } from './lib/data';

  let templateInspecting: null | template = null
</script>

<WinningModel/>

{#if $currentGame == undefined || $currentGame?.wonBy !== -1}
  {#if templateInspecting == null}
    <MainMenu
      on:createTemplate={() => {templateInspecting = {name: "", grid_size: 5, questions: {}}}}
      on:editTemplate={(async ({detail}) => {
        //TODO: add loading screen
        templateInspecting = await templateStore.get(detail.id)
      })}
    />
  {:else}
    <TemplateEditor data={templateInspecting} on:close={() => {templateInspecting = null}}/>
  {/if}
{:else}
  <Game/>
{/if}