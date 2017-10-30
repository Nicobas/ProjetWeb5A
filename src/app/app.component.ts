import { Component } from '@angular/core';
import { AuthService } from './authentication.service';
import { UserService } from './user.service';
import { ConversationService } from './conversation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/materialize.css', '../assets/css/main.css'],
  providers: [AuthService, UserService, ConversationService]
})
export class AppComponent {
  constructor(private authService: AuthService, private conversationService: ConversationService, private userService: UserService) { }
  pass = '';
  page = 'login';
  error: string;
  data: string;
  errorRegister: string;
  connected = false;
  token = '';
  id = '';
  pseudo = '';
  conversations: string[];
  selectedConversation = [''];
  userSearched;
  email= '';
  searchId= '';

  changePage(choice: string) {
    this.page = choice;
  }
  connection() {
    this.authService.connection(this.email, this.pass).subscribe(
      (data) => {this.token = data['authorizationToken'];
        console.log('token: ' + this.token);
        console.log('connection succes');
      },
      (err) => this.error = err['message'],
      () => this.me()
    );
   this.pass = '';
  }
  register() {
    this.errorRegister = '';
    this.id = '';
    this.authService.register(this.pseudo, this.email, this.pass).subscribe(
      (data) => this.id = data['id'],
      (err) => this.errorRegister = err
    );
  }

  logout() {
    this.authService.logout(this.token);
    this.token = '';
    this.connected = false;
  }
  me() {
    console.log('retrieving user\'s data');
    this.userService.getUser(this.token).subscribe(
      (data) => (this.id = data['id'], this.pseudo = data['pseudo'], this.conversations = data['conversations'])
    );
    this.connected = true;
    console.log('done');
  }

  search() {
    this.userService.searchUser(this.searchId, this.token).subscribe(
      (data) => this.userSearched = data
    );
  }
  createConv(user) {
    this.conversationService.createConv(user.id, this.token).subscribe(
      (data) => this.conversations.push(data['id'])
    );
  }
}

