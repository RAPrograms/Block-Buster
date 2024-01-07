<script lang="ts">
    import { fade } from "svelte/transition";

    class Question{
        resolver: (value: 0 | 1 | null | PromiseLike<0 | 1 | null>) => void
        question: string
        answer: string
        originalTeam

        constructor(question: string, answer: string, team: 0|1, resolver: (value: 0 | 1 | null | PromiseLike<0 | 1 | null>) => void) {
            this.resolver = resolver
            this.question = question
            this.answer = answer
            this.originalTeam = team
        }
    }

    let currentQuestion: Question | null
    let currentTeam: 0|1

    let error = false
    let guessValue = ""

    export function ask(question: string, answer: string, team: 0|1){
        currentTeam = team
        
        const promise = new Promise<0|1|null>(resolve => {
            currentQuestion = new Question(question, answer, team, resolve)
        })
        promise.then(() => {currentQuestion = null})

        return promise
    }

    function Guess(){
        //@ts-ignore
        if(!guessValue.includes(currentQuestion?.answer[0])){
            error = true
            return alert(`This word dosn't start with ${currentQuestion?.answer[0]}`)
        }

        if(currentTeam !== currentQuestion?.originalTeam){
            error = true
            currentQuestion?.resolver(null)
            return
        }

        if(guessValue.trim().replaceAll(' ', '') !== currentQuestion?.answer){
            currentTeam = (currentTeam == 0)? 1:0
            error = true
            guessValue = ""
            return
        }

        currentQuestion?.resolver(currentTeam)
    }
</script>

{#if currentQuestion}
    <section class="containor" data-team={currentTeam} in:fade={{ duration: 250 }} out:fade={{ duration: 450 }}>
        <form on:submit|preventDefault={Guess}>
            <header>
                <h1>Question</h1>
                <div>Team 1</div>
            </header>

            <div class="question">{currentQuestion.question}?</div>
    
            <input type="text" placeholder="Starts with a {currentQuestion.answer[0]}" on:input={() => {error = false}} class:error={error} bind:value={guessValue} required>
        
            <button type="submit">Guess</button>
        </form>
    </section>
{/if}

<style lang="scss">
    @keyframes shake {
        0% { transform: translate(0) }
        25% { transform: translate(-10px, 0px) }
        75% { transform: translate(10px, 1px) }
        100% { transform: translate(0) }
    }

    section.containor{
        background-color: color-mix(in oklab,var(--current-team), transparent 90%);
        transition: background-color 500ms ease-in;
        place-items: center;
        position: fixed;
        display: grid;
        height: 100vh;
        width: 100vw;
        left: 0;
        top: 0;

        &[data-team="0"]{ --current-team: var(--team-one-colour, red) }
        &[data-team="1"]{ --current-team: var(--team-two-colour, blue) }

        & > form{
            background-color: #515151;
            border-radius: 20px;
            max-width: 100vw;
            padding: 20px;
            width: 300px;

            & > header{
                margin-bottom: 10px;
                text-align: center;

                & > h1{ margin: 0; }
            }

            & > .question{
                text-align: center;
                margin-bottom: 10px;
                font-weight: bold;
                
            }

            & > input{
                outline: 1px solid white;
                box-sizing: border-box;
                border-radius: 10px;
                text-align: center;
                background: none;
                font-size: 20px;
                display: flex;
                width: 100%;
                padding: 10px;
                box-shadow: 0 0 0 transparent;
                transition: outline 0.5s;
                border: none;

                
                &.error{
                    outline-color: red;
                    animation: shake 0.2s ease-in-out 0s 2;
                    animation-iteration-count: 2; 
                }
            }

            & > button[type=submit]{
                outline: 2px solid rgb(0, 203, 0);
                margin: 15px auto 0 auto;
                color: rgb(0, 203, 0);
                border-radius: 10px;
                background: none;
                cursor: pointer;
                display: block;
                padding: 10px;
                width: 100%;
            }
        }
    }
</style>