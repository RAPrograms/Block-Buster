export default class Tile{
    #corner_points: Array<{x: number, y: number}>
    #border_lines: Array<{x1: number, y1: number, x2: number, y2: number}>

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


    setPosition(x: number, y: number){
        this.x = x
        this.y = y
        this.#updateData()
    }

    setSize(size: number){
        this.size = size
        this.#updateData()
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
        this.#corner_points.forEach(({x, y}) => { context.lineTo(x, y) });
        context.fill()

        //Character
        context.fillStyle = "rgb(255, 255, 255)"
        context.font = `${this.size}px Arial`;
        const wordWidth = context.measureText(this.character).width
        context.fillText(this.character, this.x - (wordWidth / 2), this.y + (this.size / 2.5));
    }

    constructor(character: string){
        this.character = character.toUpperCase()
        this.#corner_points = []
    }
}