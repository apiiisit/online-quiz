import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  @Input() dialog: boolean = false;
  @Input() user: any = {};
  userRoleList: any[] = [];
  submitted: boolean = false;

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
    console.log(this.user);
    
    if (userName && password && firstName && lastName && tel && email && role) {
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

}
