import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { async, getTestBed, TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { Counter, ICounter } from "../models/counter";

import { CounterService, IEnvelope } from "./counter.service";

describe("CounterService", () => {
  let injector: TestBed;
  let service: CounterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CounterService],
    });

    injector = getTestBed();
    service = injector.get(CounterService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    // finally, assert that there are no outstanding requests
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should correctly retrieve a counter", async(() => {
    const index = 0;
    const value = 42;
    const dummyEnvelope: IEnvelope = {
      message: "Okay",
      status: 200,
      data: {
        counter: new Counter(index, value),
      },
    };

    // make the HTTP request via the service
    service.counter(index).subscribe((counter: ICounter) => {
      expect(counter.index).toBe(index, "index doesn't match");
      expect(counter.value).toBe(value, "value doesn't match");
    });

    // the request is pending, therefor expect that it sometimes happens
    const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}`);
    expect(req.request.method).toBe("GET", "expect a GET request");

    // fulfill the request by transmitting a response
    req.flush(dummyEnvelope);
  }));

  it("should deal with HTTP errors trying to retrieve a counter", async(() => {
    const index = 0;

    // make the HTTP request via the service
    service.counter(index).subscribe((counter: ICounter) => {
      expect(counter).toBeUndefined("shouldn't run into this success case");
    }, (error => {
      expect(error).toBeDefined("should receive an error");
    }));

    // the request is pending, therefor expect that it sometimes happens
    const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}`);
    expect(req.request.method).toBe("GET", "expect a GET request");

    // fulfill the request by transmitting an error
    req.error(new ErrorEvent("some error"));
  }));

  it("should correctly retrieve all counters", async(() => {
    const index0 = 0;
    const value0 = 42;
    const index1 = 1;
    const value1 = 4711;
    const dummyEnvelope: IEnvelope = {
      message: "Okay",
      status: 200,
      data: {
        counters: [
          new Counter(index0, value0),
          new Counter(index1, value1)
        ],
      },
    };

    // make the HTTP request via the service
    service.counters().subscribe((counters: ICounter[]) => {
      expect(counters.length).toBe(2, "length incorrect");
      expect(counters[0].index).toBe(index0, "first index doesn't match");
      expect(counters[0].value).toBe(value0, "first value doesn't match");
      expect(counters[1].index).toBe(index1, "second index doesn't match");
      expect(counters[1].value).toBe(value1, "second value doesn't match");
    });

    // the request is pending, therefor expect that it sometimes happens
    const req = httpMock.expectOne(`${environment.apiServer}/counters`);
    expect(req.request.method).toBe("GET", "expect a GET request");

    // fulfill the request by transmitting a response
    req.flush(dummyEnvelope);
  }));

  it("should deal with HTTP errors trying to retrieve all counters", async(() => {
    // make the HTTP request via the service
    service.counters().subscribe((counters: ICounter[]) => {
      expect(counters).toBeUndefined("shouldn't run into this success case");
    }, (error => {
      expect(error).toBeDefined("should receive an error");
    }));

    // the request is pending, therefor expect that it sometimes happens
    const req = httpMock.expectOne(`${environment.apiServer}/counters`);
    expect(req.request.method).toBe("GET", "expect a GET request");

    // fulfill the request by transmitting an error
    req.error(new ErrorEvent("some error"));
  }));
});
