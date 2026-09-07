// In src/features/snakeSlice.js
import { createSlice } from "@reduxjs/toolkit"
import snakes from '../data/snakes'
import { positionToCoordinate } from "../utils/checks"

export const snakeSlice = createSlice({
    name: 'snakes',
    initialState: {
        snakeList: snakes,
    },
    reducers: {
        updateSnakePosition: (state, action) => {
            const { id, newPosition } = action.payload
            const snake = state.snakeList.find((s) => s.id === id)
            if (!snake || snake.head === newPosition) return

            const oldBody = [...snake.body]
            const updatedBody = new Array(oldBody.length)

            updatedBody[0] = newPosition
            for (let i = 1; i < oldBody.length; i++) {
                updatedBody[i] = oldBody[i - 1]
            }

            const translate = positionToCoordinate(newPosition)

            snake.body = updatedBody //replaces the old body array 
            snake.head = updatedBody[0] //newPosition
            snake.tail = updatedBody[updatedBody.length - 1] // last cell in body array 
            snake.row = translate.row
            snake.col = translate.col
        },

        syncActiveSnakes: (state, action) => {
            const activeIds = action.payload
            for (let i = 0; i < state.snakeList.length; i++) 
            {
                //if snakes id is included it set to active else set as inactive
                state.snakeList[i].isActive = activeIds.includes(state.snakeList[i].id)
            }
        }
    }
})

export const { updateSnakePosition, syncActiveSnakes } = snakeSlice.actions
export default snakeSlice.reducer