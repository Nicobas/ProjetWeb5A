import { Injectable } from '@angular/core';
import { User } from './user';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  auxane: User = {
    email: 'auxane',
    password: '1234',
    pseudo: '4ux4ne',
    picture: '../assets/profilpic.jpg',
    phrase: 'Je me kiffe',
  };

  constructor (
    private http: Http
  ) {}

  connection(login: string, pass: string): any {
    return this.http.get(``)
      .map((res: Response) => res.json());
    // if ( login === this.auxane.email  &&  pass  === this.auxane.password ) {
    //   return 1;
    // }
  }

  verifyEmail(email: string): any {
    return this.http.get('/verifyEmail/:email')
      .map((res: Response) => res.json());
  }
}
