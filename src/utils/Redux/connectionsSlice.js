import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name: "connections",
    initialState: null,
    reducers: {
        connectionsList: (state, action) => {
            return action.payload
        },
        clearConnectionsList: (state, action) => null,
    }
});

export const { connectionsList, clearConnectionsList } = connectionsSlice.actions;

export default connectionsSlice.reducer;