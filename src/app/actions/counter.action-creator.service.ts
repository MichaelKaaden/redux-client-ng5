import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActionCreator } from "redux";
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
import { NgRedux } from "@angular-redux/store";

@Injectable()
export class CounterActionCreatorService {

  constructor(private ngRedux: NgRedux<IAppState>,
              private counterService: CounterService,
              private errorActionCreatorService: ErrorsActionCreatorService) {
  }

  /**
   * Decrement a counter by saving it to the RESTful Web Service.
   *
   * @param {number} index The counter's index
   * @param {number} by The decrement value
   */
  public decrement(index: number, by = 1) {
    if (index < 0) {
      this.errorActionCreatorService.setError("decrement", `index ${index} < 0`);
      return;
    }

    // set "saving" for this counter
    this.ngRedux.dispatch(this.buildSavingAction(index));

    this.counterService.decrementCounter(index, by)
      .subscribe((c: ICounter) => {
          const counter = new Counter(c.index, c.value);
          this.ngRedux.dispatch(this.buildDecrementedAction(index, counter));
        }, (error: HttpErrorResponse) =>
          this.errorActionCreatorService.setError("decrement",
            `decrementing the counter failed with ${error instanceof Error ? error.message : error}`)
      );
  }

  /**
   * Increment a counter by saving it to the RESTful Web Service.
   *
   * @param {number} index The counter's index
   * @param {number} by The increment value
   */
  public increment(index: number, by = 1) {
    if (index < 0) {
      this.errorActionCreatorService.setError("increment", `index ${index} < 0`);
      return;
    }

    // set "saving" for this counter
    this.ngRedux.dispatch(this.buildSavingAction(index));

    this.counterService.incrementCounter(index, by)
      .subscribe((c: ICounter) => {
          const counter = new Counter(c.index, c.value);
          this.ngRedux.dispatch(this.buildIncrementedAction(index, counter));
        }, (error: HttpErrorResponse) =>
          this.errorActionCreatorService.setError("increment",
            `incrementing the counter failed with ${error instanceof Error ? error.message : error}`)
      );
  }

  /***
   * Load a counter from the RESTful Web Service.
   *
   * @param {number} index The counter's index
   */
  public load(index: number) {
    if (index < 0) {
      this.errorActionCreatorService.setError("load", `index ${index} < 0`);
      return;
    }

    // don't load the counter if it's already loaded
    const cachedCounter: ICounter = this.ngRedux.getState().counters.all.find((item: ICounter) => item.index === index);
    if (cachedCounter) {
      return;
    }

    // set "loading" for this counter
    this.ngRedux.dispatch(this.buildLoadingAction(index));

    this.counterService.counter(index)
      .subscribe((c: ICounter) => {
          const counter = new Counter(c.index, c.value);
          this.ngRedux.dispatch(this.buildLoadedAction(index, counter));
        }, (error: HttpErrorResponse) =>
          this.errorActionCreatorService.setError("load",
            `retrieving the counter failed with ${error instanceof Error ? error.message : error}`)
      );
  }

  /**
   * Load all counters from the RESTful Web Service.
   */
  public loadAll() {
    // set "loading" for this counter
    this.ngRedux.dispatch(this.buildLoadingAllAction());

    this.counterService.counters()
      .subscribe((cs: ICounter[]) => {
          const counters = [];
          for (const c of cs) {
            counters.push(new Counter(c.index, c.value));
          }
          this.ngRedux.dispatch(this.buildLoadedAllAction(counters));
        }, (error: HttpErrorResponse) =>
          this.errorActionCreatorService.setError("loadAll",
            `retrieving all counters failed with ${error instanceof Error ? error.message : error}`)
      );
  }

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
