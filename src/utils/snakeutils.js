import { coordinateToPosition, positionToCoordinate } from "./converts"

export const updateLocalSnakes = (snake, snakes) =>
{
    return snakes.map((current) => (
        snake.id == current.id ? snake : current 
    ))
}

export const snakeBite = (snake, player) =>
{
    if(snake.type == "boss")
    {
        return false
    }
    const range = snake.attackRange
    for(let sightRow = -range; sightRow <= range; sightRow++)
    {
        for(let sightCol = -range; sightCol <= range; sightCol++)
        {
            const targetRow = snake.row + sightRow
            const targetCol = snake.col + sightCol

            if(targetRow >= 0 && targetRow <= 9 && targetCol >= 0 && targetCol <= 9)
            {
                if(player.row == targetRow && player.col == targetCol)
                {
                    return true
                }
            }
        }
    }
    return false
}

export const snakeMovement = (snake, snakes, player, players) =>
{
    const moves = []
    if(snake.can_move)
    {
        let movementAllowed = snake.movement
        let newRow = snake.row
        let newCol = snake.col
        while(movementAllowed > 0)
        {
            if(move(snake, player, players, snakes, "up"))
            {   
                newRow = snake.row - 1
            }
            else if(move(snake, player, players, snakes, "down"))
            {
                newRow = snake.row + 1
            }
            else if(move(snake, player, players, snakes, "left"))
            {
                newCol = snake.col - 1 
            }
            else if(move(snake, player, players, snakes, "right"))
            {
                newCol = snake.col + 1 
            }
            else
            {
                break
            }

            moves.push(coordinateToPosition(newRow, newCol))
            snake = setNewSnake(snake, newRow, newCol)
            movementAllowed--
        }
    }
    return moves
}

//row - 1 => up
//row + 1 => down
//col - 1 => left 
//col + 1 => right

const move = (snake, player, players, snakes, moveType) =>
{
    let newRow = snake.row
    let newCol = snake.col
    switch(moveType)
    {
        case "up":
        {
            newRow = snake.row - 1
            break
        }
        case "down":
        {
            newRow = snake.row + 1
            break
        }
        case "left":
        {
            newCol = snake.col - 1
            break
        }
        case "right":
        {
            newCol = snake.col + 1
            break
        }
        default:
        {
            return false
        }
    }

    //return false if move leads to outside the board
    if(newRow < 0 || newRow > 9 || newCol < 0 || newCol > 9) return false


    //setup a new snake
    const newSnake = setNewSnake(snake, newRow, newCol)

    //return false if old dist was already less
    if(dist(player, snake) < dist(player, newSnake))
    {
        return false
    }

    //check if the new position is occupied
    if(isOccupied(newSnake, snakes, player, players)) return false

    return true

}

export const setNewSnake = (snake, newRow, newCol) =>
{
    const newHead = coordinateToPosition(newRow, newCol)
    const newBody = new Array(snake.body.length)
    newBody[0] = newHead
    for(let i = 1; i < newBody.length; i++)
    {
        newBody[i] = snake.body[i - 1]
    }
    const newTail = newBody[newBody.length - 1]

    return {
        ...snake,
        head: newHead,
        tail: newTail,
        row: newRow,
        col: newCol,
        body: newBody
    }
}


const isOccupied = (snake, snakes, player, players) =>
{
    //snake cant move to a tile where player is present
    for(let i = 0; i < players.length; i++)
    {
        if(players[i].isActive)
        {
            if(player.id == players[i].id)
            {
                //cuz player have different position and players have last copy of it need to make the data more consistent man
                if(player.position == snake.head) return true
            }
            else
            {
                if(players[i].position == snake.head) return true
            }
        }
    }
    for(let i = 0; i < snakes.length; i++)
    {
        //if the snake is same the snake can move to its own tail as it will be moved with snake
        if(snake.id == snakes[i].id)
        {
            if(snake.head == snakes[i].tail)
            {
                return false
            }
        }
        //snake cant move to a tile which contains other snakes
        if(snakes[i].body.includes(snake.head))
        {
            return true
        }
    }
    return false
}


const dist = (player, snake) =>
{   
    const rowDist = player.row - snake.row
    const colDist = player.col - snake.col

    return Math.abs(rowDist) + Math.abs(colDist)
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
