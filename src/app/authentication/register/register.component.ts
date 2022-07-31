import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  username?: string;
  firstname?: string;
  lastname?: string;
  tel?: string;
  email?: string;
  password?: string;
  cPassword?: string;
  submitted: boolean = false;
  cLogin: boolean = false;
  srcImage: any = '../../../assets/images/person.png';

  uploadBtn?: any;

  constructor(private router: Router, private authService: AuthService, private el: ElementRef) { }

  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(res => {
      if (res) {
        this.navigate()
      }
    })
    this.uploadBtn = this.el.nativeElement.querySelector('#uploadBtn');
  }

  btnSubmit() {
    this.submitted = true;
    const user = this.username;
    const pass = this.password;
    if (user && pass) {
      this.authService
        .login(user, pass)
        .subscribe({
          complete: (() => this.navigate()),
          error: (() => this.cLogin = true)
        })
    }

  }

  readImage(event: any) {
    const choosedFile = event.target.files[0];
    if (choosedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(choosedFile);
      reader.onload = () => {
        console.log(reader.result);
        this.srcImage = reader.result;
      };

    }
  }

  navigate() {
    const role = this.authService.user?.role;
    const path = ['/online-quiz/']
    if (role === 'Admin') path.push('admin')
    this.router.navigate(path)
  }
}
