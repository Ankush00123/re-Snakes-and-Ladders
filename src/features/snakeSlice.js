// In src/features/snakeSlice.js
import { createSlice } from "@reduxjs/toolkit"
import snakes from '../data/snakes'
import { positionToCoordinate } from "../utils/converts"

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
        },

        addBackoffPlayer: (state, action) =>
        {
            const {snakeID, playerID} = action.payload
            const snake = state.snakeList.find((snake) => snake.id == snakeID)
            if(snake)
            {
                if(!snake.backoffPeriod) snake.backoffPeriod = []
                const existingBackoff = snake.backoffPeriod.find((p) => p.id == playerID)
                if(existingBackoff) 
                {
                    existingBackoff.cd = 3
                }
                else
                {
                    snake.backoffPeriod.push({id: playerID, cd: 3})
                }
            }
        },
        
        decrementBackoff: (state, action) =>
        {
            const { playerID } = action.payload
            
            // Loop through ALL snakes and reduce for each so only one call is enough
            state.snakeList.forEach(snake => {
                if(snake.backoffPeriod)
                {
                    const backoff = snake.backoffPeriod.find(p => p.id == playerID)
                    if(backoff && backoff.cd > 0)
                    {
                        backoff.cd--
                    }
                }
            })
        }
    }
})

export const { updateSnakePosition, syncActiveSnakes, addBackoffPlayer, decrementBackoff } = snakeSlice.actions
export default snakeSlice.reducer