import {
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
import { CategoryType } from '@app/modules/e-commerce/_models/category.model';
import { ProductType } from '@app/modules/e-commerce/_models/product.model';
import { StoreType } from '@app/modules/e-commerce/_models/store.model';
import { CustomValidators } from '@app/shared/utils/validators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'kt-product-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class ProductGeneralComponent implements OnInit, OnDestroy {
  @Input() product$: Observable<ProductType>;
  @Input() stores$: Observable<StoreType[]>;
  @Input() categories$: Observable<CategoryType[]>;
  @Output() handleSubmit = new EventEmitter();
  public frm: FormGroup;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public genderOptions;
  public permissionOptions;

  private primitiveData: ProductType;
  private saveSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(private _fb: FormBuilder) {
    this.formSubmitted = false;
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
      categoryId: ['', [Validators.required]],
      description: ['', []],
    });
  }

  private fillData(formData: ProductType) {
    if (!formData) {
      return;
    }

    const { name, description, retailPrice, salePrice, storeId, categoryId } = this.f;

    name.setValue(formData.name);
    description.setValue(formData.description);
    retailPrice.setValue(formData.retailPrice);
    salePrice.setValue(formData.salePrice);
    // storeId.setValue(formData.storeId);
    categoryId.setValue(formData.categoryId);

    this.primitiveData = formData;
    this.frm.markAsPristine();
  }

  private dataSubscription() {
    const sub = this.product$.subscribe((data) => {
      if (data) {
        this.fillData(data);
      }
    });
    this.subscriptions.push(sub);
  }

  private composeData(): ProductType {
    const { name, description, retailPrice, salePrice, storeId, categoryId } = this.f;

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
}
