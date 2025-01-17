import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import logger from "redux-logger";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import { authorizationService } from "./authorization.service";
import { authorizationSlice } from "./authorization.slice";
import { backgroundSlice } from "./background.slice";
import { eurofurenceCache } from "./eurofurence.cache";
import { eurofurenceService } from "./eurofurence.service";
import { settingsSlice } from "./settings.slice";
import { timeTravelSlice } from "./timetravel.slice";

export const reducers = combineReducers({
    [backgroundSlice.name]: backgroundSlice.reducer,
    [timeTravelSlice.name]: timeTravelSlice.reducer,
    [authorizationSlice.name]: authorizationSlice.reducer,
    [eurofurenceCache.name]: eurofurenceCache.reducer,
    [eurofurenceService.reducerPath]: eurofurenceService.reducer,
    [authorizationService.reducerPath]: authorizationService.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
});

const persistedReducer = persistReducer(
    {
        key: "root",
        version: 2,
        storage: AsyncStorage,
        whitelist: [timeTravelSlice.name, eurofurenceService.reducerPath, backgroundSlice.name, authorizationSlice.name, eurofurenceCache.name, settingsSlice.name],
    },
    reducers
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: [eurofurenceCache.name, eurofurenceService.reducerPath],
                warnAfter: 200,
            },
        }).concat(eurofurenceService.middleware, authorizationService.middleware);

        if (Platform.OS === "web") {
            middleware.concat(logger);
        }

        return middleware;
    },
});

export const persistor = persistStore(store);

// Types for the Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed versions of common hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
