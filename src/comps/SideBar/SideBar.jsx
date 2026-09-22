import PlayerContainer from '../PlayerContainer/PlayerContainer'
import DiceBox from '../DiceBox/DiceBox'
import LogBox from '../LogBox/LogBox'
import { load_game, save_game } from '../../utils/save_load'
import { useDispatch, useSelector } from 'react-redux'
import { use } from 'react'

const SideBar = () => {

    const gameState = useSelector(state => state.game);
    const playerState = useSelector(state => state.players);
    const snakeState = useSelector(state => state.snakes);
    const ladderState = useSelector(state => state.ladders);
    

    const dispatch = useDispatch();
    const handleSave = () =>
    {
        save_game(gameState, playerState, snakeState, ladderState);
    }

    const handleLoad = () =>
    {
        load_game(dispatch);
    }
    return (
        <div className="
            w-[96vw] sm:w-125 xl:w-80 
            xl:h-[94vh] h-auto 
            flex flex-col gap-3 
            p-3 mb-8 xl:mb-0
            bg-slate-900/90 
            border-2 border-emerald-900/50 rounded-xl md:rounded-2xl 
            shadow-2xl shadow-black/80 
            backdrop-blur-md overflow-hidden box-border 
            shrink-0"
        >
            {/* Save and reset buttons */}
            <div className="flex items-center justify-between gap-2 px-1">
                <button 
                    onClick={handleSave}
                    className="
                        flex-1 
                        py-1 px-2 
                        bg-slate-800 hover:bg-slate-700 text-slate-300 
                        rounded-lg text-[10px] font-bold uppercase tracking-wider 
                        border border-slate-700 
                        cursor-pointer transition-all"
                >
                    Save Game
                </button>
                <button 
                    onClick={handleLoad}
                    className="
                        flex-1 
                        py-1 px-2 
                        bg-slate-800 hover:bg-slate-700 text-slate-300 
                        rounded-lg text-[10px] font-bold uppercase tracking-wider 
                        border border-slate-700 
                        cursor-pointer transition-all"
                >
                    Load Game    
                </button>
                <button 
                    onClick={() => window.location.reload()}
                    className="
                        flex-1 
                        py-1 px-2
                        bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 
                        rounded-lg text-[10px] font-bold uppercase tracking-wider 
                        border border-rose-800/50 
                        cursor-pointer transition-all"
                >
                    Reset
                </button>
            </div>

            {/* contains active player information and dicebox*/}
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 w-full">
                <PlayerContainer />
                <DiceBox />
            </div>

            {/* contanis logbox */}
            <div className="min-h-55 xl:min-h-0 flex-1 flex flex-col">
                <LogBox />
            </div>
        </div>
    )
}

export default SideBar