import { Injectable } from '@angular/core';
import { User } from './user';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ConversationService {
  constructor(private http: HttpClient) {}
  getConv(convId: string): void {
  }
  postConv(): void{
  }
  createConv(): void{
  }
  deleteConv(): void{
  }
}