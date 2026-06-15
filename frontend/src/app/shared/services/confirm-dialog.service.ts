import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(private ngbModal: NgbModal) {}

  confirm(
    title: string = 'Confirmação',
    message: string = 'Você tem certeza?'
  ): Observable<boolean> {
    const modalRef = this.ngbModal.open(ConfirmDialogComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'sm'
    });

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;

    return from(modalRef.result).pipe(
      map(() => true),
      catchError(() => from([false]))
    );
  }
}

import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss()"
      ></button>
    </div>
    <div class="modal-body">
      {{ message }}
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        (click)="activeModal.dismiss()"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="btn btn-danger"
        (click)="activeModal.close(true)"
      >
        Confirmar
      </button>
    </div>
  `,
  standalone: false
})
export class ConfirmDialogComponent {
  @Input() title = 'Confirmação';
  @Input() message = 'Você tem certeza?';

  constructor(public activeModal: NgbActiveModal) {}
}
