import { Injectable } from "@angular/core";
import { TypeKeys } from "./counter.actions";
import { IAppState } from "../models/app-state";
import { NgRedux } from "@angular-redux/store";

@Injectable()
export class ErrorsActionCreatorService {
  constructor(private ngRedux: NgRedux<IAppState>) {
  }

  /**
   * Create an error.
   *
   * @param {string} methodName The method the error occurred in
   * @param {string} message The error message
   */
  public setError(methodName: string, message: string) {
    this.ngRedux.dispatch({
      type: TypeKeys.ERROR_OCCURRED,
      error: `error in the "${methodName}" action creator: ${message}`,
    });
  }

  /**
   * Reset the errors.
   */
  public resetErrors() {
    this.ngRedux.dispatch({
      type: TypeKeys.RESET_ERRORS,
    });
  }
}
