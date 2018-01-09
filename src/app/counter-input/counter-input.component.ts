import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { ICounter } from "../models/counter";
import { CounterService } from "../services/counter.service";

@Component({
  selector: "mk-counter-input",
  templateUrl: "./counter-input.component.html",
  styleUrls: ["./counter-input.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterInputComponent implements OnInit {
  @Input() counter: ICounter;
  @Input() counterIndex: number;

  constructor(private counterService: CounterService) {
  }

  ngOnInit() {
    this.counterService
      .counter(this.counterIndex)
      .subscribe((res: ICounter) => this.counter = res);
  }

  public decrement(): void {
    this.counterService
      .decrementCounter(this.counterIndex, 1)
      .subscribe((res: ICounter) => this.counter = res);
  }

  public increment(): void {
    this.counterService
      .incrementCounter(this.counterIndex, 1)
      .subscribe((res: ICounter) => this.counter = res);
  }
}
