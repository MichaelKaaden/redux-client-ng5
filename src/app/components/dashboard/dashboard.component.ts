import { combineLatest as observableCombineLatest, Observable } from "rxjs";
import { NgRedux, select } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/operator/reduce";

import { CounterActionCreatorService } from "../../actions/counter.action-creator.service";
import { IAppState } from "../../models/app-state";
import { ICounter } from "../../models/counter";

/**
 * Calculate the average counter value.
 *
 * @param {Observable<number>} sum$
 * @param {Observable<number>} numOfCounters$
 * @returns {Observable<number>} average counter value
 */
export const averageCounterValue = (
  sum$: Observable<number>,
  numOfCounters$: Observable<number>
): Observable<number> => {
  return observableCombineLatest(sum$, numOfCounters$, (sum, len) => {
    // console.log(`sum: ${sum}, len: ${len}`);
    return len && len !== 0 ? Number.parseFloat((sum / len).toFixed(2)) : 0;
  });
};

/**
 * Calculate the sum of all counters.
 *
 * @param {IAppState} state
 * @returns {number} sum of all counters
 */
export const counterValueSumFunc = (state: IAppState) =>
  state.counters.reduce(
    (accumulator: number, current: ICounter) => accumulator + (current.value ? current.value : 0),
    0
  );

@Component({
  selector: "mk-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  // the counters
  @select(["counters"])
  counters$: Observable<ICounter[]>;
  // the sum of all counters
  @select(counterValueSumFunc) counterValueSum$: Observable<number>;
  // the number of counters
  @select(["counters", "length"])
  numOfCounters$: Observable<number>;

  public averageCounterValue$: Observable<number>;

  constructor(private redux: NgRedux<IAppState>, private counterActionCreatorService: CounterActionCreatorService) {}

  ngOnInit() {
    this.loadAll();

    this.averageCounterValue$ = averageCounterValue(this.counterValueSum$, this.numOfCounters$);
  }

  // needed to capture "this" properly
  public loadAll = (): void => {
    this.counterActionCreatorService.loadAll();
  };
}
