import { ICounter } from "./counter";

export interface IAppState {
  counters: ICounter[];
  errors: string[];
}

export const INITIAL_COUNTERS_STATE: ICounter[] = [];

export const INITIAL_ERRORS_STATE: string[] = [];

export const INITIAL_STATE: IAppState = {
  counters: INITIAL_COUNTERS_STATE,
  errors: INITIAL_ERRORS_STATE,
};
