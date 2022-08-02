import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { OnlineQuizService } from 'src/app/service/online-quiz.service';
import { customValue } from 'src/app/validate/custom-value';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required, customValue]),
    firstName: new FormControl(null, [Validators.required, customValue]),
    lastName: new FormControl(null, [Validators.required, customValue]),
    tel: new FormControl(null, [Validators.required, customValue]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, customValue]),
    cPassword: new FormControl(null, [Validators.required, customValue]),
    userRole: new FormControl({ userRoleId: 2 })
  })

  submitted: boolean = false;
  cLogin: boolean = false;
  imageSrc: any = 'assets/images/person.png';

  formImage = new FormData();

  uploadBtn?: any;


  constructor(private router: Router, private authService: AuthService, private onlineQuizService: OnlineQuizService, private messageService: MessageService, private el: ElementRef) { }

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
    const user = this.userForm.value;
    if (this.userForm.valid && user.password === user.cPassword) {
      delete user['cPassword']

      if (this.formImage.get('fileName')) {
        const imageType = this.formImage.get('fileName')?.toString().split('.')[1];
        const imageName = `profile-${user.userName}-${new Date().getTime()}.${imageType}`;
        this.formImage.set('fileName', imageName);
        user.profile = imageName;
        this.onlineQuizService.postUploadImage(this.formImage).subscribe();
      }

      this.onlineQuizService.postUser(user).subscribe((res: any) => {
        if (res.error) {
          return this.messageService.add({ severity: 'error', summary: 'บันทึกไม่สำเร็จ', detail: res.error, life: 3000 });
        }
        this.messageService.add({ severity: 'success', summary: 'บันทึกสำเร็จ', detail: 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว', life: 3000 });
        setTimeout(() => {
          this.navigate();
        }, 3000)
      });


    }
  }

  previewImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      this.formImage.append("fileName", file.name);
      this.formImage.append("files", file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result;
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
