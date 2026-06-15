import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from "@angular/common";
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../models/toast.model';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toast-container" role="region" aria-label="Notificações">
      <ngb-alert
        *ngFor="let toast of (toasts$ | async); trackBy: trackByToastId"
        [type]="getAlertType(toast.type)"
        [dismissible]="true"
        (close)="removeToast(toast.id)"
        class="toast-alert"
      >
        {{ toast.message }}
      </ngb-alert>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
      max-width: 500px;
    }

    .toast-alert {
      pointer-events: all;
      min-width: 300px;
      animation: slideIn 0.3s ease-in-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 640px) {
      .toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .toast-alert {
        min-width: auto;
      }
    }
  `],
  imports: [
    CommonModule,
    NgbAlertModule,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);
  toasts$ = this.toastService.toasts;

  trackByToastId(_: number, toast: Toast): string {
    return toast.id;
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  /**
   * Converte tipo de toast para tipo de alerta do ng-bootstrap
   */
  getAlertType(toastType: Toast['type']): 'success' | 'danger' | 'warning' | 'info' {
    const typeMap: Record<Toast['type'], 'success' | 'danger' | 'warning' | 'info'> = {
      'success': 'success',
      'error': 'danger',
      'warning': 'warning',
      'info': 'info'
    };
    return typeMap[toastType];
  }

}
