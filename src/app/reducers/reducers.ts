import { routerReducer } from "@angular-redux/router";
import { combineReducers } from "redux";

import { IAppState } from "../models/app-state";
import { counterReducer as counters } from "./counter.reducer";
import { errorsReducer as errors } from "./errors.reducer";

export const rootReducer = combineReducers<IAppState>({
  counters,
  errors,
  router: routerReducer,
});
