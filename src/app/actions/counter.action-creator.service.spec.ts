import { MockNgRedux, NgReduxTestingModule } from "@angular-redux/store/lib/testing";
import { HttpClient } from "@angular/common/http";
import { getTestBed, TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { IAppState } from "../models/app-state";
import { Counter } from "../models/counter";
import { CounterService } from "../services/counter.service";

import { CounterActionCreatorService } from "./counter.action-creator.service";
import { TypeKeys } from "./counter.actions";

const BASE_VALUE = 60;

describe("CounterActionCreatorService", () => {
  let injector: TestBed;
  let service: CounterActionCreatorService;
  let counterService: CounterService;
  let mockReduxInstance;
  let dispatchSpy;
  let index;
  let by;
  let savingAction;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // service under test
        CounterActionCreatorService,
        // dependencies of CounterActionCreatorService, needed for instantiation
        // need to be mocked with spyOn() to test the service under test above
        CounterService,
        // dependencies of CounterService, needed for instantiation
        // never used because of the spies, therefore may be an empty object
        {
          provide: HttpClient,
          useValue: {},
        }
      ],
      imports: [NgReduxTestingModule],
    });

    injector = getTestBed();
    service = injector.get(CounterActionCreatorService);
    counterService = injector.get(CounterService);
    mockReduxInstance = MockNgRedux.getInstance();
    dispatchSpy = spyOn(mockReduxInstance, "dispatch");
    index = 0;
    by = 1;
    savingAction = {
      type: TypeKeys.SAVING,
      payload: {
        index,
      },
    };

  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("decrement", () => {

    it("should not decrement for wrong indices", () => {
      service.decrement(-1);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should dispatch a saving and decremented action", () => {
      // prepare
      const decrementCounterSpy = spyOn(counterService, "decrementCounter")
        .and.returnValue(Observable.of(new Counter(index, by)));

      // call the service under test
      service.decrement(index, by)(dispatchSpy, () => {
        return {} as IAppState;
      }, null);

      // check
      expect(decrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(decrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(savingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: TypeKeys.DECREMENTED,
        payload: {
          index,
          counter: new Counter(index, by),
        },
      });
    });

    it("should handle errors", () => {
      // prepare
      const decrementCounterSpy = spyOn(counterService, "decrementCounter")
        .and.returnValue(Observable.throw(new Error("an error")));

      // call the service under test
      service.decrement(index, by)(dispatchSpy, () => {
        return {} as IAppState;
      }, null);

      // check
      expect(decrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(decrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(savingAction);
    });
  });
});
