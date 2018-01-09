import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { IAppState } from "../models/app-state";
import { Counter, ICounter } from "../models/counter";
import { CounterService } from "../services/counter.service";
import {
  IDecrementedCounterAction, IIncrementedCounterAction, ILoadedAction, ILoadingAction, ISavingAction,
  TypeKeys
} from "./counter.actions";

// own type to make typing easier
type Thunk = ThunkAction<void, IAppState, void>;

@Injectable()
export class CounterActionCreatorService {

  constructor(private counterService: CounterService) {
  }

  // public decrement(index: number, by = 1) {
  // }

  /**
   * Thunk: Decrement a counter by saving it to the RESTful Web Service.
   *
   * @param {number} index The counter's index
   * @param {number} by The decrement value
   * @returns {Thunk}
   */
  public decrement = (index: number, by = 1): Thunk => (dispatch: Dispatch<IAppState>, getState: () => IAppState) => {
    if (index < 0) {
      this.logError("decrement", `index "${index}" < 0`);
      return;
    }

    // set "saving" for this counter
    dispatch(this.buildSavingAction(index));

    this.counterService.decrementCounter(index, by)
      .subscribe((c: ICounter) => {
        const counter = new Counter(c.index, c.value);
        dispatch(this.buildDecrementedAction(index, counter));
      }, (error: HttpErrorResponse) => this.logError(
        "decrement",
        `decrementing the counter failed with ${error.error instanceof Error ? error.error.message : error.error}`));
  };

  /**
   * Thunk: Increment a counter by saving it to the RESTful Web Service.
   *
   * @param {number} index The counter's index
   * @param {number} by The increment value
   * @returns {Thunk}
   */
  public increment = (index: number, by = 1): Thunk => (dispatch: Dispatch<IAppState>, getState: () => IAppState) => {
    if (index < 0) {
      this.logError("increment", `index "${index}" < 0`);
      return;
    }

    // set "saving" for this counter
    dispatch(this.buildSavingAction(index));

    this.counterService.incrementCounter(index, by)
      .subscribe((c: ICounter) => {
        const counter = new Counter(c.index, c.value);
        dispatch(this.buildIncrementedAction(index, counter));
      }, (error: HttpErrorResponse) => this.logError(
        "increment",
        `incrementing the counter failed with ${error.error instanceof Error ? error.error.message : error.error}`));
  };

  /***
   * Thunk: Load a counter from the RESTful Web Service.
   *
   * @param {number} index The counter's index
   * @returns {Thunk}
   */
  public load = (index: number): Thunk => (dispatch: Dispatch<IAppState>, getState: () => IAppState) => {
    if (index < 0) {
      this.logError("load", `index "${index}" < 0`);
      return;
    }

    // set "loading" for this counter
    dispatch(this.buildLoadingAction(index));

    this.counterService.counter(index)
      .subscribe((c: ICounter) => {
        const counter = new Counter(c.index, c.value);
        dispatch(this.buildLoadedAction(index, counter));
      }, (error: HttpErrorResponse) => this.logError(
        "load",
        `retrieving the counter failed with ${error.error instanceof Error ? error.error.message : error.error}`));
  };

  /*
   * Helper functions
   */

  private buildDecrementedAction(index: number, counter: ICounter): IDecrementedCounterAction {
    return {
      type: TypeKeys.DECREMENTED,
      payload: {
        index,
        counter,
      },
    };
  }

  private buildIncrementedAction(index: number, counter: ICounter): IIncrementedCounterAction {
    return {
      type: TypeKeys.INCREMENTED,
      payload: {
        index,
        counter,
      },
    };
  }

  private buildLoadedAction(index: number, counter: ICounter): ILoadedAction {
    return {
      type: TypeKeys.LOADED,
      payload: {
        index,
        counter,
      },
    };
  }

  private buildLoadingAction(index: number): ILoadingAction {
    return {
      type: TypeKeys.LOADING,
      payload: {
        index,
      },
    };
  }

  private buildSavingAction(index: number): ISavingAction {
    return {
      type: TypeKeys.SAVING,
      payload: {
        index,
      },
    };
  }

  private logError(methodName: string, message: string) {
    console.error(`error in the "${methodName}" action creator: ${message}`);
  }
}
