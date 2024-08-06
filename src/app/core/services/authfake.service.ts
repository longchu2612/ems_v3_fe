import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })

export class AuthfakeauthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string, rememberMe: boolean) {
        return this.http.post<any>(`auth/login`, { username, password, rememberMe }, { observe: 'response' })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                // if (user) {
                    var accessToken = user.headers.get('Authorization');
                    var refreshToken = user.headers.get('RefreshToken');
                    user.body.token = accessToken;
                    const dt = { ...user.body };
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(dt));
                    this.currentUserSubject.next(dt);
                // }
                return user;
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        return this.http.get<any>('auth/logout')
        }
}
