import {createSlice} from "@reduxjs/toolkit";

const sample = createSlice({
    name: "sample",
    initialState: {
        sampleList : []
    },
    reducers: {
        setSampleList : (state, action) => {
            return {
                sampleList : action.payload
            }
        }
    }
});
export const {setSampleList} = sample.actions;
export default sample.reducer;