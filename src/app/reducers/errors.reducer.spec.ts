import { IErrorAction, IResetErrorsAction, TypeKeys } from "../actions/counter.actions";
import { INITIAL_ERRORS_STATE } from "../models/app-state";
import { errorsReducer } from "./errors.reducer";

describe("Error reducer function", () => {
  let initialState: string[];
  let firstError: string;
  let secondError: string;

  beforeEach(() => {
    initialState = [...INITIAL_ERRORS_STATE];
    firstError = "first error";
    secondError = "I'm thirsty";
  });

  it("should add an error to the initial state", () => {
    const errorAction: IErrorAction = {
      type: TypeKeys.ERROR,
      error: `${firstError}`
    };

    const state = errorsReducer(initialState, errorAction);

    expect(state).not.toEqual(initialState);
    expect(state.length).toBe(1);
    expect(state[0]).toBe(firstError);
  });

  it("should add a second error to an existing one", () => {
    initialState.push(firstError);

    const errorAction: IErrorAction = {
      type: TypeKeys.ERROR,
      error: `${secondError}`
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
      type: TypeKeys.RESET_ERRORS,
    };

    const state = errorsReducer(initialState, resetErrorsAction);

    expect(state.length).toBe(0);
  });
});
