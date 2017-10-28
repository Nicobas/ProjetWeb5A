import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://skeelofficial.fr:4000/';
  private connectionRoute = 'auth/login';
  private registerRoute = 'register';
  private url: string;
  test: boolean;

  connection(email: string, password: string): void {
    this.url = this.apiUrl + this.connectionRoute;
    const json = {login: email, password: password, refreshToken: true};
    this.http.post(this.url, json);
  }

  register(pseudo: string, email: string, password: string): void {
    this.url = this.apiUrl + this.registerRoute;
    const json = { pseudo: pseudo, email: email, password: {first: password, second: password}};
    this.http.post(this.url, json).subscribe();

  }
}
