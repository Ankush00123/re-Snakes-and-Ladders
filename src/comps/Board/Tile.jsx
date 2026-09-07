import { useSelector } from 'react-redux'
import LadderBot from './Ladders/LadderBot'
import LadderMid from './Ladders/LadderMid'
import LadderTop from './Ladders/LadderTop'


import { inRange } from '../../utils/checks'

const THREAT_STYLES = {
    poison: {
        attack: "bg-fuchsia-950/55 border-2 border-purple-400 shadow-[inset_0_0_14px_rgba(192,38,211,0.85)] animate-pulse",
        detect: "bg-purple-900/15 border border-purple-400/30 shadow-[inset_0_0_6px_rgba(192,38,211,0.25)]"
    },
    paralysis: {
        attack: "bg-amber-950/50 border-2 border-yellow-300 shadow-[inset_0_0_14px_rgba(253,224,71,0.9),0_0_8px_rgba(234,179,8,0.5)] animate-pulse",
        detect: "bg-yellow-500/15 border border-yellow-400/30 shadow-[inset_0_0_6px_rgba(250,204,21,0.25)]"
    },
    brute: {
        attack: "bg-red-950/60 border-2 border-rose-500 shadow-[inset_0_0_16px_rgba(244,63,94,0.9),0_0_10px_rgba(225,29,72,0.6)] animate-pulse",
        detect: "bg-orange-950/20 border border-orange-500/30 shadow-[inset_0_0_6px_rgba(249,115,22,0.25)]"
    }
}

