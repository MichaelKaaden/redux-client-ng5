import { filter, mergeMap } from "rxjs/operators";
import { NgRedux, select } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CounterActionCreatorService } from "../../actions/counter.action-creator.service";
import { IAppState } from "../../models/app-state";
import { ICounter } from "../../models/counter";

@Component({
  selector: "mk-counter-container",
  templateUrl: "./counter-container.component.html",
  styleUrls: ["./counter-container.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterContainerComponent implements OnInit {
  @Input() counterIndex;

  @select(["counters"])
  public counters$: Observable<ICounter[]>;

  public counter$: Observable<ICounter> = this.counters$.pipe(
    mergeMap((x) => x),
    filter((counter: ICounter) => {
      return counter.index === this.counterIndex;
    })
  );

  constructor(private redux: NgRedux<IAppState>, private counterActionCreatorService: CounterActionCreatorService) {}

  ngOnInit() {
    this.load();

    // to show what's going on
    // this.counters$.subscribe((value) =>
    //   console.log(`Counter Component #${this.counterIndex}: counters$ is now ${JSON.stringify(value)}`)
    // );
    // this.counter$.subscribe((value) =>
    //   console.log(`Counter Component #${this.counterIndex}: counter$ is now ${JSON.stringify(value)}`)
    // );
  }

  // needed to capture "this" properly
  public decrement = (by: number): void => {
    this.counterActionCreatorService.decrement(this.counterIndex, by);
  };

  // needed to capture "this" properly
  public increment = (by: number): void => {
    this.counterActionCreatorService.increment(this.counterIndex, by);
  };

  // needed to capture "this" properly
  public load = (): void => {
    this.counterActionCreatorService.load(this.counterIndex);
  };
}
