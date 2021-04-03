import { Directive } from '@angular/core';
import {
  Validator,
  AbstractControl,
  NG_VALIDATORS,
} from '@angular/forms';
import { CustomValidators } from '../utils/validators';

@Directive({
  selector: '[validateNoSpaces]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NoWhitespaceDirective, multi: true },
  ],
})
export class NoWhitespaceDirective implements Validator {
  private valFn = CustomValidators;
  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn.noWhiteSpaceValidator(control);
  }
}
