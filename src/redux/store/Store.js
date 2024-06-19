import {configureStore} from "@reduxjs/toolkit";
import persistedReducer from '@/redux/reducer/RootReducers';

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});
