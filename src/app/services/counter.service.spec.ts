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

  it("should correctly retrieve counter 0", async(() => {
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

  it("should deal with errors retrieving counter 0", async(() => {
    const index = 0;

    // make the HTTP request via the service
    service.counter(index).subscribe((counter: ICounter) => {
      expect(counter).toBeUndefined("shouldn't run into this succes case");
    }, (error => {
      expect(error).toBeDefined("should receive an error");
    }));

    // the request is pending, therefor expect that it sometimes happens
    const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}`);
    expect(req.request.method).toBe("GET", "expect a GET request");

    // fulfill the request by transmitting an error
    req.error(new ErrorEvent("some error"));
  }));
});
