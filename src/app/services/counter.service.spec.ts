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

  it("should retrieve counter 0", async(() => {
    const index = 0;
    const result: IEnvelope = {
      message: "Okay",
      status: 200,
      data: {
        counter: new Counter(index, 42),
      },
    };

    // make the HTTP request via the service
    service.counter(index).subscribe((counter: ICounter) => {
      console.log(`counter is ${JSON.stringify(counter)}`);
      expect(counter.value).toBe(42);
    });

    // the request is pending, therefor expect that it sometimes happens
    const req = httpMock.expectOne(`${environment.apiServer}/counters/${index}`);
    expect(req.request.method).toBe("GET");

    // fulfill the request by transmitting a response
    req.flush(result);
  }));
});
