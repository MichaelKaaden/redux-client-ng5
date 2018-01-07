import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { CounterContainerComponent } from "./counter-container/counter-container.component";
import { CounterHeadingComponent } from "./counter-heading/counter-heading.component";
import { CounterInputComponent } from "./counter-input/counter-input.component";
import { MaterialModule } from "./material-module";
import { CounterService } from "./services/counter.service";


@NgModule({
  declarations: [
    AppComponent,
    CounterContainerComponent,
    CounterHeadingComponent,
    CounterInputComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
  ],
  providers: [CounterService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
