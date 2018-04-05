import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { environment } from "../../environments/environment";
import { Counter, ICounter, ICounterRaw } from "../models/counter";

export interface IEnvelope {
  data: any;
  message: string;
  status: number;
}

@Injectable()
export class CounterService {
  private readonly API_HOME = ""; // one would use /restApi/v3 here, for example
  private readonly BASE_URL: string = environment.apiServer + this.API_HOME;
  private readonly DELAY = 0; // delay before the HTTP call is done

  constructor(private http: HttpClient) {}

  /**
   * Get a counter.
   *
   * @param {number} index The counter's index
   * @returns {Observable<ICounter>}
   */
  public counter(index: number): Observable<ICounter> {
    return this.http
      .get<IEnvelope>(`${this.BASE_URL}/counters/${index}`)
      .delay(this.DELAY)
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
      .delay(this.DELAY)
      .map((result: IEnvelope) => this.rawCountersToCounters(result.data.counters))
      .catch(this.errorHandler);
  }

  /**
   * Decrements a counter's value on the API server.
   *
   * @param index The counter's index
   * @param by The value by which the counter is decremented
   * @returns {Observable<ICounter>}
   */
  public decrementCounter(index: number, by: number): Observable<ICounter> {
    return this.http
      .put<IEnvelope>(`${this.BASE_URL}/counters/${index}/decrement`, { by })
      .delay(this.DELAY)
      .map((result: IEnvelope) => new Counter(result.data.counter.index, result.data.counter.value))
      .catch(this.errorHandler);
  }

  /**
   * Increments a counter's value on the API server.
   *
   * @param index The counter's index
   * @param by The value by which the counter is incremented
   * @returns {Observable<ICounter>}
   */
  public incrementCounter(index: number, by: number): Observable<ICounter> {
    return this.http
      .put<IEnvelope>(`${this.BASE_URL}/counters/${index}/increment`, { by })
      .delay(this.DELAY)
      .map((result: IEnvelope) => new Counter(result.data.counter.index, result.data.counter.value))
      .catch(this.errorHandler);
  }

  /**
   * Handle HTTP errors.
   *
   * @param {Error | any} error
   * @returns {Observable<any>}
   */
  private errorHandler(error: Error | any): Observable<any> {
    return Observable.throw(error);
  }

  /**
   * Convert conters as returned by the API into Counter instances.
   *
   * @param {ICounterRaw[]} rawCounters
   * @returns {ICounter[]}
   */
  private rawCountersToCounters(rawCounters: ICounterRaw[]): ICounter[] {
    const counters: ICounter[] = [];
    for (const rc of rawCounters) {
      counters.push(new Counter(rc.index, rc.value));
    }
    return counters;
  }
}
