import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {


    loginForm: FormGroup;
    submitted = false;
    error = '';
    returnUrl: string;

    // set the currenr year
    year: number = new Date().getFullYear();
    isChecked: boolean = false;
    @ViewChild('phoneInput') phoneInput: ElementRef | undefined;
    @ViewChild('passwordInput') passwordInput: ElementRef | undefined;
    // tslint:disable-next-line: max-line-length
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public authenticationService: AuthenticationService,
        public authFackservice: AuthfakeauthenticationService

    ) {
        const storedValue = localStorage.getItem('rememberMe');
        if (storedValue) {
            this.isChecked = JSON.parse(storedValue);
            if (this.isChecked) {
                const storedCredentials = localStorage.getItem('credentials');
                if (storedCredentials) {
                    const { phone, password } = JSON.parse(storedCredentials);
                    if (this.phoneInput && this.passwordInput) {
                        this.phoneInput.nativeElement.value = phone;
                        this.passwordInput.nativeElement.value = password;
                    }
                }
            }
        }
    }

    ngOnInit() {
        document.body.removeAttribute('data-layout');
        document.body.classList.add('auth-body-bg');

        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
            rememberMe: [false]
        });

        // reset login status
        // this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        // tslint:disable-next-line: no-string-literal
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    onCheckboxChange(event: Event) {
        this.isChecked = (event.target as HTMLInputElement).checked;
        localStorage.setItem('rememberMe', JSON.stringify(this.isChecked));

        if (this.isChecked) {
            const phone = this.f.phone.value;
            const password = this.f.password.value;
            localStorage.setItem('credentials', JSON.stringify({ phone, password }));
        } else {
            localStorage.removeItem('credentials');
        }
    }
    /**
     * Form submit
     */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        } else {
            if (environment.defaultauth === 'firebase') {
                this.authenticationService.login(this.f.phone.value, this.f.password.value).then((res: any) => {
                    this.router.navigate(['/']);
                })
                    .catch(error => {
                        this.error = error ? error : '';
                    });
            } else {
                const data = this.loginForm.value
                this.authFackservice.login(this.f.username.value, this.f.password.value, this.f.rememberMe.value)
                    .pipe(first())
                    .subscribe(
                        data => {
                            console.log(data.body.role);
                            if (data && data.body.role === 'admin') {
                                this.router.navigate(['/']);

                            } else if (data && data.body.role === 'chef') {
                                this.router.navigate(['/kitchen']);

                            } else if (data && data.body.role === 'manager') {
                                this.router.navigate(['/']);
                            } else if (data && data.body.role === 'cashier') {
                                this.router.navigate(['/ordersmanagement']);
                            } else if (data && data.body.role === 'waiter') {
                                this.router.navigate(['/serve']);
                            }
                        },
                        error => {
                            this.error = error ? error : '';
                        });
            }
        }
    }
    showPassword: boolean = false;

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
        if (this.showPassword) {
            setTimeout(() => {
                this.showPassword = false;
            }, 2000);
        }
    }
}
