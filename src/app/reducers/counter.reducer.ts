import { Action, Reducer } from "redux";

import { CounterActionTypeKeys, CounterActionTypes } from "../actions/counter.actions";
import { INITIAL_COUNTERS_STATE } from "../models/app-state";
import { Counter, ICounter } from "../models/counter";

class ReduxCounterReducer {
  private actions: { [action: string]: (state: ICounter[], action) => any };

  public static createInstance() {
    const reduxCounter = new ReduxCounterReducer();
    const reducer: Reducer<ICounter[]> = (
      state: ICounter[] = INITIAL_COUNTERS_STATE,
      action: CounterActionTypes
    ): ICounter[] => {
      return reduxCounter.execute(state, action);
    };

    return reducer;
  }

  constructor() {
    this.init();
  }

  private init() {
    this.actions = {
      [CounterActionTypeKeys.DECREMENT_COMPLETED]: this.onDecrementCompleted,
      [CounterActionTypeKeys.INCREMENT_COMPLETED]: this.onIncrementCompleted,
      [CounterActionTypeKeys.LOAD_COMPLETED]: this.onLoadCompleted,
      [CounterActionTypeKeys.LOAD_ALL_COMPLETED]: this.onLoadAllCompleted,
      [CounterActionTypeKeys.LOAD_PENDING]: this.onLoadPending,
      [CounterActionTypeKeys.LOAD_ALL_PENDING]: this.onLoadAllPending,
      [CounterActionTypeKeys.SAVE_PENDING]: this.onSavePending,
    };
  }

  private execute(state: ICounter[], action: CounterActionTypes) {
    const func = this.actions[action.type];
    const result = func ? func(state, action) : this.onDefault(state, action);
    return result;
  }

  private onDefault(state: ICounter[], action: CounterActionTypes) {
    // enforced by TypeKeys.OTHER_ACTION;
    return state;
  }

  private onDecrementCompleted(state: ICounter[], action) {
    return state.map((item) => {
      if (item.index !== action.payload.index) {
        // This isn't the item we care about - keep it as-is
        return item;
      }

      // Otherwise, this is the one we want - return an updated value resetting all flags
      return new Counter(action.payload.counter.index, action.payload.counter.value);
    });
  }

  private onIncrementCompleted(state: ICounter[], action) {
    return state.map((item) => {
      if (item.index !== action.payload.index) {
        // This isn't the item we care about - keep it as-is
        return item;
      }

      // Otherwise, this is the one we want - return an updated value resetting all flags
      return new Counter(action.payload.counter.index, action.payload.counter.value);
    });
  }

  private onLoadCompleted(state: ICounter[], action) {
    return state.map((item) => {
      if (item.index !== action.payload.index) {
        // This isn't the item we care about - keep it as-is
        return item;
      }

      // Otherwise, this is the one we want - return an updated value
      const counter = new Counter(action.payload.counter.index, action.payload.counter.value);
      return counter;
    });
  }

  private onLoadAllCompleted(state: ICounter[], action) {
    const countersToAdd: ICounter[] = [];
    for (const c of action.payload.counters) {
      if (!state.find((item) => item.index === c.index)) {
        countersToAdd.push(c);
      }
    }

    // copy the state and add the recently loaded counters
    let newCounters = state.map((item) => item).concat(countersToAdd);

    // sort the state by counter index
    newCounters = newCounters.sort((a: ICounter, b: ICounter) => {
      return a.index - b.index;
    });

    // return the resulting state
    return newCounters;
  }

  private onLoadPending(state: ICounter[], action) {
    /*
        * This is the only case where the counter does probably not yet exist.
        * It will be created and initialized with the counter and isLoading.
        */
    const counter = state.find((item) => item.index === action.payload.index);
    if (counter) {
      // another LOADING action when the counter is already in the list means: do nothing.
      return state;
    }

    // copy the state
    let newCounters = state.map((item) => item);

    // add the counter with uninitialized value
    const newCounter = new Counter(action.payload.index);
    newCounter.isLoading = true;
    newCounters.push(newCounter);

    // sort the state by counter index
    newCounters = newCounters.sort((a: ICounter, b: ICounter) => {
      return a.index - b.index;
    });

    // return the resulting state
    return newCounters;
  }

  private onLoadAllPending(state: ICounter[], action: CounterActionTypes) {
    return state;
  }

  private onSavePending(state: ICounter[], action) {
    /*
      * Get the counter we're saving so we can use its old value until the new one
      * is retrieved from the server.
      */
    const counter = state.find((item) => item.index === action.payload.index);
    return state.map((item) => {
      if (item.index !== action.payload.index) {
        // This isn't the item we care about - keep it as-is
        return item;
      }

      const newCounter = new Counter(counter.index, counter.value);
      newCounter.isSaving = true;
      return newCounter;
    });
  }
}

export const counterReducer = ReduxCounterReducer.createInstance();
