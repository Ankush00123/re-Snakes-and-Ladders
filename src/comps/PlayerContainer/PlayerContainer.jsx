import { useDispatch, useSelector } from 'react-redux'
import Player from './Player'
import { setPlayerActive } from '../../features/playerSlice'
import { updateActivePlayers } from '../../features/gameSlice'

const PlayerContainer = () => {
    const players = useSelector(state => state.players.playerList)
    const active_players = useSelector(state => state.game.activePlayers)
    const currentActiveIndex = useSelector(state => state.game.currentActiveIndex)
    const dispatch = useDispatch()

    const handle_add_player = () => {
        dispatch(setPlayerActive())
        if (active_players < 4) {
            dispatch(updateActivePlayers(1))
        }
    }

    return (
        <div className="flex flex-col bg-slate-950/70 border border-slate-800 rounded-xl p-3 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Players</span>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {active_players} / 4 Active
                </span>
            </div>

            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-48 pr-0.5 no-scrollbar">
                {players.map((p, idx) => 
                    p.isActive ? (
                        <Player 
                            key={p.id} 
                            player={p} 
                            isTurn={idx === currentActiveIndex} 
                        />
                    ) : null
                )}
            </div>

            {active_players < 4 && (
                <button
                    onClick={handle_add_player}
                    className="mt-2 w-full py-1.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer active:scale-98"
                >
                    + Add Player
                </button>
            )}
        </div>
    )
}

export default PlayerContainer