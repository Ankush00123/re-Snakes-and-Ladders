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

export const positionToCoordinate = (position) =>
{
    const bottomRow = Math.floor((position - 1) / 10)
    const row = 9 - bottomRow
    const col = bottomRow % 2 === 0 ? (position - 1) % 10 : 9 - ((position - 1) % 10)

    return {row, col}
}

export const getActiveSnakesIds = (snakes, position) =>
{
    const translate = positionToCoordinate(position)
    const pRow = translate.row
    const pCol = translate.col

    const activeSnakes = []
    const regularDist = []
    const isPlayerInTop3Rows = pRow <= 2
    for(let i = 0; i < snakes.length; i++)
    {
        if(snakes[i].type !== "boss")
        {
            const dRow = Math.abs(snakes[i].row - pRow)
            const dCol = Math.abs(snakes[i].col - pCol)
            const dist = Math.max(dRow, dCol)
            regularDist.push({ id: snakes[i].id, dist: dist })
        }
        else
        {
            if(isPlayerInTop3Rows)
            {
                activeSnakes.push(snakes[i].id)
            }
        }
    }

    regularDist.sort((a, b) => a.dist - b.dist)

    for(let i = 0; i < regularDist.length; i++)
    {
        if(i < 3)
        {
            activeSnakes.push(regularDist[i].id)
        }
    }

    return activeSnakes
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))