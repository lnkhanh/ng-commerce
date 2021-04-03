// Angular
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
// RxJS
import { Observable, Subscription } from 'rxjs';
// Layout
import { LayoutUtilsService } from '@core/views/crud';
import { UserType } from '@app/modules/auth/_models/user.model';
import { CustomValidators } from '@app/shared/utils/validators';

@Component({
  selector: 'kt-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
  @Input() user$: Observable<UserType>;
  @Input() loading$: Observable<boolean>;
  @Output() handleChangePassword = new EventEmitter();

  public user: UserType;
  public changePasswordForm: FormGroup;

  private subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.createForm();
    this.subscriptions = [];
  }

  ngOnInit() {
    this.dataSubscription();
  }

  createForm() {
    this.changePasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: [''],
      },
      { validator: CustomValidators.matchPassword }
    );
  }

  getErrorMessage(control: FormControl) {
    console.log(control.errors);
    if (!control.errors) {
      return;
    }

    if (control.errors.required) {
      return 'This field is required.';
    }
    if (control.errors.notMatchPassword) {
      return 'Mật khẩu xác nhận không đúng.';
    }

    return 'Invalid field';
  }

  get f() {
    if (!this.changePasswordForm) { return {}; }
    return this.changePasswordForm.controls;
  }

  reset() {
    this.changePasswordForm.markAsPristine();
    this.changePasswordForm.markAsUntouched();
    this.changePasswordForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      Object.keys(this.f).forEach((controlName) =>
        this.f[controlName].markAsTouched()
      );

      return;
    }

    this.handleChangePassword.emit(this.f.password.value);
    this.reset();
  }

  private dataSubscription() {
    const sub = this.user$.subscribe((data) => {
      if (data) {
        this.user = data;
      }
    });
    this.subscriptions.push(sub);
  }
}
