import { ICounter } from "./counter";

export interface ICounterState {
  all: ICounter[];
}

export interface IAppState {
  counters: ICounterState;
}

export const INITIAL_COUNTERS_STATE: ICounterState = {
  all: [],
};
export const INITIAL_STATE: IAppState = {
  counters: INITIAL_COUNTERS_STATE,
};
