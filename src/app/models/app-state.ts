import { ICounter } from "./counter";

export interface ICounterState {
  all: ICounter[];
}

export interface IAppState {
  counters: ICounterState;
  errors: string[];
}

export const INITIAL_COUNTERS_STATE: ICounterState = {
  all: [],
};

export const INITIAL_ERRORS_STATE: string[] = [];

export const INITIAL_STATE: IAppState = {
  counters: INITIAL_COUNTERS_STATE,
  errors: INITIAL_ERRORS_STATE,
};
