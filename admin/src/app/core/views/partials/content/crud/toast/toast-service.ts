import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];
  toasts$ = new BehaviorSubject<any[]>([]);
  successOpts = {
    classname: 'btn-primary'
  };
  errorOpts = {
    classname: 'bg-danger text-light'
  };

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
    this.toasts$.next(this.toasts);
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
    this.toasts$.next(this.toasts);
  }

  showStandard(textOrTpl: string | TemplateRef<any>, header: string = null) {
    const options = {
      classname: '',
      delay: 5000,
      header
    };
    this.toasts.push({ textOrTpl, ...options });
  }

  showSuccess(textOrTpl: string | TemplateRef<any>, header: string = null) {
    const options = Object.assign(
      {},
      {
        delay: 5000,
        header
      },
      this.successOpts
    );
    this.toasts.push({ textOrTpl, ...options });
    this.toasts$.next(this.toasts);
  }

  showDanger(textOrTpl: string | TemplateRef<any>, header: string = null) {
    const options = Object.assign(
      {},
      {
        delay: 10000,
        header
      },
      this.errorOpts
    );
    if (!textOrTpl) {
      textOrTpl = 'Something went wrong, please try again!';
    }
    this.toasts.push({ textOrTpl, ...options });
    this.toasts$.next(this.toasts);
  }
}
