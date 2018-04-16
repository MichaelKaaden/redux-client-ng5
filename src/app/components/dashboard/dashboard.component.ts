import { NgRedux, select } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/operator/reduce";
import { Observable } from "rxjs/Observable";

import { CounterActionCreatorService } from "../../actions/counter.action-creator.service";
import { IAppState } from "../../models/app-state";
import { ICounter } from "../../models/counter";

@Component({
  selector: "mk-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  @select(["counters"])
  counters$: Observable<ICounter[]>;
  public counterValueSum$: Observable<number>;
  @select(["counters", "length"])
  numOfCounters$: Observable<number>;

  public averageCounterValue$: Observable<number>;

  constructor(private redux: NgRedux<IAppState>, private counterActionCreatorService: CounterActionCreatorService) {}

  ngOnInit() {
    this.loadAll();

    // select counter with matching index
    // this.counters$ = this.redux.select((state: IAppState) => state.counters);
    // this.numOfCounters$ = this.redux.select((state: IAppState) => state.counters.length);
    this.counterValueSum$ = this.redux.select((state: IAppState) =>
      state.counters.reduce(
        (accumulator: number, current: ICounter) => accumulator + (current.value ? current.value : 0),
        0
      )
    );
    this.averageCounterValue$ = Observable.combineLatest(this.counterValueSum$, this.numOfCounters$, (sum, len) => {
      return len && len !== 0 ? Number.parseFloat((sum / len).toFixed(2)) : 0;
    });
  }

  // needed to capture "this" properly
  public loadAll = (): void => {
    this.counterActionCreatorService.loadAll();
  };
}
