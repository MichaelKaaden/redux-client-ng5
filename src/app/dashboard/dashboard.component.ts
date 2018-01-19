import { NgRedux } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/operator/reduce";
import { Observable } from "rxjs/Observable";
import { CounterActionCreatorService } from "../actions/counter.action-creator.service";
import { IAppState } from "../models/app-state";
import { ICounter } from "../models/counter";

@Component({
  selector: "mk-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  public averageCounterValue$: Observable<number>;
  public counters$: Observable<ICounter[]>;
  public counterValueSum$: Observable<number>;
  public numOfCounters: Observable<number>;

  constructor(private redux: NgRedux<IAppState>,
              private counterActionCreatorService: CounterActionCreatorService) {
  }

  ngOnInit() {
    this.loadAll();

    // select counter with matching index
    this.counters$ = this.redux.select((state: IAppState) => state.counters.all);
    this.numOfCounters = this.redux.select((state: IAppState) => state.counters.all.length);
    this.counterValueSum$ = this.redux.select((state: IAppState) =>
      state.counters.all.reduce((accumulator: number, current: ICounter) => accumulator + current.value, 0));
    this.averageCounterValue$ = Observable.combineLatest(this.counterValueSum$, this.numOfCounters, (sum, len) => {
      return (len && len !== 0) ? Number.parseFloat((sum / len).toFixed(2)) : 0;
    });
  }

  // needed to capture "this" properly
  public loadAll = (): void => {
    this.redux.dispatch<any>(this.counterActionCreatorService.loadAll());
  };
}
