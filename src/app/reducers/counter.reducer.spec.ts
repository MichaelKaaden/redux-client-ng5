import {
  IDecrementCompletedCounterAction,
  IIncrementCompletedCounterAction,
  ILoadAllCompletedAction,
  ILoadAllPendingAction,
  ILoadCompletedAction,
  ILoadPendingAction,
  ISavePendingAction,
  TypeKeys,
} from "../actions/counter.actions";
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
  let decrementedCounterAction: IDecrementCompletedCounterAction;
  let incrementedCounterAction: IIncrementCompletedCounterAction;
  let loadedAction: ILoadCompletedAction;
  let loadedAllAction: ILoadAllCompletedAction;
  let loadingAction: ILoadPendingAction;
  let loadingAllAction: ILoadAllPendingAction;
  let savingAction: ISavePendingAction;

  /*
   * Helper function to get a specific counter out of an app state object
   */
  const getItemForIndex = (theState: ICounterState, theIndex: number): ICounter => {
    return theState.all.find((theCounter: ICounter) => theCounter.index === theIndex);
  };

  beforeEach(() => {
    state = INITIAL_COUNTERS_STATE;
    index = 1;
    value = 42;

    anotherCounter = new Counter(index - 1, value - 1);
    counter = new Counter(index, value);
    yetAnotherCounter = new Counter(index + 1, value + 1);

    decrementedCounterAction = {
      type: TypeKeys.DECREMENT_COMPLETED,
      payload: {
        index,
        counter: new Counter(index, value - 1),
      },
    };
    incrementedCounterAction = {
      type: TypeKeys.INCREMENT_COMPLETED,
      payload: {
        index,
        counter: new Counter(index, value + 1),
      },
    };
    loadedAction = {
      type: TypeKeys.LOAD_COMPLETED,
      payload: {
        index,
        counter,
      },
    };
    loadedAllAction = {
      type: TypeKeys.LOAD_ALL_COMPLETED,
      payload: {
        counters: [anotherCounter, counter, yetAnotherCounter],
      },
    };
    loadingAction = {
      type: TypeKeys.LOAD_PENDING,
      payload: {
        index,
      },
    };
    loadingAllAction = {
      type: TypeKeys.LOAD_ALL_PENDING,
    };
    savingAction = {
      type: TypeKeys.SAVE_PENDING,
      payload: {
        index,
      },
    };
  });

  describe("with the decremented action", () => {
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

  describe("with the incremented action", () => {
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

  describe("with the loaded action", () => {
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

  describe("with the loaded all action", () => {
    it("should add all counters to the state", () => {
      expect(state.all.length).toBe(0);

      const result = counterReducer(state, loadedAllAction);

      expect(result).not.toBe(state);
      expect(state.all.length).toBe(0);
      expect(result.all.length).toBe(3);
      expect(getItemForIndex(result, anotherCounter.index)).toBe(anotherCounter);
      expect(getItemForIndex(result, counter.index)).toBe(counter);
      expect(getItemForIndex(result, yetAnotherCounter.index)).toBe(yetAnotherCounter);
    });

    it("should ignore doubles", () => {
      state = {
        all: [anotherCounter, counter, yetAnotherCounter],
      };

      const doubleCounter = new Counter(index, value);

      loadedAllAction.payload = {
        counters: [doubleCounter],
      };

      const result = counterReducer(state, loadedAllAction);

      expect(result.all.length).toBe(state.all.length);
      expect(getItemForIndex(result, counter.index)).toBe(counter);
      expect(getItemForIndex(result, doubleCounter.index)).toBe(counter);
    });

    it("should add counters to existing ones in the state", () => {
      state = {
        all: [anotherCounter, yetAnotherCounter],
      };

      loadedAllAction.payload = {
        counters: [anotherCounter, counter, yetAnotherCounter],
      };

      const result = counterReducer(state, loadedAllAction);

      expect(state.all.length).toBe(2);
      expect(result.all.length).toBe(3);
      expect(getItemForIndex(result, counter.index)).toBe(counter);
      expect(getItemForIndex(result, anotherCounter.index)).toBe(anotherCounter);
      expect(getItemForIndex(result, yetAnotherCounter.index)).toBe(yetAnotherCounter);
    });

    it("should sort the counters by index", () => {
      loadedAllAction.payload = {
        counters: [yetAnotherCounter, counter, anotherCounter],
      };

      const result = counterReducer(state, loadedAllAction);

      expect(result.all.length).toBe(3);
      expect(result.all[0].index).toBe(anotherCounter.index);
      expect(result.all[1].index).toBe(counter.index);
      expect(result.all[2].index).toBe(yetAnotherCounter.index);
    });
  });

  describe("with the loading action", () => {
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

  describe("with the loading all action", () => {
    it("should not add to the app state", () => {
      const result = counterReducer(state, loadingAllAction);

      expect(state.all.length).toBe(0);
      expect(result.all.length).toBe(0);
    });

    it("should not change the app state", () => {
      state = {
        all: [anotherCounter, counter, yetAnotherCounter],
      };

      const result = counterReducer(state, loadingAllAction);

      expect(result).toBe(state);
    });
  });

  describe("with the saving action", () => {
    it("should set the isSaving flag", () => {
      state = {
        all: [counter],
      };

      const result = counterReducer(state, savingAction);

      expect(result).not.toBe(state);
      const newCounter = getItemForIndex(result, index);
      expect(newCounter).not.toBe(counter);
      expect(newCounter.isSaving).toBeTruthy();
    });
  });
});
