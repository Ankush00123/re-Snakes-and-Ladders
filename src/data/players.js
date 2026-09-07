const players = [
    {
        id: 1,
        name: "Player 1",
        position: 1,
        row: 9,
        col: 0,
        color: "cyan",
        effects: [
            {
                type: "brute",
                isActive: false,
                remainingTurns: 0
            },
            {
                type: "paralysis",
                isActive: false,
                remainingTurns: 0
            },
            {
                type: "poison",
                isActive: false,
                remainingTurns: 0
            },
        ],
        isActive: true,
        hasCompleted: false
    },

    {
        id: 2,
        name: "Player 2",
        position: 1,
        row: 9,
        col: 0,
        color: "red",
        effects: [
            {
                type: "brute",
                isActive: false,
                remainingTurns: 0
            },
            {
                type: "paralysis",
                isActive: false,
                remainingTurns: 0
            },
            {
                type: "poison",
                isActive: false,
                remainingTurns: 0
            },
        ],
        isActive: false,
        hasCompleted: false
    },

    {
        id: 3,
        name: "Player 3",
        position: 1,
        row: 9,
        col: 0,
        color: "yellow",
        effects: [
            {
                type: "brute",
                isActive: false,
                remainingTurns: 0
            },
            {
                type: "paralysis",
                isActive: false,
                remainingTurns: 0
            },
            {
                type: "poison",
                isActive: false,
                remainingTurns: 0
            },
        ],
        isActive: false,
        hasCompleted: false
    },

    {
        id: 4,
        name: "Player 4",
        position: 1,
        row: 9,
        col: 0,
        color: "orange",
        effects: [
            {
                type: "brute",
                isActive: false,
                remainingTurns: 0
            },
            {
                type: "paralysis",
                isActive: false,
                remainingTurns: 0
            },
            {
                type: "poison",
                isActive: false,
                remainingTurns: 0
            },
        ],
        isActive: false,
        hasCompleted: false
    },
]


export default players