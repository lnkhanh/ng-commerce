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
import { Observable, Subscription } from 'rxjs';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { MatDialogRef } from '@angular/material/dialog';
import { OptionSet } from '@app/modules/e-commerce/_models/option-set.model';
import { OptionSetControlType, optionSetControlTypes } from '@app/modules/e-commerce/_models/option-set.model';
import { CreateOptionSetAction } from '@app/modules/e-commerce/_actions/option-set.actions';
import { selectCurrentOptionSet } from '@app/modules/e-commerce/_selectors/option-set.selectors';

@Component({
  selector: 'kt-add-new-option-set-dialog',
  templateUrl: './add-new-option-set-dialog.component.html',
  styleUrls: ['./add-new-option-set-dialog.component.scss'],
})
export class AddNewOptionSetDialogComponent implements OnInit, OnDestroy {
  public frm: FormGroup;
  public loading$: Observable<boolean>;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public genderOptions;
  public permissionOptions;
  public optionSetControlTypes;

  private saveSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(
    private _fb: FormBuilder,
    private _cd: ChangeDetectorRef,
    private _store: Store<AppState>,
    private _dialogRef: MatDialogRef<AddNewOptionSetDialogComponent>
  ) {
    this.formSubmitted = false;
    this.subscriptions = [];
    this.optionSetControlTypes = optionSetControlTypes;
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

    const payload = this.composeData();
    this._store.dispatch(new CreateOptionSetAction(payload));
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

  handleOnChangeName(event: any) {
    if (!this.f.displayName.value) {
      this.f.displayName.setValue(event.target.value);
    }
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
      displayName: [
        '',
        [
          Validators.required,
          Validators.maxLength(250),
          CustomValidators.noWhiteSpaceValidator,
        ],
      ],
      displayOrder: [
        '',
        [
          Validators.max(999)
        ],
      ],
      displayControlType: [
        OptionSetControlType.RADIO,
        [
          Validators.required
        ]
      ],
    });
  }

  private composeData(): OptionSet {
    const { name, displayName, displayOrder, displayControlType } = this.f;

    const data: OptionSet = {
      name: name.value,
      displayName: displayName.value,
      displayOrder: displayOrder.value,
      displayControlType: displayControlType.value
    };

    return data;
  }

  private saveActionSub() {
    if (this.saveSubscription) {
      return;
    }

    this.saveSubscription = this._store
      .pipe(select(selectCurrentOptionSet()))
      .subscribe((optSet) => {
        if (optSet) {
          this._dialogRef.close({
            shouldReload: true,
            optionSetId: optSet.id,
          });
        }
      });

    this.subscriptions.push(this.saveSubscription);
  }
}
