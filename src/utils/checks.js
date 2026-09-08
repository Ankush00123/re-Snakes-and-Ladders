
export const inRange = (activePlayer, snake, range) =>
{
    if(!activePlayer || !snake || snake.type == "boss")
    {
        return false
    }
    
    const drow = Math.abs(activePlayer.row - snake.row)
    const dcol = Math.abs(activePlayer.col - snake.col)
    
    return drow <= range && dcol <= range
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))