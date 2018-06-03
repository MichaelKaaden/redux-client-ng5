import { MockNgRedux, NgReduxTestingModule } from "@angular-redux/store/lib/testing";
import { getTestBed, TestBed } from "@angular/core/testing";

import { ErrorsActionCreatorService } from "./errors.action-creator.service";
import { ErrorActionTypeKeys, IErrorOccurredAction, IResetErrorsAction } from "./error.actions";

describe("ErrorsActionCreatorService", () => {
  let injector: TestBed;
  let service: ErrorsActionCreatorService;
  let mockReduxInstance;
  let dispatchSpy;
  let index;
  let by;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // service under test
        ErrorsActionCreatorService,
      ],
      imports: [NgReduxTestingModule],
    });

    injector = getTestBed();
    service = injector.get(ErrorsActionCreatorService);
    MockNgRedux.reset();
    mockReduxInstance = MockNgRedux.getInstance();
    dispatchSpy = spyOn(mockReduxInstance, "dispatch");
    index = 0;
    by = 1;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("setErrors", () => {
    it("should dispatch an error occurred action", () => {
      const methodName = "foo";
      const message = "bar";

      // call the service under test
      service.setError(methodName, message);

      // prepare expected action
      const errorAction: IErrorOccurredAction = {
        type: ErrorActionTypeKeys.ERROR_OCCURRED,
        payload: {
          error: `error in the "${methodName}" action creator: "${message}"`,
        },
      };

      // check
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(errorAction);
    });
  });

  describe("resetErrors", () => {
    it("should dispatch a reset errors action", () => {
      // call the service under test
      service.resetErrors();

      // prepare expected action
      const errorAction: IResetErrorsAction = {
        type: ErrorActionTypeKeys.RESET_ERRORS,
      };

      // check
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(errorAction);
    });
  });
});
