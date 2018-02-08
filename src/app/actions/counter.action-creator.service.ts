import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { IAppState } from "../models/app-state";
import { Counter, ICounter } from "../models/counter";
import { CounterService } from "../services/counter.service";
import {
  IDecrementedCounterAction,
  IIncrementedCounterAction,
  ILoadedAction,
  ILoadedAllAction,
  ILoadingAction,
  ILoadingAllAction,
  ISavingAction,
  TypeKeys
} from "./counter.actions";
import { ErrorsActionCreatorService } from "./errors.action-creator.service";

// own type to make typing easier
type Thunk = ThunkAction<void, IAppState, void>;

@Injectable()
export class CounterActionCreatorService {

  constructor(private counterService: CounterService,
              private errorActionCreatorService: ErrorsActionCreatorService) {
  }

  /**
   * Thunk: Decrement a counter by saving it to the RESTful Web Service.
   *
   * @param {number} index The counter's index
   * @param {number} by The decrement value
   * @returns {Thunk}
   */
  public decrement = (index: number, by = 1): Thunk =>
    (dispatch: Dispatch<IAppState>, getState: () => IAppState) => {
      if (index < 0) {
        return dispatch(this.errorActionCreatorService.buildErrorAction("decrement", `index ${index} < 0`));
      }

      // set "saving" for this counter
      dispatch(this.buildSavingAction(index));

      this.counterService.decrementCounter(index, by)
        .subscribe((c: ICounter) => {
            const counter = new Counter(c.index, c.value);
            return dispatch(this.buildDecrementedAction(index, counter));
          }, (error: HttpErrorResponse) =>
            dispatch(this.errorActionCreatorService.buildErrorAction("decrement",
              `decrementing the counter failed with ${error instanceof Error ? error.message : error}`))
        );
    };

  /**
   * Thunk: Increment a counter by saving it to the RESTful Web Service.
   *
   * @param {number} index The counter's index
   * @param {number} by The increment value
   * @returns {Thunk}
   */
  public increment = (index: number, by = 1): Thunk =>
    (dispatch: Dispatch<IAppState>, getState: () => IAppState) => {
      if (index < 0) {
        return dispatch(this.errorActionCreatorService.buildErrorAction("increment", `index ${index} < 0`));
      }

      // set "saving" for this counter
      dispatch(this.buildSavingAction(index));

      this.counterService.incrementCounter(index, by)
        .subscribe((c: ICounter) => {
            const counter = new Counter(c.index, c.value);
            return dispatch(this.buildIncrementedAction(index, counter));
          }, (error: HttpErrorResponse) =>
            dispatch(this.errorActionCreatorService.buildErrorAction("increment",
              `incrementing the counter failed with ${error instanceof Error ? error.message : error}`))
        );
    };

  /***
   * Thunk: Load a counter from the RESTful Web Service.
   *
   * @param {number} index The counter's index
   * @returns {Thunk}
   */
  public load = (index: number): Thunk =>
    (dispatch: Dispatch<IAppState>, getState: () => IAppState) => {
      if (index < 0) {
        return dispatch(this.errorActionCreatorService.buildErrorAction("load", `index ${index} < 0`));
      }

      // don't load the counter if it's already loaded
      const cachedCounter: ICounter = getState().counters.all.find((item: ICounter) => item.index === index);
      if (cachedCounter) {
        return;
      }

      // set "loading" for this counter
      dispatch(this.buildLoadingAction(index));

      this.counterService.counter(index)
        .subscribe((c: ICounter) => {
            const counter = new Counter(c.index, c.value);
            return dispatch(this.buildLoadedAction(index, counter));
          }, (error: HttpErrorResponse) =>
            dispatch(this.errorActionCreatorService.buildErrorAction("load",
              `retrieving the counter failed with ${error instanceof Error ? error.message : error}`))
        );
    };

  /**
   * Thunk: Load all counters from the RESTful Web Service.
   *
   * @returns {Thunk}
   */
  public loadAll = (): Thunk =>
    (dispatch: Dispatch<IAppState>, getState: () => IAppState) => {
      // set "loading" for this counter
      dispatch(this.buildLoadingAllAction());

      this.counterService.counters()
        .subscribe((cs: ICounter[]) => {
            const counters = [];
            for (const c of cs) {
              counters.push(new Counter(c.index, c.value));
            }
            return dispatch(this.buildLoadedAllAction(counters));
          }, (error: HttpErrorResponse) =>
            dispatch(this.errorActionCreatorService.buildErrorAction("loadAll",
              `retrieving all counters failed with ${error instanceof Error ? error.message : error}`))
        );
    };

  /*
   * Helper functions
   */

  private buildDecrementedAction: ActionCreator<IDecrementedCounterAction> = (index: number, counter: ICounter) => {
    return {
      type: TypeKeys.DECREMENTED,
      payload: {
        index,
        counter,
      },
    };
  };

  private buildIncrementedAction: ActionCreator<IIncrementedCounterAction> = (index: number, counter: ICounter) => {
    return {
      type: TypeKeys.INCREMENTED,
      payload: {
        index,
        counter,
      },
    };
  };

  private buildLoadedAction: ActionCreator<ILoadedAction> = (index: number, counter: ICounter) => {
    return {
      type: TypeKeys.LOADED,
      payload: {
        index,
        counter,
      },
    };
  };

  private buildLoadedAllAction: ActionCreator<ILoadedAllAction> = (counters: ICounter[]) => {
    return {
      type: TypeKeys.LOADED_ALL,
      payload: {
        counters,
      }
    };
  };

  private buildLoadingAction: ActionCreator<ILoadingAction> = (index: number) => {
    return {
      type: TypeKeys.LOADING,
      payload: {
        index,
      },
    };
  };

  private buildLoadingAllAction: ActionCreator<ILoadingAllAction> = () => {
    return {
      type: TypeKeys.LOADING_ALL,
    };
  };

  private buildSavingAction: ActionCreator<ISavingAction> = (index: number) => {
    return {
      type: TypeKeys.SAVING,
      payload: {
        index,
      },
    };
  };
}
