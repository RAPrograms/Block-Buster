import { countIntersects, getSiblingTilePosition } from "./general"
import Tile from "./tile"

export default class Board{
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

                if(!instance.inside(x, y))
                    continue

                return instance
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


    #leftToRightWiningPath(team: 0|1, possition: [number, number], path: Array<string> = []): null | Array<string>{
        const instance = this.matrix[possition[0]]?.[possition[1]]
        if(instance == undefined)
            return null
        
        if(instance.capured !== team)
            return null


        if(path.includes(`${possition[0]}|${possition[1]}`))
            return null

        if(possition[0] == this.matrix.length - 1){
            path.push(`${possition[0]}|${possition[1]}`)
            return path
        }

        const new_path = path.slice(0)
        new_path.push(`${possition[0]}|${possition[1]}`)
        
        for(var i=0; i<6; i++){
            const result = this.#leftToRightWiningPath(team, getSiblingTilePosition(possition, i), new_path)
            if(result)
                return result
        }

        return null
    }
    

    getWiningPath(){


        const result = this.#leftToRightWiningPath(0, [0, 0])
        console.log("\nwining path", result)

        if(result != null)
            result.forEach(location => {
                const [colum, row] = location.split("|")
                this.matrix[Number(colum)][Number(row)].colour = "orange"
            })

        /*for(var i=0; i<this.matrix.length; i++){
            this.#leftToRightWiningPath(1, [0, i], [])
        }*/
    }
}