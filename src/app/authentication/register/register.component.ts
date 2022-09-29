import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { OnlineQuizService } from 'src/app/service/online-quiz.service';
import { Mode } from 'src/app/type/mode';
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
    tel: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, customValue]),
    cPassword: new FormControl(null, [Validators.required, customValue])
  })

  title?: string;
  btnValue?: string;

  userReg: RegExp = /^[a-zA-Z0-9_]/
  strReg: RegExp = /^[a-zA-Zก-๙]/

  submitted: boolean = false;
  repeatUser: boolean = false;
  cLogin: boolean = false;
  imageSrc: any = 'assets/images/person.png';

  formImage = new FormData();

  uploadBtn?: any;

  mode!: Mode;
  Mode = Mode;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private authService: AuthService, private onlineQuizService: OnlineQuizService, private messageService: MessageService, private el: ElementRef) { }

  ngOnInit(): void {

    this.onlineQuizService.clearQuizKey();

    const { mode } = this.activeRoute.snapshot.data;
    this.mode = mode;

    if (mode === Mode.ADD) {
      this.title = 'สมัครสมาชิก';
      this.authService.isLoggedIn$.subscribe(res => {
        if (res) {
          this.navigate()
        }
      })
    } else if (mode === Mode.EDIT) {
      this.title = 'แก้ไขข้อมูลส่วนตัว';
      this.userForm.get('userName')?.disable();
      this.userForm.get('password')?.disable();
      this.userForm.get('cPassword')?.disable();

      this.onlineQuizService.getUser(this.authService.user.userId).subscribe(res => {
        this.userForm.controls['userName'].setValue(res.userName);
        this.userForm.controls['firstName'].setValue(res.firstName);
        this.userForm.controls['lastName'].setValue(res.lastName);
        this.userForm.controls['tel'].setValue(res.tel);
        this.userForm.controls['email'].setValue(res.email);
        if (res.profile) this.imageSrc = `api/user/image/${res.profile}`;
      })
    }

    this.uploadBtn = this.el.nativeElement.querySelector('#uploadBtn');
  }

  btnCancel() {
    const role = this.authService.user?.role
    let path = ['online-quiz']
    if (role == 'Admin') {
      path.push('management')
    }
    this.router.navigate(path)
  }

  btnSubmit() {
    this.repeatUser = false;
    this.submitted = true;
    const user = this.userForm.value;
    user.tel = user.tel?.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')

    if (this.formImage.get('fileName')) {
      const imageType = this.formImage.get('fileName')?.toString().split('.')[1];
      const imageName = `profile-${this.userForm.get('userName')?.value}-${new Date().getTime()}.${imageType}`;
      this.formImage.set('fileName', imageName);
      user.profile = imageName;
      this.onlineQuizService.postUploadImage(this.formImage).subscribe();
    }

    if (this.mode === Mode.ADD) {
      if (this.userForm.valid && user.password === user.cPassword) {
        delete user['cPassword']
        user['userRole'] = { userRoleId: 2 }
        this.onlineQuizService.postUser(user).subscribe((res: any) => {
          if (res.error) {
            this.repeatUser = true;
            return this.messageService.add({ severity: 'error', summary: 'บันทึกไม่สำเร็จ', detail: 'มี Username นี้อยู่แล้วในระบบ', life: 3000 });
          }
          this.messageService.add({ severity: 'success', summary: 'บันทึกสำเร็จ', detail: 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว', life: 1500 });
          setTimeout(() => {
            this.navigate();
          }, 1500)
        });
      }
    } else if (this.mode === Mode.EDIT) {
      if (this.userForm.valid) {
        this.onlineQuizService.updateUser(this.authService.user.userId, user).subscribe((res: any) => {
          if (res.error) {
            return this.messageService.add({ severity: 'error', summary: 'บันทึกไม่สำเร็จ', detail: res.error, life: 1500 });
          }
          this.messageService.add({ severity: 'success', summary: 'บันทึกสำเร็จ', detail: 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว', life: 1500 });
          setTimeout(() => {
            if(user.profile) this.authService.setProfile(user.profile)
            this.navigate();
          }, 1500)
        });
      }
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
    if (role === 'Admin') path.push('management')
    window.location.pathname = path.join('');
  }


}
