import {
  ChangeDetectorRef,
  Component,
  Inject,
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
import { CustomValidators } from '@app/shared/utils/validators';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CreateProductAction } from '@app/modules/e-commerce/_actions/product.actions';
import { selectCurrentProduct } from '@app/modules/e-commerce/_selectors/product.selectors';
import { selectCategoryList } from '@app/modules/e-commerce/_selectors/category.selectors';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductType } from '@app/modules/e-commerce/_models/product.model';
import { StoreType } from '@app/modules/e-commerce/_models/store.model';
import { CategoryType } from '@app/modules/e-commerce/_models/category.model';

@Component({
  selector: 'kt-add-new-product-dialog',
  templateUrl: './add-new-product-dialog.component.html',
  styleUrls: ['./add-new-product-dialog.component.scss'],
})
export class AddNewProductDialogComponent implements OnInit, OnDestroy {
  public frm: FormGroup;
  public loading$: Observable<boolean>;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public genderOptions;
  public stores: StoreType[];
  public categories: CategoryType[];

  private saveSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(
    private _fb: FormBuilder,
    private _cd: ChangeDetectorRef,
    private _store: Store<AppState>,
    private _dialogRef: MatDialogRef<AddNewProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA)  public data: { stores$: Observable<StoreType[]>, categories$: Observable<CategoryType[]> }
  ) {
    this.stores = [];
    this.categories = [];
    this.formSubmitted = false;
    this.subscriptions = [];
  }

  ngOnInit() {
    this.initForm();
    this.loading$ = this._store.pipe(select(selectPageLoading));
    if (this.data) {
      const storeSub = this.data.stores$.subscribe((stores) => {
        if (stores && stores.length) {
          this.stores = stores;
        }
      });

      const catSub = this.data.categories$.subscribe((categories) => {
        if (categories && categories.length) {
          this.categories = categories;
        }
      });

      this.subscriptions.push(storeSub);
      this.subscriptions.push(catSub);
    }
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
    this._store.dispatch(new CreateProductAction({ data }));
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
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(250),
          CustomValidators.noWhiteSpaceValidator,
        ],
      ],
      retailPrice: ['', [Validators.required]],
      salePrice: ['', []],
      // storeId: ['', []],
      categoryId: ['', []],
      description: ['', []],
    });
  }

  private composeData(): ProductType {
    const {
      name,
      description,
      retailPrice,
      salePrice,
      // storeId,
      categoryId
    } = this.f;

    const data: ProductType = {
      name: name.value,
      description: description.value,
      retailPrice: retailPrice.value,
      salePrice: salePrice.value,
      // storeId: storeId.value,
      categoryId: categoryId.value
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
      .pipe(select(selectCurrentProduct()))
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
