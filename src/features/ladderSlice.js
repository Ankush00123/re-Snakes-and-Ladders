import { createSlice } from "@reduxjs/toolkit";
import ladders from "../data/ladders";

const ladderSlice = createSlice({
    name: "ladders",
    initialState:{
        ladderList: ladders
    },
    reducers: {
        loadLadderState: (state, action) => {
            return action.payload;
        }
    }

})

export const {
    loadLadderState    
} = ladderSlice.actions

export default ladderSlice.reducer

