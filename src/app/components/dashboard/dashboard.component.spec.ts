import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockNgRedux, NgReduxTestingModule } from "@angular-redux/store/lib/testing";

import { counterValueSumFunc, DashboardComponent } from "./dashboard.component";
import { CounterActionCreatorService } from "../../actions/counter.action-creator.service";
import { Subject } from "rxjs/Subject";
import { Counter, ICounter } from "../../models/counter";
import { IAppState } from "../../models/app-state";

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let counterIndex: number;
  let creatorSpy: jasmine.SpyObj<CounterActionCreatorService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [NgReduxTestingModule],
      providers: [
        {
          provide: CounterActionCreatorService,
          useValue: jasmine.createSpyObj("CounterActionCreatorService", ["loadAll"]),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    MockNgRedux.reset();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    creatorSpy = TestBed.get(CounterActionCreatorService);
    counterIndex = 0;

    // prepare stubs
    // creatorSpy.loadAll.and.returnValue({});

    // fixture.detectChanges();  // will do this explicitly when needed
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call loadAll on initialization", () => {
    fixture.detectChanges();

    expect(creatorSpy.loadAll.calls.count()).toBe(1, "loadAll was called once");
  });

  it("should select the counters from Redux", (done) => {
    const countersStub: Subject<ICounter[]> = MockNgRedux.getSelectorStub<IAppState, ICounter[]>("counters");

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

  it("should select the counters length from Redux", (done) => {
    const numOfCountersStub: Subject<number> = MockNgRedux.getSelectorStub<IAppState, number>(["counters", "length"]);

    // determine a sequence of values we'd like to test the Redux store with
    const expectedValues: ICounter[][] = [
      [new Counter(counterIndex, 42)],
      [new Counter(counterIndex, 42), new Counter(counterIndex + 1, 43)],
      [new Counter(counterIndex, 42), new Counter(counterIndex + 1, 43), new Counter(counterIndex + 2, 44)],
    ];

    // drive those values through our stub
    expectedValues.forEach((counterArray: ICounter[]) => numOfCountersStub.next(counterArray.length));
    // toArray only deals with completed streams
    numOfCountersStub.complete();

    // make sure counters$ receives these values
    let i = 0;
    component.numOfCounters$.subscribe(
      (length: number) => {
        console.log(`got length ${length}`);
        expect(length).toEqual(expectedValues[i++].length, "numOfCounters$ received the correct length");
      },
      (error) => console.log(error),
      done
    );
  });

  it("should select the sum from Redux", (done) => {
    const counterValueSumStub: Subject<number> = MockNgRedux.getSelectorStub<IAppState, number>(counterValueSumFunc);
    const values: number[] = [1, 2];

    values.forEach((value: number) => counterValueSumStub.next(value));
    counterValueSumStub.complete();

    let i = 0;
    component.counterValueSum$.subscribe(
      (sum: number) => {
        console.log(`sum is ${JSON.stringify(sum)}`);
        expect(sum).toBe(values[i++]);
      },
      (error) => console.log(error),
      done
    );
  });
});
