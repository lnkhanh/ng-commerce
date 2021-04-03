import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@app/shared/utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public submitted = false;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      firstName: ['User', Validators.required],
      lastName: ['Demo', Validators.required],
      email: ['demo1@test.com', [Validators.required, Validators.email]],
      password: ['admin1234', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['admin1234', Validators.required],
      agreeTerms: [false, Validators.requiredTrue],
    }, {
      validator: CustomValidators.mustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
  }
}
