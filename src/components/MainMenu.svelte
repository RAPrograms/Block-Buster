<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { templateStore } from '../lib/data';

    import Icon from './Icon.svelte'
    import banner from '/Banner.svg'

    const dispatch = createEventDispatcher();
</script>

<header>
    <div>
        <img src={banner} alt=""/>
    </div>
    <a href="https://github.com/Dog2657/Block-Buster" target="_blank" rel="noopener noreferrer">Made by Dog2657</a>
</header>

<main>
    <h2>Games</h2>
    <button class="new-game" on:click={() => {dispatch('createTemplate')}}>New Game</button>

    <section class="instances">
        {#await $templateStore}
            Loading
        {:then templates} 
            {#each templates as {name, id}}
                <article>
                    <button>{name}</button>
                    <button on:click={() => {dispatch("editTemplate", {id})}}>
                        <Icon name="edit" width=20 height=20/>
                    </button>
                </article>
            {/each}
        {/await}
    </section>
</main>

<div style="height: 1000px;"></div>

<style lang="scss">
    header{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        max-height: 200px;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
        padding: 10px 5px;
        background: #373737;
        box-shadow: 0px 4px 20px 3px rgba(0, 0, 0, 0.146);

        & > div{
            text-align: center;
            flex-grow: 1;
            position: relative;
            display: flex;
            width: max-content;
            overflow: hidden;
            justify-content: center;
        }

        & > a{
            color: white;
            
        }
    }

    main{
        & > h2{
            margin: 10px auto 2px auto;
            text-align: center;
        }

        & > button.new-game{
            cursor: pointer;
            width: 300px;
            padding: 10px;
            border: 2px solid white;
            margin: 2px auto 10px auto;
            border-radius: 10px;
            text-align: center;
            display: block;
            background: none;
            box-sizing: border-box;
        }

        & > .instances{
            grid-template-columns: auto auto auto;
            margin-top: 20px;
            display: grid;
            gap: 20px 30px;

            & > article{
                display: flex;
                gap: 5px;
    
                & > button{
                    background-color: white;
                    padding: 10px;
                    box-sizing: border-box;
                    transition: opacity 450ms ease-out;
                    cursor: pointer;
                    opacity: 1;

                    &:hover{
                        transition: opacity 250ms ease-in;
                        opacity: .7;
                    }
                }

                & > button:nth-child(1){
                    flex: 1;
                    border-radius: 15px 5px 5px 15px;
                    color: black;
                    font-size: 20px;
                    white-space: nowrap;
                    width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                & > button:nth-child(2){
                    border-radius: 5px 15px 15px 5px;
                    color: black
                }
            }
        }
    }
</style>