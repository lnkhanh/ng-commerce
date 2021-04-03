import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Option } from '@app/modules/e-commerce/_models/option-set.model';
import { CustomValidators } from '@app/shared/utils/validators';

@Component({
  selector: 'option-form',
  templateUrl: './option-form.component.html',
  styleUrls: ['./option-form.component.scss']
})
export class OptionFormComponent implements OnInit {
  @Output() handleSubmit = new EventEmitter();
  public frm: FormGroup;
  public formSubmitting: boolean;
  public formSubmitted: boolean;

  constructor(private _fb: FormBuilder) {
    this.formSubmitted = false;
  }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    this.formSubmitted = true;

    if (!this.frm.dirty || this.frm.invalid) {
      return;
    }

    this.handleSubmit.emit(this.composeData());
  }

  onReset() {
    this.frm.reset();
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
      value: [
        '',
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(99999999)
        ],
      ]
    });
  }

  private composeData(): Option {
    const { name, displayName, displayOrder, value } = this.f;

    const data: Option = {
      name: name.value,
      displayName: displayName.value,
      value: value.value
    };

    return data;
  }
}
