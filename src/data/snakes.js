const snakes = [
    
    {
        id: 1,
        type: "boss",
        head: 99,
        tail: 2,
        row: 0,
        col: 1,
        body: [99, 81, 79, 61, 59, 41, 39, 21, 19, 2],
        isActive: false,
        detectionRange: 5,
        attackRange: 3,
        can_move: false,
        movement: 0
    },
    {
        id: 2,
        type: "paralysis",
        head: 57,
        tail: 27,
        row: 4,
        col: 3,
        body: [57, 56, 55, 47, 33, 28, 27],
        isActive: false,
        detectionRange: 2,
        attackRange: 1,
        can_move: true,
        movement: 2
    },
    
    {
        id: 3,
        type: "brute",
        head: 76,
        tail: 54,
        row: 2,
        col: 4,
        body: [76, 75, 67, 54],
        isActive: false,
        detectionRange: 2,
        attackRange: 1,
        can_move: true,
        movement: 2
    },
    {
        id: 4,
        type: "poison",
        head: 32,
        tail: 10,
        row: 6,
        col: 8,
        body: [32, 29, 12, 10],
        isActive: false,
        detectionRange: 2,
        attackRange: 1,
        can_move: true,
        movement: 2
    },
    {
        id: 5,
        type: "poison",
        head: 16,
        tail: 22,
        row: 8,
        col: 4,
        body: [16, 17, 18, 23, 22],
        isActive: false,
        detectionRange: 2,
        attackRange: 1,
        can_move: true,
        movement: 2
    }
]

export default snakes