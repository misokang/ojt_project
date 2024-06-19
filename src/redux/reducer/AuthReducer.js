import {createSlice} from "@reduxjs/toolkit";

const auth = createSlice({
    name: "auth",
    initialState: {
        authList : []
    },
    reducers: {
        setAuthList : (state, action) => {
            return {
                authList : action.payload
            }
        }
    }
});
export const {setAuthList} = auth.actions;
export default auth.reducer;