import { Injectable } from '@angular/core';

import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface Event {
    type: string;
    payload?: any;
}

type EventCallback = (payload: any) => void;

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private handler = new Subject<Event>();

    loading$ = new BehaviorSubject(null)
    constructor() { }
  count = 0
    setLoading(value){
      if(value){
        this.count ++
      }else{
        this.count--
      }

      if(this.count > 0){
        setTimeout(_ =>{
          this.loading$.next(true)
        }, 100)
      }else{
        setTimeout(_ =>{
          this.loading$.next(false)
        }, 100)
      }
      // console.log(value)
      // if(value == false){
      //   setTimeout(_ => {
      //   }, 10000)
      // }
    }

    /**
     * Broadcast the event
     * @param type type of event
     * @param payload payload
     */
    broadcast(type: string, payload = {}) {
        this.handler.next({ type, payload });
    }

    /**
     * Subscribe to event
     * @param type type of event
     * @param callback call back function
     */
    subscribe(type: string, callback: EventCallback): Subscription {
        return this.handler.pipe(
            filter(event => event.type === type)).pipe(
                map(event => event.payload))
            .subscribe(callback);
    }
}
