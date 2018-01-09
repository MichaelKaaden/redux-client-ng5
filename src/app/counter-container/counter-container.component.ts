import { NgRedux } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { CounterActionCreatorService } from "../actions/counter.action-creator.service";
import { IAppState } from "../models/app-state";

@Component({
  selector: "mk-counter-container",
  templateUrl: "./counter-container.component.html",
  styleUrls: ["./counter-container.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterContainerComponent implements OnInit {
  @Input() counterIndex;

  constructor(private redux: NgRedux<IAppState>,
              private counterActionCreatorService: CounterActionCreatorService) {
  }

  ngOnInit() {
    this.load();
  }

  // needed to capture "this" properly
  public decrement = (by: number): void => {
    this.redux.dispatch<any>(this.counterActionCreatorService.decrement(this.counterIndex, by));
  };

  // needed to capture "this" properly
  public increment = (by: number): void => {
    this.redux.dispatch<any>(this.counterActionCreatorService.increment(this.counterIndex, by));
  };

  // needed to capture "this" properly
  public load = (): void => {
    this.redux.dispatch<any>(this.counterActionCreatorService.load(this.counterIndex));
  };
}
