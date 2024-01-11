<script lang="ts">
    import { templateStore, currentGame, type template } from '../../lib/data';
    import { ForceNumberInput, getEventTarget } from '../../lib/general';

    import Icon from "../Icon.svelte";
    import Modal from "./Modal.svelte";

    let gameid: undefined | string = undefined
    let form: HTMLFormElement

    export function open(id: string){ gameid = id }

    function handleColourChange(e: Event & { currentTarget: EventTarget & HTMLInputElement; }){
        const input: HTMLInputElement = getEventTarget(e)
        input?.parentElement?.parentElement?.style.setProperty("--colour", input.value)
    }

    function play(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement; }){
        const form: HTMLFormElement = getEventTarget(e)
        currentGame.start(
            //@ts-ignore
            gameid, 
            //@ts-ignore
            Number(form.querySelector("input[type=number][name=streak-limit]").value),
            {
                //@ts-ignore
                name: form.querySelector('input[name=team-one-name]').value,
                //@ts-ignore
                colour: form.querySelector('article > label > input[type=color]').value
            },
            {
                //@ts-ignore
                name: form.querySelector('input[name=team-one-name]').value,
                //@ts-ignore
                colour: form.querySelector('article > label > input[type=color]').value
            }
        )
    }
</script>

<Modal show={gameid !== undefined}>
    <form on:submit|preventDefault={play}>
        <h1>Start Game</h1>

        <label class="streak-maximum">
            <input type="number" name="streak-limit" value="5" on:change={(e) => {
                const input = getEventTarget(e)
                const number = Number(input.value)

                if(Number.isNaN(number) || number < 1)
                    return input.value = "1"

                input.value = String(number)
            }} on:keydown={ForceNumberInput}>
            <div>Team streak limit</div>
        </label>

        <hr/>

        <section class="teams">
            <article style="--colour: #FF0000">
                <label>
                    <Icon name="edit" width="30" height="30"/>
                    <input type="color" value="#FF0000" on:input={handleColourChange}>
                </label>
                <input type="text" placeholder="Team 1" name="team-one-name" required>
            </article>
            <article style="--colour: #0000FF">
                <label>
                    <Icon name="edit" width="30" height="30"/>
                    <input type="color" value="#0000FF" on:input={handleColourChange}>
                </label>
                <input type="text" placeholder="Team 2" name="team-two-name" required>
            </article>
        </section>

        <section class="buttons">
            <button type="button" on:click={() => {gameid = undefined}}>Cancel</button>
            <button type="submit">Play</button>
        </section>
    </form>
</Modal>

<style lang="scss">
    @import '../../assets/variables.scss';

    form{
        & > h1{
            text-align: center;
            margin: 0 0 10px 0;
        }

        & > label.streak-maximum{
            @include FancyInput(#515151);
            margin: 15px 0 10px 0;

            & > input{text-align: center;}
        }

        & > hr{
            margin: 15px 0;
        }

        & > section.teams > article{
            display: flex;
            border-radius: 10px;
            outline: 1px solid var(--colour);
            box-sizing: border-box;
            height: 40px;

            &:not(:last-child){
                margin-bottom: 15px;
            }

            & > label{
                scale: 70%;
                border-radius: 5px;
                display: grid;
                place-items: center;
                height: 100%;
                aspect-ratio: 1/1;
                background-color: var(--colour);

                & > input{
                    visibility: hidden;
                    position: absolute;
                    width: 0;
                    height: 0;
                }
            }
            & > input{
                height: 100%;
                flex: 1;
                box-sizing: border-box;

                border-radius: 0 10px 10px 0;
                outline: transparent;
                border: none;
                background: none;
            }
        }

        & > section.buttons{
            display: flex;
            margin-top: 20px;
            gap: 10px;

            & > button{
                flex: 1;
                padding: 10px;
                box-sizing: border-box;

                &:nth-child(1){
                    @include FancyButton(red);
                }
                &:nth-child(2){
                    @include FancyButton(green);
                }
            }
        }
    }
</style>