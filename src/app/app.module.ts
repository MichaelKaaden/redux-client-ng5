import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { CounterContainerComponent } from "./counter-container/counter-container.component";
import { MaterialModule } from "./material-module";
import { CounterHeadingComponent } from "./counter-heading/counter-heading.component";
import { CounterInputComponent } from "./counter-input/counter-input.component";


@NgModule({
  declarations: [
    AppComponent,
    CounterContainerComponent,
    CounterHeadingComponent,
    CounterInputComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
