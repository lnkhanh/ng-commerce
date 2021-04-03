import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { CreateCategoryAction, UpdateCategoryAction } from '@app/modules/e-commerce/_actions/category.actions';
import { selectCurrentCategory } from '@app/modules/e-commerce/_selectors/category.selectors';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryType } from '@app/modules/e-commerce/_models/category.model';

@Component({
  selector: 'compose-category-dialog',
  templateUrl: './compose-category-dialog.component.html',
  styleUrls: ['./compose-category-dialog.component.scss'],
})
export class ComposeCategoryDialogComponent implements OnInit, OnDestroy {
  public frm: FormGroup;
  public loading$: Observable<boolean>;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public genderOptions;
  public permissionOptions;
  public categoryId: string;

  private primitiveData: CategoryType;
  private saveSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(
    private _fb: FormBuilder,
    private _store: Store<AppState>,
    private _dialogRef: MatDialogRef<ComposeCategoryDialogComponent>
  ) {
    this.formSubmitted = false;
    this.subscriptions = [];
  }

  ngOnInit() {
    this.initForm();
    this._dataSubscription();
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

    if (this.categoryId) {
      this._store.dispatch(new UpdateCategoryAction({ data }));
    } else {
      this._store.dispatch(new CreateCategoryAction({ data }));
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

  private fillData(formData: CategoryType) {
    if (!formData) {
      return;
    }

    const { name } = this.f;

    name.setValue(formData.name);

    this.primitiveData = formData;
    this.frm.markAsPristine();
  }

  private _dataSubscription() {
    const sub = this._store.pipe(select(selectCurrentCategory())).subscribe((data) => {
      if (data) {
        this.fillData(data);
        this.categoryId = data.id;
      }
    });
    this.subscriptions.push(sub);
  }

  private composeData(): CategoryType {
    const { name } = this.f;

    const data: CategoryType = {
      name: name.value,
    };

    if (this.categoryId) {
      data.id = this.categoryId;
    }

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
      .pipe(select(selectCurrentCategory()))
      .subscribe((category) => {
        if (category) {
          this._dialogRef.close({
            shouldReload: true,
            categoryId: category.id,
          });
        }
      });

    this.subscriptions.push(this.saveSubscription);
  }
}
