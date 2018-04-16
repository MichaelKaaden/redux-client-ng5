import { MockNgRedux, NgReduxTestingModule } from "@angular-redux/store/lib/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Subject } from "rxjs/Subject";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { CounterContainerComponent } from "./counter-container.component";
import { Counter, ICounter } from "../../models/counter";
import { CounterActionCreatorService } from "../../actions/counter.action-creator.service";

describe("CounterContainerComponent", () => {
  let component: CounterContainerComponent;
  let fixture: ComponentFixture<CounterContainerComponent>;
  let counterIndex: number;
  let creatorSpy: jasmine.SpyObj<CounterActionCreatorService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterContainerComponent],
      imports: [NgReduxTestingModule],
      providers: [
        {
          provide: CounterActionCreatorService,
          useValue: jasmine.createSpyObj("CounterActionCreatorService", ["load", "increment", "decrement"]),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    MockNgRedux.reset();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterContainerComponent);
    component = fixture.componentInstance;
    creatorSpy = TestBed.get(CounterActionCreatorService);
    counterIndex = 0;
    component.counterIndex = counterIndex;

    // prepare stubs
    // creatorSpy.load.and.returnValue({});

    // fixture.detectChanges();  // will do this explicitly when needed
  });

  describe("and its initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should only call load on initialization", () => {
      fixture.detectChanges();

      expect(creatorSpy.load.calls.count()).toBe(1, "load was called once");
      expect(creatorSpy.decrement.calls.count()).toBe(0, "decrement was not called");
      expect(creatorSpy.increment.calls.count()).toBe(0, "increment was not called");
    });
  });

  describe("and Redux use", () => {
    it("should select the counters from Redux", (done) => {
      const countersStub: Subject<ICounter[]> = MockNgRedux.getSelectorStub(["counters"]);

      // determine a sequence of values we'd like to test the Redux store with
      const expectedValues: ICounter[][] = [
        [new Counter(counterIndex, 42)],
        [new Counter(counterIndex, 42), new Counter(counterIndex + 1, 43)],
        [new Counter(counterIndex, 42), new Counter(counterIndex + 1, 43), new Counter(counterIndex + 2, 44)],
      ];

      // drive those values through our stub
      expectedValues.forEach((counterArray: ICounter[]) => countersStub.next(counterArray));
      // toArray only deals with completed streams
      countersStub.complete();

      // make sure counters$ receives these values
      let i = 0;
      component.counters$.subscribe(
        (counterArray: ICounter[]) => {
          // console.log(`received ${JSON.stringify(counterArray)}`);
          expect(counterArray).toEqual(expectedValues[i++], "counters$ received the correct array");
        },
        (error) => console.log(error),
        done
      );
    });

    it("should retrieve its counter from the counters", (done) => {
      const countersStub: Subject<ICounter[]> = MockNgRedux.getSelectorStub(["counters"]);

      const counters: ICounter[] = [
        new Counter(counterIndex, 42),
        new Counter(counterIndex + 1, 43),
        new Counter(counterIndex + 2, 44),
      ];

      countersStub.next(counters);
      countersStub.complete();

      component.counter$.subscribe(
        (counter: ICounter) => {
          console.log(`received ${JSON.stringify(counter)}`);
          expect(counter.index).toBe(counterIndex, "counter has the correct index");
          expect(counter.value).toBe(42, "counter has the correct value");
        },
        (error) => console.log(error),
        done
      );
    });
  });

  describe("and its decrement and increment operations", () => {
    it("should call decrement on the counter action creator", () => {
      const by = 5;
      component.decrement(by);

      expect(creatorSpy.decrement.calls.count()).toBe(1, "decrement did call decrement on its action creator");
      expect(creatorSpy.increment.calls.count()).toBe(0, "decrement did not call increment on its action creator");
      expect(creatorSpy.load.calls.count()).toBe(0, "decrement did not call load on its action creator");
      expect(creatorSpy.decrement.calls.mostRecent().args[0]).toBe(counterIndex, "decrement used the correct index");
      expect(creatorSpy.decrement.calls.mostRecent().args[1]).toBe(by, "decrement used the correct by value");
    });

    it("should call increment on the counter action creator", () => {
      const by = 5;
      component.increment(by);

      expect(creatorSpy.increment.calls.count()).toBe(1, "increment did call increment on its action creator");
      expect(creatorSpy.decrement.calls.count()).toBe(0, "increment did not call decrement on its action creator");
      expect(creatorSpy.load.calls.count()).toBe(0, "increment did not call load on its action creator");
      expect(creatorSpy.increment.calls.mostRecent().args[0]).toBe(counterIndex, "increment used the correct index");
      expect(creatorSpy.increment.calls.mostRecent().args[1]).toBe(by, "increment used the correct by value");
    });
  });
});
