import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminConfig } from '@app/core';
import {
  genderOptions,
  permissionOptions,
  UserType,
} from '@app/modules/auth/_models/user.model';
import { CustomValidators } from '@app/shared/utils/validators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'kt-user-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class CustomerGeneralComponent implements OnInit, OnDestroy {
  @Input() user$: Observable<UserType>;
  @Output() handleSubmit = new EventEmitter();
  public frm: FormGroup;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public genderOptions;
  public permissionOptions;
  public adminConfig = AdminConfig;

  private primitiveData: UserType;
  private saveSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(private _fb: FormBuilder, private _cd: ChangeDetectorRef) {
    this.formSubmitted = false;
    this.genderOptions = genderOptions;
    this.permissionOptions = permissionOptions;
    this.subscriptions = [];
  }

  ngOnInit() {
    this.initForm();
    this.dataSubscription();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((u) => u.unsubscribe());
  }

  onSubmit() {
    this.formSubmitted = true;

    if (!this.frm.dirty || this.frm.invalid) {
      return;
    }

    this.handleSubmit.emit(this.composeData());
  }

  onReset() {
    if (!this.primitiveData) {
      return;
    }

    this.fillData(this.primitiveData);
  }

  get f() {
    if (!this.frm) { return {}; }
    return this.frm.controls;
  }

  getErrorMessage(control: FormControl) {
    if (control.errors.required) {
      return 'This field is required.';
    }

    return 'Invalid field';
  }

  private initForm() {
    this.frm = this._fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          CustomValidators.noWhiteSpaceValidator,
        ],
      ],
      firstName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(15)],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(80),
        ],
      ],
      isActivate: [''],
      address: ['', [Validators.maxLength(250)]],
      phone: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });
  }

  private fillData(formData: UserType) {
    if (!formData) {
      return;
    }

    const {
      email,
      firstName,
      lastName,
      phone,
      gender,
      address,
      isActivate,
    } = this.f;

    email.setValue(formData.email);
    firstName.setValue(formData.firstName);
    lastName.setValue(formData.lastName);
    phone.setValue(formData.phone);
    gender.setValue(formData.gender);
    address.setValue(formData.address);
    isActivate.setValue(formData.isActivate);

    this.primitiveData = formData;
    this.frm.markAsPristine();
  }

  private dataSubscription() {
    const sub = this.user$.subscribe((data) => {
      if (data) {
        this.fillData(data);
      }
    });
    this.subscriptions.push(sub);
  }

  private composeData(): UserType {
    const {
      email,
      firstName,
      lastName,
      phone,
      gender,
      address,
      isActivate,
    } = this.f;

    const data: UserType = {
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      companyId: '1bc', // TODO
      branchId: '1av', // TODO
      gender: gender.value,
      address: address.value,
      isActivate: isActivate.value,
    };

    return data;
  }

  private makeFormPristine() {
    // Keeping reset data
    Object.keys(this.f).forEach((k) => {
      this.f[k].markAsPristine();
    });
  }
}
