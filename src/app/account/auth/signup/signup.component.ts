import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';
import { UserProfileService } from '../../../core/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {

  signupForm: FormGroup;
  submitted = false;
  error = '';
  successmsg = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
              private userService: UserProfileService) { }

  ngOnInit() {
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');

    this.signupForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern('^(84|0[3|5|7|8|9])+([0-9]{8})$')]],
      full_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required]],
      // confirmPassword: ['', Validators.required],
    },
    {
      validator: this.passwordMatchValidator
    });
  }
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ mustMatch: true });
    } else {
      return null;
    }
  }
  passwordsMustMatch(group: FormGroup) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    if (password !== confirmPassword) {
        group.get('confirmPassword').setErrors({ mustMatch: true });
    } else {
        group.get('confirmPassword').setErrors(null);
    }
}
  ngAfterViewInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  // showpassword

  showPassword: boolean = false;

  toggleShowPassword() {
      this.showPassword = !this.showPassword;
      if (this.showPassword) {
          setTimeout(() => {
              this.showPassword = false;
          }, 2000);
      }
  }
  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.register(this.f.phone.value, this.f.password.value).then((res: any) => {
          this.successmsg = true;
          if (this.successmsg) {
            this.router.navigate(['/']);
          }
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.userService.register(this.signupForm.value)
          .pipe(first())
          .subscribe(
            data => {
              this.successmsg = true;
              if (this.successmsg) {
                this.router.navigate(['/account/login']);
              }
              alert("Tạo thành công ")
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }
}
