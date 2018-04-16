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
          useValue: jasmine.createSpyObj("CounterActionCreatorService", ["load", "loadAll", "increment", "decrement"]),
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
    creatorSpy.load.and.returnValue({});

    // fixture.detectChanges();  // will do this explicitly when needed
  });

  describe("and its initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should only call load on initialization", () => {
      fixture.detectChanges();

      expect(creatorSpy.load.calls.count()).toBe(1, "load was called once");
      expect(creatorSpy.loadAll.calls.count()).toBe(0, "loadAll was not called");
      expect(creatorSpy.decrement.calls.count()).toBe(0, "decrement was not called");
      expect(creatorSpy.increment.calls.count()).toBe(0, "increment was not called");
    });
  });

  describe("and Redux use", () => {
    it("should select the errors from Redux", (done) => {
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
          expect(counterArray).toEqual(expectedValues[i++]);
        },
        (error) => console.log(error),
        done
      );
    });
  });
});
