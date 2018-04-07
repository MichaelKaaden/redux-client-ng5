import { Action } from "redux";

export enum ErrorActionTypeKeys {
  ERROR_OCCURRED = "ERROR_OCCURRED",
  RESET_ERRORS = "RESET_ERRORS",
  OTHER_ACTION = "__any_other_action_type__",
}

/***********
 * Actions *
 ***********/

/**
 * Interface for the error occurred action.
 */
export interface IErrorOccurredAction extends Action {
  type: ErrorActionTypeKeys.ERROR_OCCURRED;
  payload: {
    error: string;
  };
}

export interface IResetErrorsAction extends Action {
  type: ErrorActionTypeKeys.RESET_ERRORS;
}

/**
 * Interface for all actions living outside
 * this app. TypeScript will warn us if we
 * forget to handle this special action type.
 */
export interface IOtherAction extends Action {
  type: ErrorActionTypeKeys.OTHER_ACTION;
}

export type ErrorActionTypes = IErrorOccurredAction | IResetErrorsAction | IOtherAction;
