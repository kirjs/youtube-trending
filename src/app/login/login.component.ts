import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LoginComponent {
  constructor(readonly user: UserService) {
  }
}
