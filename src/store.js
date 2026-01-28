import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import youTubeReducer from "./YouTube/Slices/youTubeSlice";
import authReducer from "./YouTube/Slices/authSlice";

const reducers = combineReducers({
  youTubeState: youTubeReducer,
  authState: authReducer,
});

const store = configureStore({
  reducer: reducers,
  middleware: [thunk],
});

export default store;
