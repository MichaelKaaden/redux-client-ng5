import { Reducer } from "redux";
import { INITIAL_ERRORS_STATE } from "../models/app-state";
import { ErrorActionTypeKeys, ErrorActionTypes } from "../actions/error.actions";

export const errorsReducer: Reducer<string[]> = (
  state: string[] = INITIAL_ERRORS_STATE,
  action: ErrorActionTypes
): string[] => {
  switch (action.type) {
    case ErrorActionTypeKeys.ERROR_OCCURRED:
      return [...state, action.payload.error];

    case ErrorActionTypeKeys.RESET_ERRORS:
      return INITIAL_ERRORS_STATE;

    default:
      return state;
  }
};
