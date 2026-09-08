const IntroductionPage = ({onClose}) =>
{
    return(
        <div
            className="
                fixed inset-0 z-50 
                flex justify-center items-center
                bg-black/80 backdrop-blur-sm 
                p-4
            "
        >
            <div
                className="
                    w-full max-w-md 
                    max-h-[85vh] overflow-y-auto no-scrollbar /* 👈 Makes it scrollable on mobile while keeping your text */
                    bg-slate-900 
                    border-2 border-emerald-500/50 rounded-2xl
                    shadow-2xl shadow-emerald-900/20 
                    p-6
                    flex flex-col gap-4
                "
            >
                <h1
                    className="
                        text-2xl font-black text-transparent text-center uppercase 
                        bg-clip-text tracking-widest
                        bg-linear-to-r from-emerald-400 to-cyan-400 
                    "
                >   
                    re: Snakes and Ladders
                </h1>

                <div 
                    className="
                        flex flex-col gap-3 
                        text-sm text-slate-300 
                        mt-2
                    "
                >
                    
                    <p><strong>Snakes</strong> The main part of this game are the snakes. The snakes can move and can be distinguished by color(as of right now)</p>
                    <p> the red snake is boss snake, the yellow one is Paralysis, the orange one is brute and the purple one might be tough but its poison</p>
                    <p> the snake types are used for debuffs different types different debuffs</p>
                    
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
                        <li><span className="text-purple-400 font-bold">Poison:</span> makes the dice roll to be half with cieling so ur just moveing half the dist or 0</li>
                        <li><span className="text-yellow-400 font-bold">Paralysis:</span> a little harsh one where player can't move if they cant roll a 6</li>
                        <li><span className="text-orange-400 font-bold">Brute:</span> keeps the classic snakes thingy where it puts u down to its tail and additionally makes ur roll to be roll - 1 (eg: u roll 6 if this effect is active ur roll becomes 5) </li>
                    </ul>

                    <p><strong>Ranges:</strong> the snake's ranges are visually represented the more obvious one are the attacking range(i.e on those tiles ur player will get attacked if landed there) or the dimmer ones to show the detection range the snakes can move correct but only when the player is in detection range of snakes </p>

                    <p><strong>Boss Snake:</strong> great name fr but works as the major roadblock, it doesnt move and has a hugh range for attack on tiles 99 98 97 96 making the chances of winning much lower in end<strong>ALL</strong> debuffs at once.</p>
                    <p><strong> ladders:</strong> works as normal ladders <strong>but additionally clears debuffs</strong>.</p>

                    <p><strong>Immunity</strong> to stop perma stun from paralysis snake this was introduced basically snakes cant attack continuously and takes a 2 turn break before attacking again</p>
                </div>

                <button 
                    onClick={onClose}
                    className="
                        mt-4 w-full py-3 rounded-xl 
                        bg-emerald-600 hover:bg-emerald-500 
                        text-white font-extrabold uppercase tracking-widest
                        transition-all active:scale-95 shadow-lg
                    "
                >
                    I see
                </button>
            </div>
        </div>
    )
}

export default IntroductionPage