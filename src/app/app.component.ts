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
  username = '';
  email = '';
  pass = '';
  token = '';
  page = 'login';
  error: string;
  data: string;
  errorRegister: string;
  id: string;

  constructor(private authService: AuthService, private conversationService: ConversationService, private userService: UserService) { }

  changePage(choice: string) {
    this.page = choice;
  }
  connection() {
    this.authService.connection(this.email, this.pass).subscribe(
      (data) => this.token = data['refreshToken'],
      (err) => this.error = err['message']
    );
   this.pass = '';
  }
  register() {
    this.errorRegister = '';
    this.id = '';
    this.authService.register(this.username, this.email, this.pass).subscribe(
      (data) => this.id = data['id'],
      (err) => this.errorRegister = err
    );
  }

  logout() {
    this.authService.logout();
    this.token = '';
  }

}



