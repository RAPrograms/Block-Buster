<script lang="ts">
    import { destructureQuestions, getEventTarget, structureQuestions } from '../lib/general'
    import { templateStore, type template } from '../lib/data';
    import { createEventDispatcher } from 'svelte';
    import { get, writable } from 'svelte/store';

    import ConformationModal from './Modals/Conformation.svelte';
    import Icon from "./Icon.svelte"

    export let data: template

    const dispatch = createEventDispatcher();

    let confirmDelete: () => Promise<boolean>

    let questions = (() => {
        const store = writable(destructureQuestions(data.questions))
        if(get(store).length <= 0)
            store.set([{answer: "", question: ""}])

        return {
            subscribe: store.subscribe,
            set: store.set,
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
        const template = data

        if(template.grid_size > 15)
            template.grid_size = 15
        else if(template.grid_size < 5)
            template.grid_size = 5

        template.questions = structureQuestions($questions)

        if(template.id == undefined)
            templateStore.add(template)
        else
            templateStore.set(template.id, template)

        dispatch("close")
    }


    export function gridSize(node: HTMLInputElement) {
        node.addEventListener('keydown', (e) => {
            const key = e.key || e.keyCode;

            if(key === "Backspace")
                return

            if(Number.isNaN(Number(key)))
                return e.preventDefault()
        })
        node.addEventListener('change', e => {
            const input: HTMLInputElement = getEventTarget(e)
            const number = Number(input.value)

            if(Number.isNaN(number))
                return input.value = "5"

            if(number > 15)
                return input.value = "15"
            
            if(number < 5)
                return input.value = "5"
        })

        return { destroy(){} };
    }
</script>

<ConformationModal message="Delete Template?" bind:ask={confirmDelete}/>

<form on:submit|preventDefault={save}>
    <header>
        <label class="name">
            <div>Name</div>
            <input type="text" required placeholder="" bind:value={data.name}>
        </label>
        <label class="grid-size">
            <div>Grid Size</div>
            <input type="number" inputmode="numeric" required placeholder="" use:gridSize bind:value={data.grid_size}>
        </label>
        {#if data.id}
            <button type="button" on:click={async() => {
                if(!(await confirmDelete()))
                    return

                //TODO: show loading icon
                //@ts-ignore
                await templateStore.delete(data.id)
                dispatch("close")
            }}>
                <Icon name="bin" width=25 height=25/>
            </button>
        {/if}
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
        flex-direction: column;
        display: flex;
        flex: 1;

        & > header{
            margin-bottom: 10px;
            align-items: center;
            display: flex;

            & > label{
                &:first-child{ flex: 1; }

                border: 1px solid white;
                box-sizing: border-box;
                border-radius: 5px;
                position: relative;
                min-height: 40px;
                display: block;
                color: white;
                margin: 10px;
                height: 100%;

                & > div{
                    background-color: #242424;
                    position: absolute;
                    padding: 0 5px;
                    top: -32%;
                    left: 5px;
                }

                & > input{
                    border-radius: inherit;
                    box-sizing: border-box;
                    padding: 5px 10px;
                    background: none;
                    color: white;
                    height: 40px;
                    border: none;
                    width: 100%;
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
                grid-template-columns: 40px 1fr 40px; 
                outline: 1px solid white;
                grid-template-rows: 1fr; 
                grid-auto-columns: 1fr; 
                grid-auto-rows: 1fr; 
                display: grid; 
                padding: 10px;
                gap: 0px 0px; 
                grid-template-areas: 
                    ". Name Add"; 

                & > div:nth-child(2){
                    text-align: center;
                    grid-area: Name;
                }
                & > button:nth-child(3){
                    cursor: pointer;
                    grid-area: Add;
                }
            }

            & > section {
                overflow-y: scroll;
                height: 300px;
                flex: 1;

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