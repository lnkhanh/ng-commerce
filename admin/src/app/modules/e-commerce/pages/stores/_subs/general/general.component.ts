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
import { StoreType } from '@app/modules/e-commerce/_models/store.model';
import { CustomValidators } from '@app/shared/utils/validators';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ng-com-store-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class StoreGeneralComponent implements OnInit, OnDestroy {
  @Input() store$: Observable<StoreType>;
  @Output() handleSubmit = new EventEmitter();
  public frm: FormGroup;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public genderOptions;
  public permissionOptions;

  private primitiveData: StoreType;
  private saveSubscription: Subscription;
  private destroy$: Subject<boolean>;

  constructor(private _fb: FormBuilder, private _cd: ChangeDetectorRef) {
    this.formSubmitted = false;
    this.destroy$ = new Subject();
  }

  ngOnInit() {
    this.initForm();
    this._subscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSubmit() {
    this.formSubmitted = true;

    if (!this.frm.dirty || this.frm.invalid) {
      return;
    }

    this.handleSubmit.emit(this._composeData());
  }

  onReset() {
    if (!this.primitiveData) {
      return;
    }

    this._fillData(this.primitiveData);
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

  private _fillData(formData: StoreType) {
    if (!formData) {
      return;
    }

    const { name, address } = this.f;

    name.setValue(formData.name);
    address.setValue(formData.address);

    this.primitiveData = formData;
    this.frm.markAsPristine();
  }

  private _subscriptions() {
    this.store$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      if (data) {
        this._fillData(data);
      }
    });
  }

  private _composeData(): StoreType {
    const { name, address } = this.f;

    const data: StoreType = {
      name: name.value,
      address: address.value,
    };

    return data;
  }

  private _makeFormPristine() {
    // Keeping reset data
    Object.keys(this.f).forEach((k) => {
      this.f[k].markAsPristine();
    });
  }
}
