import {configureStore} from '@reduxjs/toolkit'
import gameReducer from '../features/gameSlice'
import playerReducer from '../features/playerSlice'
import snakeReducer from '../features/snakeSlice'
import ladderReducer from '../features/ladderSlice'

const store = configureStore({
    reducer: {
        game: gameReducer,
        players: playerReducer,
        snakes: snakeReducer,
        ladders: ladderReducer
    }
})

export default store