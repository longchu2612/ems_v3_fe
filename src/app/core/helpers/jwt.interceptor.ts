import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private authfackservice: AuthfakeauthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (environment.defaultauth === 'firebase') {
            const currentUser = this.authenticationService.currentUser();
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`,
                    }
                });
            }
        } else {
            if (!request.url.includes('http') && !request.url.includes('assets')) {
                request = request.clone({
                    url: environment.host + request.url
                    
                });
            }
            const currentUser = this.authfackservice.currentUserValue;
            const workSpace = localStorage.getItem('workspace');
            // const workspace_Id = JSON.parse(workSpace).id;
            let workSpaceID = '';
            if (workSpace){
                workSpaceID = workSpace
            }
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        // 'Content-Type': 'application/json',
                        Authorization: `Bearer ${currentUser.token}`,
                    }
                });
              
            }

            // add authorization header with jwt token if available
        }
        // console.log("123");
        return next.handle(request)
    }
}
