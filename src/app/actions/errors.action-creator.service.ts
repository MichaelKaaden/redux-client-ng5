import { Injectable } from "@angular/core";
import { NgRedux } from "@angular-redux/store";

import { IAppState } from "../models/app-state";
import { ErrorActionTypeKeys } from "./error.actions";

@Injectable()
export class ErrorsActionCreatorService {
  constructor(private ngRedux: NgRedux<IAppState>) {}

  /**
   * Create an error.
   *
   * @param {string} methodName The method the error occurred in
   * @param {string} message The error message
   */
  public setError(methodName: string, message: string) {
    this.ngRedux.dispatch({
      type: ErrorActionTypeKeys.ERROR_OCCURRED,
      payload: {
        error: `error in the "${methodName}" action creator: "${message}"`,
      },
    });
  }

  /**
   * Reset the errors.
   */
  public resetErrors() {
    this.ngRedux.dispatch({
      type: ErrorActionTypeKeys.RESET_ERRORS,
    });
  }
}
