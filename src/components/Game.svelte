<script lang="ts">
    import { onMount } from 'svelte';
    import { countIntersects, getScreenSize } from '../lib/general'

    import { game, Tile } from '../lib/board'
    import { createExpect } from 'vitest';
 
    let canvas: HTMLCanvasElement
    let tileSize = 0
    let board = {x: 0, y: 0, width: 0, height: 0}

    function calculatePositioning(canvas: HTMLCanvasElement){
        const a = 2 * Math.PI / 6;

        const tileRadius = ((canvas.height >= canvas.width)? canvas.width:canvas.height) / 5 / 2;

        tileSize = 2 * (Math.sqrt(3) / 2 * tileRadius)

        board.width = tileSize * game.matrix.length
        board.height = tileSize * (game.matrix.length + 1)

        board.x = (canvas.width > canvas.height)? (canvas.width / 2) - (board.width / 2) : 0
        board.y = (canvas.height > canvas.width)? (canvas.height / 2) - (board.height / 2) : 0

        //canvas.getContext("2d")?.fillRect(board.x, board.y, 10, 10)

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
                instance.updateSize(tileRadius)
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

        ctx.fillRect(board.x, board.y, board.width, board.height)
      
        game.render(ctx)

        //ctx.fillRect(0)

        requestAnimationFrame(render)
    }

    function handelClick(e: MouseEvent){
        const {top, left} = canvas.getBoundingClientRect()

        const clickX = e.pageX - left
        const clickY = e.pageY - top

        if(clickX < board.x || clickY < board.y)
            return

        if((board.x + board.width) < clickX || (board.y + board.height) < clickY)
            return

        const instance = game.getCollidingTile(clickX, clickY)
        if(instance == undefined)
            return

        console.log(instance)
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

<svelte:window on:resize={handleReaize}/>

<canvas bind:this={canvas} on:click={handelClick} use:handelCanvas/>