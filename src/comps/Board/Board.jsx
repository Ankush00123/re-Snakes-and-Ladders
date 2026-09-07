import { positionToCoordinate } from '../../utils/checks'
import Tile from './Tile'
import { useSelector } from 'react-redux'

// Translates a tile number (1-100) to exact X/Y coordinates on a 100x100 viewbox grid
const getTileCenter = (position) => {
    const translate = positionToCoordinate(position)
    return {
        x: translate.col * 10 + 5,
        y: translate.row * 10 + 5
    }
}

// Calculates the exact angle the snake's head is facing based on its neck tile
const getSnakeAngle = (body) => {
    if (body.length < 2) return 0
    const head = getTileCenter(body[0])
    const neck = getTileCenter(body[1])
    return Math.atan2(head.y - neck.y, head.x - neck.x) * (180 / Math.PI)
}

const Board = () => {
    const board = useSelector(state => state.game.board)
    const players = useSelector(state => state.players.playerList)
    const snakes = useSelector(state => state.snakes.snakeList)
    const ladders = useSelector(state => state.ladders.ladderList)

    const SNAKE_STYLES = {
        boss: { base: "#dc2626", scales: "#7f1d1d", width: "5" },      // Red
        poison: { base: "#a855f7", scales: "#581c87", width: "3.7" },   // Purple
        paralysis: { base: "#eab308", scales: "#713f12", width: "3.5" },// Yellow
        brute: { base: "#ea580c", scales: "#7c2d12", width: "4" }     // Orange
    }

    return (
        <div className="
            relative 
            w-[96vw] h-[96vw] sm:w-125 sm:h-125 xl:h-[94vh] xl:w-auto xl:aspect-square /* 📱 Responsive scaling */
            shrink-0 rounded-xl md:rounded-2xl 
            overflow-hidden border-4 border-amber-900/60 
            shadow-2xl shadow-black/80 bg-emerald-950/80 backdrop-blur-sm
        ">
            
            {/* The Board Grid */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                {board.flat().map((tile) => (
                    <Tile 
                        value={tile} 
                        key={tile} 
                        players={players} 
                        snakes={snakes}
                        ladders={ladders}
                    />
                ))}
            </div>

            {/* The Detailed Snake Overlay */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-15">
                {snakes.map(snake => {
                    if (!snake.body || snake.body.length === 0) return null

                    const style = SNAKE_STYLES[snake.type]
                    const dPath = snake.body.map((tile, index) => {
                        const { x, y } = getTileCenter(tile)
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                    }).join(" ")

                    const headPos = getTileCenter(snake.body[0])
                    const angle = getSnakeAngle(snake.body)

                    return (
                        <g key={snake.id} className="transition-all duration-300">
                            
                            {/* 1. Base Snake Body (Thick Line) */}
                            <path
                                d={dPath}
                                stroke={style.base}
                                strokeWidth={style.width}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                className={`drop-shadow-lg`}
                            />

                            {/* 2. Snake Scales/Stripes (Dashed Overlay) */}
                            {/* <path
                                d={dPath}
                                stroke={style.scales}
                                strokeWidth={parseFloat(style.width) - 1.5}
                                strokeDasharray="1.5 2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                className={snake.isActive ? 'opacity-100' : 'opacity-60'}
                            /> */}
                            
                            {/* 3. Rotated Snake Head Group */}
                            <g transform={`rotate(${angle}, ${headPos.x}, ${headPos.y})`}>
                                
                                {/* Forked Tongue (Sticking out the front) */}
                                <path 
                                    d={`M ${headPos.x + 2} ${headPos.y} L ${headPos.x + 4.5} ${headPos.y} M ${headPos.x + 4.5} ${headPos.y} L ${headPos.x + 5.5} ${headPos.y - 1} M ${headPos.x + 4.5} ${headPos.y} L ${headPos.x + 5.5} ${headPos.y + 1}`} 
                                    stroke="#ef4444" 
                                    strokeWidth="0.3" 
                                    fill="none" 
                                    strokeLinecap="round"
                                />

                                {/* Diamond/Oval Head Shape */}
                                <ellipse 
                                    cx={headPos.x + 0.5} 
                                    cy={headPos.y} 
                                    rx={snake.type === 'boss' ? "3.5" : "2.8"} 
                                    ry={snake.type === 'boss' ? "2.5" : "2.0"} 
                                    fill={style.base}
                                />

                                {/* Left Eye */}
                                <circle cx={headPos.x + 1.5} cy={headPos.y - 1} r="0.6" fill="#ffffff" />
                                <circle cx={headPos.x + 1.7} cy={headPos.y - 1} r="0.3" fill="#000000" />
                                
                                {/* Right Eye */}
                                <circle cx={headPos.x + 1.5} cy={headPos.y + 1} r="0.6" fill="#ffffff" />
                                <circle cx={headPos.x + 1.7} cy={headPos.y + 1} r="0.3" fill="#000000" />
                            </g>
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

export default Board