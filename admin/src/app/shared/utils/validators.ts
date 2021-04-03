import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static noSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return { cannotContainSpace: true };
    }

    return null;
  }

  // Validates URL
  static urlValidator(control: AbstractControl): ValidationErrors | null {
    if (control.pristine || control.value === '') {
      return null;
    }
    const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    control.markAsTouched();
    if (URL_REGEXP.test(control.value)) {
      return null;
    }
    return {
      invalidUrl: true
    };
  }

  static noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  static matchPassword(control: AbstractControl) {
    const password = control.get('password').value; // to get value in input tag
    const confirmPassword = control.get('confirmPassword').value; // to get value in input tag

    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ notMatchPassword: true });
    } else {
      return null;
    }
  }
}
