<script lang="ts">
    import { removeTeamCSSColours } from "../../lib/general";
    import { currentGame } from "../../lib/data";
    import { onDestroy } from "svelte";

    import Icon from "../Icon.svelte";
    import Modal from "./Modal.svelte";

    onDestroy(() => { removeTeamCSSColours() })
</script>

<Modal show={$currentGame !== undefined && $currentGame.wonBy !== -1}>
    <section data-team={$currentGame?.wonBy}>
        <h1>Game Finished</h1>

        <Icon name="cup" width="100" height="120"/>

        <footer>
            <div>Congratulations</div>
            <div>{$currentGame?.teams[$currentGame?.wonBy].name}</div>
        </footer>

        <button on:click={currentGame.end}>Close</button>
    </section>
</Modal>

<style lang="scss">
    @import '../../assets/variables.scss';

    :global(.model-containor:has(section[data-team="0"])){ --backdrop-color: color-mix(in oklab, var(--team-one-colour, red), transparent 80%); }
    :global(.model-containor:has(section[data-team="1"])){ --backdrop-color: color-mix(in oklab, var(--team-two-colour, blue), transparent 80%); }

    section{
        & > h1{
            margin: 0 auto;
            text-align: center;
        }

        & > :global(svg){
            color: #FFD700;
            margin: 0 auto;
            display: block;
        }

        & > footer{
            text-align: center;
            max-width: 400px;

            & > div:nth-child(1){
                font-style: italic;
            }

            & > div:nth-child(2){
                color: #FFD700;
                width: 100%;
                font-size: 25px;
                word-break: break-all;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;  
                overflow: hidden;
            }
        }

        & > button{
            @include FancyButton(rgb(228, 220, 220));
            margin-top: 20px;
            width: 100%;
        }
    }
</style>