import { Injectable } from "@angular/core";
import { ActionCreator } from "redux";
import { IErrorAction, IResetErrorsAction, TypeKeys } from "./counter.actions";

@Injectable()
export class ErrorsActionCreatorService {

  /**
   * Create an error action.
   *
   * @param {string} methodName The method the error occurred in
   * @param {string} message The error message
   * @returns {{type: TypeKeys; error: string}}
   */
  public buildErrorAction: ActionCreator<IErrorAction> = (methodName: string, message: string) => {
    return {
      type: TypeKeys.ERROR,
      error: `error in the "${methodName}" action creator: ${message}`,
    };
  };

  /**
   * Create an reset errors action.
   *
   * @returns {{type: TypeKeys}}
   */
  public buildResetErrorsAction: ActionCreator<IResetErrorsAction> = () => {
    return {
      type: TypeKeys.RESET_ERRORS,
    };
  };
}
