import { Action } from "redux";
import { ICounter } from "../models/counter";

// see https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/

/**
 * Keys for actions
 */

export enum TypeKeys {
  DECREMENTED = "DECREMENTED",
  INCREMENTED = "INCREMENTED",
  LOADED = "LOADED",
  LOADED_ALL = "LOADED_ALL",
  LOADING = "LOADING",
  LOADING_ALL = "LOADING_ALL",
  SAVED = "SAVED",
  SAVING = "SAVING",
  OTHER_ACTION = "__any_other_action_type__",
}

/***********
 * Actions *
 ***********/

/**
 * Interface for the decrement action.
 */
export interface IDecrementedCounterAction extends Action {
  type: TypeKeys.DECREMENTED;
  payload: {
    index: number;
    counter: ICounter;
  };
}

/**
 * Interface for the increment action.
 */
export interface IIncrementedCounterAction extends Action {
  type: TypeKeys.INCREMENTED;
  payload: {
    index: number;
    counter: ICounter;
  };
}

/**
 * Interface for the loaded action.
 */
export interface ILoadedAction extends Action {
  type: TypeKeys.LOADED;
  payload: {
    index: number;
    counter: ICounter;
  };
}

/**
 * Interface for the loaded all counters action.
 */
export interface ILoadedAllAction extends Action {
  type: TypeKeys.LOADED_ALL;
  payload: {
    counters: ICounter[];
  };
}

/**
 * Interface for the loading action.
 */
export interface ILoadingAction extends Action {
  type: TypeKeys.LOADING;
  payload: {
    index: number;
  };
}

/**
 * Interface for the loading all counters action.
 */
export interface ILoadingAllAction extends Action {
  type: TypeKeys.LOADING_ALL;
}

/**
 * Interface for the saving action.
 */
export interface ISavingAction extends Action {
  type: TypeKeys.SAVING;
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
  type: TypeKeys.OTHER_ACTION;
}

/**
 * Type for all the actions above
 */
export type ActionTypes =
  | IDecrementedCounterAction
  | IIncrementedCounterAction
  | ILoadedAction
  | ILoadedAllAction
  | ILoadingAction
  | ILoadingAllAction
  | ISavingAction
  | IOtherAction;

