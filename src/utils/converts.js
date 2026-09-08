import board from "../data/board"
export const positionToCoordinate = (position) =>
{
    const bottomRow = Math.floor((position - 1) / 10)
    const row = 9 - bottomRow
    const col = bottomRow % 2 === 0 ? (position - 1) % 10 : 9 - ((position - 1) % 10)

    return {row, col}
}

export const coordinateToPosition = (row, col) =>
{
    if(row < 0 || row > 9 || col < 0 || col > 9) return -1
    
    return board[row][col]
}

export const setNewPlayer = (player, newPosition) =>
{
    const translate = positionToCoordinate(newPosition)
    return {
        ...player,
        position: newPosition,
        row: translate.row,
        col: translate.col
    }
}
