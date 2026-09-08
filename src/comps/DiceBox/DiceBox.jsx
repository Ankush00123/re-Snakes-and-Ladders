import Dice from './Dice'
import useGameEngine from "../../hooks/useGameEngine"

const DiceBox = () => {
    const {handleRoll, roll, activePlayer, isGameOver, isAnimating} = useGameEngine()
    
    return (
        //the outermost box
        <div 
            className='
                flex flex-col items-center justify-between 
                p-3 
                bg-slate-950/70 
                border border-slate-800 rounded-xl 
                shadow-inner
            '
        >
            {/* div containing current active player to showcase current turn */}
            <div 
                className="
                    w-full 
                    flex items-center justify-between 
                    text-xs text-slate-400 font-bold 
                    mb-1
                "
            >
                <span>Current Turn</span>
                <span className="text-emerald-400 font-semibold">{activePlayer?.name || "None"}</span>
            </div>

            {/* the dice face or simply dice */}
            <div className="py-2">
                <Dice roll={roll} handleClick={handleRoll} />
            </div>

            {/* the simple roll dice button */}
            <button
                onClick={handleRoll}
                disabled={isGameOver || isAnimating}
                className={`
                    w-full 
                    mt-1 py-2 px-4 
                    rounded-xl 
                    font-extrabold text-xs tracking-wider uppercase 
                    transition-all 
                    cursor-pointer 
                    shadow-md
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