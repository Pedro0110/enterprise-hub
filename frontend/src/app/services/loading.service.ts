import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private counter = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  show() {
    this.counter++;
    if (this.counter === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide() {
    if (this.counter > 0) this.counter--;
    if (this.counter === 0) {
      this.loadingSubject.next(false);
    }
  }

  reset() {
    this.counter = 0;
    this.loadingSubject.next(false);
  }
}
