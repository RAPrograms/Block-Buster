<script lang="ts">
    import Modal from "./Modal.svelte";

    let promise: Promise<boolean> | undefined
    let close: (value: boolean | PromiseLike<boolean>) => void

    export let message: string
    export let denyText: string = "Cancel"
    export let acceptText: string = "Confirm"

    export function ask(){
        promise = new Promise<boolean>(resolve => {
            close = resolve
        })
        promise.then(() => { promise = undefined })

        return promise
    }
</script>

<Modal show={promise !== undefined}>
    <h1>{message}</h1>
    <section>
        <button on:click={() => {close(false)}}>{denyText}</button>
        <button on:click={() => {close(true)}}>{acceptText}</button>
    </section>
</Modal>

<style lang="scss">
    @import '../../assets/variables.scss';

    h1{
        margin: 0 0 10px 0;
        text-align: center;
    }

    section{
        display: flex;
        width: 100%;
        gap: 10px;

        & > button{
            &:nth-child(1){ @include FancyButton(red); }
            &:nth-child(2){ @include FancyButton(green); }

            flex: 1;
        }
    }
</style>
