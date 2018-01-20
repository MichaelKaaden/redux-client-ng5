import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";

import { CounterService } from "./counter.service";

describe("CounterService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CounterService],
      imports: [HttpClientTestingModule]
    });
  });

  it("should be created", inject([
    HttpTestingController,
    CounterService
  ], (http: HttpTestingController,
      service: CounterService) => {
    expect(service).toBeTruthy();
  }));
});
