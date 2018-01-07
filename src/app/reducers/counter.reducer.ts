import { ActionTypes } from "../actions/counter.actions";
import { ICounterState, INITIAL_COUNTERS_STATE } from "../models/app-state";

export function counterReducer(state: ICounterState = INITIAL_COUNTERS_STATE, action: ActionTypes): ICounterState {
  return state;
}
