import { useDispatch } from "react-redux"
import { setPlayerInactive } from "../../features/playerSlice"
import { updateActivePlayers } from "../../features/gameSlice"

const Player = ({ player, isTurn }) => {
    const dispatch = useDispatch()

    const handleRemove = () => {
        dispatch(setPlayerInactive({ id: player.id }))
        dispatch(updateActivePlayers(-1))
    }

    const activeEffects = player.effects.filter(e => e.isActive)

    return (
        <div 
            className={`
                flex flex-col gap-1 p-2 rounded-lg border transition-all
                ${isTurn 
                    ? 'bg-slate-800/80 border-emerald-500/60 shadow-sm shadow-emerald-500/20 ring-1 ring-emerald-500/40' 
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span 
                        className="w-3 h-3 rounded-full border border-white/40 shadow-xs" 
                        style={{ backgroundColor: player.color || '#38bdf8' }}
                    />
                    <span className="text-xs font-bold text-slate-200">{player.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700/50">
                        Tile {player.position}
                    </span>
                </div>

                <button 
                    onClick={handleRemove}
                    className="text-slate-500 hover:text-rose-400 text-xs font-bold px-1 rounded transition-colors cursor-pointer"
                    title="Remove Player"
                >
                    ✕
                </button>
            </div>

            {/* Debuff Pills */}
            {activeEffects.length > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                    {activeEffects.map((effect) => {
                        const styleMap = {
                            poison: "bg-purple-950/80 text-purple-300 border-purple-800/60",
                            paralysis: "bg-amber-950/80 text-amber-300 border-amber-800/60",
                            brute: "bg-rose-950/80 text-rose-300 border-rose-800/60"
                        }
                        return (
                            <span 
                                key={effect.type}
                                className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 border rounded ${styleMap[effect.type] || "bg-slate-800 text-slate-300"}`}
                            >
                                {effect.type} ({effect.remainingTurns}t)
                            </span>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Player