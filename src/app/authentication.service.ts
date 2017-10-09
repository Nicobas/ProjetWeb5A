import { Injectable } from '@angular/core';
import { User } from './user';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://localhost:4000/';
  private verifyEmailRoute = 'register/verifyEmail/';
  private url : string;
  test: boolean;
  auxane: User = {
    email: 'auxane',
    password: '1234',
    pseudo: '4ux4ne',
    picture: '../assets/profilpic.jpg',
    phrase: 'Je me kiffe',
  };

  connection(login: string, pass: string): any {
    // if ( login === this.auxane.email  &&  pass  === this.auxane.password ) {
    //   return 1;
    // }
  }

  verifyEmail(email: string): boolean {
    this.url = this.apiUrl + this.verifyEmailRoute + email;
    this.http.get(this.url).subscribe(data => this.test = data['isAvailable']);
    return this.test;
  }
}
