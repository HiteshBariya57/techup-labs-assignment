import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PinService {
  private pinAddedSource = new Subject<any>();
  pinAdded$ = this.pinAddedSource.asObservable();

  addPin(pin: any) {
    this.pinAddedSource.next(pin);
  }
}