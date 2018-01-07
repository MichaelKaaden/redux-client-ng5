import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { CounterContainerComponent } from "./counter-container/counter-container.component";
import { MaterialModule } from "./material-module";


@NgModule({
  declarations: [
    AppComponent,
    CounterContainerComponent
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
