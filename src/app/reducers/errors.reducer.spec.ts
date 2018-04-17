import { INITIAL_ERRORS_STATE } from "../models/app-state";
import { errorsReducer } from "./errors.reducer";
import { ErrorActionTypeKeys, IErrorOccurredAction, IOtherAction, IResetErrorsAction } from "../actions/error.actions";
import { CounterActionTypeKeys, ILoadPendingAction } from "../actions/counter.actions";

describe("Error reducer function", () => {
  let initialState: string[];
  let firstError: string;
  let secondError: string;

  beforeEach(() => {
    initialState = [...INITIAL_ERRORS_STATE];
    firstError = "first error";
    secondError = "I'm thirsty";
  });

  it("should use its initial value with an undefined state", () => {
    const otherAction: IOtherAction = {
      type: ErrorActionTypeKeys.OTHER_ACTION,
    };

    const state = errorsReducer(undefined, otherAction);

    expect(state.length).toBe(0);
  });

  it("should add an error to the initial state", () => {
    const errorAction: IErrorOccurredAction = {
      type: ErrorActionTypeKeys.ERROR_OCCURRED,
      payload: {
        error: `${firstError}`,
      },
    };

    const state = errorsReducer(initialState, errorAction);

    expect(state).not.toEqual(initialState);
    expect(state.length).toBe(1);
    expect(state[0]).toBe(firstError);
  });

  it("should add a second error to an existing one", () => {
    initialState.push(firstError);

    const errorAction: IErrorOccurredAction = {
      type: ErrorActionTypeKeys.ERROR_OCCURRED,
      payload: {
        error: `${secondError}`,
      },
    };

    const state = errorsReducer(initialState, errorAction);

    expect(state.length).toBe(2);
    expect(state[0]).toBe(firstError);
    expect(state[1]).toBe(secondError);
  });

  it("should remove errors on reset", () => {
    initialState.push(firstError);
    initialState.push(secondError);

    const resetErrorsAction: IResetErrorsAction = {
      type: ErrorActionTypeKeys.RESET_ERRORS,
    };

    const state = errorsReducer(initialState, resetErrorsAction);

    expect(state.length).toBe(0);
  });

  it("should ignore unknown action types", () => {
    const anAction: ILoadPendingAction = {
      type: CounterActionTypeKeys.LOAD_PENDING,
      payload: {
        index: 0,
      },
    };
    const state = errorsReducer(initialState, anAction);
    expect(state).toBe(initialState);
  });
});
