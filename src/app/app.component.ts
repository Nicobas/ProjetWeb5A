import { Component } from '@angular/core';
import { AuthService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/materialize.css', '../assets/css/main.css'],
  providers: [AuthService]
})
export class AppComponent {
  username = '';
  email = '';
  pass = '';
  token = 0;
  page = 'login';

  constructor(private authService: AuthService) { }

  changePage(choice: string) {
    this.page = choice;
  }
  connection() {
    this.token = this.authService.connection(this.email, this.pass);
  }

  verifyEmail() {
    this.token = this.authService.verifyEmail(this.email);
  }
}



