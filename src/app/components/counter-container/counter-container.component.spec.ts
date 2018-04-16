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
          useValue: jasmine.createSpyObj("CounterActionCreatorService", ["load"]),
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

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select the errors from Redux", (done) => {
    const countersStub: Subject<ICounter[]> = MockNgRedux.getSelectorStub(["counters"]);

    // determine a sequence of values we'd like to test the Redux store with
    const expectedValues: ICounter[][] = [
      [new Counter(counterIndex, 42)],
      [new Counter(counterIndex, 42), new Counter(counterIndex + 1, 43)],
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
