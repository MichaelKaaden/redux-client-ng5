import { ActionTypes, TypeKeys } from "../actions/counter.actions";
import { ICounterState, INITIAL_COUNTERS_STATE } from "../models/app-state";
import { Counter, ICounter } from "../models/counter";

export function counterReducer(state: ICounterState = INITIAL_COUNTERS_STATE, action: ActionTypes): ICounterState {
  let counter: ICounter;
  let newCounter: ICounter;
  let newCounters: ICounter[] = [];

  switch (action.type) {
    case TypeKeys.DECREMENTED:
      return {
        all: state.all.map((item) => {
          if (item.index !== action.payload.index) {
            // This isn't the item we care about - keep it as-is
            return item;
          }

          // Otherwise, this is the one we want - return an updated value resetting all flags
          return new Counter(action.payload.counter.index, action.payload.counter.value);
        }),
      };

    case TypeKeys.INCREMENTED:
      return {
        all: state.all.map((item) => {
          if (item.index !== action.payload.index) {
            // This isn't the item we care about - keep it as-is
            return item;
          }

          // Otherwise, this is the one we want - return an updated value resetting all flags
          return new Counter(action.payload.counter.index, action.payload.counter.value);
        }),
      };

    case TypeKeys.LOADED:
      return {
        all: state.all.map((item) => {
          if (item.index !== action.payload.index) {
            // This isn't the item we care about - keep it as-is
            return item;
          }

          // Otherwise, this is the one we want - return an updated value
          counter = new Counter(action.payload.counter.index, action.payload.counter.value);
          return counter;
        }),
      };

    case TypeKeys.LOADED_ALL:
      const countersToAdd: ICounter[] = [];
      for (const c of action.payload.counters) {
        if (!state.all.find((item) => item.index === c.index)) {
          countersToAdd.push(c);
        }
      }

      // copy the state and add the recently loaded counters
      newCounters = state.all.map((item) => item).concat(countersToAdd);

      // sort the state by counter index
      newCounters = newCounters.sort((a: ICounter, b: ICounter) => {
        return a.index - b.index;
      });

      // return the resulting state
      return {
        all: newCounters,
      };

    case TypeKeys.LOADING:
      /*
       * This is the only case where the counter does probably not yet exist.
       * It will be created and initialized with the counter and isLoading.
       */
      counter = state.all.find((item) => item.index === action.payload.index);
      if (counter) {
        // another LOADING action when the counter is already in the list means: do nothing.
        return state;
      }

      // copy the state
      newCounters = state.all.map((item) => item);

      // add the counter with uninitialized value
      newCounter = new Counter(action.payload.index);
      newCounter.isLoading = true;
      newCounters.push(newCounter);

      // sort the state by counter index
      newCounters = newCounters.sort((a: ICounter, b: ICounter) => {
        return a.index - b.index;
      });

      // return the resulting state
      return {
        all: newCounters,
      };

    case TypeKeys.LOADING_ALL:
      return state;

    case TypeKeys.SAVING:
      /*
       * Get the counter we're saving so we can use its old value until the new one
       * is retrieved from the server.
       */
      counter = state.all.find((item) => item.index === action.payload.index);
      return {
        all: state.all.map((item) => {
          if (item.index !== action.payload.index) {
            // This isn't the item we care about - keep it as-is
            return item;
          }

          newCounter = new Counter(counter.index, counter.value);
          newCounter.isSaving = true;
          return newCounter;
        }),
      };

    default:  // enforced by TypeKeys.OTHER_ACTION
      return state;
  }
}
