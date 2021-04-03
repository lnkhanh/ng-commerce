import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionSet, OptionSetControlType, optionSetControlTypes } from '@app/modules/e-commerce/_models/option-set.model';
import { CustomValidators } from '@app/shared/utils/validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'option-set-form',
  templateUrl: './option-set-form.component.html',
  styleUrls: ['./option-set-form.component.scss']
})
export class OptionSetFormComponent implements OnInit, OnDestroy {
  @Input() optionSet$: Observable<OptionSet>;
  @Output() handleSubmit = new EventEmitter();
  public frm: FormGroup;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  public optionSetControlTypes;

  private primitiveData: OptionSet;
  private destroy$: Subject<void>;

  constructor(private _fb: FormBuilder) {
    this.formSubmitted = false;
    this.destroy$ = new Subject();
    this.optionSetControlTypes = optionSetControlTypes;
  }

  ngOnInit() {
    this.initForm();
    this.dataSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  private fillData(formData: OptionSet) {
    if (!formData) {
      return;
    }

    const { name, displayName, displayOrder, displayControlType } = this.f;

    name.setValue(formData.name);
    displayName.setValue(formData.displayName);
    displayOrder.setValue(formData.displayOrder);
    displayControlType.setValue(formData.displayControlType);

    this.primitiveData = formData;
    this.frm.markAsPristine();
  }

  private dataSubscription() {
    this.optionSet$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      if (data) {
        this.fillData(data);
      }
    });
  }
}
