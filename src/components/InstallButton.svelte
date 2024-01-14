<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from "svelte";
    import { cubicInOut } from 'svelte/easing'
    import Icon from './Icon.svelte';

    let installPromptEvent: any
    let disabled = false

    function getPrompt(){
        window.addEventListener("beforeinstallprompt", async (event) => {
            event.preventDefault();
            installPromptEvent = event
        });
    }

    async function prompt(){
        const { outcome } = await installPromptEvent.prompt();
        if(outcome != "accepted")
            return getPrompt()

        disabled = true
    }

    onMount(() => { getPrompt()})
</script>

{#if !disabled && installPromptEvent}
    <button aria-label="Install app" on:click={prompt} transition:fade={{ delay: 250, duration: 400, easing: cubicInOut }}>
        <Icon name="download" width="30" height="30"/>
    </button>
{/if}

<style type="scss">
    button{
        transition: opacity 800ms ease-out;
        border-top-left-radius: 20px;
        justify-content: center;
        padding: 10px 0 2px 10px;
        align-items: center;
        background: brown;
        cursor: pointer;
        position: fixed;
        display: flex;
        border: none;
        opacity: 1;
        bottom: 0;
        gap: 10px;
        right: 0;

        &::after{
            content: "Install";
            transition: max-width 800ms ease-out;
            overflow: hidden;
            font-size: 30px;
            max-width: 0px;
        }

        &:hover, &:focus-within, &:focus{
            transition: opacity 400ms ease-out;
            opacity: .7;

            &::after{
                transition: max-width 400ms ease-out;
                max-width: 500px;
            }
        }
    }
</style>