import { MockNgRedux, NgReduxTestingModule } from "@angular-redux/store/lib/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ErrorsActionCreatorService } from "../../actions/errors.action-creator.service";
import { ErrorsComponent } from "./errors.component";
import { ErrorActionTypeKeys, IErrorOccurredAction, IResetErrorsAction } from "../../actions/error.actions";
import { Subject } from "rxjs/Subject";
import { IAppState } from "../../models/app-state";

describe("ErrorsComponent", () => {
  let component: ErrorsComponent;
  let fixture: ComponentFixture<ErrorsComponent>;
  let mockReduxInstance;
  let dispatchSpy;
  let resetErrorsAction: IResetErrorsAction;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorsComponent],
      imports: [NgReduxTestingModule],
      providers: [ErrorsActionCreatorService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsComponent);
    component = fixture.componentInstance;
    MockNgRedux.reset();
    mockReduxInstance = MockNgRedux.getInstance();
    dispatchSpy = spyOn(mockReduxInstance, "dispatch");
    resetErrorsAction = {
      type: ErrorActionTypeKeys.RESET_ERRORS,
    };

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select the errors from Redux", (done) => {
    const errorsStub: Subject<string[]> = MockNgRedux.getSelectorStub<IAppState, string[]>(["errors"]);

    // determine a sequence of values we'd like to test the Redux store with
    const expectedValues: string[][] = [["foo"], ["foo", "bar", "baz"]];

    // drive those values through our stub
    expectedValues.forEach((errorArray: string[]) => errorsStub.next(errorArray));
    // errorsStub.next(expectedValues);

    // toArray only deals with completed streams
    errorsStub.complete();

    // make sure counters$ receives these values
    // component.counter$.toArray().subscribe((values) => expect(values).toEqual(expectedValues));
    let i = 0;
    component.errors$.subscribe(
      (errorArray) => {
        expect(errorArray).toEqual(expectedValues[i++]);
      },
      (error) => console.log(`error ${error}`),
      done
    );
  });

  it("should change according to the application state", () => {
    const error = "foo";
    const errorAction: IErrorOccurredAction = {
      type: ErrorActionTypeKeys.ERROR_OCCURRED,
      payload: {
        error: `${error}`,
      },
    };
    mockReduxInstance.dispatch(errorAction);

    fixture.detectChanges();

    component.errors$.subscribe((errors: string[]) => {
      expect(errors).toBeDefined();
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe(error);
    });
  });

  it("reset should dispatch an ResetErrorsAction", () => {
    component.reset();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(resetErrorsAction);
  });

  it("reset should empty errors$", () => {
    const error = "foo";
    const errorAction: IErrorOccurredAction = {
      type: ErrorActionTypeKeys.ERROR_OCCURRED,
      payload: {
        error: `${error}`,
      },
    };
    mockReduxInstance.dispatch(errorAction);
    fixture.detectChanges();
    mockReduxInstance.dispatch(resetErrorsAction);
    fixture.detectChanges();

    component.errors$.subscribe((errors: string[]) => {
      expect(errors).toBeDefined();
      expect(errors.length).toBe(0);
    });
  });
});
