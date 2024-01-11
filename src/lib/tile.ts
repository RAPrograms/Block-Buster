import { countIntersects } from "./general"
import { get } from "svelte/store"

export default class Tile{
    #corner_points: Array<{x: number, y: number}>
    #border_lines: Array<{x1: number, y1: number, x2: number, y2: number}>
    colour: string  = ""
    capured: -1 | 0 | 1 = -1
    character: string
    size: number = 0
    x: number = 0
    y: number = 0

    #updateData(){
        this.#corner_points = []
        this.#border_lines = []

        const size = this.size * .99
        const angle = 2 * Math.PI / 6
    
        for (var i = 0; i < 6; i++) {
            const x = this.x + size * Math.cos(angle * i)
            const y = this.y + size * Math.sin(angle * i)

            this.#corner_points.push({ x, y })

            this.#border_lines.push({x1: x, y1: y, x2: undefined, y2: undefined})
            
            if(i > 0){
                this.#border_lines[i-1].x2 = x
                this.#border_lines[i-1].y2 = y
            }
        }

        this.#border_lines[5].x2 = this.#border_lines[0].x1
        this.#border_lines[5].y2 = this.#border_lines[0].y1
    }

    setAll(x: number, y: number, size: number){
        this.x = x
        this.y = y
        this.size = size
        this.#updateData()
    }

    setPosition(x: number, y: number){
        this.setAll(x, y, this.size)
    }

    setSize(size: number){
        this.setAll(this.x, this.y, size)
    }

    inside(x: number, y: number){
        const line1 = {x1: 0, y1: 0, x2: x, y2: y}
        return countIntersects(line1, this.#border_lines) === 1
    }


    draw(context: CanvasRenderingContext2D){
        //Outer circle
        /*context.fillStyle
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();*/

        //Hexagon
        context.strokeStyle = "white"
        context.fillStyle = this.colour
        context.beginPath();
        this.#corner_points.forEach(({x, y}) => { context.lineTo(x, y) });
        context.lineTo(this.#corner_points[0].x, this.#corner_points[0].y)

        if(this.colour !== "") context.fill()
        
        context.stroke()

        //Character
        context.fillStyle = "rgb(255, 255, 255)"
        context.font = `${this.size}px Arial`;
        const wordWidth = context.measureText(this.character).width
        context.fillText(this.character, this.x - (wordWidth / 2), this.y + (this.size / 2.5));
    }


    constructor(character: string){
        this.character = character.toUpperCase()
        this.#corner_points = []
        this.#border_lines = []
    }

    static from(x: number, y: number, size: number, character: string = "a"){
        const instance = new Tile(character)
        instance.setAll(x, y, size)
        return instance
    }
}