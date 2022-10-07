import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  username?: string;
  email?: string;
  newPassword?: string;
  rePassword?: string;

  txtLabel: string = 'ค้นหา';
  txtMsg?: string;

  txtFullName?: string;
  imageSrc: any = 'assets/images/person.png';

  cSearch: boolean = false;
  cIncorrect: boolean = false;
  cPassword: boolean = false;
  submitted: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  validatePassword(password: string) {
    const REX_NAME = /^[A-Za-z0-9ก-๙_@]{6,}$/;
    return REX_NAME.test(password);
  }

  btnSearch() {
    this.submitted = true;

    if (this.cSearch) {
      if (this.newPassword && this.rePassword) {

        if (!this.validatePassword(this.newPassword!) || !this.validatePassword(this.rePassword!)) {
          this.txtMsg = 'รหัสผ่านต้องมากกว่า 6 ตัวอักษร';
          this.cPassword = true;
          return
        } else if (this.newPassword !== this.rePassword) {
          this.txtMsg = 'รหัสผ่านไม่ตรงกัน';
          this.cPassword = true;
          return
        }

        this.cPassword = false;
        this.authService.changePassword(this.username!, this.newPassword!).subscribe({
          complete: () => {
            this.messageService.add({ severity: 'success', summary: 'บันทึกสำเร็จ', detail: 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว', life: 1500 });
            setTimeout(() => {
              window.location.pathname = 'online-quiz';
            }, 1500)
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'บันทึกไม่สำเร็จ', detail: 'ระบบไม่สามารถบันทึกข้อมูลได้ในขณะนี้', life: 1500 });
            setTimeout(() => {
              window.location.pathname = 'online-quiz';
            }, 1500)
          }
        })
      }

    } else {
      if (this.username && this.email) {
        this.authService.searchUser(this.username!, this.email!, '').subscribe({
          next: (res: any) => {

            if (res.firstName && res.lastName) this.txtFullName = res.firstName + ' ' + res.lastName;
            if (res.profile) this.imageSrc = `api/user/image/${res.profile}`

          },
          complete: () => {
            this.cSearch = true;
            this.cIncorrect = false;
            this.submitted = false;
            this.txtLabel = "ยืนยัน"
          },
          error: () => {
            this.cIncorrect = true;
          }
        })
      }
    }
  }

}
