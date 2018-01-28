import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { Counter, ICounter } from "../models/counter";
import { CounterService } from "../services/counter.service";

import { CounterInputComponent } from "./counter-input.component";

const BASE_VALUE = 60;

const counterServiceStub = {
  counter: (index: number): Observable<ICounter> => {
    console.log(`returning counter for index ${index}`);
    return Observable.of(new Counter(index, index + BASE_VALUE));
  }
};

describe("CounterInputComponent", () => {
  let component: CounterInputComponent;
  let fixture: ComponentFixture<CounterInputComponent>;
  let compiled: any;
  let index;
  let counter: ICounter;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterInputComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{
        provide: CounterService,
        useValue: counterServiceStub,
      }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    index = 21;
    counter = new Counter(index, BASE_VALUE + index);

    fixture = TestBed.createComponent(CounterInputComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("initially, no index is set", () => {
    expect(component.counterIndex).toBeUndefined();
  });

  it("should abort without loadFunc", () => {
    component.counterIndex = index;
    expect(fixture.detectChanges).toThrow();
  });

  it("should use the correct index", () => {
    component.counterIndex = index;
    fixture.detectChanges();
    expect(component.counterIndex).toBe(index);
  });

  it("should display the counter's value", () => {
    component.counterIndex = index;
    component.counter = counter;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
    const span = compiled.querySelector("span").textContent;
    expect(span).toContain(`${BASE_VALUE + index}`);
  });
});
