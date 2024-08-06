import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private httpClient: HttpClient
    ) { }

    isLogin() {
        let a = this.getStorage('token')
        if (a) {
            return a
        }
        return false
    }

    setStorage(name, value) {
        localStorage.setItem(name, value)
    }

    getStorage(name) {
        return localStorage.getItem(name)
    }

    onLogin(data){
        return this.httpClient.post('login', data).pipe(map(d => d['data']))
    }

    onLogout(){
        localStorage.removeItem('token')
    }


}
