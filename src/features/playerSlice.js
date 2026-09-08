import { createSlice } from "@reduxjs/toolkit"
import players from "../data/players"
import { positionToCoordinate } from "../utils/converts"

export const playerSlice = createSlice(
    {
        name: "players",

        initialState: {
            playerList: players,
        },

        reducers:{
            updatePlayerPosition: (state, action) => {
                const {id, newPosition} = action.payload
                state.playerList = state.playerList.map((player) => {
                    if (player.id === id) {
                        const translate = positionToCoordinate(newPosition)
                        return {
                            ...player, 
                            position: newPosition, 
                            row: translate.row,
                            col: translate.col
                        }
                    }
                    return player
                })
            },

            setPlayerActive: (state) => {
                for(let i = 0; i < state.playerList.length; i++)
                {
                    if(state.playerList[i].isActive == false)
                    {
                        state.playerList[i].isActive = true
                        console.log(`${state.playerList[i].name} is set to active`)
                        return
                    }
                }
                console.log(`Max amount of player are active currently`)
            },

            setPlayerInactive: (state, action) => {
                const {id} = action.payload
                state.playerList = state.playerList.map(player => (
                    player.id === id ? {...player, isActive: false, position: 1, row: 9, col: 0} : player
                ))
            },

            addEffect: (state, action) => {
                const {id, effectType} = action.payload
                state.playerList = state.playerList.map(player => {
                    if(player.id === id)
                    {
                        player.effects.forEach((effect) => {
                            if(effect.type === effectType)
                            {
                                effect.isActive = true
                                effect.remainingTurns = 3
                            }
                        })
                    }
                    return player
                })
            },

            removeEffect: (state, action) =>
            {
                const {id, effectType} = action.payload
                state.playerList = state.playerList.map((player) => {
                    if(player.id === id) 
                    {
                        player.effects.forEach((effect) =>
                        {
                            if(effect.type === effectType)
                            {
                                effect.isActive = false
                                effect.remainingTurns = 0
                            }
                        })
                    }
                    return player
                })
            },

            updateEffect: (state, action) =>
            {
                const {id, effectType} = action.payload
                state.playerList = state.playerList.map((player) => {
                    if(player.id === id)
                    {
                        player.effects.forEach((effect) => {
                            if(effect.type === effectType && effect.isActive === true)
                            {
                                if(effect.remainingTurns <= 1)
                                {
                                    effect.isActive = false
                                    effect.remainingTurns = 0
                                }
                                else
                                {
                                    effect.remainingTurns = effect.remainingTurns - 1
                                }
                            }
                        })
                    }
                    return player
                })
            }
        }
    }
)

export const {updatePlayerPosition, setPlayerActive, setPlayerInactive, addEffect, removeEffect, updateEffect} = playerSlice.actions

export default playerSlice.reducer