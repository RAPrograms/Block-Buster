import { countIntersects } from "./general"

export class Tile{
    corner_points: Array<{x: number, y: number}>
    capured: -1 | 0 | 1 = -1
    character: string
    size: number = 0
    x: number = 0
    y: number = 0

    updateCorners(){
        this.corner_points = []

        const size = this.size * .99

        const angle = 2 * Math.PI / 6
    
        for (var i = 0; i < 6; i++) {
            this.corner_points.push({
                x: this.x + size * Math.cos(angle * i),
                y: this.y + size * Math.sin(angle * i)
            })
        }
    }


    setPosition(x: number, y: number){
        this.x = x
        this.y = y
        this.updateCorners()
    }

    updateSize(size: number){
        this.size = size
        this.updateCorners()
    }


    draw(context: CanvasRenderingContext2D){
        //Outer circle
        context.fillStyle = "rgb(255, 0, 0)"
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();

        //Hexagon
        context.fillStyle = "rgb(0, 255, 0)"
        context.beginPath();
        this.corner_points.forEach(({x, y}) => { context.lineTo(x, y) });
        context.fill()

        //Character
        context.fillStyle = "rgb(255, 255, 255)"
        context.font = `${this.size}px Arial`;
        const wordWidth = context.measureText(this.character).width
        context.fillText(this.character, this.x - (wordWidth / 2), this.y + (this.size / 2.5));
    }

    constructor(character: string){
        this.character = character.toUpperCase()
        this.corner_points = []
    }
}

class board{
    matrix: Array<Array<Tile>> = []

    constructor(size: number, possibleCharacters: Array<string>){
        const temp: Array<number> = []

        for(let i=0; i<size; i++){
            this.matrix.push(new Array(size).fill(undefined).map(() => {
                let index = -1

                while(index === -1 || temp.includes(index)){
                    index = Math.round(Math.random() * (possibleCharacters.length - 1))
                }

                if(possibleCharacters.length < 3 || temp.length >= 3)
                    temp.splice(0, 1)

                temp.push(index)

                return new Tile(possibleCharacters[index])
            }))
        }
    }

    getSlot(colum: number, row: number){
        return this.matrix[colum][row]
    }

    getCollidingTile(x: number, y: number){
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix.length; j++) {
                const instance = this.matrix[i][j]

                if(x < (instance.x - instance.size) || y < (instance.y - instance.size))
                    continue

                if((instance.x + instance.size) < x || (instance.y + instance.size) < y)
                    continue

                    
                const lines = instance.corner_points.map(({x, y}, i) => {
                    const next = instance.corner_points[ (i >= instance.corner_points.length -1)? 0 : i+1]
                    
                    return {x1: x, y1: y, x2: next.x, y: next.y}
                })
                //console.log(countIntersects({x1: 0, y1: instance.y, x2: x, y2: y}, lines))
            }
        }
    }


    render(context: CanvasRenderingContext2D){
        this.matrix.forEach(elements => {
            elements.forEach(instance => {
                instance.draw(context)
            })
        });
    }
}

export let game = new board(5, ["a", "b", "c", "d", "e", "f", "g"])