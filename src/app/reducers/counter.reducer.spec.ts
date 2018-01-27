import { IDecrementedCounterAction, IIncrementedCounterAction, ILoadedAction, ILoadingAction, TypeKeys } from "../actions/counter.actions";
import { ICounterState, INITIAL_COUNTERS_STATE } from "../models/app-state";
import { Counter, ICounter } from "../models/counter";
import { counterReducer } from "./counter.reducer";

describe("Counter Reducer function", () => {
  let state: ICounterState; // tslint:disable-line:prefer-const
  let index;
  let value;
  let counter: ICounter;
  let anotherCounter: ICounter;
  let yetAnotherCounter: ICounter;
  let decrementedCounterAction: IDecrementedCounterAction;
  let incrementedCounterAction: IIncrementedCounterAction;
  let loadingAction: ILoadingAction;
  let loadedAction: ILoadedAction;

  beforeEach(() => {
    state = INITIAL_COUNTERS_STATE;
    index = 1;
    value = 42;

    counter = new Counter(index, value);
    anotherCounter = new Counter(index - 1, value - 1);
    yetAnotherCounter = new Counter(index + 1, value + 1);

    // result of the decrement action
    decrementedCounterAction = {
      type: TypeKeys.DECREMENTED,
      payload: {
        index,
        counter: new Counter(index, value - 1),
      },
    };

    // result of the increment action
    incrementedCounterAction = {
      type: TypeKeys.INCREMENTED,
      payload: {
        index,
        counter: new Counter(index, value + 1),
      },
    };

    loadingAction = {
      type: TypeKeys.LOADING,
      payload: {
        index,
      }
    };

    loadedAction = {
      type: TypeKeys.LOADED,
      payload: {
        index,
        counter,
      }
    };
  });

  describe("for the decremented action", () => {
    it("should not decrement a counter not in the app state", () => {
      const result = counterReducer(state, decrementedCounterAction);

      expect(result.all.length).toBe(0);
    });

    it("should decrement a single counter in the app state", () => {
      state = {
        all: [counter],
      };

      const result = counterReducer(state, decrementedCounterAction);
      expect(result).not.toBe(state);
      expect(result.all.length).toBe(state.all.length);
      const oldItem = getItemForIndex(state, index);
      const newItem = getItemForIndex(result, index);
      expect(newItem).not.toBe(oldItem);
      expect(newItem.value).toBe(oldItem.value - 1);
    });

    it("should decrement a counter in the middle of the app state", () => {

      state = {
        all: [anotherCounter, counter, yetAnotherCounter],
      };

      const result = counterReducer(state, decrementedCounterAction);
      expect(result).not.toBe(state);
      expect(result.all.length).toBe(state.all.length);
      const oldItem = getItemForIndex(state, index);
      const newItem = getItemForIndex(result, index);
      expect(newItem).not.toBe(oldItem);
      expect(newItem.value).toBe(oldItem.value - 1);
    });

    it("should handle a non-present counter", () => {
      state = {
        all: [anotherCounter, yetAnotherCounter],
      };

      const result = counterReducer(state, decrementedCounterAction);
      expect(result.all.length).toBe(state.all.length);

      const newCounter = getItemForIndex(result, index);
      expect(newCounter).toBeUndefined();
    });
  });

  describe("for the incremented action", () => {
    it("should not increment a counter not in the app state", () => {
      const result = counterReducer(state, incrementedCounterAction);

      expect(result.all.length).toBe(0);
    });

    it("should increment a single counter in the app state", () => {
      state = {
        all: [counter],
      };

      const result = counterReducer(state, incrementedCounterAction);
      expect(result).not.toBe(state);
      expect(result.all.length).toBe(state.all.length);
      const oldItem = getItemForIndex(state, index);
      const newItem = getItemForIndex(result, index);
      expect(newItem).not.toBe(oldItem);
      expect(newItem.value).toBe(oldItem.value + 1);
    });

    it("should increment a counter in the middle of the app state", () => {

      state = {
        all: [anotherCounter, counter, yetAnotherCounter],
      };

      const result = counterReducer(state, incrementedCounterAction);
      expect(result).not.toBe(state);
      expect(result.all.length).toBe(state.all.length);
      const oldItem = getItemForIndex(state, index);
      const newItem = getItemForIndex(result, index);
      expect(newItem).not.toBe(oldItem);
      expect(newItem.value).toBe(oldItem.value + 1);
    });

    it("should handle a non-present counter", () => {
      state = {
        all: [anotherCounter, yetAnotherCounter],
      };

      const result = counterReducer(state, incrementedCounterAction);
      expect(result.all.length).toBe(state.all.length);

      const newCounter = getItemForIndex(result, index);
      expect(newCounter).toBeUndefined();
    });

  });

  describe("for the loading action", () => {
    it("should add a counter if the app state is empty", () => {
      const result = counterReducer(state, loadingAction);

      expect(state.all.length).toBe(0);
      expect(result.all.length).toBe(1);

      const newCounter = getItemForIndex(result, index);
      expect(newCounter.value).toBeUndefined();
      expect(newCounter.isLoading).toBeTruthy();
      expect(newCounter.isSaving).toBeFalsy();
    });

    it("should add a counter if the counter is not yet in the app state", () => {
      state = {
        all: [anotherCounter, yetAnotherCounter],
      };
      const result = counterReducer(state, loadingAction);

      expect(state.all.length).toBe(2);
      expect(result.all.length).toBe(3);

      const newCounter = getItemForIndex(result, index);
      expect(newCounter.value).toBeUndefined();
      expect(newCounter.isLoading).toBeTruthy();
      expect(newCounter.isSaving).toBeFalsy();
    });

    it("should not change the other counters if the counter is not yet in the app state", () => {
      state = {
        all: [anotherCounter, yetAnotherCounter],
      };
      const result = counterReducer(state, loadingAction);

      expect(state.all.length).toBe(2);
      expect(result.all.length).toBe(3);

      const newAnotherCounter = getItemForIndex(result, anotherCounter.index);
      expect(newAnotherCounter.value).toBe(anotherCounter.value);
      const newYetAnotherCounter = getItemForIndex(result, yetAnotherCounter.index);
      expect(newYetAnotherCounter.value).toBe(yetAnotherCounter.value);
    });

    it("should sort the counter list if the counter is not yet in the app state", () => {
      state = {
        all: [anotherCounter, yetAnotherCounter],
      };
      const result = counterReducer(state, loadingAction);

      expect(state.all.length).toBe(2);
      expect(result.all.length).toBe(3);
      expect(result.all[0].index).toBe(0);
      expect(result.all[1].index).toBe(1);
      expect(result.all[2].index).toBe(2);
    });

    it("should not add a counter if the counter already is in the app state", () => {
      counter = new Counter(index);
      counter.isLoading = true;
      state = {
        all: [counter],
      };

      const result = counterReducer(state, loadingAction);

      expect(state.all.length).toBe(1);
      expect(result).toBe(state);
    });
  });

  describe("for the loaded action", () => {
    it("should set the properties for the placeholder counter as single counter in the array", () => {
      const oldCounter = new Counter(index);
      oldCounter.isLoading = true;
      state = {
        all: [oldCounter],
      };

      const result = counterReducer(state, loadedAction);
      expect(result.all.length).toBe(1);
      const newCounter = getItemForIndex(result, index);
      expect(newCounter.index).toBe(oldCounter.index);
      expect(newCounter.value).toBe(value);
      expect(newCounter.isLoading).toBeFalsy();
    });

    it("should set the properties for the placeholder counter for some counters in the array", () => {
      const oldCounter = new Counter(index);
      oldCounter.isLoading = true;
      state = {
        all: [anotherCounter, oldCounter, yetAnotherCounter],
      };

      const result = counterReducer(state, loadedAction);
      expect(result.all.length).toBe(3);
      const newCounter = getItemForIndex(result, index);
      expect(newCounter.index).toBe(oldCounter.index);
      expect(newCounter.value).toBe(value);
      expect(newCounter.isLoading).toBeFalsy();
    });

    it("should handle a non-present counter", () => {
      state = {
        all: [anotherCounter, yetAnotherCounter],
      };

      const result = counterReducer(state, loadedAction);

      expect(result.all.length).toBe(state.all.length);
      const newCounter = getItemForIndex(result, index);
      expect(newCounter).toBeUndefined();
    });
  });

  /*
   * Helper function to get a specific counter out of an app state object
   */
  const getItemForIndex = (theState: ICounterState, theIndex: number): ICounter => {
    return theState.all.find((theCounter: ICounter) => theCounter.index === theIndex);
  };
});
