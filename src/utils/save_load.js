import { loadGameState } from "../features/gameSlice";
import { loadLadderState } from "../features/ladderSlice";
import { loadPlayerState } from "../features/playerSlice";
import { loadSnakeState } from "../features/snakeSlice";
import { delay } from "./checks";

export const save_game = (gameState, playerState, snakeState, ladderState) =>
{   
    const saveData = {
        gameState,
        playerState,
        snakeState,
        ladderState,
        savedAt: new Date(Date.now()).toLocaleString()
    };
    localStorage.setItem("Save Data",JSON.stringify(saveData));
    window.alert("Game State Saved Successfully");
}

export const load_game = async (dispatch) =>
{
    const loadDataString = localStorage.getItem("Save Data");
    if (!loadDataString) 
    {
        alert("No saved data found to be loaded");
        return;
    }

    const loadData = JSON.parse(loadDataString);
    dispatch(loadGameState(loadData.gameState));
    dispatch(loadPlayerState(loadData.playerState));
    dispatch(loadSnakeState(loadData.snakeState));
    dispatch(loadLadderState(loadData.ladderState));
    window.alert("Last Saved Game State Loaded");
}