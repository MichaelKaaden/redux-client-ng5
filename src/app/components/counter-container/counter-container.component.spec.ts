import { NgReduxTestingModule } from "@angular-redux/store/lib/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CounterContainerComponent } from "./counter-container.component";

xdescribe("CounterContainerComponent", () => {
  let component: CounterContainerComponent;
  let fixture: ComponentFixture<CounterContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterContainerComponent],
      imports: [NgReduxTestingModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