const Tile = ({ value, players, snakes, ladders }) => {
    const currentActiveIndex = useSelector(state => state.game.currentActiveIndex)
    const activePlayer = players[currentActiveIndex]

    const playersAtTile = players.filter((player) => player.position === value && player.isActive)

    const zeroIndex = value - 1
    const row = 9 - Math.floor(zeroIndex / 10)
    const bottomRow = Math.floor(zeroIndex / 10)
    const col = bottomRow % 2 === 0 ? zeroIndex % 10 : 9 - (zeroIndex % 10)
    const currentCoord = { row, col }

    const isEven = (row + col) % 2 === 0
    const isStart = value === 1
    const isEnd = value === 100

    // 1. Boss Dead Zone threat only glows if the Boss Snake is active
    const bossSnake = snakes.find(s => s.type === "boss" && s.isActive)
    const isBossDeadZone = Boolean(bossSnake) && [96, 97, 98, 99].includes(value)

    // 2. Aura and detection only trigger for snakes with isActive: true
    let activeThreat = null

    if (!isBossDeadZone) {
        for (let i = 0; i < snakes.length; i++) {
            const snake = snakes[i]
            if (!snake.isActive || snake.type === "boss") continue

            if (inRange(currentCoord, snake, snake.attackRange)) {
                activeThreat = { type: snake.type, level: 'attack' }
                break
            } else if (!activeThreat && inRange(currentCoord, snake, snake.detectionRange)) {
                activeThreat = { type: snake.type, level: 'detect' }
            }
        }
    }

    return (
        <div className={`relative aspect-square w-full h-full overflow-hidden rounded-md group ${isBossDeadZone ? 'z-10' : ''}`}>
            {/* Tile Floor */}
            <div
                className={`
                    absolute inset-0 z-0 flex flex-col justify-between p-1 transition-all duration-300
                    ${isBossDeadZone
                        ? 'bg-black border-2 border-purple-600/80 shadow-[inset_0_0_20px_rgba(0,0,0,1)]'
                        : isEnd 
                            ? 'bg-linear-to-br from-amber-400/90 to-amber-600/90 border border-amber-300' 
                            : isStart 
                                ? 'bg-linear-to-br from-cyan-500/80 to-blue-600/80 border border-cyan-300' 
                                : isEven 
                                    ? 'bg-emerald-700/75 border border-emerald-600/40' 
                                    : 'bg-emerald-600/65 border border-emerald-500/30'
                    }
                `}
            >
                <span className={`text-[10px] font-bold tracking-tighter leading-none ${
                    isBossDeadZone 
                        ? 'text-red-500 font-mono font-black drop-shadow-[0_0_4px_rgba(239,68,68,0.9)]'
                        : isEnd || isStart 
                            ? 'text-slate-900 font-extrabold' 
                            : 'text-emerald-200/70'
                }`}>
                    {value}
                </span>

                {isStart && <span className="text-[8px] font-black uppercase tracking-wider text-slate-900">Start</span>}
                {isEnd && <span className="text-[8px] font-black uppercase tracking-wider text-slate-900">Goal</span>}
                {isBossDeadZone && (
                    <span className="text-[7px] font-black tracking-widest text-red-400/90 font-mono text-center uppercase drop-shadow-[0_0_3px_rgba(239,68,68,0.8)]">
                        💀
                    </span>
                )}
            </div>

            {/* Boss Threat Aura */}
            {isBossDeadZone && (
                <>
                    <div className="absolute inset-0 z-5 pointer-events-none bg-linear-to-b from-purple-950/80 via-black/90 to-red-950/80 shadow-[inset_0_0_15px_rgba(168,85,247,0.7),inset_0_0_8px_rgba(239,68,68,0.9)] animate-pulse" />
                    <div 
                        className="absolute inset-0 z-5 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 2px, transparent 0, transparent 8px)'
                        }}
                    />
                </>
            )}

            {/* Regular Threat Auras */}
            {activeThreat && !isBossDeadZone && (
                <div 
                    className={`
                        absolute inset-0 z-5 pointer-events-none transition-all duration-300
                        ${THREAT_STYLES[activeThreat.type]?.[activeThreat.level] || ''}
                    `}
                />
            )}

            {/* Ladders Layer */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                {ladders.map((ladder) => {
                    if (ladder.from === value) return <LadderBot key={ladder.id} />
                    if (ladder.to === value) return <LadderTop key={ladder.id} />
                    if (ladder.body.includes(value)) return <LadderMid key={ladder.id} />
                    return null
                })}
            </div>

            {/* Snake Sprites Layer */}
            {/* <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                {snakes.map((snake) => {
                    const isHead = snake.head === value
                    const isTail = snake.tail === value
                    const isMiddleBody = snake.body.includes(value) && !isHead && !isTail

                    if (!isHead && !isTail && !isMiddleBody) return null

                    return (
                        <div 
                            key={snake.id} 
                            className="w-full h-full flex items-center justify-center transition-opacity duration-300"
                        >
                            {isHead && <SnakeHead type={snake.type} />}
                            {isTail && <SnakeTail type={snake.type} />}
                            {isMiddleBody && <SnakeBody type={snake.type} />}
                        </div>
                    )
                })}
            </div> */}

            {/* Players Layer */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                {playersAtTile.map((player, index) => {
                    const isCurrentTurn = activePlayer && activePlayer.id === player.id
                    const scale = isCurrentTurn 
                        ? Math.max(0.65, 1.15 - index * 0.15) 
                        : Math.max(0.45, 0.9 - index * 0.15)
                    const offset = index * 3

                    return (
                        <div
                            key={player.id}
                            title={player.name}
                            style={{
                                backgroundColor: player.color || '#0284c7',
                                transform: `scale(${scale}) translate(${offset}px, -${offset}px)`,
                                zIndex: isCurrentTurn ? 50 : 30 + index,
                            }}
                            className={`
                                absolute w-[90%] h-[90%] rounded-xl flex items-center justify-center text-white font-extrabold text-xs transition-all duration-200
                                ${isCurrentTurn 
                                    ? 'border-2 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.9),0_0_4px_white] ring-2 ring-amber-400/60 animate-pulse' 
                                    : 'border-2 border-white/70 shadow-md shadow-black/70 opacity-80'
                                }
                            `}
                        >
                            {player.id}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Tile