import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import UserReducer from "./usuario";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
	key: "root",
	storage: AsyncStorage
};

const reducer = combineReducers({
	usuario: UserReducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: [thunk]
	// middleware: (getDefaultMiddleware) =>
	// 	getDefaultMiddleware({
	// 		serializableCheck: false
	// 	})
});

export const persistor = persistStore(store);
