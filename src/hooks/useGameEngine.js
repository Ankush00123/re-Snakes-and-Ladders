import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { appendLogBox, setGameOver, setRoll, nextTurn } from "../features/gameSlice"
import { addEffect, removeEffect, updateEffect, updatePlayerPosition } from "../features/playerSlice"
import { delay, inRange } from "../utils/checks"
import { updateSnakePosition, syncActiveSnakes, addBackoffPlayer, decrementBackoff } from "../features/snakeSlice"
import { snakeMovement, getActiveSnakesIds, snakeBite, setNewSnake, updateLocalSnakes} from "../utils/snakeutils"
import { positionToCoordinate, setNewPlayer } from "../utils/converts"
import { updateLocalPlayers } from "../utils/playerutils"

const useGameEngine = () =>
{
    const dispatch = useDispatch()
    const roll = useSelector(state => state.game.lastRoll)
    const currentActiveIndex = useSelector(state => state.game.currentActiveIndex)
    
    //useful arrays
    const players = useSelector(state => state.players.playerList)
    const snakes = useSelector(state => state.snakes.snakeList)
    const ladders = useSelector(state => state.ladders.ladderList)

    const isGameOver = useSelector(state => state.game.gameOver)
    
    const activePlayer = players[currentActiveIndex]

    const [isAnimating, setIsAnimating] = useState(false)

    //whenever turn changes the active snakes are set according to the current player
    useEffect(() => {
        if (!activePlayer || isGameOver)
        {
            return
        }

        const activeSnakeIds = getActiveSnakesIds(snakes, activePlayer.position)
        dispatch(syncActiveSnakes(activeSnakeIds))

    }, [currentActiveIndex])

    async function handleRoll() {
        if(isAnimating) return
        
        if (isGameOver || !activePlayer) {
            dispatch(appendLogBox(`Game already Ended`))
            return 
        }
        if (!activePlayer.isActive) {
            dispatch(appendLogBox(`${activePlayer.name} is inactive Setting up next turn`))
            dispatch(nextTurn(players))
            return
        }

        setIsAnimating(true)
        
        try
        {
            dispatch(decrementBackoff({playerID: activePlayer.id}))

            let local_snakes = [...snakes]
            let local_players = [...players]
            let local_ladders = [...ladders]

            let newRoll = Math.floor((Math.random() * 6) + 1)
            dispatch(setRoll(newRoll))
            dispatch(appendLogBox(`${activePlayer.name} rolled to ${newRoll}`))

            const effects = activePlayer.effects
            for (let i = 0; i < effects.length; i++) 
            {
                if(effects[i].isActive) 
                {
                    if(effects[i].type === "poison") 
                    {
                        newRoll = Math.floor(newRoll / 2)
                    }

                    if(effects[i].type === "paralysis") 
                    {
                        if(newRoll !== 6) 
                        {
                            newRoll = 0
                        }
                    }

                    if(effects[i].type === "brute") 
                    {
                        newRoll = newRoll - 1
                    }
                    if(newRoll < 0)
                    {
                        newRoll = 0
                    }
                    dispatch(updateEffect({ id: activePlayer.id, effectType: effects[i].type }))
                }
            }

            let newPlayer = setNewPlayer(
                activePlayer, 
                Math.min(100, activePlayer.position + newRoll)
            )

            if(newRoll > 0)
            {
                for(let step = activePlayer.position + 1; step <= newPlayer.position; step++)
                {
                    dispatch(updatePlayerPosition({id: activePlayer.id, newPosition: step}))
                    await delay(300)
                }
                local_players = updateLocalPlayers(newPlayer, local_players)
            }
            else
            {
                await delay(600)
            }

            // --- 2 LADDER CHECKS ---
            for (let i = 0; i < local_ladders.length; i++) {
                if (local_ladders[i].from === newPlayer.position) 
                {
                    for(let j = 0; j < local_ladders[i].body.length; j++)
                    {
                        dispatch(updatePlayerPosition({id: newPlayer.id, newPosition: local_ladders[i].body[j]}))
                        await delay(300)
                    }
                    dispatch(removeEffect({ id: activePlayer.id, effectType: "poison" }))
                    dispatch(removeEffect({ id: activePlayer.id, effectType: "paralysis" }))
                    dispatch(removeEffect({ id: activePlayer.id, effectType: "brute" }))
                    dispatch(appendLogBox(`${activePlayer.name} used ladder with id ${local_ladders[i].id} and landed to tile ${local_ladders[i].to} from tile ${local_ladders[i].from} and debuffs on players are removed if any`))
                    newPlayer = setNewPlayer(newPlayer, local_ladders[i].to)
                    local_players = updateLocalPlayers(newPlayer, local_players)
                    break
                }
            }

            if (newPlayer.position == 100) {
                dispatch(setGameOver(true))
                dispatch(appendLogBox(`${activePlayer.name} wins the game `))
                return
            }


            //get the active snakes ids
            const activeSnakeIds = getActiveSnakesIds(snakes, newPlayer.position)

            //set the active snakes for this turn 
            dispatch(syncActiveSnakes(activeSnakeIds))

            //derives a local copy with their updated status
            local_snakes = snakes.map((snake) => ({
                ...snake,
                isActive: activeSnakeIds.includes(snake.id)
            }))

            let isBitten = false
            // --- 3. SNAKE CHECKS (ATTACK & MOVE) ---
            for (let i = 0; i < local_snakes.length; i++) 
            {
                
                if (local_snakes[i].isActive) 
                {
                    // case1: boss snake
                    if (local_snakes[i].type === "boss") 
                    {
                        if([96, 97, 98, 99].includes(newPlayer.position)) 
                        {
                            dispatch(addEffect({ id: activePlayer.id, effectType: "poison" }))
                            dispatch(addEffect({ id: activePlayer.id, effectType: "paralysis" }))
                            dispatch(addEffect({ id: activePlayer.id, effectType: "brute" }))
                            for(let j = 0; j < local_snakes[i].body.length; j++)
                            {
                                dispatch(updatePlayerPosition({id: activePlayer.id, newPosition: local_snakes[i].body[j]}))
                                await delay(300)
                            }
                            dispatch(appendLogBox(`${activePlayer.name} got bit by boss snake and has been debuffed`))
                            //updates the player so its old positions are invalidated
                            newPlayer = setNewPlayer(newPlayer, local_snakes[i].tail)
                            local_players = updateLocalPlayers(newPlayer, local_players)
                            isBitten = true
                        }
                        continue
                    }

                    // case2: snake attacks
                    const playerBackoff = local_snakes[i].backoffPeriod?.find(p => p.id == newPlayer.id)
                    const isOnCD = playerBackoff && playerBackoff.cd > 0
                    if(inRange(newPlayer, local_snakes[i], local_snakes[i].attackRange) && !isBitten && !isOnCD) 
                    {
                        if(snakeBite(local_snakes[i], newPlayer))
                        {
                            dispatch(addEffect({ id: newPlayer.id, effectType: local_snakes[i].type }))
                            if (local_snakes[i].type === "brute") 
                            {
                                for(let j = 0; j < local_snakes[i].body.length; j++)
                                {
                                    dispatch(updatePlayerPosition({id: newPlayer.id, newPosition: local_snakes[i].body[j]}))
                                    await delay(300)
                                }
                                newPlayer = setNewPlayer(newPlayer, local_snakes[i].tail)
                                local_players = updateLocalPlayers(newPlayer, local_players)
                            }
                            dispatch(appendLogBox(`${newPlayer.name} got bit by ${local_snakes[i].type} snake and has been debuffed`))
                            isBitten = true
                            dispatch(addBackoffPlayer({snakeID: local_snakes[i].id, playerID: newPlayer.id}))
                        }
                    } 
                    else 
                    {
                        // case 3: snake moves
                        if(inRange(newPlayer, local_snakes[i], local_snakes[i].detectionRange)) 
                        {
                            //creates new snake as they move to avoid overlapping condition
                            if(local_snakes[i].can_move) 
                            {
                                let newSnake = local_snakes[i]
                                const moves = snakeMovement(local_snakes[i], local_snakes, newPlayer, local_players)
                                for(let j = 0; j < moves.length; j++)
                                {
                                    dispatch(updateSnakePosition({id: local_snakes[i].id, newPosition: moves[j]}))
                                    await delay(300)

                                    const translate = positionToCoordinate(moves[j])
                                    newSnake = setNewSnake(newSnake, translate.row, translate.col)
                                }
                                if(moves.length > 0)
                                {
                                    dispatch(appendLogBox(`${local_snakes[i].type} snake moved closer to ${activePlayer.name}!`))
                                }
                                local_snakes = updateLocalSnakes(newSnake, local_snakes)
                            }
                        }
                    }
                }
            }
            //returns if player is bitten by some snake while setting up the next turn
            if(isBitten)
            {
                dispatch(nextTurn(local_players))
                return
            }


            
            if (newPlayer.position == 100) {
                dispatch(setGameOver(true))
                dispatch(appendLogBox(`${activePlayer.name} wins the game `))
                return
            }

            dispatch(nextTurn(local_players))
        }
        finally
        {
            setIsAnimating(false)
        }   
    }
    return {handleRoll, roll, activePlayer, isGameOver, isAnimating}
}

export default useGameEngine