import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { findIndex } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { OrderDetails } from '../../_models/pos.model';
import { Helpers } from '@app/shared/utils/helpers';
import { OrderStatusOptions, OrderStatuses } from '@app/modules/e-commerce/_models/order.model';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';

interface IStatusStep {
  selected: boolean;
  label: string;
  value: number;
  icon: string;
}

@Component({
  selector: 'status-header-order-details',
  templateUrl: './status-header-order-details.component.html',
  styleUrls: ['./status-header-order-details.component.scss'],
})
export class StatusHeaderOrderDetailsComponent implements OnInit, OnDestroy {
  @Input() order$: Observable<OrderDetails>;
  @Output() handleUpdateStatus = new EventEmitter();
  @Output() handleOnPrint = new EventEmitter();
  @Output() handleOnDismiss = new EventEmitter();

  public orderStatuses;
  public steps: IStatusStep[] = [];
  public cancelledStatus: number;
  public currentStatus: number;

  private destroy$: Subject<boolean>;
  constructor(private _toastService: ToastService) {
    this.destroy$ = new Subject();
    this.cancelledStatus = OrderStatuses.Cancelled;
    this.orderStatuses = OrderStatusOptions;
  }

  ngOnInit() {
    this.order$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((order) => {
        if (order) {
          this.currentStatus = order.status;
          this.generateStatuses(this.orderStatuses);
          this.setSelected(order.status);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onUpdateStatus(status: IStatusStep) {
    const notAllowedStatuses = [OrderStatuses.Completed, OrderStatuses.Cancelled];
    if (status.selected === true || notAllowedStatuses.includes(this.currentStatus)) {
      this._toastService.showDanger('the current status not allowed to update.');
      return;
    }

    this.handleUpdateStatus.emit(status.value);
  }

  onPrint() {
    this.handleOnPrint.emit();
  }

  onDismiss() {
    this.handleOnDismiss.emit();
  }

  private setSelected(status: number) {
    const idx = findIndex(this.steps, { value: status });

    // Highlight only for cancel status.
    if (status === OrderStatuses.Cancelled) {
      this.steps[idx].selected = true;
      return;
    }

    if (idx !== -1) {
      for (let i = 0; i <= idx; i++) {
        this.steps[i].selected = true;
      }
    }
  }

  private generateStatuses(statuses: { val: number, name: string }[]) {
    this.steps = [];

    statuses.forEach((status) => {
      this.steps.push({
        selected: false,
        label: status.name,
        value: status.val,
        icon: Helpers.getStatusIcon(status.val),
      });
    });
  }
}
