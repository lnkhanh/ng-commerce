import { Component, TemplateRef } from '@angular/core';

import { ToastService } from './toast-service';

@Component({
  selector: 'app-toasts',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts$ | async"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      [header]="toast.header"
      (hide)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"
        *ngIf="!toast.header" (click)="toastService.remove(toast)">
        <span aria-hidden="true">&times;</span>
      </button>
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"
          *ngIf="!toast.header" (click)="toastService.remove(toast)">
          <span aria-hidden="true">&times;</span>
        </button>
        {{ toast.textOrTpl }}
      </ng-template>
    </ngb-toast>
  `,
  host: { '[class.ngb-toasts]': 'true' }
})
export class ToastsContainer {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
