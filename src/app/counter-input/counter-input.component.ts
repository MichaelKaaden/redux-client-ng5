import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "mk-counter-input",
  templateUrl: "./counter-input.component.html",
  styleUrls: ["./counter-input.component.css"]
})
export class CounterInputComponent implements OnInit {
  @Input() counterIndex: number;

  public counterValue: number;

  constructor() {
  }

  ngOnInit() {
    this.counterValue = 42;
  }

}
