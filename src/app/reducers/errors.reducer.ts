import { Reducer } from "redux";
import { ActionTypes, TypeKeys } from "../actions/counter.actions";
import { INITIAL_ERRORS_STATE } from "../models/app-state";

export const errorsReducer: Reducer<string[]> = (
  state: string[] = INITIAL_ERRORS_STATE,
  action: ActionTypes
): string[] => {
  switch (action.type) {
    case TypeKeys.ERROR_OCCURRED:
      return [...state, action.error];

    case TypeKeys.RESET_ERRORS:
      return INITIAL_ERRORS_STATE;

    default:
      return state;
  }
};
