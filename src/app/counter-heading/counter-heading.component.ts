import { Component, Input, OnInit } from "@angular/core";
import { ICounter } from "../models/counter";
import { CounterService } from "../services/counter.service";

@Component({
  selector: "mk-counter-heading",
  templateUrl: "./counter-heading.component.html",
  styleUrls: ["./counter-heading.component.css"]
})
export class CounterHeadingComponent implements OnInit {
  @Input() counterIndex;

  public counter: ICounter;

  constructor(private counterService: CounterService) {
  }

  ngOnInit() {
    this.counterService.counter(this.counterIndex).subscribe((res: ICounter) => this.counter = res);
  }
}
