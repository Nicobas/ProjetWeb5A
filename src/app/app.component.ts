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
  isAvailable = false;
  constructor(private authService: AuthService, private ConversationService: ConversationService, private UserService: UserService) { }

  changePage(choice: string) {
    this.page = choice;
  }
  connection() {
    this.token = this.authService.connection(this.email, this.pass);
  }

  verifyEmail() {
    this.isAvailable = this.authService.verifyEmail(this.email);
  }
}



