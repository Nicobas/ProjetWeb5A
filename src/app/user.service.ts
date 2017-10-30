import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://skeelofficial.fr:4000/';
  private meRoute = 'me';
  private searchUserRoute = 'findUsers/';
  private url;

  public jsonHeaders(token: string): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return headers;
  }
  getUser(token: string): Observable<Response> {
    const header = this.jsonHeaders(token);
    this.url = this.apiUrl + this.meRoute;
    return this.http.get(this.url, {headers: header});
  }

  searchUser(pseudo: string, token: string): Observable<Response> {
    const header = this.jsonHeaders(token);
    this.url = this.apiUrl + this.searchUserRoute + pseudo;
    return this.http.get(this.url, {headers: header});
  }
}
