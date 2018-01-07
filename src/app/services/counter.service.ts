import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { environment } from "../../environments/environment";
import { Counter, ICounter, ICounterRaw } from "../models/counter";

interface IEnvelope {
  data: any;
  message: string;
  status: number;
}

@Injectable()
export class CounterService {
  private readonly API_HOME = ""; // one would use /restApi/v3 here, for example
  private readonly BASE_URL: string = environment.apiServer + this.API_HOME;

  constructor(private http: HttpClient) {
  }

  /**
   * Get a counter.
   *
   * @param {number} index The counter's index
   * @returns {Observable<ICounter>}
   */
  public counter(index: number): Observable<ICounter> {
    return this.http
      .get<IEnvelope>(`${this.BASE_URL}/counters/${index}`)
      .map((result: IEnvelope) => new Counter(result.data.counter.index, result.data.counter.value))
      .catch(this.errorHandler);
  }

  /**
   * Get all counters.
   *
   * @returns {Observable<ICounter[]>}
   */
  public counters(): Observable<ICounter[]> {
    return this.http
      .get<IEnvelope>(`${this.BASE_URL}/counters`)
      .map((result: IEnvelope) => this.rawCountersToCounters(result.data.counters))
      .catch(this.errorHandler);
  }

  private rawCountersToCounters(rawCounters: ICounterRaw[]): ICounter[] {
    const counters: ICounter[] = [];
    for (const rc of rawCounters) {
      counters.push(new Counter(rc.index, rc.value));
    }
    return counters;
  }

  private errorHandler(error: Error | any): Observable<any> {
    return Observable.throw(error);
  }
}
