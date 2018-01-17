import { NgReduxRouter, NgReduxRouterModule } from "@angular-redux/router";
import { DevToolsExtension, NgRedux, NgReduxModule } from "@angular-redux/store";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { CounterActionCreatorService } from "./actions/counter.action-creator.service";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { CounterContainerComponent } from "./counter-container/counter-container.component";
import { CounterHeadingComponent } from "./counter-heading/counter-heading.component";
import { CounterInputComponent } from "./counter-input/counter-input.component";
import { CounterListComponent } from "./counter-list/counter-list.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MaterialModule } from "./material-module";
import { IAppState, INITIAL_STATE } from "./models/app-state";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { ProgressComponent } from "./progress/progress.component";
import { rootReducer } from "./reducers/reducers";
import { CounterService } from "./services/counter.service";


@NgModule({
  declarations: [
    AppComponent,
    CounterContainerComponent,
    CounterHeadingComponent,
    CounterInputComponent,
    ProgressComponent,
    CounterListComponent,
    DashboardComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgReduxModule,
    NgReduxRouterModule.forRoot(),
    MaterialModule,
  ],
  providers: [
    CounterService,
    CounterActionCreatorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(devTools: DevToolsExtension,
              ngRedux: NgRedux<IAppState>,
              ngReduxRouter: NgReduxRouter) {
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
    ngReduxRouter.initialize();
  }
}
