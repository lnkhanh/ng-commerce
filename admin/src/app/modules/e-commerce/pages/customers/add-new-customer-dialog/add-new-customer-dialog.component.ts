import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppState } from '@app/core/reducers';
import {
  GenderEnum,
  genderOptions,
  permissionOptions,
  UserType,
} from '@app/modules/auth/_models/user.model';
import { CustomValidators } from '@app/shared/utils/validators';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CreateCustomerAction } from '@app/modules/e-commerce/_actions/customer.actions';
import { selectCurrentCustomer } from '@app/modules/e-commerce/_selectors/customer.selectors';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminConfig } from '@app/core';

@Component({
  selector: 'kt-add-new-customer-dialog',
  templateUrl: './add-new-customer-dialog.component.html',
  styleUrls: ['./add-new-customer-dialog.component.scss'],
})
export class AddNewCustomerDialogComponent implements OnInit, OnDestroy {
  public frm: FormGroup;
  public loading$: Observable<boolean>;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public genderOptions;
  public permissionOptions;
  public adminConfig = AdminConfig;

  private saveSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(
    private _fb: FormBuilder,
    private _cd: ChangeDetectorRef,
    private _store: Store<AppState>,
    private _dialogRef: MatDialogRef<AddNewCustomerDialogComponent>
  ) {
    this.formSubmitted = false;
    this.genderOptions = genderOptions;
    this.permissionOptions = permissionOptions;
    this.subscriptions = [];
  }

  ngOnInit() {
    this.initForm();
    this.loading$ = this._store.pipe(select(selectPageLoading));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((u) => u.unsubscribe());
  }

  onSubmit() {
    this.formSubmitted = true;

    if (!this.frm.dirty || this.frm.invalid) {
      return;
    }

    const data = this.composeData();
    this._store.dispatch(new CreateCustomerAction({ data }));
    this.saveActionSub();
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
        "",
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required]],
      gender: [GenderEnum.Male, [Validators.required]],
    });
  }

  private composeData(): UserType {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      gender,
    } = this.f;

    const data: UserType = {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      companyId: '1bc', // TODO
      branchId: '1av', // TODO
      gender: gender.value,
    };

    return data;
  }

  private makeFormPristine() {
    // Keeping reset data
    Object.keys(this.f).forEach((k) => {
      this.f[k].markAsPristine();
    });
  }

  private saveActionSub() {
    if (this.saveSubscription) {
      return;
    }

    this.saveSubscription = this._store
      .pipe(select(selectCurrentCustomer()))
      .subscribe((user) => {
        if (user) {
          this._dialogRef.close({
            shouldReload: true,
            userId: user.id
          });
        }
      });

    this.subscriptions.push(this.saveSubscription);
  }
}
