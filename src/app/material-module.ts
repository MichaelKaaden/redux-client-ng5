import { NgModule } from "@angular/core";

import { MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTabsModule } from "@angular/material";

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ]
})
export class MaterialModule {
}
