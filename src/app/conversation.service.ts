import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ConversationService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'https://skeelofficial.fr:4000/';
  private url;
  private createConvRoute = 'me/conversations';
  private getConvRoute = 'conversations/';

  public jsonHeaders(token: string): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return headers;
  }
  getConv(convId: string, token: string): Observable<Response> {
    this.url = this.apiUrl + this.getConvRoute + convId;
    const header = this.jsonHeaders(token);
    return this.http.get(this.url, {headers: header});
  }

  createConv(userid: string, token: string): Observable<Response> {
    this.url = this.apiUrl + this.createConvRoute;
    const header = this.jsonHeaders(token);
    const json = {userId: userid};
    return this.http.post(this.url, json, {headers: header});
  }

  sendMessage(message: string, convId: string, token: string): void {
    this.url = this.apiUrl + this.getConvRoute + convId + '/messages';
    const header = this.jsonHeaders(token);
    const json = {content: message};
    this.http.post(this.url, json, {headers: header}).subscribe();
  }
}
