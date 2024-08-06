import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        // private authenticationService: AuthenticationService,
        private authfackservice: AuthfakeauthenticationService,
        private translateService: TranslateService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            // console.log(request, err)
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                Swal.fire({
                    title: this.translateService.instant('PAGE.LOGIN.SessionTimeout'),
                    text: this.translateService.instant('PAGE.LOGIN.Pleaselogintocontinues'),
                    timer: 3000
                })
                // this.authfackservice.logout();
                // location.reload();
            } else if (err.status == 403) {
                // this.authfackservice.logout()
                // this.router.navigate(['/account/login'])
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
