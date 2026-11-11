import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: 'request',
    initialState: null,
    reducers: {
        requestsList: (state, action) => {
            return action.payload
        },
        removeRequests: (state, action) => {
            return null
        },
        removeRequestFromList: (state, action) => {
            if (!state) return null;
            return state.filter((request) => request._id !== action.payload);
        }
    }
});

export const { requestsList, removeRequests, removeRequestFromList } = requestSlice.actions;

export default requestSlice.reducer;
