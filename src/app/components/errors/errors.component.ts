import { NgRedux, select } from "@angular-redux/store";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ErrorsActionCreatorService } from "../../actions/errors.action-creator.service";
import { IAppState } from "../../models/app-state";

@Component({
  selector: "mk-errors",
  templateUrl: "./errors.component.html",
  styleUrls: ["./errors.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsComponent {
  @select((state: IAppState) => state.errors) errors$: Observable<string[]>;

  constructor(private redux: NgRedux<IAppState>,
              private errorsActionCreatorService: ErrorsActionCreatorService) {
  }

  reset() {
    this.redux.dispatch<any>(this.errorsActionCreatorService.buildResetErrorsAction());
  }
}
