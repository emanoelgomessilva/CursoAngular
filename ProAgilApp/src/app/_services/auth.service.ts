import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = 'https://localhost:44391/api/user/';
JwtHelper = new JwtHelperService();

constructor(private http: HttpClient) { }

login() {

}

register() {

}

loggedIn() {
  
}

}
