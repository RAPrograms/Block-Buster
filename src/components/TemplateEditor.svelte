<script lang="ts">
    import type { template } from '../lib/data';
    import { get, writable } from 'svelte/store';
    import { createEventDispatcher, onMount } from 'svelte';
    import { destructureQuestions, structureQuestions } from '../lib/general'

    import Icon from "./Icon.svelte"

    export let data: template

    const dispatch = createEventDispatcher();

    let questions = (() => {
        const store = writable(destructureQuestions(data.questions))
        if(get(store).length <= 0)
            store.set([{answer: "", question: ""}])

        return {
            subscribe: store.subscribe,
            new: () => {
                const temp = get(store)
                temp.unshift({answer: "", question: ""}) 
                store.set(temp)
            },
            remove: (index: number) => {
                const temp = get(store)
                temp.splice(index, 1);
                store.set(temp)
            }
        }
    })()

    function save(){
        console.log($questions)
    }
</script>
<form on:submit|preventDefault={save}>
    <header>
        <label class="name">
            <div>Name</div>
            <input type="text" required placeholder="" value={data.name || ""}>
        </label>
        <label class="grid-size">
            <div>Grid Size</div>
            <input type="text" required placeholder="" value={data.grid_size || ""}>
        </label>
        <button type="button">
            <Icon name="bin" width=25 height=25/>
        </button>
    </header>

    <section class="questions">
        <header>
            <div></div>
            <div>Questions</div>
            <button type="button" on:click={questions.new}>
                <Icon name="plus" width=20 height=20/>
            </button>
        </header>
        <section>
            <header>
                <div>Answer</div>
                <div>Question</div>
            </header>
            {#each $questions as _, i}
                <div>
                    <input type="text" required bind:value={$questions[i].answer}>
                    <input type="text" required bind:value={$questions[i].question}>
                    
                    <button type="button" disabled={$questions.length <= 1} on:click={() => {questions.remove(i)}}>
                        <Icon name="cross" width=20 height=20/>
                    </button>
                </div>
            {/each}
        </section>
    </section>

    <section class="actions">
        <button on:click={() => {dispatch("close")}}>Cancel</button>
        <button type="submit">Save</button>
    </section>
</form>

<style lang="scss">
    @import '../assets/variables.scss';

    form{
        flex: 1;
        display: flex;
        flex-direction: column;

        & > header{
            display: flex;
            margin-bottom: 10px;
            align-items: center;

            & > label{
                &:first-child{ flex: 1; }

                margin: 10px;
                border: 1px solid white;
                box-sizing: border-box;
                border-radius: 5px;
                position: relative;
                display: block;
                color: white;
                height: 100%;
                min-height: 40px;
                display: block;

                & > div{
                    position: absolute;
                    top: -32%;
                    left: 5px;
                    background-color: #242424;
                    padding: 0 5px;
                }

                & > input{
                    background: none;
                    padding: 5px 10px;
                    color: white;
                    box-sizing: border-box;
                    width: 100%;
                    height: 40px;
                    border-radius: inherit;
                    border: none;
                }
            }

            & > button{
                @include FancyButton(red);
                height: 40px;
                padding: 5px;
            }
        }

        & > section.questions{
            flex: 1;
            border: 2.5px solid white;
            border-radius: 5px;
            margin: 0 10px;

            & > header{
                display: grid; 
                grid-auto-columns: 1fr; 
                grid-auto-rows: 1fr; 
                grid-template-columns: 40px 1fr 40px; 
                grid-template-rows: 1fr; 
                gap: 0px 0px; 
                outline: 1px solid white;
                padding: 10px;
                grid-template-areas: 
                    ". Name Add"; 

                & > div:nth-child(2){
                    grid-area: Name;
                    text-align: center;
                }
                & > button:nth-child(3){
                    grid-area: Add;
                    cursor: pointer;
                }
            }

            & > section {
                flex: 1;
                overflow-y: scroll;
                height: 300px;

                & > header > * {
                    font-weight: bold;
                }
                & > *{
                    grid-template-areas: "answer question delete"; 
                    grid-template-columns: 1fr 2fr 32px; 
                    margin: 20px 10px 0 10px;
                    grid-template-rows: 1fr; 
                    grid-auto-columns: 1fr; 
                    grid-auto-rows: 1fr; 
                    display: grid; 
                    gap: 20px; 
                    
                    //Header and questions
                    & > :nth-child(1){ grid-area: answer; }
                    & > :nth-child(2){ grid-area: question; }
                    & > button:nth-child(3){ grid-area: delete; }
                    & > *{ width: 100%; }

                    & > button{
                        @include FancyButton(red);
                        padding: 5px;
                    }
                }
            }
        }

        & > section.actions{
            margin: 25px 10px 10px 10px;
            box-sizing: border-box;
            display: flex;
            gap: 20px;

            & > button{
                flex: 1;
                padding: 20px 10px;

                &:nth-of-type(1){ @include FancyButton(red); }
                &:nth-of-type(2){ @include FancyButton(rgb(1, 205, 1)); }
            }
        }
    }
</style>