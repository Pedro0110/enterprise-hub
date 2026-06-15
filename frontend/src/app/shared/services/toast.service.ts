import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  public toasts = this.toasts$.asObservable();

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 5000): void {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, message, type, duration };

    const current = this.toasts$.value;
    this.toasts$.next([...current, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration ?? 7000);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration ?? 5000);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration ?? 5000);
  }

  remove(id: string): void {
    const current = this.toasts$.value;
    this.toasts$.next(current.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts$.next([]);
  }
}
