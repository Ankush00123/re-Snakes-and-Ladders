import PlayerContainer from '../PlayerContainer/PlayerContainer'
import DiceBox from '../DiceBox/DiceBox'
import LogBox from '../LogBox/LogBox'

const SideBar = () => {
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
            {/* 📱 Mobile: 2 Columns | 💻 Desktop: Stacked Vertically */}
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 w-full">
                <PlayerContainer />
                <DiceBox />
            </div>
            
            {/* Bottom Row: LogBox stretches to fill remaining space */}
            <div className="min-h-55 xl:min-h-0 flex-1 flex flex-col">
                <LogBox />
            </div>
        </div>
    )
}

export default SideBar