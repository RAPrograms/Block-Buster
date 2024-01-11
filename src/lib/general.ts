export function getScreenSize(){
    return{
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight
    }
}

export function getEventTarget(e: any){
    return e.target || e.srcElement || e.originalTarget
}

export function intersects(l1: {x1: number, y1: number, x2: number, y2: number}, l2: {x1: number, y1: number, x2: number, y2: number}): boolean{
    // https://wikimedia.org/api/rest_v1/media/math/render/svg/3037b45bc402892dc1273dc0c3b70532f3bcda39
    //https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const num_t = ((l1.x1 - l2.x1) * (l2.y1 - l2.y2)) - ((l1.y1 - l2.y1) * (l2.x1 - l2.x2)) 
    const num_u = ((l1.x1 - l2.x1) * (l1.y1 - l1.y2)) - ((l1.y1 - l2.y1) * (l1.x1 - l1.x2)) 

    const denom = ((l1.x1 - l1.x2) * (l2.y1 - l2.y2)) - ((l1.y1 - l1.y2) * (l2.x1 - l2.x2)) 
    
    const t = num_t / denom
    const u = num_u / denom

    if((0 <= t && t <= 1) && (0 <= u && u <= 1)){
        const p_x = l1.x1 + (t * (l1.x2 - l1.x1))
        const p_y = l1.y1 + (t * (l1.y2 - l1.y1))

        if((l1.x1 >= p_x && p_x >= l1.x2 && l1.y1 >= p_y && p_y >= l1.y2) || (l1.x2 >= p_x && p_x >= l1.x1 && l1.y2 >= p_y && p_y >= l1.y1)){
            return true
        }
    }

    return false
}

export function countIntersects(line: {x1: number, y1: number, x2: number, y2: number}, lines: Array<{x1: number, y1: number, x2: number, y2: number}>): number{
    let count = 0

    lines.forEach((line2, index) => {
        if(intersects(line, line2))
            count++
    });

    return count
}
 
export function destructureQuestions(questions: Record<string, Array<{answer: string, question: string}>>): Array<{answer: string, question: string}>{
    const output: Array<{answer: string, question: string}>  = []
    
    Object.values(questions).forEach(values => {
        values.forEach(q => {
            output.push(q)
        })
    })

    return output
}

export function structureQuestions(questions: Array<{answer: string, question: string}>){
    const output: Record<string, Array<{answer: string, question: string}>> = {}

    questions.forEach(question => {
        question.answer = question.answer.toLowerCase()

        if(output[question.answer[0]] == undefined)
            //@ts-ignore
            output[question.answer[0]] = []

        //@ts-ignore
        output[question.answer[0]].push(question)
    })

    return output
}

export function ForceNumberInput(e: KeyboardEvent){
    if(["Backspace", "ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(e.key))
        return

    if(Number.isNaN(Number(e.key)))
        return e.preventDefault()
}


export function getSiblingTilePosition(current: [number, number], siblin: number): [number, number]{
    switch(siblin){
        case 0: //Top
            return [current[0], current[1] - 1]
        
        case 1: //Top right
            return [current[0] + 1, current[1]]

        case 2: //Bottem Right
            return [current[0] + 1, current[1] + 1]

        case 3: //Bottem
            return [current[0], current[1] + 1]

        case 4: //Bottem Left
            return [current[0] -1, current[1] + 1]

        case 5: //Top Left
            return [current[0] -1, current[1]]
    }

    return [NaN, NaN]
}