import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActionCreator } from "redux";
import { IAppState } from "../models/app-state";
import { Counter, ICounter } from "../models/counter";
import { CounterService } from "../services/counter.service";
import {
  CounterActionTypeKeys,
  IDecrementCompletedCounterAction,
  IIncrementCompletedCounterAction,
  ILoadAllCompletedAction,
  ILoadAllPendingAction,
  ILoadCompletedAction,
  ILoadPendingAction,
  ISavePendingAction,
} from "./counter.actions";
import { ErrorsActionCreatorService } from "./errors.action-creator.service";
import { NgRedux } from "@angular-redux/store";

@Injectable()
export class CounterActionCreatorService {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private counterService: CounterService,
    private errorActionCreatorService: ErrorsActionCreatorService
  ) {}

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
    this.ngRedux.dispatch(this.buildSavePendingAction(index));

    this.counterService.decrementCounter(index, by).subscribe(
      (c: ICounter) => {
        const counter = new Counter(c.index, c.value);
        this.ngRedux.dispatch(this.buildDecrementCompletedAction(index, counter));
      },
      (error: HttpErrorResponse) => {
        this.errorActionCreatorService.setError("decrement", `decrementing the counter failed with ${error.message}`);
      }
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
    this.ngRedux.dispatch(this.buildSavePendingAction(index));

    this.counterService.incrementCounter(index, by).subscribe(
      (c: ICounter) => {
        const counter = new Counter(c.index, c.value);
        this.ngRedux.dispatch(this.buildIncrementCompletedAction(index, counter));
      },
      (error: HttpErrorResponse) => {
        this.errorActionCreatorService.setError("increment", `incrementing the counter failed with ${error.message}`);
      }
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
    const cachedCounter: ICounter = this.ngRedux.getState().counters.find((item: ICounter) => item.index === index);
    if (cachedCounter) {
      return;
    }

    // set "loading" for this counter
    this.ngRedux.dispatch(this.buildLoadPendingAction(index));

    this.counterService.counter(index).subscribe(
      (c: ICounter) => {
        const counter = new Counter(c.index, c.value);
        this.ngRedux.dispatch(this.buildLoadCompletedAction(index, counter));
      },
      (error: HttpErrorResponse) => {
        console.log("Error during loading");
        this.errorActionCreatorService.setError("load", `retrieving the counter failed with ${error.message}`);
      }
    );
  }

  /**
   * Load all counters from the RESTful Web Service.
   */
  public loadAll() {
    // set "loading" for this counter
    this.ngRedux.dispatch(this.buildLoadAllPendingAction());

    this.counterService.counters().subscribe(
      (cs: ICounter[]) => {
        const counters = [];
        for (const c of cs) {
          counters.push(new Counter(c.index, c.value));
        }
        this.ngRedux.dispatch(this.buildLoadAllCompletedAction(counters));
      },
      (error: HttpErrorResponse) => {
        this.errorActionCreatorService.setError("loadAll", `retrieving all counters failed with ${error.message}`);
      }
    );
  }

  /*
   * Helper functions
   */

  private buildDecrementCompletedAction: ActionCreator<IDecrementCompletedCounterAction> = (
    index: number,
    counter: ICounter
  ) => {
    return {
      type: CounterActionTypeKeys.DECREMENT_COMPLETED,
      payload: {
        index,
        counter,
      },
    };
  };

  private buildIncrementCompletedAction: ActionCreator<IIncrementCompletedCounterAction> = (
    index: number,
    counter: ICounter
  ) => {
    return {
      type: CounterActionTypeKeys.INCREMENT_COMPLETED,
      payload: {
        index,
        counter,
      },
    };
  };

  private buildLoadCompletedAction: ActionCreator<ILoadCompletedAction> = (index: number, counter: ICounter) => {
    return {
      type: CounterActionTypeKeys.LOAD_COMPLETED,
      payload: {
        index,
        counter,
      },
    };
  };

  private buildLoadAllCompletedAction: ActionCreator<ILoadAllCompletedAction> = (counters: ICounter[]) => {
    return {
      type: CounterActionTypeKeys.LOAD_ALL_COMPLETED,
      payload: {
        counters,
      },
    };
  };

  private buildLoadPendingAction: ActionCreator<ILoadPendingAction> = (index: number) => {
    return {
      type: CounterActionTypeKeys.LOAD_PENDING,
      payload: {
        index,
      },
    };
  };

  private buildLoadAllPendingAction: ActionCreator<ILoadAllPendingAction> = () => {
    return {
      type: CounterActionTypeKeys.LOAD_ALL_PENDING,
    };
  };

  private buildSavePendingAction: ActionCreator<ISavePendingAction> = (index: number) => {
    return {
      type: CounterActionTypeKeys.SAVE_PENDING,
      payload: {
        index,
      },
    };
  };
}
