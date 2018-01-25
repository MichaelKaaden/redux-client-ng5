import { inject, TestBed } from "@angular/core/testing";

import { CounterActionCreatorService } from "./counter.action-creator.service";

xdescribe("CounterActionCreatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CounterActionCreatorService]
    });
  });

  it("should be created", inject([CounterActionCreatorService], (service: CounterActionCreatorService) => {
    expect(service).toBeTruthy();
  }));
});
