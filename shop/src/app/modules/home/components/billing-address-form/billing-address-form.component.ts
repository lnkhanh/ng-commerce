import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserType } from '@app/modules/auth/_models/user.model';
import { AdminConfig } from '@app/shared/configs/admin.config';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PaymentMethod } from '../../_models/order.model';

@Component({
  selector: 'billing-address-form',
  templateUrl: './billing-address-form.component.html',
  styleUrls: ['./billing-address-form.component.css']
})
export class BillingAddressFormComponent implements OnInit, OnDestroy {
  @Input() user: UserType;
  @Output() handleBillingAddressFormChanges = new EventEmitter();
  public form: FormGroup;
  public adminConfig = AdminConfig;

  private destroy$: Subject<void>;

  constructor(private _fb: FormBuilder) {
    this.destroy$ = new Subject();
  }

  ngOnInit(): void {
    this.createForm();
    this.onFormChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    if (!this.form) return {};
    return this.form.controls;
  }

  getErrorMessage(control: AbstractControl) {
    if (!control.errors) {
      return "";
    }

    if (control.errors.required) {
      return "This field is required.";
    }

    if (control.errors.minlength) {
      return `Please enter at least ${control.errors.minlength.requiredLength} characters.`;
    }

    if (control.errors.maxlength) {
      return `please enter less than ${control.errors.maxlength.requiredLength} characters.`;
    }

    return "Invalid field!";
  }

  onSubmit() {
    if (this.form.invalid) {
      this.handleBillingAddressFormChanges.emit(null);
      return;
    }

    const { firstName, lastName, phone, address, email, orderNote } = this.form.value;
    const payload = { id: this.user.id,firstName, lastName, phone, address, email, orderNote };
    this.handleBillingAddressFormChanges.emit(payload);
  }

  private createForm() {
    const { firstName, lastName, email, address, phone } = this.user;

    this.form = this._fb.group({
      lastName: [
        lastName,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(26),
        ]),
      ],
      firstName: [
        firstName,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(26),
        ]),
      ],
      email: [
        { value: email, disabled: true }
      ],
      address: [address, Validators.compose([Validators.required, Validators.minLength(15), Validators.maxLength(255)])],
      paymentMethod: [PaymentMethod.CASH_ON_DELIVERY, Validators.required],
      phone: [
        phone,
        Validators.required,
      ],
      orderNote: [
        '',
        Validators.compose([
          Validators.maxLength(250),
        ]),
      ]
    });
  }

  private onFormChanges() {
    this.form.valueChanges.pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe((values) => {
      console.log(this.form.controls);
      this.onSubmit();
    });
  }
}
