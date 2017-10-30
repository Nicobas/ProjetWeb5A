import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://skeelofficial.fr:4000/';
  private connectionRoute = 'auth/login';
  private registerRoute = 'register';
  private logoutRoute = 'auth/logout';
  private url: string;

  public jsonHeaders(token: string): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': token});
    return headers;
  }

  connection(email: string, password: string): Observable<Response> {
    this.url = this.apiUrl + this.connectionRoute;
    const json = {login: email, password: password, refreshToken: true};
    return this.http.post(this.url, json);
  }

  register(pseudo: string, email: string, password: string): Observable<Response> {
    this.url = this.apiUrl + this.registerRoute;
    const json = { pseudo: pseudo, email: email, password: {first: password, second: password}};
    return this.http.post(this.url, json);

  }

  logout(token: string): void {
    const header = this.jsonHeaders(token);
    this.url = this.apiUrl + this.logoutRoute;
    this.http.delete(this.url, {headers: header}).subscribe();
}
}
