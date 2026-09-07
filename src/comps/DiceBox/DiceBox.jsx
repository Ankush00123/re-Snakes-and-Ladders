import { useEffect, useState } from "react"
import Dice from "./Dice"
import { useDispatch, useSelector } from "react-redux"
import { appendLogBox, setGameOver, setRoll, nextTurn } from "../../features/gameSlice"
import { addEffect, removeEffect, updateEffect, updatePlayerPosition } from "../../features/playerSlice"
import { delay, getActiveSnakesIds, inRange, positionToCoordinate } from "../../utils/checks"
import { updateSnakePosition, syncActiveSnakes } from "../../features/snakeSlice"

const DiceBox = () => {
    const dispatch = useDispatch()
    const roll = useSelector(state => state.game.lastRoll)
    const currentActiveIndex = useSelector(state => state.game.currentActiveIndex)
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
                    dispatch(updateEffect({ id: activePlayer.id, effectType: effects[i].type }))
                }
            }

            const nextTile = Math.min(100, activePlayer.position + newRoll)
            if(newRoll > 0)
            {
                for(let step = activePlayer.position + 1; step <= nextTile; step++)
                {
                    dispatch(updatePlayerPosition({id: activePlayer.id, newPosition: step}))
                    await delay(300)
                }
            }
            else
            {
                await delay(600)
            }

            //get the active snakes ids
            const activeSnakeIds = getActiveSnakesIds(snakes, nextTile)

            //set the active snakes for this turn 
            dispatch(syncActiveSnakes(activeSnakeIds))

            //snakes active on current turn
            const currentTurnSnakes = []
            for (let i = 0; i < snakes.length; i++) {
                currentTurnSnakes.push({
                    ...snakes[i],
                    isActive: activeSnakeIds.includes(snakes[i].id)
                })
            }

            const translate = positionToCoordinate(nextTile)
            // player with its location as 
            const landingPlayer = {
                ...activePlayer,
                position: nextTile, 
                row: translate.row,
                col: translate.col
            }

            let isBitten = false
            // --- 2. SNAKE CHECKS (ATTACK & MOVE) ---
            for (let i = 0; i < currentTurnSnakes.length; i++) 
            {
                
                if (currentTurnSnakes[i].isActive) 
                {
                    // case1: boss snake
                    if (currentTurnSnakes[i].type === "boss") 
                    {
                        if([96, 97, 98, 99].includes(nextTile)) 
                        {
                            dispatch(addEffect({ id: activePlayer.id, effectType: "poison" }))
                            dispatch(addEffect({ id: activePlayer.id, effectType: "paralysis" }))
                            dispatch(addEffect({ id: activePlayer.id, effectType: "brute" }))
                            for(let j = 0; j < currentTurnSnakes[i].body.length; j++)
                            {
                                dispatch(updatePlayerPosition({id: activePlayer.id, newPosition: currentTurnSnakes[i].body[j]}))
                                await delay(300)
                            }
                            // dispatch(updatePlayerPosition({ id: activePlayer.id, newPosition: currentTurnSnakes[i].tail }))
                            dispatch(appendLogBox(`${activePlayer.name} got bit by boss snake and has been debuffed`))
                            isBitten = true
                        }
                        continue
                    }

                    // case2: snake attacks
                    if(inRange(landingPlayer, currentTurnSnakes[i], currentTurnSnakes[i].attackRange) && !isBitten) 
                    {
                        const range = currentTurnSnakes[i].attackRange
                        for(let dr = -range; dr <= range; dr++) 
                        {
                            for(let dc = -range; dc <= range; dc++) 
                            {
                                const targetRow = currentTurnSnakes[i].row + dr
                                const targetCol = currentTurnSnakes[i].col + dc
                                
                                if(targetRow >= 0 && targetRow <= 9 && targetCol >= 0 && targetCol <= 9) 
                                {
                                    if(landingPlayer.row === targetRow && landingPlayer.col === targetCol) 
                                    {
                                        dispatch(addEffect({ id: activePlayer.id, effectType: currentTurnSnakes[i].type }))
                                        if (currentTurnSnakes[i].type === "brute") 
                                        {
                                            for(let j = 0; j < currentTurnSnakes[i].body.length; j++)
                                            {
                                                dispatch(updatePlayerPosition({id: activePlayer.id, newPosition: currentTurnSnakes[i].body[j]}))
                                                await delay(300)
                                            }
                                            // dispatch(updatePlayerPosition({ id: activePlayer.id, newPosition: currentTurnSnakes[i].tail }))
                                        }
                                        dispatch(appendLogBox(`${activePlayer.name} got bit by ${currentTurnSnakes[i].type} snake and has been debuffed`))
                                        isBitten = true
                                    }
                                }
                            }
                        }
                    } 
                    else 
                    {
                        // case 3: snake moves
                        if(inRange(landingPlayer, currentTurnSnakes[i], currentTurnSnakes[i].detectionRange)) 
                        {
                            if(currentTurnSnakes[i].can_move) 
                            {
                                const dRow = landingPlayer.row - currentTurnSnakes[i].row
                                const dCol = landingPlayer.col - currentTurnSnakes[i].col

                                const stepRow = dRow === 0 ? 0 : (dRow > 0 ? 1 : -1)
                                const stepCol = dCol === 0 ? 0 : (dCol > 0 ? 1 : -1)

                                const absRow = Math.abs(dRow)
                                const absCol = Math.abs(dCol)

                                let nextSnakeRow = currentTurnSnakes[i].row
                                let nextSnakeCol = currentTurnSnakes[i].col

                                if(absRow === absCol) 
                                {
                                    nextSnakeRow += stepRow
                                    nextSnakeCol += stepCol
                                } 
                                else if(absRow !== 0 && (absRow < absCol || absCol === 0)) 
                                {
                                    nextSnakeRow += stepRow
                                } 
                                else if(absCol !== 0 && (absCol < absRow || absRow === 0)) 
                                {
                                    nextSnakeCol += stepCol
                                }

                                nextSnakeRow = Math.max(0, Math.min(9, nextSnakeRow))
                                nextSnakeCol = Math.max(0, Math.min(9, nextSnakeCol))

                                const bRow = 9 - nextSnakeRow
                                const zIdx = bRow % 2 === 0 ? nextSnakeCol : 9 - nextSnakeCol
                                const newSnakeTile = bRow * 10 + zIdx + 1

                                // Check if tile is occupied by another snake
                                let isTileOccupied = false
                                for (let j = 0; j < currentTurnSnakes.length; j++) 
                                {
                                    if (currentTurnSnakes[j].body.includes(newSnakeTile)) 
                                    {
                                        isTileOccupied = true
                                        break
                                    }
                                }

                                if(newSnakeTile !== currentTurnSnakes[i].head && !isTileOccupied && newSnakeTile !== landingPlayer.position) 
                                {
                                    const oldBody = [...currentTurnSnakes[i].body]
                                    currentTurnSnakes[i].body = [newSnakeTile, ...oldBody.slice(0, -1)]
                                    currentTurnSnakes[i].head = newSnakeTile
                                    currentTurnSnakes[i].row = nextSnakeRow
                                    currentTurnSnakes[i].col = nextSnakeCol

                                    dispatch(updateSnakePosition({ id: currentTurnSnakes[i].id, newPosition: newSnakeTile }))
                                    dispatch(appendLogBox(`🐍 ${currentTurnSnakes[i].type} snake moved closer to ${activePlayer.name}!`))
                                }
                            }
                        }
                    }
                }
            }
            //returns if player is bitten by some snake while setting up the next turn
            if(isBitten)
            {
                dispatch(nextTurn(players))
                return
            }

            // --- 3. LADDER CHECKS ---
            for (let i = 0; i < ladders.length; i++) {
                if (ladders[i].from === nextTile) 
                {
                    for(let j = 0; j < ladders[i].body.length; j++)
                    {
                        dispatch(updatePlayerPosition({id: activePlayer.id, newPosition: ladders[i].body[j]}))
                        await delay(300)
                    }
                    // dispatch(updatePlayerPosition({ id: activePlayer.id, newPosition: ladders[i].to }))
                    dispatch(removeEffect({ id: activePlayer.id, effectType: "poison" }))
                    dispatch(removeEffect({ id: activePlayer.id, effectType: "paralysis" }))
                    dispatch(removeEffect({ id: activePlayer.id, effectType: "brute" }))
                    dispatch(appendLogBox(`${activePlayer.name} used ladder with id ${ladders[i].id} and landed to tile ${ladders[i].to} from tile ${ladders[i].from} and debuffs on players are removed if any`))
                    dispatch(nextTurn(players))
                    return 
                }
            }

            if (nextTile === 100) {
                dispatch(setGameOver(true))
                dispatch(appendLogBox(`${activePlayer.name} wins the game `))
                return
            }

            dispatch(nextTurn(players))
        }
        finally
        {
            setIsAnimating(false)
        }
        
    }

    return (
        <div className="flex flex-col items-center justify-between p-3 bg-slate-950/70 border border-slate-800 rounded-xl shadow-inner">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
                <span>Current Turn</span>
                <span className="text-emerald-400 font-semibold">{activePlayer?.name || "None"}</span>
            </div>

            <div className="py-2">
                <Dice roll={roll} handleClick={handleRoll} />
            </div>

            <button
                onClick={handleRoll}
                disabled={isGameOver || isAnimating}
                className={`
                    w-full mt-1 py-2 px-4 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md
                    ${isGameOver 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                        : 'bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1'
                    }
                `}
            >
                {isGameOver ? "Game Over" : "Roll Dice"}
            </button>
        </div>
    )
}

export default DiceBox