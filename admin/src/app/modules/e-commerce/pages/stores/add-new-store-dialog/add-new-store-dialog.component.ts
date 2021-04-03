import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppState } from '@app/core/reducers';
import { CustomValidators } from '@app/shared/utils/validators';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CreateStoreAction } from '@app/modules/e-commerce/_actions/store.actions';
import { selectCurrentStore } from '@app/modules/e-commerce/_selectors/store.selectors';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { MatDialogRef } from '@angular/material/dialog';
import { StoreType } from '@app/modules/e-commerce/_models/store.model';

@Component({
  selector: 'kt-add-new-store-dialog',
  templateUrl: './add-new-store-dialog.component.html',
  styleUrls: ['./add-new-store-dialog.component.scss'],
})
export class AddNewStoreDialogComponent implements OnInit, OnDestroy {
  public frm: FormGroup;
  public loading$: Observable<boolean>;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public genderOptions;
  public permissionOptions;

  private saveSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(
    private _fb: FormBuilder,
    private _cd: ChangeDetectorRef,
    private _store: Store<AppState>,
    private _dialogRef: MatDialogRef<AddNewStoreDialogComponent>
  ) {
    this.formSubmitted = false;
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
    this._store.dispatch(new CreateStoreAction({ data }));
    this.saveActionSub();
  }

  get f() {
    if (!this.frm) {
      return {};
    }
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
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(250),
          CustomValidators.noWhiteSpaceValidator,
        ],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.maxLength(250),
          CustomValidators.noWhiteSpaceValidator,
        ],
      ],
    });
  }

  private composeData(): StoreType {
    const { name, address } = this.f;

    const data: StoreType = {
      name: name.value,
      address: address.value,
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
      .pipe(select(selectCurrentStore()))
      .subscribe((store) => {
        if (store) {
          this._dialogRef.close({
            shouldReload: true,
            storeId: store.id,
          });
        }
      });

    this.subscriptions.push(this.saveSubscription);
  }
}
