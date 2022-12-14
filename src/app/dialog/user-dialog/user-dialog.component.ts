import { Component, Input, OnInit } from '@angular/core';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  @Input() dialog: boolean = false;
  @Input() mode: boolean = false;
  @Input() user: any;

  userRoleList: any[] = [];
  submitted: boolean = false;
  emailSubmit: boolean = false;
  repeatUser: boolean = false;

  userReg: RegExp = /^[a-zA-Z0-9_]/
  strReg: RegExp = /^[a-zA-Zก-๙]/
  emailReg: RegExp = /^[a-zA-Z0-9_@.]/
  blockSpace: RegExp = /[^\s]/

  constructor(private onlineQuizAdminService: OnlineQuizAdminService) { }

  ngOnInit(): void {
    this.userRoleList = [
      {
        userRoleId: 1,
        userRoleName: 'A',
        userRoleDescription: 'admin'
      },
      {
        userRoleId: 2,
        userRoleName: 'U',
        userRoleDescription: 'user'
      },
    ]

    if (!this.user) {
      this.user = {
        userRole: this.userRoleList[1]
      }
    }

  }

  refresh() {
    this.dialog = false;
    this.user = {};
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.repeatUser = false;
    this.submitted = true;

    const userName = this.user.userName?.trim();
    const password = this.user.password?.trim();
    const firstName = this.user.firstName?.trim();
    const lastName = this.user.lastName?.trim();
    const tel = this.user.tel?.trim();
    const email = this.user.email?.trim();
    const role = this.user.userRole;

    this.validate(this.user.email)

    if (userName && userName.length > 5 && password && password.length > 5 && firstName && firstName.length > 5 && lastName && lastName.length > 5 && tel && email && role && this.emailSubmit) {
      this.user.tel = this.user.tel.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')

      if (this.user.userId) {
        this.saveToDatabase(this.user);
      }
      else {
        this.onlineQuizAdminService.newUser(this.user).subscribe((res: any) => {
          if (res.error) {
            this.repeatUser = true;
            return this.onlineQuizAdminService.alertMsg('error', 'บันทึกข้อมูลไม่สำเร็จ', 'มี Username นี้อยู่แล้วในระบบ');
          }
          this.onlineQuizAdminService.alertMsg('success', 'บันทึกข้อมูลสำเร็จ', 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว');
          this.refresh();
        });
      }
      
    }
  }

  saveToDatabase(user: any) {
    this.onlineQuizAdminService.updateUser(user).subscribe({
      complete: () => {
        this.onlineQuizAdminService.alertMsg('success', 'บันทึกข้อมูลสำเร็จ', 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว');
        this.refresh();
      },
      error: (error) => {
        console.log(error);
        this.onlineQuizAdminService.alertMsg('error', 'บันทึกข้อมูลไม่สำเร็จ', 'มีบางอย่างผิดพลาด');
      }
    });
  }

  validate(value: string) {
    const emailRegExp = /^[a-zA-Z0-9_.]+@([a-z]+\.)+[a-z]{2,4}$/
    this.emailSubmit = emailRegExp.test(value)
  }

}
