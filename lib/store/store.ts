import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./reducer/user";
import searchReducer from "./reducer/search";

function persistConfig(key: string) {
  return { key, storage };
}

export function makeStore() {
  const store = configureStore({
    reducer: {
      user: persistReducer(persistConfig("user"), userReducer),
      search: persistReducer(persistConfig("search"), searchReducer),
    },
  });
  const persistor = persistStore(store);
  return { store, persistor };
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>["store"];
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
