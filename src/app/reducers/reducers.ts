import { combineReducers } from "redux";

import { IAppState } from "../models/app-state";
import { counterReducer as counters } from "./counter.reducer";

export const rootReducer = combineReducers<IAppState>({
  counters,
});
