import { createSlice } from "@reduxjs/toolkit";
import ladders from "../data/ladders";

const ladderSlice = createSlice({
    name: "ladders",
    initialState:{
        ladderList: ladders
    },
    reducers: {

    }

})

export const {} = ladderSlice.actions

export default ladderSlice.reducer

