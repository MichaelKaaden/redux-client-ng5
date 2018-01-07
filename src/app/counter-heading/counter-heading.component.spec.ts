import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterHeadingComponent } from "./counter-heading.component";

describe("CounterHeadingComponent", () => {
  let component: CounterHeadingComponent;
  let fixture: ComponentFixture<CounterHeadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterHeadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
