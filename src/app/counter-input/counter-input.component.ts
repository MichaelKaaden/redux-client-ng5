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
  @Input() decrementFunc: (by: number) => void;
  @Input() incrementFunc: (by: number) => void;
  @Input() loadFunc: () => void;

  constructor(private counterService: CounterService) {
  }

  ngOnInit() {
    this.loadFunc();
  }

  public decrement(): void {
    this.decrementFunc(1);
  }

  public increment(): void {
    this.incrementFunc(1);
  }
}
