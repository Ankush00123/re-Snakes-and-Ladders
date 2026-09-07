import Board from './comps/Board/Board'
import SideBar from './comps/SideBar/SideBar'

function App() {
    return (
        <div
            className="
                min-h-screen w-full 
                bg-slate-950 text-slate-100 
                flex flex-col xl:flex-row
                items-center xl:justify-center 
                gap-4 p-2 md:p-4 
                overflow-x-hidden overflow-y-auto
                select-none 
                box-border
            "
        >
            <Board />
            <SideBar />
        </div>
    )
}

export default App