import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage/session';
import sample from "@/redux/reducer/SampleReducer";
import auth from "@/redux/reducer/AuthReducer.js";

/**
 * persist config
 */
const persistConfig = {
    key: 'root@sample',
    storage,
    whiteList : []
};

const rootReducer = combineReducers({
    sample,
    auth
});

export default persistReducer(persistConfig, rootReducer);
