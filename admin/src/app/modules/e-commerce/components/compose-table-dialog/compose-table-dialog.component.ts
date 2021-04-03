import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppState } from '@app/core/reducers';
import { CustomValidators } from '@app/shared/utils/validators';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CreateStoreTableAction, UpdateStoreTableAction } from '@app/modules/e-commerce/_actions/store.actions';
import { selectCurrentStoreTable } from '@app/modules/e-commerce/_selectors/store.selectors';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreTableType } from '@app/modules/e-commerce/_models/store.model';

@Component({
  selector: 'ng-com-compose-table-dialog',
  templateUrl: './compose-table-dialog.component.html',
  styleUrls: ['./compose-table-dialog.component.scss']
})
export class ComposeTableDialogComponent implements OnInit, OnDestroy {
  public frm: FormGroup;
  public loading$: Observable<boolean>;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public genderOptions;
  public permissionOptions;
  public tableId: string;

  private primitiveData: StoreTableType;
  private saveSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(
    private _fb: FormBuilder,
    private _store: Store<AppState>,
    private _dialogRef: MatDialogRef<ComposeTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      table: StoreTableType,
      storeId: string
    }
  ) {
    this.formSubmitted = false;
    this.subscriptions = [];
  }

  ngOnInit() {
    this.initForm();
    if (this.data && this.data.table) {
      this.fillData(this.data.table);
    }
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

    if (this.tableId) {
      this._store.dispatch(new UpdateStoreTableAction({ tableId: data.id, storeId: this.data.storeId, name: data.name }));
    } else {
      this._store.dispatch(new CreateStoreTableAction({ data }));
    }
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
    });
  }

  private fillData(formData: StoreTableType) {
    if (!formData) {
      return;
    }

    this.tableId = formData.id;

    const { name } = this.f;

    name.setValue(formData.name);

    this.primitiveData = formData;
    this.frm.markAsPristine();
  }

  private composeData(): StoreTableType {
    const { name } = this.f;

    const data: StoreTableType = {
      storeId: this.data.storeId,
      name: name.value,
    };

    if (this.tableId) {
      data.id = this.tableId;
    }

    return data;
  }

  private saveActionSub() {
    if (this.saveSubscription) {
      return;
    }

    this.saveSubscription = this._store
      .pipe(select(selectCurrentStoreTable()))
      .subscribe((table) => {
        if (table) {
          this._dialogRef.close({
            shouldReload: true,
            tableId: table.id,
          });
        }
      });

    this.subscriptions.push(this.saveSubscription);
  }
}

