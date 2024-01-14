<script lang="ts">
    import { fade } from "svelte/transition";

    export let show = false
</script>

{#if show}
    <div class="model-containor" in:fade={{ duration: 250 }} out:fade={{ duration: 450 }}>
        <section class="model">
            <slot/>
        </section>
    </div>
{/if}

<style lang="scss">
    div.model-containor{
        background-color: var(--backdrop-color, rgba(0, 0, 0, 0.368));
        place-items: center;
        position: fixed;
        display: grid;
        z-index: 10;
        height: 100vh;
        width: 100vw;
        left: 0;
        top: 0;

        & > section{
            box-shadow: 0px 0px 300px 5px #515151; 
            background-color: #515151;
            box-sizing: border-box;
            padding: 30px;
            max-width: 100%;

            @media (width <= 400px) { width: 100vw; }
            @media (width > 400px) {
                border-radius: 10px;
                min-width: 400px;
            }
        }
    }
</style>