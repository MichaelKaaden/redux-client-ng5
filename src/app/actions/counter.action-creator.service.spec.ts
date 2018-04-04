import {
  MockNgRedux,
  NgReduxTestingModule,
} from "@angular-redux/store/lib/testing";
import { HttpClient } from "@angular/common/http";
import { getTestBed, TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { Counter } from "../models/counter";
import { CounterService } from "../services/counter.service";

import { CounterActionCreatorService } from "./counter.action-creator.service";
import { TypeKeys } from "./counter.actions";
import { ErrorsActionCreatorService } from "./errors.action-creator.service";

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
    savingAction = {
      type: TypeKeys.SAVE_PENDING,
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
        type: TypeKeys.ERROR_OCCURRED,
        error: `error in the "decrement" action creator: index -1 < 0`,
      });
    });

    it("should dispatch a saving and decremented action", () => {
      // prepare
      const decrementCounterSpy = spyOn(
        counterService,
        "decrementCounter"
      ).and.returnValue(Observable.of(new Counter(index, by)));

      // call the service under test
      service.decrement(index, by);

      // check
      expect(decrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(decrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(savingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: TypeKeys.DECREMENT_COMPLETED,
        payload: {
          index,
          counter: new Counter(index, by),
        },
      });
    });

    it("should dispatch errors that occured retrieving data from the REST service", () => {
      // prepare
      const errorMessage = "some error";
      const decrementCounterSpy = spyOn(
        counterService,
        "decrementCounter"
      ).and.returnValue(Observable.throw(new Error(errorMessage)));

      // call the service under test
      service.decrement(index, by);

      // check
      expect(decrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(decrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(savingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: TypeKeys.ERROR_OCCURRED,
        error: `error in the "decrement" action creator: decrementing the counter failed with ${errorMessage}`,
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
        type: TypeKeys.ERROR_OCCURRED,
        error: `error in the "increment" action creator: index -1 < 0`,
      });
    });

    it("should dispatch a saving and incremented action", () => {
      // prepare
      const incrementCounterSpy = spyOn(
        counterService,
        "incrementCounter"
      ).and.returnValue(Observable.of(new Counter(index, by)));

      // call the service under test
      service.increment(index, by);

      // check
      expect(incrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(incrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(savingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: TypeKeys.INCREMENT_COMPLETED,
        payload: {
          index,
          counter: new Counter(index, by),
        },
      });
    });

    it("should dispatch errors that occured retrieving data from the REST service", () => {
      // prepare
      const errorMessage = "some error";
      const incrementCounterSpy = spyOn(
        counterService,
        "incrementCounter"
      ).and.returnValue(Observable.throw(new Error(errorMessage)));

      // call the service under test
      service.increment(index, by);

      // check
      expect(incrementCounterSpy).toHaveBeenCalledTimes(1);
      expect(incrementCounterSpy).toHaveBeenCalledWith(index, by);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(savingAction);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: TypeKeys.ERROR_OCCURRED,
        error: `error in the "increment" action creator: incrementing the counter failed with ${errorMessage}`,
      });
    });
  });
});
