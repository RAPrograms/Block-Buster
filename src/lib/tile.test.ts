import { expect, test } from 'vitest'

import Tile from "./tile"


test("Center mouse click inside hexagon", () => {
    const instance = Tile.from(50, 50, 50)
    expect( instance.inside(50, 50) ).toBeTruthy()
})

test("Top Left mouse click inside hexagon", () => {
    const instance = Tile.from(50, 50, 50)
    expect( instance.inside(0, 0) ).toBeFalsy()
})

test("Top Center mouse click inside hexagon", () => {
    const instance = Tile.from(50, 50, 50)
    expect( instance.inside(50, 0) ).toBeFalsy()
})