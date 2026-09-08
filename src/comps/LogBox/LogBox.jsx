import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const LogBox = () => {
    const loglist = useSelector((state) => state.game.logBox) || [];
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [loglist]);

    return (
        //the box 
        <div 
            className="flex-1 min-h-35 flex flex-col 
                bg-slate-950/80 
                border border-slate-800 rounded-xl 
                p-2.5 
                overflow-hidden 
                shadow-inner
                "
            >
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Game Log</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 pr-1 font-mono text-[11px] leading-relaxed text-slate-300"
            >
                {loglist.length === 0 ? (
                    <div className="text-slate-600 italic text-center py-4">Waiting for game to start....</div>
                )
                : 
                (
                    loglist.map((log, index) => (
                        <div
                            key={index}
                            className="p-1.5 rounded bg-slate-900/60 border border-slate-800/50 wrap-break-words"
                        >
                            {log}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default LogBox