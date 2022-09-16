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
        this.onlineQuizAdminService.newUser(this.user).subscribe({
          complete: () => {
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'User created');
            this.refresh();
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'User create error');
          }
        });
      }
      this.dialog = false;
    }
  }

  saveToDatabase(user: any) {
    this.onlineQuizAdminService.updateUser(user).subscribe({
      complete: () => {
        this.onlineQuizAdminService.alertMsg('success', 'Successful', 'User updated');
        this.refresh();
      },
      error: () => {
        this.onlineQuizAdminService.alertMsg('error', 'Error', 'User update error');
      }
    });
  }

  validate(value: string) {
    const emailRegExp = /^[a-zA-Z0-9_.]+@([a-z]+\.)+[a-z]{2,4}$/
    this.emailSubmit = emailRegExp.test(value)
  }

}
