import { Action } from "redux";
import { ICounter } from "../models/counter";

// see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/

/**
 * Keys for actions
 */

export enum CounterActionTypeKeys {
  DECREMENT_COMPLETED = "DECREMENT_COMPLETED",
  INCREMENT_COMPLETED = "INCREMENT_COMPLETED",
  LOAD_ALL_COMPLETED = "LOAD_ALL_COMPLETED",
  LOAD_ALL_PENDING = "LOAD_ALL_PENDING",
  LOAD_COMPLETED = "LOAD_COMPLETED",
  LOAD_PENDING = "LOAD_PENDING",
  SAVE_PENDING = "SAVE_PENDING",
  OTHER_ACTION = "__any_other_action_type__",
}

/***********
 * Actions *
 ***********/

/**
 * Interface for the decrement completed action.
 */
export interface IDecrementCompletedCounterAction extends Action {
  type: CounterActionTypeKeys.DECREMENT_COMPLETED;
  payload: {
    index: number;
    counter: ICounter;
  };
}

/**
 * Interface for the increment completed action.
 */
export interface IIncrementCompletedCounterAction extends Action {
  type: CounterActionTypeKeys.INCREMENT_COMPLETED;
  payload: {
    index: number;
    counter: ICounter;
  };
}

/**
 * Interface for the load completed action.
 */
export interface ILoadCompletedAction extends Action {
  type: CounterActionTypeKeys.LOAD_COMPLETED;
  payload: {
    index: number;
    counter: ICounter;
  };
}

/**
 * Interface for the load all completed counters action.
 */
export interface ILoadAllCompletedAction extends Action {
  type: CounterActionTypeKeys.LOAD_ALL_COMPLETED;
  payload: {
    counters: ICounter[];
  };
}

/**
 * Interface for the load pending action.
 */
export interface ILoadPendingAction extends Action {
  type: CounterActionTypeKeys.LOAD_PENDING;
  payload: {
    index: number;
  };
}

/**
 * Interface for the load all pending counters action.
 */
export interface ILoadAllPendingAction extends Action {
  type: CounterActionTypeKeys.LOAD_ALL_PENDING;
}

/**
 * Interface for the save pending action.
 */
export interface ISavePendingAction extends Action {
  type: CounterActionTypeKeys.SAVE_PENDING;
  payload: {
    index: number;
  };
}

/**
 * Interface for all actions living outside
 * this app. TypeScript will warn us if we
 * forget to handle this special action type.
 */
export interface IOtherAction extends Action {
  type: CounterActionTypeKeys.OTHER_ACTION;
}

/**
 * Type for all the actions above
 */
export type CounterActionTypes =
  | IDecrementCompletedCounterAction
  | IIncrementCompletedCounterAction
  | ILoadAllCompletedAction
  | ILoadAllPendingAction
  | ILoadCompletedAction
  | ILoadPendingAction
  | ISavePendingAction
  | IOtherAction;
