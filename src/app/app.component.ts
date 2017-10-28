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
  token = 0;
  page = 'login';
  constructor(private authService: AuthService, private conversationService: ConversationService, private userService: UserService) { }

  changePage(choice: string) {
    this.page = choice;
  }
  connection() {
    this.authService.connection(this.email, this.pass);
  }
  register() {
    this.authService.register(this.username, this.email, this.pass);
  }

}



