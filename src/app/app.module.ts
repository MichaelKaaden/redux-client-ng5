import { NgReduxRouter, NgReduxRouterModule } from "@angular-redux/router";
import { DevToolsExtension, NgRedux, NgReduxModule } from "@angular-redux/store";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { createLogger } from "redux-logger";
import { CounterActionCreatorService } from "./actions/counter.action-creator.service";
import { ErrorsActionCreatorService } from "./actions/errors.action-creator.service";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./components/app/app.component";
import { CounterContainerComponent } from "./components/counter-container/counter-container.component";
import { CounterHeadingComponent } from "./components/counter-heading/counter-heading.component";
import { CounterInputComponent } from "./components/counter-input/counter-input.component";
import { CounterListComponent } from "./components/counter-list/counter-list.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ErrorsComponent } from "./components/errors/errors.component";
import { MaterialModule } from "./material-module";
import { IAppState, INITIAL_STATE } from "./models/app-state";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ProgressComponent } from "./components/progress/progress.component";
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
    PageNotFoundComponent,
    ErrorsComponent
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
    ErrorsActionCreatorService,
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
        createLogger(),
      ],
      storeEnhancers);
    ngReduxRouter.initialize();
  }
}
