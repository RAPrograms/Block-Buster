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
    
    #recursiveWiningPathCheck(team: 0|1, possition: [number, number], conditionCheck: (position: [number, number], boardSize: number) => boolean, path: Array<string> = []): null | Array<string>{
        //Base
        const instance = this.matrix[possition[0]]?.[possition[1]]
        if(instance == undefined)
            return null


        if(instance.capured !== team)
            return null


        if(path.includes(`${possition[0]}|${possition[1]}`))
            return null

        if(conditionCheck(possition, this.matrix.length)){
            path.push(`${possition[0]}|${possition[1]}`)
            return path
        }

        //Recursion
        const new_path = path.slice(0)
        new_path.push(`${possition[0]}|${possition[1]}`)

        for(var i=0; i<6; i++){
            const path = this.#recursiveWiningPathCheck(team, getSiblingTilePosition(possition, i), conditionCheck, new_path)
            if(path) return path
        }

        return null
    }

    async getWiningPath(){
        const horizontalCheck = (possition: [number, number], size: number) => { return possition[0] == size - 1 }
        const verticalCheck = (possition: [number, number], size: number) => { return possition[1] == size - 1 }
        
        interface responseContent{
            result: string[] | null,
            team: number
        }

        const pathPromises: Array<Promise<responseContent>> = []

        for(let i=0; i<this.matrix.length; i++){
            //Team 1
            pathPromises.push(new Promise<responseContent>(resolve => { resolve({result: this.#recursiveWiningPathCheck(0, [0, i], horizontalCheck), team: 0}) }))
            pathPromises.push(new Promise<responseContent>(resolve => { resolve({result: this.#recursiveWiningPathCheck(0, [i, 0], verticalCheck), team: 0}) }))

            //Team 2
            pathPromises.push(new Promise<responseContent>(resolve => { resolve({result: this.#recursiveWiningPathCheck(1, [0, i], horizontalCheck), team: 1}) }))
            pathPromises.push(new Promise<responseContent>(resolve => { resolve({result: this.#recursiveWiningPathCheck(1, [i, 0], verticalCheck), team: 1}) }))
        }

        await Promise.all(pathPromises)

        for(const index in pathPromises) {
            const result = await pathPromises[index]
            if(result.result == null)
                continue

            return result
        }
    }
}