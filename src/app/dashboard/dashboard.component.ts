import { NgRedux } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
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
  public counter$: Observable<ICounter[]>;

  constructor(private redux: NgRedux<IAppState>,
              private counterActionCreatorService: CounterActionCreatorService) {
  }

  ngOnInit() {
    this.loadAll();

    // select counter with matching index
    this.counter$ = this.redux.select((state: IAppState) => state.counters.all);
  }

  // needed to capture "this" properly
  public loadAll = (): void => {
    this.redux.dispatch<any>(this.counterActionCreatorService.loadAll());
  };
}
