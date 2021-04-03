import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserType } from '@app/modules/auth/_models/user.model';
import { AdminConfig } from '@app/shared/configs/admin.config';
import { UpdateAccountPayload } from '../../_models/account.model';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() user: UserType;
  @Output() handleUpdateAccount = new EventEmitter();
  @Output() handleUploadAvatar = new EventEmitter();
  @Output() handleRemoveAvatar = new EventEmitter();

  public form: FormGroup;
  public adminConfig = AdminConfig;

  constructor(private _fb: FormBuilder) {
  }
  
  ngOnInit() {
    this.createForm();
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

  onUploadAvatar(formData: FormData) {
    this.handleUploadAvatar.emit(formData);
  }

  onRemoveAvatar() {
    this.handleRemoveAvatar.emit();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const { firstName,lastName, phone, address } = this.form.value;
    const payload: UpdateAccountPayload = { firstName,lastName, phone, address, gender: 'M' };
    this.handleUpdateAccount.emit(payload);
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
        { value: email, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ],
      address: [address, Validators.compose([Validators.maxLength(255)])],
      phone: [
        phone,
        Validators.compose([Validators.minLength(9), Validators.maxLength(12)]),
      ],
    });
  }
}
