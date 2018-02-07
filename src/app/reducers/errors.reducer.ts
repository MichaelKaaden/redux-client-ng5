import { ActionTypes, TypeKeys } from "../actions/counter.actions";
import { INITIAL_ERRORS_STATE } from "../models/app-state";

export function errorsReducer(state: string[] = INITIAL_ERRORS_STATE, action: ActionTypes): string[] {
  switch (action.type) {
    case TypeKeys.ERROR:
      return [...state, action.error];

    case TypeKeys.RESET_ERRORS:
      return INITIAL_ERRORS_STATE;

    default:
      return state;
  }
}