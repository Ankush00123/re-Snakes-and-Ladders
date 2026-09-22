import { createSlice } from "@reduxjs/toolkit"
import board from '../data/board'

export const gameSlice = createSlice(
    {
        name: "game",

        initialState: {
            board: board,
            lastRoll: 0,
            logBox: [],
            activePlayers: 1,
            gameOver: false,
            currentActiveIndex: 0,
            loadCounter: 0,
        },

        reducers: {
            setRoll: (state, action) => {
                state.lastRoll = action.payload
            },

            updateActivePlayers: (state, action) => {
                state.activePlayers = state.activePlayers + action.payload
            },

            appendLogBox: (state, action) => {
                state.logBox.push(action.payload)
            },
            
            //takes players arr as input and set the index of next player as CurrentActiveIndex
            nextTurn: (state, action) => {
                const turnOrder = []
                const players = action.payload
                for(let i = 0; i < players.length; i++)
                {
                    if(players[i].isActive)
                    {
                        turnOrder.push(i)
                    }
                }

                if(turnOrder.length === 0)
                {
                    console.log("Error: No players in the provided PLAYER array are marked active")
                    console.log(players)
                    return
                }

                const currActive = turnOrder.indexOf(state.currentActiveIndex)
                const nextActive = (currActive + 1) % turnOrder.length

                state.currentActiveIndex = turnOrder[nextActive]

            },
            setGameOver: (state, action) => {
                state.gameOver = action.payload
            },

            loadGameState: (state, action) => {
                const newGameState = action.payload;
                return {
                    ...newGameState,
                    loadCounter: state.loadCounter + 1
                }
            },
        }
    }
)

export const {
    setRoll,
    updateActivePlayers,
    appendLogBox,
    nextTurn,
    setGameOver,
    loadGameState
} = gameSlice.actions

export default gameSlice.reducer