<script lang="ts">
  import MainMenu from './components/MainMenu.svelte';
  import TemplateEditor from './components/TemplateEditor.svelte';

  import { templateStore, type template } from './lib/data';

  let templateInspecting: null | template = null
</script>

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