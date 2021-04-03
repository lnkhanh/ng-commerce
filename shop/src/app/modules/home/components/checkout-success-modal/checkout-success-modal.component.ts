import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout-success-modal',
  templateUrl: './checkout-success-modal.component.html',
  styleUrls: ['./checkout-success-modal.component.css']
})
export class CheckoutSuccessModalComponent implements OnInit {
  @Input() orderCode: string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(private _activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  onGoToOrderDetails() {
    this._activeModal.dismiss();
    this.passEntry.emit(this.orderCode);
  }

  onGoToHome() {
    this._activeModal.dismiss();
    this.passEntry.emit()
  }
}
