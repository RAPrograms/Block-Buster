<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { getScreenSize } from '../lib/general'

    import Board from '../lib/board'
    import Question from '../components/modals/Question.svelte';
    import { currentGame, type Game } from '../lib/data';

    //@ts-ignore
    const details: Game = $currentGame

    const currentTeam: {id: number, streak: number} = {id: -1, streak: 0}

    let askQuestion: (question: string, answer: string, team: 0 | 1) => Promise<0 | 1 | null>

    let canvas: HTMLCanvasElement
    let tileSize = 0
    let board = {x: 0, y: 0, width: 0, height: 0}

    onMount(() => {
        const root = document.querySelector(':root');

        //@ts-ignore
        root.style.setProperty('--team-one-colour', details.teams[0].colour);
        //@ts-ignore
        root.style.setProperty('--team-two-colour', details.teams[1].colour);

        //TODO: re-add code
        //currentTeam.id = (Math.random() > .5)? 1:0
        currentTeam.id = 0
    })

    onDestroy(() => {
        const root = document.querySelector(':root');

        //@ts-ignore
        root.style.removeProperty('--team-one-colour');
        //@ts-ignore
        root.style.removeProperty('--team-two-colour');
    })

    function calculatePositioning(canvas: HTMLCanvasElement){
        //@ts-ignore
        let game: Board = $currentGame?.board

        const a = 2 * Math.PI / 6;

        const tileRadius = ((canvas.height >= canvas.width)? canvas.width:canvas.height) / 5 / 2;

        tileSize = 2 * (Math.sqrt(3) / 2 * tileRadius)

        board.width = tileSize * game.matrix.length
        board.height = tileSize * (game.matrix.length + 1)

        board.x = (canvas.width > canvas.height)? (canvas.width / 2) - (board.width / 2) : 0
        board.y = (canvas.height > canvas.width)? (canvas.height / 2) - (board.height / 2) : 0

        let x = board.x
        let y = (tileSize / 1.5) + board.y

        for (let row=0; row<game.matrix.length; row++) {
            for(let colum=0; colum<5; colum++){
                const instance = game.getSlot(colum, row)

                x += tileRadius * (1 + Math.cos(a));

                if(colum % 2 == 0){
                    y = y + tileRadius * Math.sin(a);
                }else{
                    y = y - tileRadius * Math.sin(a);
                }

                instance.setPosition(x, y)
                instance.setSize(tileRadius)
            }
            y += tileRadius * .86
            x = board.x
        }
    }


    async function render(){
        if(canvas == null)
            return

        //@ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        //Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Board bounding box
        //ctx.fillRect(board.x, board.y, board.width, board.height)
      
        $currentGame?.board.render(ctx)

        requestAnimationFrame(render)
    }

    async function handelClick(e: MouseEvent){
        const {top, left} = canvas.getBoundingClientRect()

        const clickX = e.pageX - left
        const clickY = e.pageY - top

        if(clickX < board.x || clickY < board.y)
            return

        if((board.x + board.width) < clickX || (board.y + board.height) < clickY)
            return

        const instance = $currentGame?.board.getCollidingTile(clickX, clickY)
        if(instance == undefined)
            return

        if(instance.capured !== -1)
            return
        
        instance.capured = 0
        instance.colour = details.teams[0].colour
        
        const path = await details.board.getWiningPath()

        if(path != null)
            path.forEach(location => {
                const [colum, row] = location.split("|")
                details.board.matrix[Number(colum)][Number(row)].colour = "orange"
            })

        return
        //@ts-ignore
        const questions: Record<string, { answer: string; question: string; }[]> = $currentGame?.questions[instance.character.toLowerCase()]
        
        //@ts-ignore
        const questionIndex = Math.floor(Math.random() * questions?.length)
        const question = questions[questionIndex]

        //@ts-ignore
        const answerResult = await askQuestion(question.question, question.answer, currentTeam.id)
        //Both teams are wrong
        if(answerResult == null)
            return currentTeam.streak = 0

        //Set tile's team
        instance.capured = answerResult
        instance.colour = details.teams[answerResult].colour

        

        //Current team wrongly anwser && other team answers correctly  -> other team
        if(currentTeam.id !== answerResult){
            currentTeam.id = answerResult
            currentTeam.streak = 0
            return
        }


        //Current team correctly anwser | streak continues -> current team | streak++
        if(currentTeam.id === answerResult && (currentTeam.streak + 1) < details.streakLimit)
            return currentTeam.streak++

        //Current team correctly anwser | streak force stops -> other team
        else if(currentTeam.id === answerResult){
            currentTeam.id = (answerResult == 0)? 1:0
            currentTeam.streak = 0
            return
        }
    }


    function handelCanvas(canvas: HTMLCanvasElement){
        const { width, height } = getScreenSize()
        
        window.document.body.style.overflow = 'hidden'

        canvas.width = width
        canvas.height = height

        calculatePositioning(canvas)
        requestAnimationFrame(render)
        
        return {
            destroy() {
                window.document.body.style.overflow = ''
            }
        };
    }

    function handleReaize(){
        const {width, height} = getScreenSize()

        canvas.width = width
        canvas.height = height

        calculatePositioning(canvas)
 
    }
</script>

<Question bind:ask={askQuestion}/>

<svelte:window on:resize={handleReaize}/>

<canvas bind:this={canvas} on:click={handelClick} use:handelCanvas/>