import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username?: string;
  password?: string;
  submitted: boolean = false;
  cLogin: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(res => {
      if (res) {
        this.navigate()
      }
    })
  }

  btnSubmit() {
    this.submitted = true;
    const user = this.username?.toLowerCase();
    const pass = this.password;
    if (user && pass) {
      this.authService
        .login(user, pass)
        .subscribe({
          complete: (() => {
            this.authService.updateLastLogin().subscribe();
            this.navigate()
          }),
          error: (() => this.cLogin = true)
        })
    }

  }

  navigate() {
    const role = this.authService.user?.role;
    const path = ['/online-quiz/']
    if (role === 'Admin') path.push('management')
    window.location.pathname = path.join('');
  }

}
