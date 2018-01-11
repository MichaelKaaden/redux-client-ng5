import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: "mk-progress",
  templateUrl: "./progress.component.html",
  styleUrls: ["./progress.component.css"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProgressComponent implements OnInit, OnChanges {
  @Input() delay = 250;
  @Input() diameter = 40;
  @Input() isLoading: boolean;

  public showProgress = false;

  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.isLoading) {
        console.log(`${this.delay}ms passed, showing progress...`);
        this.showProgress = true;
        this.ref.detectChanges();
      }
    }, this.delay);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isLoading.previousValue === true) {
      console.log(`disabling progress.`);
      this.showProgress = false;
    }
  }
}
