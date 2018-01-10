import { DevToolsExtension, NgRedux, NgReduxModule } from "@angular-redux/store";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { CounterActionCreatorService } from "./actions/counter.action-creator.service";

import { AppComponent } from "./app.component";
import { CounterContainerComponent } from "./counter-container/counter-container.component";
import { CounterHeadingComponent } from "./counter-heading/counter-heading.component";
import { CounterInputComponent } from "./counter-input/counter-input.component";
import { MaterialModule } from "./material-module";
import { IAppState, INITIAL_STATE } from "./models/app-state";
import { rootReducer } from "./reducers/reducers";
import { CounterService } from "./services/counter.service";
import { ProgressComponent } from "./progress/progress.component";


@NgModule({
  declarations: [
    AppComponent,
    CounterContainerComponent,
    CounterHeadingComponent,
    CounterInputComponent,
    ProgressComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgReduxModule,
    MaterialModule,
  ],
  providers: [
    CounterService,
    CounterActionCreatorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>,
              devTools: DevToolsExtension) {
    const storeEnhancers = devTools.isEnabled() ? [devTools.enhancer()] : [];

    // Tell @angular-redux/store about our rootReducer and our
    // initial state. It will use this to create a redux store
    // for us and wire up all the events.
    ngRedux.configureStore(
      rootReducer,
      INITIAL_STATE,
      // [createLogger()],
      [
        thunk,
        createLogger(),
      ],
      storeEnhancers);
  }
}
