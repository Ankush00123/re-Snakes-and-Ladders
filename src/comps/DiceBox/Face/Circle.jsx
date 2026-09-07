const Circle = ({ className = "", color = "bg-slate-900" }) => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <span className={`w-3.5 h-3.5 rounded-full ${color} shadow-inner shadow-black/70 ${className}`} />
        </div>
    )
}

export default Circle