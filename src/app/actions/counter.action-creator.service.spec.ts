import { getTestBed, TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { Counter, ICounter } from "../models/counter";
import { CounterService } from "../services/counter.service";

import { CounterActionCreatorService } from "./counter.action-creator.service";

const BASE_VALUE = 60;

const counterServiceStub = {
  counter: (index: number): Observable<ICounter> => {
    console.log(`returning counter for index ${index}`);
    return Observable.of(new Counter(index, index + BASE_VALUE));
  }
};

describe("CounterActionCreatorService", () => {
  let injector: TestBed;
  let service: CounterActionCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CounterActionCreatorService,
        {
          provide: CounterService,
          useValue: counterServiceStub,
        }
      ]
    });

    injector = getTestBed();
    service = injector.get(CounterActionCreatorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
