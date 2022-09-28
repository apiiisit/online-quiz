import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
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

  constructor(private messageService: MessageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(res => {
      if (res) {
        this.navigate()
      }
    })
  }

  btnSubmit() {
    this.submitted = true;
    this.cLogin = false;
    
    const user = this.username?.toLowerCase();
    const pass = this.password;
    if (user && pass) {
      this.authService
        .login(user, pass)
        .subscribe({
          complete: (() => {
            this.authService.updateLastLogin().subscribe();
            this.messageService.add({ severity: 'success', summary: 'เข้าสู่ระบบ', detail: 'เข้าสู่ระบบสำเร็จ', life: 1000 });
            this.navigate()
          }),
          error: (() => {
            this.cLogin = true
            this.messageService.add({ severity: 'error', summary: 'เข้าสู่ระบบ', detail: 'เข้าสู่ระบบไม่สำเร็จ', life: 2000 });

          })
        })
    }

  }

  navigate() {
    const role = this.authService.user?.role;
    const path = ['/online-quiz/']
    if (role === 'Admin') path.push('management')

    if (this.submitted) {
      setTimeout(() => {
        window.location.pathname = path.join('');
      }, 1500);
    } else {
      window.location.pathname = path.join('');
    }
    
  }

}
