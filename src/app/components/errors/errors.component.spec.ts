import { MockNgRedux, NgReduxTestingModule } from "@angular-redux/store/lib/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IErrorOccurredAction, IResetErrorsAction, TypeKeys } from "../../actions/counter.actions";
import { ErrorsActionCreatorService } from "../../actions/errors.action-creator.service";

import { ErrorsComponent } from "./errors.component";

describe("ErrorsComponent", () => {
  let component: ErrorsComponent;
  let fixture: ComponentFixture<ErrorsComponent>;
  let mockReduxInstance;
  let dispatchSpy;
  let resetErrorsAction: IResetErrorsAction;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ErrorsComponent],
        imports: [NgReduxTestingModule],
        providers: [ErrorsActionCreatorService],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsComponent);
    component = fixture.componentInstance;
    MockNgRedux.reset();
    mockReduxInstance = MockNgRedux.getInstance();
    dispatchSpy = spyOn(mockReduxInstance, "dispatch");
    resetErrorsAction = {
      type: TypeKeys.RESET_ERRORS,
    };

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should change according to the application state", () => {
    const error = "foo";
    const errorAction: IErrorOccurredAction = {
      type: TypeKeys.ERROR_OCCURRED,
      error: `${error}`,
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
      type: TypeKeys.ERROR_OCCURRED,
      error: `${error}`,
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
