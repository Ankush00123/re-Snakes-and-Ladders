import Face1 from "./Face/Face1"
import Face2 from "./Face/Face2"
import Face3 from "./Face/Face3"
import Face4 from "./Face/Face4"
import Face5 from "./Face/Face5"
import Face6 from "./Face/Face6"

const Dice = ({ roll, handleClick }) => {
    return (
        <div
            onClick={handleClick}
            className="
                w-20 h-20 
                bg-linear-to-br from-white via-slate-100 to-slate-300 
                rounded-2xl border-2 border-slate-300
                shadow-lg shadow-black/60 
                flex items-center justify-center 
                p-2.5 
                cursor-pointer select-none 
                transition-transform 
                hover:scale-105 active:rotate-6 duration-150"
        >
            {roll === 0 && <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Roll</span>}
            {roll === 1 && <Face1 />}
            {roll === 2 && <Face2 />}
            {roll === 3 && <Face3 />}
            {roll === 4 && <Face4 />}
            {roll === 5 && <Face5 />}
            {roll === 6 && <Face6 />}
        </div>
    )
}

export default Dice