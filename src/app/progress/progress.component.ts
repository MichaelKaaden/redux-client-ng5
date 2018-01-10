import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "mk-progress",
  templateUrl: "./progress.component.html",
  styleUrls: ["./progress.component.css"]
})
export class ProgressComponent implements OnInit {
  @Input() diameter = 40;
  @Input() isLoading: boolean;

  constructor() {
  }

  ngOnInit() {
  }
}
