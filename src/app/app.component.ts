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
  connected = true;
  token = 'test';
  id = 'test';
  pseudo = 'test';
  conversations = ['conv1', 'conv2', 'conv3'];
  selectedConversation = ['bla', 'blablabla', 'blabla', 'blablabla'];
  email= 'test@test.fr';


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
      (data) => (this.id = data['id'], this.pseudo = data['pseudo'], this.conversations = data['conversation'])
    );
    this.connected = true;
    console.log('done');
  }

}
