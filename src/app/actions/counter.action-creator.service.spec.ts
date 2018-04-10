import { MockNgRedux, NgReduxTestingModule } from "@angular-redux/store/lib/testing";
import { HttpClient } from "@angular/common/http";
import { getTestBed, TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import { Counter } from "../models/counter";
import { CounterService } from "../services/counter.service";

import { CounterActionCreatorService } from "./counter.action-creator.service";
import { CounterActionTypeKeys, ILoadPendingAction, ISavePendingAction } from "./counter.actions";
import { ErrorsActionCreatorService } from "./errors.action-creator.service";
import { ErrorActionTypeKeys } from "./error.actions";

const BASE_VALUE = 60;

describe("CounterActionCreatorService", () => {
  let injector: TestBed;
  let service: CounterActionCreatorService;
  let counterService: CounterService;
  let mockReduxInstance;
  let dispatchSpy;
  let index;
  let by;
  let savePendingAction: ISavePendingAction;
  let loadPendingAction: ILoadPendingAction;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // service under test
        CounterActionCreatorService,
        // dependencies of CounterActionCreatorService, needed for instantiation
        // need to be mocked with spyOn() to test the service under test above
        CounterService,
        ErrorsActionCreatorService,
        // dependencies of CounterService, needed for instantiation
        // never used because of the spies, therefore may be an empty object
        {
          provide: HttpClient,
          useValue: {},
        },
      ],
      imports: [NgReduxTestingModule],
    });

    injector = getTestBed();
    service = injector.get(CounterActionCreatorService);
    counterService = injector.get(CounterService);
    MockNgRedux.reset();
    mockReduxInstance = MockNgRedux.getInstance();
    dispatchSpy = spyOn(mockReduxInstance, "dispatch");
    index = 0;
    by = 1;
    savePendingAction = {
      type: CounterActionTypeKeys.SAVE_PENDING,
      payload: {
        index,
      },
    };
    loadPendingAction = {
      type: CounterActionTypeKeys.LOAD_PENDING,
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
      // call the service under test
      service.decrement(-1);

      // check
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: ErrorActionTypeKeys.ERROR_OCCURRED,
        payload: {
          error: `error in the "decrement" action creator: "index -1 < 0"`,
        },
      });
    });

    it("should dispatch a save pending and decrement completed action", () => {
      // prepare
      const decrementCounterSpy = spyOn(counterService, "decrementCounter").and.returnValue(
        Observable.of(new Counter(index, by))
      );

      // call the service under test
      service.decrement(index, by);

      // check
      expect(decrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(decrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(savePendingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: CounterActionTypeKeys.DECREMENT_COMPLETED,
        payload: {
          index,
          counter: new Counter(index, by),
        },
      });
    });

    it("should dispatch errors that occurred retrieving data from the REST service", () => {
      // prepare
      const errorMessage = "some error";
      const decrementCounterSpy = spyOn(counterService, "decrementCounter").and.returnValue(
        Observable.throw(new Error(errorMessage))
      );

      // call the service under test
      service.decrement(index, by);

      // check
      expect(decrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(decrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(savePendingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: ErrorActionTypeKeys.ERROR_OCCURRED,
        payload: {
          error: `error in the "decrement" action creator: "decrementing the counter failed with ${errorMessage}"`,
        },
      });
    });
  });

  describe("increment", () => {
    it("should not increment for wrong indices", () => {
      // call the service under test
      service.increment(-1);

      // check
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: ErrorActionTypeKeys.ERROR_OCCURRED,
        payload: {
          error: `error in the "increment" action creator: "index -1 < 0"`,
        },
      });
    });

    it("should dispatch a save pending and increment completed action", () => {
      // prepare
      const incrementCounterSpy = spyOn(counterService, "incrementCounter").and.returnValue(
        Observable.of(new Counter(index, by))
      );

      // call the service under test
      service.increment(index, by);

      // check
      expect(incrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(incrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(savePendingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: CounterActionTypeKeys.INCREMENT_COMPLETED,
        payload: {
          index,
          counter: new Counter(index, by),
        },
      });
    });

    it("should dispatch errors that occurred retrieving data from the REST service", () => {
      // prepare
      const errorMessage = "some error";
      const incrementCounterSpy = spyOn(counterService, "incrementCounter").and.returnValue(
        Observable.throw(new Error(errorMessage))
      );

      // call the service under test
      service.increment(index, by);

      // check
      expect(incrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(incrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(savePendingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: ErrorActionTypeKeys.ERROR_OCCURRED,
        payload: {
          error: `error in the "increment" action creator: "incrementing the counter failed with ${errorMessage}"`,
        },
      });
    });
  });

  describe("load", () => {
    it("should not load for wrong indices", () => {
      // call the service under test
      service.load(-1);

      // check
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: ErrorActionTypeKeys.ERROR_OCCURRED,
        payload: {
          error: `error in the "load" action creator: "index -1 < 0"`,
        },
      });
    });

    it("should dispatch a load pending and load completed action", () => {
      // prepare
      const counterSpy = spyOn(counterService, "counter").and.returnValue(Observable.of(new Counter(index, by)));
      spyOn(MockNgRedux.getInstance(), "getState").and.returnValue({
        counters: [],
      });

      // call the service under test
      service.load(index);

      // check
      expect(counterSpy).toHaveBeenCalledTimes(1);
      expect(counterSpy).toHaveBeenCalledWith(index);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(loadPendingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: CounterActionTypeKeys.LOAD_COMPLETED,
        payload: {
          index,
          counter: new Counter(index, by),
        },
      });
    });

    it("should exit immediately if the counter is found in the cache", () => {
      // prepare
      const counterSpy = spyOn(counterService, "counter").and.returnValue(Observable.of(new Counter(index, by)));
      spyOn(MockNgRedux.getInstance(), "getState").and.returnValue({
        counters: [new Counter(index, by)],
      });

      // call the service under test
      service.load(index);

      // check
      expect(counterSpy).toHaveBeenCalledTimes(0);
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should dispatch errors that occurred retrieving data from the REST service", () => {
      // prepare
      const errorMessage = "some error";
      const counterSpy = spyOn(counterService, "counter").and.returnValue(Observable.throw(new Error(errorMessage)));
      spyOn(MockNgRedux.getInstance(), "getState").and.returnValue({
        counters: [],
      });

      // call the service under test
      service.load(index);

      // check
      expect(counterSpy).toHaveBeenCalledTimes(1);
      expect(counterSpy).toHaveBeenCalledWith(index);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(loadPendingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: ErrorActionTypeKeys.ERROR_OCCURRED,
        payload: {
          error: `error in the "load" action creator: "retrieving the counter failed with ${errorMessage}"`,
        },
      });
    });
  });
});
