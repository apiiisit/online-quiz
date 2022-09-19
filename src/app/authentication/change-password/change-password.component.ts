import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  oldPassword?: string;
  newPassword?: string;
  rePassword?: string;
  txtMsg?: string;

  cIncorrect: boolean = false;
  cPassword: boolean = false;
  submitted: boolean = false;

  constructor(private authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  validatePassword(password: string) {
    const REX_NAME = /^[A-Za-z0-9ก-๙_@]{6,}$/;
    return REX_NAME.test(password);
  }

  btnCancel() {
    window.location.href = ''
  }

  btnSearch() {
    this.submitted = true;
    if (this.oldPassword && this.newPassword && this.rePassword) {
      this.authService.searchUser(this.authService.user.userName!, '', this.oldPassword!).subscribe({
        complete: () => {
          this.cIncorrect = false;
          if (!this.validatePassword(this.newPassword!) || !this.validatePassword(this.rePassword!)) {
            this.txtMsg = 'รหัสผ่านต้องมีมากกว่า 6 ตัวอักษร';
            this.cPassword = true;
          } else if (this.newPassword !== this.rePassword) {
            this.txtMsg = 'รหัสผ่านไม่ตรงกัน';
            this.cPassword = true;
          } else {
            this.authService.changePassword(this.authService.user.userName!, this.newPassword!).subscribe({
              complete: () => {
                this.cPassword = false;
                this.messageService.add({ severity: 'success', summary: 'บันทึกสำเร็จ', detail: 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว', life: 1500 });
                this.messageService.add({ severity: 'success', summary: 'ระบบ', detail: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง', life: 1500 });
                setTimeout(() => {
                  this.authService.logout();
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

        },
        error: () => {
          this.cIncorrect = true;
        }
      })
    }

  }

}
