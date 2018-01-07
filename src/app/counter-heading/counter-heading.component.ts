import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "mk-counter-heading",
  templateUrl: "./counter-heading.component.html",
  styleUrls: ["./counter-heading.component.css"]
})
export class CounterHeadingComponent implements OnInit {
  @Input() counterIndex;

  constructor() { }

  ngOnInit() {
  }

}
